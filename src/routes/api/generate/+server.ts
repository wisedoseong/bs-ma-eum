import { json, type RequestHandler } from '@sveltejs/kit';
import { generateTextContent } from '$lib/services/textGenerationService';
import { generateImage } from '$lib/services/imageGenerationService';

/**
 * POST /api/generate
 *
 * 통합 API (텍스트 + 이미지 한 번에 생성)
 *
 * Request body:
 * {
 *   "docType": "상장" | "일기" | "보고서" | "문서" | "메일작성" | "블로그 글 작성" | "광고 문구 생성",
 *   "keywords": "string",
 *   "writingStyle": "string",
 *   "imageStyle": "string",
 *   "customPrompt": "string (optional)",
 *   "apiKey": "string"
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "text": {
 *       "title": "string",
 *       "content": "string"
 *     },
 *     "image": {
 *       "base64Image": "data:image/png;base64,...",
 *       "mimeType": "image/png"
 *     }
 *   }
 * }
 */
export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();

    // 유효성 검사
    if (
      !body.docType ||
      !body.keywords ||
      !body.writingStyle ||
      !body.imageStyle ||
      !body.apiKey
    ) {
      return json(
        {
          success: false,
          error:
            'Missing required fields: docType, keywords, writingStyle, imageStyle, apiKey',
        },
        { status: 400 }
      );
    }

    if (!['상장', '일기', '보고서', '문서', '메일작성', '블로그 글 작성', '광고 문구 생성'].includes(body.docType)) {
      return json(
        { success: false, error: 'Invalid docType. Must be one of: 상장, 일기, 보고서, 문서, 메일작성, 블로그 글 작성, 광고 문구 생성' },
        { status: 400 }
      );
    }

    // === Step 1: 텍스트 생성 ===
    const textResult = await generateTextContent({
      docType: body.docType,
      keywords: body.keywords,
      writingStyle: body.writingStyle,
      customPrompt: body.customPrompt,
      apiKey: body.apiKey,
    });

    // === Step 2: 이미지 생성 ===
    const imageResult = await generateImage({
      textTitle: textResult.title,
      textContent: textResult.content,
      keywords: body.keywords,
      imageStyle: body.imageStyle,
      customPrompt: body.customPrompt,
      apiKey: body.apiKey,
    });

    return json({
      success: true,
      data: {
        text: textResult,
        image: {
          base64Image: `data:${imageResult.mimeType};base64,${imageResult.base64Image}`,
          mimeType: imageResult.mimeType,
        },
      },
    });
  } catch (error) {
    console.error('Generation error:', error);

    if (error instanceof Error) {
      const status = (error as any).status || 500;
      return json(
        {
          success: false,
          error: error.message,
        },
        { status }
      );
    }

    return json(
      {
        success: false,
        error: 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
};

// GET 요청으로 API 정보 제공
export const GET: RequestHandler = async () => {
  return json({
    endpoint: '/api/generate',
    method: 'POST',
    description: '텍스트와 이미지를 한 번에 생성합니다 (권장)',
    requiredFields: ['docType', 'keywords', 'writingStyle', 'imageStyle', 'apiKey'],
    optionalFields: ['customPrompt'],
    docTypeOptions: ['상장', '일기', '보고서', '문서', '메일작성', '블로그 글 작성', '광고 문구 생성'],
    example: {
      request: {
        docType: '상장',
        keywords: '#고마워, #사랑해',
        writingStyle: '근엄하게',
        imageStyle: '수채화',
        apiKey: 'your-gemini-api-key',
      },
      response: {
        success: true,
        data: {
          text: {
            title: '감사의 마음',
            content: '감사합니다...',
          },
          image: {
            base64Image: 'data:image/png;base64,...',
            mimeType: 'image/png',
          },
        },
      },
    },
  });
};
