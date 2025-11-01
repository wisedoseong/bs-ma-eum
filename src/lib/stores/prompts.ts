import { writable, type Writable } from 'svelte/store';
import { getFromStorage, saveToStorage } from '$lib/utils/storage';
import { SYSTEM_PROMPTS, type DocType } from '$lib/config/prompts';

export interface CustomPrompts {
  award?: string;
  diary?: string;
  report?: string;
  document?: string;
}

// 커스텀 프롬프트 저장소 생성
function createCustomPromptsStore(): Writable<CustomPrompts> {
  const initialValue = getFromStorage<CustomPrompts>('customPrompts', {});
  const store = writable<CustomPrompts>(initialValue);

  return {
    subscribe: store.subscribe,
    set: (value: CustomPrompts) => {
      saveToStorage('customPrompts', value);
      store.set(value);
    },
    update: (fn: (value: CustomPrompts) => CustomPrompts) => {
      store.update((value) => {
        const newValue = fn(value);
        saveToStorage('customPrompts', newValue);
        return newValue;
      });
    },
  };
}

/**
 * 지정된 문서 타입의 프롬프트를 가져옵니다.
 * 커스텀 프롬프트가 있으면 그것을, 없으면 기본 템플릿을 반환합니다.
 */
// export function getPrompt(docType: DocType, customPrompts: CustomPrompts): string {
//   return customPrompts[docType] || SYSTEM_PROMPTS[docType];
// }

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

export const customPrompts = createCustomPromptsStore();
