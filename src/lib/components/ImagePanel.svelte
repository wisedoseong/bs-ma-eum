<script lang="ts">
  import { Download } from '@lucide/svelte';
  import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';

  let {
    imageData = null,
    isLoading = false,
    imageStyle = ''
  } = $props();

  function handleDownload() {
    if (!imageData) return;

    // base64 데이터로부터 링크 생성
    const link = document.createElement('a');
    link.href = imageData;
    link.download = `ma-eum-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
</script>

<div class="flex flex-col space-y-6">
  {#if isLoading && !imageData}
    <Card>
      <CardHeader>
        <CardTitle>3. 마음 카드</CardTitle>
      </CardHeader>
      <CardContent class="flex justify-center items-center h-64">
        <svg
          class="animate-spin h-8 w-8 text-primary"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </CardContent>
    </Card>
  {/if}

  {#if imageData}
    <Card>
      <CardHeader>
        <CardTitle>3. 마음 카드</CardTitle>
      </CardHeader>
      <CardContent>
        <img
          src={imageData}
          alt={`생성된 ${imageStyle} 이미지`}
          class="rounded-lg w-full aspect-square object-cover border"
        />
      </CardContent>
      <CardFooter>
        <Button onclick={handleDownload} class="w-full gap-2">
          <Download class="h-4 w-4" />
          카드 저장
        </Button>
      </CardFooter>
    </Card>
  {/if}
</div>
