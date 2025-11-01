<script lang="ts">
  import { Settings } from '@lucide/svelte';
  import { Button } from '$lib/components/ui/button';

  interface Props {
    onSettingsClick?: (e: MouseEvent) => void;
  }

  let { onSettingsClick }: Props = $props();
</script>

<header class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
  <div class="max-w-[1920px] mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
    <div class="flex items-center gap-4">
      <div>
        <h1 class="text-3xl md:text-4xl font-bold tracking-tight">
          Ma-eum (마음)
        </h1>
        <p class="text-sm md:text-base text-muted-foreground mt-1">
          내 마음... 내생각을 정리하고 표현 하세요.
        </p>
      </div>
    </div>

    <Button variant="ghost" size="icon" onclick={onSettingsClick} title="설정">
      <Settings class="h-5 w-5" />
    </Button>
  </div>
</header>
