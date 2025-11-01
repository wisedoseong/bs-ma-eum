import { writable, type Writable } from 'svelte/store';
import { getFromStorage, saveToStorage } from '$lib/utils/storage';

export interface CustomImageStyles {
  [key: string]: string;
}

// 커스텀 이미지 스타일 저장소 생성
function createSettingsStore(): Writable<CustomImageStyles> {
  const initialValue = getFromStorage<CustomImageStyles>('customStyles', {});
  const store = writable<CustomImageStyles>(initialValue);

  return {
    subscribe: store.subscribe,
    set: (value: CustomImageStyles) => {
      saveToStorage('customStyles', value);
      store.set(value);
    },
    update: (fn: (value: CustomImageStyles) => CustomImageStyles) => {
      store.update((value) => {
        const newValue = fn(value);
        saveToStorage('customStyles', newValue);
        return newValue;
      });
    },
  };
}

export const customImageStyles = createSettingsStore();
