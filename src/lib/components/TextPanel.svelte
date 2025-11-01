<script lang="ts">
  import { DEFAULT_IMAGE_STYLES } from '$lib/config/prompts';
  import { settingsStore } from '$lib/stores/settings.svelte';
  import { inputState, setImageStyle } from '$lib/stores/inputState.svelte';
  import { Card, CardHeader, CardTitle, CardContent } from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import { Label } from '$lib/components/ui/label';
  import { Select, SelectTrigger, SelectContent, SelectItem } from '$lib/components/ui/select';

  interface Props {
    title?: string;
    content?: string;
    isLoading?: boolean;
    onGenerateImage?: (e: MouseEvent) => void;
  }

  let {
    title = '',
    content = '',
    isLoading = false,
    onGenerateImage
  }: Props = $props();

  const allImageStyles = [
    ...DEFAULT_IMAGE_STYLES.map((s) => ({ label: s.label, value: s.value })),
  ];

  const customStyles = $derived(
    Object.entries(settingsStore.styles).map(([name, value]) => ({
      label: name,
      value: value,
    }))
  );

  const allStylesForSelect = $derived([...allImageStyles, ...customStyles]);
</script>

<div class="flex flex-col space-y-6">
  {#if isLoading && !content}
    <Card>
      <CardHeader>
        <CardTitle>2. 마음 조각</CardTitle>
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

  {#if content}
    <Card>
      <CardHeader>
        <CardTitle>2. 마음 조각</CardTitle>
      </CardHeader>
      <CardContent class="space-y-4">
        <div>
          <h3 class="text-xl font-semibold mb-2">{title}</h3>
          <p class="text-muted-foreground whitespace-pre-wrap">{content}</p>
        </div>

        <div class="space-y-2 border-t pt-4">
          <Label for="imageStyle">이미지 스타일</Label>
          <Select type="single" value={inputState.imageStyle} onValueChange={(value) => setImageStyle(value)}>
            <SelectTrigger id="imageStyle">
              {inputState.imageStyle || '스타일을 선택하세요'}
            </SelectTrigger>
            <SelectContent>
              {#each allStylesForSelect as style}
                <SelectItem value={style.value} label={style.label}>
                  {style.label}
                </SelectItem>
              {/each}
            </SelectContent>
          </Select>
        </div>

        <Button
          onclick={onGenerateImage}
          disabled={isLoading}
          class="w-full"
        >
          {#if isLoading}
            <svg
              class="animate-spin -ml-1 mr-3 h-5 w-5"
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
            이미지 그리는 중...
          {:else}
            이미지 생성
          {/if}
        </Button>
      </CardContent>
    </Card>
  {/if}
</div>
