// localStorage 관리 유틸리티 함수

const STORAGE_PREFIX = 'ma-eum';

export interface StorageKeys {
  apiKey: string;
  customPrompts: string;
  customStyles: string;
}

/**
 * localStorage에서 값을 가져옵니다.
 * @param key - 저장소 키
 * @param defaultValue - 기본값
 * @returns 저장된 값 또는 기본값
 */
export function getFromStorage<T>(key: keyof StorageKeys, defaultValue: T): T {
  if (typeof window === 'undefined') {
    return defaultValue;
  }

  try {
    const stored = localStorage.getItem(`${STORAGE_PREFIX}:${key}`);
    if (stored === null) {
      return defaultValue;
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error(`Failed to get storage key ${key}:`, error);
    return defaultValue;
  }
}

/**
 * localStorage에 값을 저장합니다.
 * @param key - 저장소 키
 * @param value - 저장할 값
 */
export function saveToStorage<T>(key: keyof StorageKeys, value: T): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(`${STORAGE_PREFIX}:${key}`, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to save storage key ${key}:`, error);
  }
}

/**
 * localStorage에서 값을 제거합니다.
 * @param key - 저장소 키
 */
export function removeFromStorage(key: keyof StorageKeys): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem(`${STORAGE_PREFIX}:${key}`);
  } catch (error) {
    console.error(`Failed to remove storage key ${key}:`, error);
  }
}

/**
 * localStorage를 완전히 초기화합니다.
 */
export function clearAllStorage(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Failed to clear storage:', error);
  }
}
