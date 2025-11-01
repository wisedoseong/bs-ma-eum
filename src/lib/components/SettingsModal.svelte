<script lang="ts">
  import { apiKeyStore, setApiKey } from '$lib/stores/apiKey.svelte';
  import { promptsStore, setCustomPrompt, deleteCustomPrompt } from '$lib/stores/prompts.svelte';
  import { settingsStore, addCustomStyle, deleteCustomStyle, resetAllCustomStyles } from '$lib/stores/settings.svelte';
  import { SYSTEM_PROMPTS, DEFAULT_IMAGE_STYLES, type DocType } from '$lib/config/prompts';
  import { Dialog, DialogContent, DialogHeader, DialogTitle } from '$lib/components/ui/dialog';
  import { Tabs, TabsList, TabsTrigger, TabsContent } from '$lib/components/ui/tabs';
  import { Label } from '$lib/components/ui/label';
  import { Input } from '$lib/components/ui/input';
  import { Textarea } from '$lib/components/ui/textarea';
  // import { Select, SelectTrigger, SelectContent, SelectItem } from '$lib/components/ui/select';
  import { Button } from '$lib/components/ui/button';

  let { isOpen = $bindable(false) } = $props();

  let localApiKey = $state(apiKeyStore.value);
  let activeTab = $state('api');
  let selectedDocType = $state<DocType>('상장');
  let customPromptText = $state('');
  let newStyleName = $state('');
  let newStyleValue = $state('');
  let savedMessageVisible = $state(false);
  let savedMessageType = $state<'api' | 'prompt' | 'style'>('api');

  $effect(() => {
    if (isOpen) {
      localApiKey = apiKeyStore.value;
      customPromptText = promptsStore.custom[selectedDocType] || '';
    }
  });

  function handleApiKeySave() {
    setApiKey(localApiKey);
    showSavedMessage('api');
  }

  function handlePromptSave() {
    setCustomPrompt(selectedDocType, customPromptText);
    showSavedMessage('prompt');
  }

  function handleResetPrompt() {
    customPromptText = '';
    deleteCustomPrompt(selectedDocType);
    showSavedMessage('prompt');
  }

  function handleAddStyle() {
    if (!newStyleName.trim() || !newStyleValue.trim()) {
      alert('스타일명과 설명을 모두 입력해주세요.');
      return;
    }

    addCustomStyle(newStyleName, newStyleValue);
    newStyleName = '';
    newStyleValue = '';
    showSavedMessage('style');
  }

  function handleDeleteStyle(styleName: string) {
    if (confirm(`"${styleName}" 스타일을 삭제하시겠습니까?`)) {
      deleteCustomStyle(styleName);
    }
  }

  function handleResetAllStyles() {
    if (confirm('모든 커스텀 스타일을 삭제하시겠습니까?')) {
      resetAllCustomStyles();
      showSavedMessage('style');
    }
  }

  function showSavedMessage(type: 'api' | 'prompt' | 'style') {
    savedMessageType = type;
    savedMessageVisible = true;
    setTimeout(() => {
      savedMessageVisible = false;
    }, 2000);
  }

  function handleDocTypeChange(docType: DocType) {
    selectedDocType = docType;
    customPromptText = promptsStore.custom[selectedDocType] || '';
  }
</script>

<Dialog bind:open={isOpen}>
  <DialogContent class="max-w-2xl max-h-[90vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle>설정</DialogTitle>
    </DialogHeader>

    <Tabs value={activeTab} onValueChange={(value) => (activeTab = value)}>
      <TabsList class="grid w-full grid-cols-3">
        <TabsTrigger value="api">API 키</TabsTrigger>
<!--        <TabsTrigger value="prompts">프롬프트</TabsTrigger>-->
<!--        <TabsTrigger value="styles">이미지 스타일</TabsTrigger>-->
      </TabsList>

      <TabsContent value="api" class="space-y-4 mt-4">
        <div class="space-y-2">
          <Label for="apiKey">Google Gemini API 키</Label>
          <Input id="apiKey" type="password" bind:value={localApiKey} placeholder="API 키를 입력하세요 " />
          <p class="text-xs text-muted-foreground">
            Google Cloud Console에서 발급받은 Gemini API 키를 입력하세요.
            <a
              href="https://makersuite.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              class="text-primary hover:underline"
            >
              API 키 발급하기
            </a>
          </p>
        </div>

        <Button onclick={handleApiKeySave} class="w-full">API 키 저장</Button>

        {#if savedMessageVisible && savedMessageType === 'api'}
          <div class="p-3 bg-green-100 text-green-800 rounded-md text-sm">
            ✓ API 키가 저장되었습니다.
          </div>
        {/if}
      </TabsContent>

      <TabsContent value="prompts" class="space-y-4 mt-4">
        <!-- 문서 타입 선택 -->
        <div class="space-y-2">
          <Label>문서 타입</Label>
          <div class="flex gap-2 flex-wrap">
            {#each [
              { id: '상장' as const, label: '상장' },
              { id: '일기' as const, label: '일기' },
              { id: '보고서' as const, label: '보고서' },
              { id: '문서' as const, label: '문서' },
              { id: '메일작성' as const, label: '메일 작성' },
              { id: '블로그 글 작성' as const, label: '블로그' },
              { id: '광고 문구 생성' as const, label: '광고 문구' },
              { id: '오타수정' as const, label: '오타 수정' },
              { id: '글수정' as const, label: '글 수정' },
            ] as docType}
              <Button
                variant={selectedDocType === docType.id ? 'default' : 'outline'}
                size="sm"
                onclick={() => handleDocTypeChange(docType.id)}
              >
                {docType.label}
              </Button>
            {/each}
          </div>
        </div>

        <!-- 커스텀 프롬프트 -->
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <Label for="customPrompt">커스텀 프롬프트</Label>
            <button
              onclick={() => {
                customPromptText = SYSTEM_PROMPTS[selectedDocType];
              }}
              class="text-xs text-primary hover:underline"
            >
              기본값 복사
            </button>
          </div>
          <Textarea
            id="customPrompt"
            bind:value={customPromptText}
            placeholder="커스텀 프롬프트를 입력하세요. 비워두면 기본값을 사용합니다."
            class="min-h-[200px] font-mono text-xs"
          />
          <p class="text-xs text-muted-foreground">
            프롬프트에 {'{'}keywords{'}'}, {'{'}writingStyle{'}'} 변수를 사용할 수 있습니다.
          </p>
        </div>

        <div class="flex gap-2">
          <Button onclick={handlePromptSave} class="flex-1">프롬프트 저장</Button>
          <Button onclick={handleResetPrompt} variant="destructive" class="flex-1">
            기본값으로 초기화
          </Button>
        </div>

        {#if savedMessageVisible && savedMessageType === 'prompt'}
          <div class="p-3 bg-green-100 text-green-800 rounded-md text-sm">
            ✓ 프롬프트가 저장되었습니다.
          </div>
        {/if}
      </TabsContent>

      <TabsContent value="styles" class="space-y-4 mt-4">
        <!-- 기본 스타일 (읽기 전용) -->
        <div>
          <h3 class="text-sm font-semibold mb-2">기본 이미지 스타일</h3>
          <div class="grid grid-cols-2 gap-2">
            {#each DEFAULT_IMAGE_STYLES as style}
              <div class="p-2 bg-muted rounded-md text-sm">
                <p class="font-medium">{style.label}</p>
                <p class="text-xs text-muted-foreground">{style.value}</p>
              </div>
            {/each}
          </div>
        </div>

        <!-- 커스텀 스타일 -->
        <div class="border-t pt-4">
          <h3 class="text-sm font-semibold mb-2">커스텀 이미지 스타일</h3>

          {#if Object.keys(settingsStore.styles).length > 0}
            <div class="space-y-2 mb-4">
              {#each Object.entries(settingsStore.styles) as [name, value]}
                <div class="p-3 bg-muted rounded-md flex items-start justify-between gap-2">
                  <div class="flex-1">
                    <p class="font-medium text-sm">{name}</p>
                    <p class="text-xs text-muted-foreground">{value}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    onclick={() => handleDeleteStyle(name)}
                  >
                    삭제
                  </Button>
                </div>
              {/each}
            </div>

            <Button onclick={handleResetAllStyles} variant="destructive" class="w-full mb-4">
              모든 커스텀 스타일 삭제
            </Button>
          {/if}

          <!-- 새 스타일 추가 -->
          <div class="border-t pt-4 space-y-2">
            <h4 class="text-sm font-medium">새 스타일 추가</h4>
            <Input
              type="text"
              bind:value={newStyleName}
              placeholder="스타일명 (예: 네온 사이버펑크)"
            />
            <Textarea
              bind:value={newStyleValue}
              placeholder="스타일 설명 (예: Neon cyberpunk aesthetic with glowing colors...)"
              class="min-h-[80px]"
            />
            <Button onclick={handleAddStyle} class="w-full">스타일 추가</Button>
          </div>
        </div>

        {#if savedMessageVisible && savedMessageType === 'style'}
          <div class="p-3 bg-green-100 text-green-800 rounded-md text-sm">
            ✓ 스타일이 저장되었습니다.
          </div>
        {/if}
      </TabsContent>
    </Tabs>
  </DialogContent>
</Dialog>
