import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { zenAudio } from '../utils/audioSynth';
import { recordTimerSession } from '../utils/studyTimeLogs';

export type TimerMode = 'focus' | 'break';

export interface StudySessionState {
  isActive: boolean;
  isPaused: boolean;
  mode: TimerMode;
  subject: string;
  topic: string;
  targetMinutes: number;
  totalSeconds: number;
  remainingSeconds: number;
  completedIntervals: number;
  soundEnabled: boolean;
  lastCompletedSession?: {
    minutes: number;
    subject: string;
    topic: string;
    timestamp: string;
  };
}

interface StudySessionContextType {
  state: StudySessionState;
  startSession: (minutes: number, subject?: string, topic?: string) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  stopSession: (saveMinutes?: boolean) => void;
  extendSession: (minutes: number) => void;
  startBreak: (minutes?: number) => void;
  toggleSound: () => void;
  isExpandedModalOpen: boolean;
  setIsExpandedModalOpen: (open: boolean) => void;
  showCompletionModal: boolean;
  closeCompletionModal: () => void;
  formattedTime: string;
  progressPercentage: number;
}

const STORAGE_KEY = 'eduflow_study_timer_state_v1';
const END_TIMESTAMP_KEY = 'eduflow_study_timer_end_ts';

const defaultState: StudySessionState = {
  isActive: false,
  isPaused: false,
  mode: 'focus',
  subject: 'Mathematics',
  topic: 'Problem Solving & Revision',
  targetMinutes: 25,
  totalSeconds: 25 * 60,
  remainingSeconds: 25 * 60,
  completedIntervals: 0,
  soundEnabled: true,
};

const StudySessionContext = createContext<StudySessionContextType | undefined>(undefined);

export const StudySessionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load saved state or default
  const [state, setState] = useState<StudySessionState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: StudySessionState = JSON.parse(saved);
        // If active and not paused, recalculate remainingSeconds from end timestamp
        if (parsed.isActive && !parsed.isPaused) {
          const endTsStr = localStorage.getItem(END_TIMESTAMP_KEY);
          if (endTsStr) {
            const endTs = parseInt(endTsStr, 10);
            const now = Date.now();
            const diffSeconds = Math.max(0, Math.round((endTs - now) / 1000));
            parsed.remainingSeconds = diffSeconds;
            if (diffSeconds <= 0) {
              parsed.isActive = false;
            }
          }
        }
        return parsed;
      }
    } catch {
      // Fallback
    }
    return defaultState;
  });

  const [isExpandedModalOpen, setIsExpandedModalOpen] = useState<boolean>(false);
  const [showCompletionModal, setShowCompletionModal] = useState<boolean>(false);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Log minutes to daily goal and persistent session logs
  const logMinutesToDailyGoal = useCallback((minutes: number, subject?: string, topic?: string) => {
    if (minutes <= 0) return;
    try {
      const currentVal = parseInt(localStorage.getItem('eduflow_study_completed_minutes') || '0', 10);
      const updated = currentVal + minutes;
      localStorage.setItem('eduflow_study_completed_minutes', updated.toString());

      // Append to persistent timer session logs for the 7-day sparkline
      recordTimerSession({
        date: new Date().toISOString().split('T')[0],
        minutes,
        subject: subject || state.subject || 'Mathematics',
        topic: topic || state.topic || 'Concept Study',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });

      // Trigger standard storage event for cross-component re-renders
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('studyMinutesUpdated', { detail: { added: minutes, total: updated } }));
    } catch (e) {
      console.error('Failed to log study minutes to daily goal', e);
    }
  }, [state.subject, state.topic]);

  // Complete session handler
  const handleCompleteSession = useCallback(() => {
    if (state.soundEnabled) {
      zenAudio.playCompletionChime();
    }

    const completedMins = state.targetMinutes;
    logMinutesToDailyGoal(completedMins, state.subject, state.topic);

    setState((prev) => ({
      ...prev,
      isActive: false,
      isPaused: false,
      remainingSeconds: 0,
      completedIntervals: prev.completedIntervals + 1,
      lastCompletedSession: {
        minutes: completedMins,
        subject: prev.subject,
        topic: prev.topic,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    }));

    localStorage.removeItem(END_TIMESTAMP_KEY);
    setShowCompletionModal(true);
  }, [state.soundEnabled, state.targetMinutes, state.subject, state.topic, logMinutesToDailyGoal]);

  // Active Timer Countdown Interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (state.isActive && !state.isPaused) {
      interval = setInterval(() => {
        // Calculate remaining seconds from target end timestamp
        const endTsStr = localStorage.getItem(END_TIMESTAMP_KEY);
        if (endTsStr) {
          const endTs = parseInt(endTsStr, 10);
          const now = Date.now();
          const remaining = Math.max(0, Math.round((endTs - now) / 1000));

          if (remaining <= 0) {
            handleCompleteSession();
          } else {
            setState((prev) => ({
              ...prev,
              remainingSeconds: remaining
            }));
          }
        } else {
          // Fallback direct decrement
          setState((prev) => {
            if (prev.remainingSeconds <= 1) {
              handleCompleteSession();
              return { ...prev, remainingSeconds: 0, isActive: false };
            }
            return { ...prev, remainingSeconds: prev.remainingSeconds - 1 };
          });
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state.isActive, state.isPaused, handleCompleteSession]);

  const startSession = (minutes: number, subject = 'Mathematics', topic = 'Problem Solving & Deep Revision') => {
    const totalSecs = minutes * 60;
    const endTs = Date.now() + totalSecs * 1000;
    localStorage.setItem(END_TIMESTAMP_KEY, endTs.toString());

    if (state.soundEnabled) {
      zenAudio.playStartChime();
    }

    setState({
      isActive: true,
      isPaused: false,
      mode: 'focus',
      subject: subject || 'Mathematics',
      topic: topic || 'Active Practice',
      targetMinutes: minutes,
      totalSeconds: totalSecs,
      remainingSeconds: totalSecs,
      completedIntervals: state.completedIntervals,
      soundEnabled: state.soundEnabled,
    });
  };

  const pauseSession = () => {
    setState((prev) => ({
      ...prev,
      isPaused: true
    }));
    localStorage.removeItem(END_TIMESTAMP_KEY);
  };

  const resumeSession = () => {
    const remainingMs = state.remainingSeconds * 1000;
    const endTs = Date.now() + remainingMs;
    localStorage.setItem(END_TIMESTAMP_KEY, endTs.toString());

    setState((prev) => ({
      ...prev,
      isPaused: false
    }));
  };

  const stopSession = (saveMinutes = true) => {
    if (saveMinutes && state.isActive) {
      const elapsedSeconds = state.totalSeconds - state.remainingSeconds;
      const elapsedMinutes = Math.floor(elapsedSeconds / 60);
      if (elapsedMinutes >= 1) {
        logMinutesToDailyGoal(elapsedMinutes, state.subject, state.topic);
      }
    }

    localStorage.removeItem(END_TIMESTAMP_KEY);
    setState((prev) => ({
      ...prev,
      isActive: false,
      isPaused: false,
      remainingSeconds: prev.targetMinutes * 60,
      totalSeconds: prev.targetMinutes * 60
    }));
  };

  const extendSession = (extraMinutes: number) => {
    const extraSeconds = extraMinutes * 60;
    const newTotal = state.totalSeconds + extraSeconds;
    const newRemaining = state.remainingSeconds + extraSeconds;

    if (state.isActive && !state.isPaused) {
      const endTs = Date.now() + newRemaining * 1000;
      localStorage.setItem(END_TIMESTAMP_KEY, endTs.toString());
    }

    setState((prev) => ({
      ...prev,
      totalSeconds: newTotal,
      remainingSeconds: newRemaining,
      targetMinutes: prev.targetMinutes + extraMinutes
    }));
  };

  const startBreak = (breakMinutes = 5) => {
    const totalSecs = breakMinutes * 60;
    const endTs = Date.now() + totalSecs * 1000;
    localStorage.setItem(END_TIMESTAMP_KEY, endTs.toString());

    if (state.soundEnabled) {
      zenAudio.playBreakChime();
    }

    setState((prev) => ({
      ...prev,
      isActive: true,
      isPaused: false,
      mode: 'break',
      targetMinutes: breakMinutes,
      totalSeconds: totalSecs,
      remainingSeconds: totalSecs
    }));
  };

  const toggleSound = () => {
    setState((prev) => ({
      ...prev,
      soundEnabled: !prev.soundEnabled
    }));
  };

  const closeCompletionModal = () => {
    setShowCompletionModal(false);
  };

  // Helper values
  const mins = Math.floor(state.remainingSeconds / 60);
  const secs = state.remainingSeconds % 60;
  const formattedTime = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  const progressPercentage = state.totalSeconds > 0
    ? Math.max(0, Math.min(100, Math.round(((state.totalSeconds - state.remainingSeconds) / state.totalSeconds) * 100)))
    : 0;

  return (
    <StudySessionContext.Provider
      value={{
        state,
        startSession,
        pauseSession,
        resumeSession,
        stopSession,
        extendSession,
        startBreak,
        toggleSound,
        isExpandedModalOpen,
        setIsExpandedModalOpen,
        showCompletionModal,
        closeCompletionModal,
        formattedTime,
        progressPercentage
      }}
    >
      {children}
    </StudySessionContext.Provider>
  );
};

export const useStudyTimer = () => {
  const context = useContext(StudySessionContext);
  if (!context) {
    throw new Error('useStudyTimer must be used within a StudySessionProvider');
  }
  return context;
};
