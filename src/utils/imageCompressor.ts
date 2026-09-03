/**
 * Safe Image Compression and Storage Utility
 * Prevents LocalStorage QuotaExceeded errors by scaling and compressing images to lightweight WebP/JPEG formats.
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'image/jpeg' | 'image/webp' | 'image/png';
}

/**
 * Compresses a File or Blob into a lightweight base64 data URL
 */
export async function compressImageFile(
  file: File | Blob,
  options: CompressionOptions = {}
): Promise<string> {
  const {
    maxWidth = 320,
    maxHeight = 320,
    quality = 0.75,
    format = 'image/jpeg'
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (!result) {
        resolve('');
        return;
      }
      compressDataUrl(result, { maxWidth, maxHeight, quality, format })
        .then(resolve)
        .catch(() => resolve(result)); // Fallback to raw data if canvas fails
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Compresses an existing Base64 Data URL or Image URL
 */
export async function compressDataUrl(
  dataUrl: string,
  options: CompressionOptions = {}
): Promise<string> {
  // If it's a standard web URL and not a heavy base64 data URL, return as-is
  if (!dataUrl || !dataUrl.startsWith('data:image/')) {
    return dataUrl;
  }

  // If already small (< 40KB base64 string length), return as-is
  if (dataUrl.length < 40000) {
    return dataUrl;
  }

  const {
    maxWidth = 320,
    maxHeight = 320,
    quality = 0.75,
    format = 'image/jpeg'
  } = options;

  return new Promise((resolve) => {
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          let { width, height } = img;

          // Calculate aspect ratio bounding
          if (width > maxWidth || height > maxHeight) {
            if (width / height > maxWidth / maxHeight) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1, width);
          canvas.height = Math.max(1, height);

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(dataUrl);
            return;
          }

          // Fill background white in case of transparent PNG converted to JPEG
          if (format === 'image/jpeg') {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }

          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL(format, quality);
          resolve(compressed);
        } catch {
          resolve(dataUrl);
        }
      };

      img.onerror = () => {
        resolve(dataUrl);
      };

      img.src = dataUrl;
    } catch {
      resolve(dataUrl);
    }
  });
}

/**
 * Safe local storage setter with quota management and fallback
 */
export function safeLocalStorageSet(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (err: any) {
    // If QuotaExceededError, attempt cleanup of non-essential storage keys
    if (
      err?.name === 'QuotaExceededError' ||
      err?.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
      err?.code === 22 ||
      err?.code === 1014
    ) {
      console.warn(`[SafeStorage] LocalStorage quota exceeded for key "${key}". Executing safe cache trimming...`);
      try {
        // Clean up legacy or cache keys
        const keysToEvict = [
          'eduflow_temp_cache',
          'eduflow_video_history',
          'eduflow_registered_students_v1',
          'eduflow_registered_students_v2',
          'eduflow_active_student_user_v1',
          'eduflow_active_student_user_v2'
        ];
        keysToEvict.forEach((k) => localStorage.removeItem(k));

        // Try setting again
        localStorage.setItem(key, value);
        return true;
      } catch (retryErr) {
        console.warn(`[SafeStorage] Could not persist key "${key}" even after trimming. Storing in-memory session only.`, retryErr);
        return false;
      }
    }
    console.warn(`[SafeStorage] Error writing to localStorage key "${key}":`, err);
    return false;
  }
}

/**
 * Sanitizes student records for local storage by ensuring any avatar base64 data is trimmed/compressed
 */
export function sanitizeStudentForStorage<T extends { avatar?: string }>(student: T): T {
  if (!student.avatar || !student.avatar.startsWith('data:image/')) {
    return student;
  }
  // If base64 avatar is unusually large (> 80KB), we keep a placeholder or return as-is if compressed
  if (student.avatar.length > 80000) {
    // Return standard fallback avatar to prevent quota overflow
    return {
      ...student,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'
    };
  }
  return student;
}
