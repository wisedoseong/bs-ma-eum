import { getFromStorage, saveToStorage } from '$lib/utils/storage';

// Svelte 5 방식: $state()를 사용한 공유 상태 (객체 기반)
// 객체 속성을 수정하는 방식으로 내보낼 수 있음
export const apiKeyStore = $state({
  value: getFromStorage<string>('apiKey', '')
});

/**
 * API 키를 저장하고 localStorage에 동기화합니다
 */
export function setApiKey(newValue: string) {
  apiKeyStore.value = newValue;
  saveToStorage('apiKey', newValue);
}

/**
 * API 키를 초기화합니다
 */
export function resetApiKey() {
  apiKeyStore.value = '';
  saveToStorage('apiKey', '');
}

/**
 * 현재 API 키 값을 반환합니다
 */
export function getApiKey(): string {
  return apiKeyStore.value;
}
