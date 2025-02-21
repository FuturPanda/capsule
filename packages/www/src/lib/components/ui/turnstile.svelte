<!-- TurnstileWidget.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';

	export let sitekey: string;
	export let callback: (token: string) => void = () => {};

	let containerRef: HTMLDivElement;

	onMount(() => {
		const initTurnstile = () => {
			if (window.turnstile && containerRef) {
				window.turnstile.render(containerRef, {
					sitekey,
					callback
				});
			}
		};

		if (!window.turnstile) {
			const script = document.createElement('script');
			script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
			script.async = true;
			script.defer = true;
			script.onload = initTurnstile;
			document.head.appendChild(script);
		} else {
			initTurnstile();
		}

		return () => {
			if (window.turnstile && containerRef) {
				window.turnstile.remove(containerRef);
			}
		};
	});
</script>

<div bind:this={containerRef} class="mt-3 rounded-s"></div>
