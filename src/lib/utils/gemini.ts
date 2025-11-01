import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from '@google/genai';

/**
 * Gemini API 설정 인터페이스
 */
export interface GeminiConfig {
  thinkingBudget?: number;
  safetySettings?: Array<{
    category: HarmCategory;
    threshold: HarmBlockThreshold;
  }>;
  responseModalities?: string[];
}

/**
 * Gemini API 인스턴스를 초기화합니다
 */
export function initializeGemini(apiKey: string): GoogleGenAI {
  return new GoogleGenAI({
    apiKey,
  });
}

/**
 * 기본 Gemini 설정을 반환합니다
 */
export function getDefaultConfig(): GeminiConfig {
  return {
    thinkingBudget: 0,
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ],
  };
}

/**
 * 이미지 생성용 설정을 반환합니다 (Thinking 제외)
 */
export function getImageGenerationConfig(): GeminiConfig {
  const config = getDefaultConfig();
  // 이미지 생성 모델은 Thinking을 지원하지 않으므로 제거
  delete config.thinkingBudget;
  return config;
}

/**
 * Gemini API를 호출하여 텍스트를 생성합니다
 */
export async function generateText(
  ai: GoogleGenAI,
  model: string,
  prompt: string,
  config: GeminiConfig = {}
): Promise<string> {
  const finalConfig = { ...getDefaultConfig(), ...config };

  const response = await ai.models.generateContentStream({
    model: `models/${model}`,
    config: finalConfig,
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ],
  });

  let generatedText = '';
  for await (const chunk of response) {
    if (chunk.text) {
      generatedText += chunk.text;
    }
  }

  return generatedText.trim();
}

/**
 * 프롬프트의 변수를 대체합니다
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
 * 텍스트에서 제목과 내용을 파싱합니다
 */
export function parseTextResponse(text: string): { title: string; content: string } {
  const titleMatch = text.match(/title\s*:\s*([^\n]+)/i);
  const contentMatch = text.match(/content\s*:\s*([\s\S]+?)(?=title\s*:|$)/i);

  const title = titleMatch ? titleMatch[1].trim() : '제목 없음';
  const content = contentMatch ? contentMatch[1].trim() : text.trim();

  return { title, content };
}

/**
 * Gemini 에러를 처리합니다
 */
export function handleGeminiError(error: unknown): { message: string; status: number } {
  if (error instanceof Error) {
    if (error.message.includes('API key')) {
      return { message: 'Invalid API key', status: 401 };
    }

    if (error.message.includes('quota') || error.message.includes('RESOURCE_EXHAUSTED')) {
      return { message: 'API quota exceeded', status: 429 };
    }

    if (error.message.includes('Thinking is not enabled')) {
      return {
        message: 'This model does not support thinking configuration',
        status: 400,
      };
    }

    return { message: error.message, status: 500 };
  }

  return { message: 'An unexpected error occurred', status: 500 };
}
