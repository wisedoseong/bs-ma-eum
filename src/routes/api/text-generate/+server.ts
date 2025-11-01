import { json, type RequestHandler } from '@sveltejs/kit';
import { generateTextContent, type TextGenerateRequest } from '$lib/services/textGenerationService';
import type { DocType } from '$lib/config/prompts';

const ALL_DOC_TYPES: DocType[] = ['상장', '일기', '보고서', '문서', '메일작성', '오타수정', '글수정', '블로그 글 작성', '광고 문구 생성'];
const REVISION_TYPES: DocType[] = ['오타수정', '글수정'];

/**
 * POST /api/text-generate
 *
 * Google Gemini API를 사용하여 텍스트를 생성 또는 수정합니다.
 *
 * Request body (생성 시):
 * {
 *   "docType": "상장" | "일기" | "보고서" | "문서" | "메일작성",
 *   "keywords": "string",
 *   "writingStyle": "string",
 *   "apiKey": "string",
 *   "customPrompt": "string (optional)"
 * }
 *
 * Request body (수정 시):
 * {
 *   "docType": "오타수정" | "글수정",
 *   "originalText": "string",
 *   "writingStyle": "string (글수정 시 필수)",
 *   "apiKey": "string",
 *   "customPrompt": "string (optional)"
 * }
 */
export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();

    // 기본 필드 유효성 검사
    if (!body.docType || !body.apiKey) {
      return json({ error: 'Missing required fields: docType, apiKey' }, { status: 400 });
    }

    if (!ALL_DOC_TYPES.includes(body.docType)) {
      return json({ error: `Invalid docType. Must be one of: ${ALL_DOC_TYPES.join(', ')}` }, { status: 400 });
    }

    const isRevision = REVISION_TYPES.includes(body.docType);

    if (isRevision) {
      if (!body.originalText) {
        return json({ error: 'Missing required field for revision: originalText' }, { status: 400 });
      }
    } else {
      if (!body.keywords) {
        return json({ error: 'Missing required field for generation: keywords' }, { status: 400 });
      }
    }

    // '오타수정'을 제외하고 writingStyle은 필수
    if (body.docType !== '오타수정' && !body.writingStyle) {
      return json({ error: 'Missing required field: writingStyle' }, { status: 400 });
    }

    // 서비스 호출
    const result = await generateTextContent(body as TextGenerateRequest);

    return json(result);
  } catch (error) {
    console.error('Text generation error:', error);

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