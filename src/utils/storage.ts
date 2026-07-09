/**
 * Safe local storage manager with fallback.
 */
export const storage = {
  get(key: string, fallback: string = ''): string {
    try {
      return localStorage.getItem(key) || fallback;
    } catch {
      return fallback;
    }
  },

  set(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn('Storage failed:', e);
    }
  },

  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {}
  },
};
