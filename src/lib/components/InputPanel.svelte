<script lang="ts">
  import { DEFAULT_WRITING_STYLES, type DocType } from '$lib/config/prompts';
  import { inputState, setDocType, setKeywords, setWritingStyle, setOriginalText } from '$lib/stores/inputState.svelte';
  import { Button } from '$lib/components/ui/button';
  import { Label } from '$lib/components/ui/label';
  import { Textarea } from '$lib/components/ui/textarea';
  import { Select, SelectTrigger, SelectContent, SelectItem } from '$lib/components/ui/select';
  import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '$lib/components/ui/card';

  interface Props {
    isLoading?: boolean;
    onGenerate?: (e: MouseEvent) => void;
  }

  let {
    isLoading = false,
    onGenerate
  }: Props = $props();

  const docTypeOptions: Array<{ id: DocType; label: string }> = [
    { id: '상장', label: '상장' },
    { id: '일기', label: '일기' },
    { id: '보고서', label: '보고서' },
    { id: '문서', label: '문서' },
    { id: '메일작성', label: '메일 작성' },
    { id: '블로그 글 작성', label: '블로그' },
    { id: '광고 문구 생성', label: '광고 문구' },
    { id: '오타수정', label: '오타 수정' },
    { id: '글수정', label: '글 수정' },
  ];

  const revisionTypes: DocType[] = ['오타수정', '글수정'];
</script>

<div class="flex flex-col space-y-6">
  <Card class="sticky top-24">
    <CardHeader>
      <CardTitle>1. 마음 입력</CardTitle>
    </CardHeader>
    <CardContent class="space-y-4">
      <!-- 상: 문서 타입 -->
      <div class="space-y-2">
        <Label>문서 타입</Label>
        <div class="flex space-x-2 flex-wrap gap-2">
          {#each docTypeOptions as option}
            <Button
              variant={inputState.docType === option.id ? 'default' : 'outline'}
              onclick={() => setDocType(option.id)}
              onmousedown={(e) => {}}
            >
              {option.label}
            </Button>
          {/each}
        </div>
      </div>

      <!-- 중: 키워드 또는 원본 텍스트 입력 -->
      <div class="space-y-2">
        {#if revisionTypes.includes(inputState.docType)}
          <Label for="originalText">원본 텍스트</Label>
          <Textarea
            id="originalText"
            value={inputState.originalText}
            oninput={(e) => setOriginalText(e.currentTarget.value)}
            placeholder="수정하거나 다듬고 싶은 글의 전체 내용을 입력하세요..."
            class="min-h-[200px]"
          />
        {:else}
          <Label for="keywords">키워드 (예: #회의 일정 조율, #참석 요청)</Label>
          <Textarea
            id="keywords"
            value={inputState.keywords}
            oninput={(e) => setKeywords(e.currentTarget.value)}
            placeholder="당신의 마음에 떠오른 단어들을 입력하세요..."
            class="min-h-[100px]"
          />
        {/if}
      </div>

      <!-- 하: 문서 스타일 -->
      {#if inputState.docType !== '오타수정'}
        <div class="space-y-2">
          <Label for="style">문서 스타일</Label>
          <Select type="single" value={inputState.writingStyle} onValueChange={(value) => setWritingStyle(value)}>
            <SelectTrigger id="style">
              {inputState.writingStyle || '스타일을 선택하세요'}
            </SelectTrigger>
            <SelectContent>
              {#each DEFAULT_WRITING_STYLES as style}
                <SelectItem value={style.value} label={style.label}>
                  {style.label}
                </SelectItem>
              {/each}
            </SelectContent>
          </Select>
        </div>
      {/if}
    </CardContent>
    <CardFooter>
      <Button
        onclick={onGenerate}
        disabled={isLoading || (revisionTypes.includes(inputState.docType) ? !inputState.originalText.trim() : !inputState.keywords.trim())}
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
          글 만드는 중...
        {:else}
          글 만들기
        {/if}
      </Button>
    </CardFooter>
  </Card>
</div>
