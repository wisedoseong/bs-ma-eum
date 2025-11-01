import { json, type RequestHandler } from '@sveltejs/kit';
import { generateImage } from '$lib/services/imageGenerationService';

interface ImageGenerateRequest {
  textTitle: string;
  textContent: string;
  keywords: string;
  imageStyle: string;
  customPrompt?: string;
  apiKey: string;
}

interface ImageGenerateResponse {
  base64Image: string;
  mimeType: string;
}

/**
 * POST /api/image-generate
 *
 * 2-Call Process:
 * 1. Text generation: 영어 긍정 프롬프트 생성
 * 2. Image generation: 실제 이미지 생성
 *
 * Request body:
 * {
 *   "textTitle": "string",
 *   "textContent": "string",
 *   "keywords": "string",
 *   "imageStyle": "string",
 *   "customPrompt": "string (optional)",
 *   "apiKey": "string"
 * }
 *
 * Response:
 * {
 *   "base64Image": "string (base64)",
 *   "mimeType": "string"
 * }
 */
export const POST: RequestHandler = async ({ request }) => {
  try {
    const body: ImageGenerateRequest = await request.json();

    // 유효성 검사
    if (!body.textTitle || !body.textContent || !body.keywords || !body.imageStyle || !body.apiKey) {
      return json(
        { error: 'Missing required fields: textTitle, textContent, keywords, imageStyle, apiKey' },
        { status: 400 }
      );
    }

    // 서비스 호출
    const result = await generateImage({
      textTitle: body.textTitle,
      textContent: body.textContent,
      keywords: body.keywords,
      imageStyle: body.imageStyle,
      customPrompt: body.customPrompt,
      apiKey: body.apiKey,
    });

    return json(result);
  } catch (error) {
    console.error('Image generation error:', error);

    if (error instanceof Error) {
      const status = (error as any).status || 500;
      return json({ error: error.message }, { status });
    }

    return json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
};
