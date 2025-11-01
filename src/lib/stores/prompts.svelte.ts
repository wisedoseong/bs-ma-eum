import { getFromStorage, saveToStorage } from '$lib/utils/storage';
import { SYSTEM_PROMPTS, type DocType } from '$lib/config/prompts';

export interface CustomPrompts {
  award?: string;
  diary?: string;
  report?: string;
  document?: string;
}

// Svelte 5 방식: $state()를 사용한 공유 상태 (객체 기반)
export const promptsStore = $state({
    custom: getFromStorage<CustomPrompts>('customPrompts', {} as CustomPrompts)
});

/**
 * 지정된 문서 타입의 프롬프트를 가져옵니다.
 * 커스텀 프롬프트가 있으면 그것을, 없으면 기본 템플릿을 반환합니다.
 */
export interface CustomPrompts extends Record<DocType, string | undefined> {}



/**
 * 특정 문서 타입의 커스텀 프롬프트를 설정합니다
 */
export function setCustomPrompt(docType: DocType, prompt: string) {
  if (prompt.trim()) {
    promptsStore.custom[docType] = prompt;
  } else {
    delete promptsStore.custom[docType];
  }
  saveToStorage('customPrompts', promptsStore.custom);
}

/**
 * 특정 문서 타입의 커스텀 프롬프트를 삭제합니다
 */
export function deleteCustomPrompt(docType: DocType) {
  delete promptsStore.custom[docType];
  saveToStorage('customPrompts', promptsStore.custom);
}

/**
 * 모든 커스텀 프롬프트를 초기화합니다
 */
export function resetAllCustomPrompts() {
  Object.keys(promptsStore.custom).forEach((key) => {
    delete promptsStore.custom[key as DocType];
  });
  saveToStorage('customPrompts', {});
}

/**
 * 프롬프트에서 변수를 대체합니다.
 */
export function replacePromptVariables(
  prompt: string,
  variables: Record<string, string>
): string {
  let result = prompt;
  Object.entries(variables).forEach(([key, value]) => {
    result = result.replace(new RegExp(`{${key}}`, 'g'), value);
  });
  return result;
}

/**
 * 현재 커스텀 프롬프트 객체를 반환합니다
 */
export function getCustomPrompts(): CustomPrompts {
  return promptsStore.custom;
}
