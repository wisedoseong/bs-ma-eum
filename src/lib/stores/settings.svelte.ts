import { getFromStorage, saveToStorage } from '$lib/utils/storage';

export interface CustomImageStyles {
  [key: string]: string;
}

// Svelte 5 방식: $state()를 사용한 공유 상태 (객체 기반)
export const settingsStore = $state({
  styles: getFromStorage<CustomImageStyles>('customStyles', {})
});

/**
 * 커스텀 스타일을 추가합니다
 */
export function addCustomStyle(name: string, value: string) {
  settingsStore.styles[name] = value;
  saveToStorage('customStyles', settingsStore.styles);
}

/**
 * 커스텀 스타일을 삭제합니다
 */
export function deleteCustomStyle(name: string) {
  delete settingsStore.styles[name];
  saveToStorage('customStyles', settingsStore.styles);
}

/**
 * 모든 커스텀 스타일을 초기화합니다
 */
export function resetAllCustomStyles() {
  Object.keys(settingsStore.styles).forEach((key) => {
    delete settingsStore.styles[key];
  });
  saveToStorage('customStyles', {});
}

/**
 * 커스텀 스타일을 전부 교체합니다
 */
export function setCustomImageStyles(styles: CustomImageStyles) {
  Object.keys(settingsStore.styles).forEach((key) => {
    delete settingsStore.styles[key];
  });
  Object.entries(styles).forEach(([key, value]) => {
    settingsStore.styles[key] = value;
  });
  saveToStorage('customStyles', settingsStore.styles);
}

/**
 * 현재 커스텀 스타일 객체를 반환합니다
 */
export function getCustomImageStyles(): CustomImageStyles {
  return settingsStore.styles;
}
