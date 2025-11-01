import { writable, type Writable } from 'svelte/store';
import { getFromStorage, saveToStorage } from '$lib/utils/storage';

// API 키 저장소 생성
function createApiKeyStore(): Writable<string> {
  const initialValue = getFromStorage<string>('apiKey', '');
  const store = writable<string>(initialValue);

  return {
    subscribe: store.subscribe,
    set: (value: string) => {
      saveToStorage('apiKey', value);
      store.set(value);
    },
    update: (fn: (value: string) => string) => {
      store.update((value) => {
        const newValue = fn(value);
        saveToStorage('apiKey', newValue);
        return newValue;
      });
    },
  };
}

export const apiKey = createApiKeyStore();
