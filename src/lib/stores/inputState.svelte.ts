import { type DocType } from '$lib/config/prompts';

/**
 * InputPanel과 TextPanel의 입력 상태를 관리하는 Store
 * Svelte 5 방식: $state()를 사용한 공유 상태 (객체 기반)
 *
 * docType: 문서 타입
 * keywords: 사용자가 입력한 키워드 (생성용)
 * originalText: 사용자가 입력한 원본 텍스트 (수정용)
 * writingStyle: 문서의 작문 스타일
 * imageStyle: 이미지의 스타일
 */
export const inputState = $state({
  docType: '상장' as DocType,
  keywords: '',
  originalText: '',
  writingStyle: '근엄하게',
  imageStyle: '수채화 (Watercolor)'
});

/**
 * 문서 타입을 변경합니다
 */
export function setDocType(type: DocType) {
  inputState.docType = type;
}

/**
 * 키워드를 변경합니다
 */
export function setKeywords(keywords: string) {
  inputState.keywords = keywords;
}

/**
 * 원본 텍스트를 변경합니다
 */
export function setOriginalText(text: string) {
  inputState.originalText = text;
}

/**
 * 작문 스타일을 변경합니다
 */
export function setWritingStyle(style: string) {
  inputState.writingStyle = style;
}

/**
 * 이미지 스타일을 변경합니다
 */
export function setImageStyle(style: string) {
  inputState.imageStyle = style;
}

/**
 * 모든 입력 상태를 초기화합니다
 */
export function resetInputState() {
  inputState.docType = '상장';
  inputState.keywords = '';
  inputState.originalText = '';
  inputState.writingStyle = '근엄하게';
  inputState.imageStyle = '수채화 (Watercolor)';
}
