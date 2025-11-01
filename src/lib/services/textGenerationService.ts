import { SYSTEM_PROMPTS, type DocType } from '$lib/config/prompts';
import {
  initializeGemini,
  generateText,
  replacePromptVariables,
  parseTextResponse,
  handleGeminiError,
} from '$lib/utils/gemini';

export interface TextGenerateRequest {
  docType: DocType;
  writingStyle: string;
  apiKey: string;
  keywords?: string;
  originalText?: string;
  customPrompt?: string;
}

export interface TextGenerateResponse {
  title: string;
  content: string;
}

const TEXT_MODEL_NAME = 'gemini-flash-lite-latest';
const revisionTypes: DocType[] = ['오타수정', '글수정'];

/**
 * 텍스트를 생성 또는 수정합니다
 */
export async function generateTextContent(
  params: TextGenerateRequest
): Promise<TextGenerateResponse> {
  try {
    // Gemini API 초기화
    const ai = initializeGemini(params.apiKey);

    // 프롬프트 선택: 커스텀 프롬프트가 있으면 사용, 없으면 기본 템플릿 사용
    let basePrompt = params.customPrompt || SYSTEM_PROMPTS[params.docType];

    const isRevision = revisionTypes.includes(params.docType);

    // 프롬프트에 주입할 변수 객체 생성
    const variables: Record<string, string> = {
          writingStyle: params.writingStyle,
    }

    if (isRevision && params.originalText) {
         variables.originalText = params.originalText;
    } else if (!isRevision && params.keywords) {
        variables.keywords = params.keywords;
    }

    // 변수 대체
    const finalPrompt = replacePromptVariables(basePrompt, variables);

    // Gemini API 호출
    const generatedText = await generateText(ai, TEXT_MODEL_NAME, finalPrompt);

    // 응답 파싱
    const { title, content } = parseTextResponse(generatedText);

    return { title, content };
  } catch (error) {
    const { message, status } = handleGeminiError(error);
    const err = new Error(message);
    (err as any).status = status;
    throw err;
  }
}