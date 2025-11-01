<script lang="ts">
  import InputPanel from '$lib/components/InputPanel.svelte';
  import TextPanel from '$lib/components/TextPanel.svelte';
  import ImagePanel from '$lib/components/ImagePanel.svelte';
  import { apiKeyStore } from '$lib/stores/apiKey.svelte.ts';
  import { promptsStore } from '$lib/stores/prompts.svelte.ts';
  import { inputState } from '$lib/stores/inputState.svelte';

  // --- 상태 변수 ---
  let isLoadingText = false;
  let textTitle = '';
  let textContent = '';

  let isLoadingImage = false;
  let imageData: string | null = null;

  let errorMessage = '';
  let errorType: 'text' | 'image' = 'text';
  let errorTimeoutId: NodeJS.Timeout | null = null;

  function showError(message: string, type: 'text' | 'image' = 'text') {
    // 기존 타이머 취소
    if (errorTimeoutId) {
      clearTimeout(errorTimeoutId);
    }

    errorMessage = message;
    errorType = type;

    // 5초 후 자동 해제
    errorTimeoutId = setTimeout(() => {
      errorMessage = '';
      errorTimeoutId = null;
    }, 5000);
  }

  async function handleGenerateText() {
    // API 키 체크
    if (!apiKeyStore.value) {
      showError('Google API 키를 설정해주세요.');
      return;
    }

    // 키워드 체크
    if (!inputState.keywords.trim()) {
      showError('키워드를 입력해주세요.');
      return;
    }

    isLoadingText = true;
    textTitle = '';
    textContent = '';
    imageData = null;
    errorMessage = '';

    // 기존 에러 타이머 취소
    if (errorTimeoutId) {
      clearTimeout(errorTimeoutId);
      errorTimeoutId = null;
    }

    try {
      const response = await fetch('/api/text-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          docType: inputState.docType,
          keywords: inputState.keywords,
          writingStyle: inputState.writingStyle,
          customPrompt: promptsStore.custom[inputState.docType],
          apiKey: apiKeyStore.value,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Text generation failed');
      }

      const data = await response.json();

      // 응답 데이터 검증
      if (!data.title || !data.content) {
        throw new Error('API 응답 형식이 올바르지 않습니다');
      }

      textTitle = data.title;
      textContent = data.content;
      errorMessage = ''; // 성공 시 에러 메시지 초기화
    } catch (error) {
      console.error('Text generation error:', error);
      const errorMsg = error instanceof Error ? error.message : '텍스트 생성에 실패했습니다.';
      showError(errorMsg, 'text');
    } finally {
      isLoadingText = false;
    }
  }

  async function handleGenerateImage() {
    if (!textContent || !apiKeyStore.value) {
      showError('API 키가 필요합니다.', 'image');
      return;
    }

    isLoadingImage = true;
    imageData = null;
    errorMessage = '';

    // 기존 에러 타이머 취소
    if (errorTimeoutId) {
      clearTimeout(errorTimeoutId);
      errorTimeoutId = null;
    }

    try {
      const response = await fetch('/api/image-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          textTitle,
          textContent,
          keywords: inputState.keywords,
          imageStyle: inputState.imageStyle,
          customPrompt: undefined,
          apiKey: apiKeyStore.value,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Image generation failed');
      }

      const data = await response.json();

      // 응답 데이터 검증
      if (!data.base64Image || !data.mimeType) {
        throw new Error('API 응답 형식이 올바르지 않습니다');
      }

      imageData = `data:${data.mimeType};base64,${data.base64Image}`;
      errorMessage = ''; // 성공 시 에러 메시지 초기화
    } catch (error) {
      console.error('Image generation error:', error);
      const errorMsg = error instanceof Error ? error.message : '이미지 생성에 실패했습니다.';
      showError(errorMsg, 'image');
    } finally {
      isLoadingImage = false;
    }
  }
</script>

<div class="min-h-screen w-full bg-background text-foreground p-4 md:p-8">
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-[1920px] mx-auto">
    <!-- === 1. 입력 (Input) === -->
    <InputPanel
      isLoading={isLoadingText}
      onGenerate={handleGenerateText}
    />

    <!-- === 2. 텍스트 결과 (Text) === -->
    <TextPanel
      title={textTitle}
      content={textContent}
      isLoading={isLoadingImage}
      onGenerateImage={handleGenerateImage}
    />

    <!-- === 3. 이미지 결과 (Image) === -->
    <ImagePanel imageData={imageData} isLoading={isLoadingImage} imageStyle={inputState.imageStyle} />
  </div>

  <!-- 에러 메시지 -->
  {#if errorMessage}
    <div
      class="fixed bottom-4 right-4 max-w-sm p-4 bg-destructive text-destructive-foreground rounded-lg shadow-lg"
    >
      <p class="font-medium">{errorMessage}</p>
      <button
        onclick={() => {
          if (errorTimeoutId) {
            clearTimeout(errorTimeoutId);
            errorTimeoutId = null;
          }
          errorMessage = '';
        }}
        class="text-xs mt-2 underline hover:no-underline"
      >
        닫기
      </button>
    </div>
  {/if}
</div>

