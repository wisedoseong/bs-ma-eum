import { IMAGE_GENERATION_SYSTEM_PROMPT, IMAGE_NEGATIVE_PROMPT } from '$lib/config/prompts';
import {
  initializeGemini,
  generateText,
  replacePromptVariables,
  handleGeminiError,
  getDefaultConfig,
  getImageGenerationConfig,
} from '$lib/utils/gemini';

export interface ImageGenerateRequest {
  textTitle: string;
  textContent: string;
  keywords: string;
  imageStyle: string;
  customPrompt?: string;
  apiKey: string;
}

export interface ImageGenerateResponse {
  base64Image: string;
  mimeType: string;
}

const TEXT_MODEL_NAME = 'gemini-flash-lite-latest';
const IMAGE_MODEL_NAME = 'gemini-2.5-flash-image';

/**
 * 텍스트에서 영어 긍정 프롬프트를 생성합니다 (Call 1)
 */
async function generateImagePrompt(
  ai: any,
  textTitle: string,
  textContent: string,
  keywords: string,
  imageStyle: string,
  customPrompt?: string
): Promise<string> {
  let baseImagePrompt = customPrompt || IMAGE_GENERATION_SYSTEM_PROMPT;

  const finalImagePromptBuilderPrompt = replacePromptVariables(baseImagePrompt, {
    title: textTitle,
    content: textContent,
    keywords,
    imageStyle,
  });

  const englishPositivePrompt = await generateText(
    ai,
    TEXT_MODEL_NAME,
    finalImagePromptBuilderPrompt,
    getDefaultConfig()
  );

  return englishPositivePrompt;
}

/**
 * 프롬프트로 이미지를 생성합니다 (Call 2)
 */
async function generateImageFromPrompt(
  ai: any,
  imagePrompt: string
): Promise<{ base64Image: string; mimeType: string }> {
  // @ts-ignore - SafetySetting 타입 호환성 문제
  const imageResponse = await ai.models.generateContentStream({
    model: `models/${IMAGE_MODEL_NAME}`,
    config: {
      ...getImageGenerationConfig(),
      responseModalities: ['IMAGE', 'TEXT'],
    },
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: imagePrompt,
          },
        ],
      },
    ],
  });

  let base64Image: string | null = null;
  let mimeType = 'image/jpeg';

  for await (const chunk of imageResponse) {
    if (chunk.candidates?.[0]?.content?.parts) {
      for (const part of chunk.candidates[0].content.parts) {
        // @ts-ignore - Google GenAI API의 inlineData 타입
        if (part.inlineData) {
          // @ts-ignore
          base64Image = part.inlineData.data;
          // @ts-ignore
          mimeType = part.inlineData.mimeType || 'image/jpeg';
        }
      }
    }
  }

  if (!base64Image) {
    throw new Error('No image data received from API');
  }

  return { base64Image, mimeType };
}

/**
 * 이미지를 생성합니다 (2-Call 프로세스)
 */
export async function generateImage(params: ImageGenerateRequest): Promise<ImageGenerateResponse> {
  try {
    // Gemini API 초기화
    const ai = initializeGemini(params.apiKey);

    // === Call 1: 영어 긍정 프롬프트 생성 ===
    const englishPositivePrompt = await generateImagePrompt(
      ai,
      params.textTitle,
      params.textContent,
      params.keywords,
      params.imageStyle,
      params.customPrompt
    );

    // === Call 2: 실제 이미지 생성 ===
    const finalImagePrompt = `${englishPositivePrompt}\n\n${params.imageStyle}\n\nNegative Keywords: ${IMAGE_NEGATIVE_PROMPT}`;

    const { base64Image, mimeType } = await generateImageFromPrompt(ai, finalImagePrompt);

    return { base64Image, mimeType };
  } catch (error) {
    const { message, status } = handleGeminiError(error);
    const err = new Error(message);
    (err as any).status = status;
    throw err;
  }
}
