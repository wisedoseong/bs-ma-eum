<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/Header.svelte';
	import SettingsModal from '$lib/components/SettingsModal.svelte';

	let { children } = $props();
	let isSettingsModalOpen = $state(false);

	function handleSettingsClick() {
		isSettingsModalOpen = true;
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Header onSettingsClick={handleSettingsClick} />
<SettingsModal bind:isOpen={isSettingsModalOpen} />
{@render children?.()}
