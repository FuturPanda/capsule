<!-- <script lang="ts">
	import { source } from 'sveltekit-sse';
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';

	let progress = 0;
	let messages: string[] = [];
	const maxMessages = 4;
	const loadingStates = [
		'Initializing systems...',
		'Establishing connection...',
		'Loading resources...',
		'Configuring modules...',
		'Optimizing performance...',
		'Preparing interface...',
		'Almost ready...',
		'Final checks...'
	];
	function addMessage(message: string) {
		messages = [...messages, message].slice(-maxMessages);
	}
	onMount(() => {
		const res = source('/api/capsule-creation').select('message');

		res.subscribe((message: string) => {
			// spring.target = data.progress;
			console.log(message);
		});
		const progressInterval = setInterval(() => {
			if (progress < 100) {
				progress += 1;

				if (progress % Math.floor(100 / loadingStates.length) === 0) {
					const messageIndex = Math.floor((progress / 100) * loadingStates.length);
					if (loadingStates[messageIndex]) {
						addMessage(loadingStates[messageIndex]);
					}
				}
			} else {
				clearInterval(progressInterval);
			}
		}, 50);

		return () => clearInterval(progressInterval);
	});
</script>

<div class="loading-page">
	<div class="container">
		<div class="loader"></div>
	</div>
	<div class="absolute z-10 min-w-[300px] pt-6">
		<div class="mb-4 space-y-2">
			{#each messages as message, i (message + i)}
				<div
					in:fly={{ y: 20, duration: 400 }}
					class="text-center font-mono text-sm tracking-wider text-neutral-300"
				>
					{message}
				</div>
			{/each}
		</div>

		<div class="text-center font-mono text-xs tracking-widest text-neutral-400" in:fade>
			{progress}%
		</div>
	</div>
</div>

<style>
	.loading-page {
		margin: 0px;
		background: radial-gradient(#323232, #000);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 100vh;
	}

	.container {
		width: 350px;
		height: 350px;
		border-radius: 100%;
		background: linear-gradient(
			165deg,
			rgba(40, 40, 40, 1) 0%,
			rgb(30, 30, 30) 40%,
			rgb(20, 20, 20) 98%,
			rgb(0, 0, 0) 100%
		);
		position: relative;
	}

	.loader {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
	}

	.loader:before {
		position: absolute;
		content: '';
		width: 100%;
		height: 100%;
		border-radius: 100%;
		border-bottom: 0 solid #00000005;
		top: 0;
		left: 0;
		transform-origin: center center;
		box-shadow:
			0 -10px 20px 20px #00000040 inset,
			0 -5px 15px 10px #00000050 inset,
			0 -2px 5px #00000080 inset,
			0 -3px 2px #000000bb inset,
			0 2px 0px #000000,
			0 2px 3px #000000,
			0 5px 5px #00000090,
			0 10px 15px #00000060,
			0 10px 20px 20px #00000040;
		filter: blur(3px);
		animation: 2s rotate linear infinite;
	}

	@keyframes rotate {
		100% {
			transform: rotate(360deg);
		}
	}
</style> -->
