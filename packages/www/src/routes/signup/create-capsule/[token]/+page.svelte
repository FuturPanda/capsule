<script lang="ts">
	import { source } from 'sveltekit-sse';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { Terminal, Copy, Check } from 'lucide-svelte';

	let { data } = $props();
	let progress = $state(0);
	let estimatedProgress = $state(0);
	let maxEstimatedAdvance = $state(15);

	let messages: string[] = $state([]);
	const maxMessages = 4;
	let initialSpeed = 50;
	let acceleratedSpeed = $state(10);
	let maxProgress = $state(100);
	let progressInterval = null;
	let currentSpeed = initialSpeed;
	let copied = $state(false);

	let showEndMessage = $state(false);
	let appName = $state('');

	function copyToClipboard() {
		const url = `https://${appName}.fly.dev`;
		navigator.clipboard
			.writeText(url)
			.then(() => {
				copied = true;
				setTimeout(() => {
					copied = false;
				}, 2000);
			})
			.catch((err) => {
				console.error('Could not copy text: ', err);
			});
	}

	function updateEstimatedProgress() {
		if (estimatedProgress < maxProgress && estimatedProgress < progress + maxEstimatedAdvance) {
			estimatedProgress = Math.min(estimatedProgress + 1, maxProgress);

			if (progress > estimatedProgress) {
				currentSpeed = acceleratedSpeed;
				stopProgress();
				startProgress();
			} else if (progress < estimatedProgress && currentSpeed === acceleratedSpeed) {
				currentSpeed = initialSpeed;
				stopProgress();
				startProgress();
			}

			progress = Math.max(progress, estimatedProgress);
		}
	}

	function startProgress() {
		stopProgress();
		progressInterval = setInterval(updateEstimatedProgress, currentSpeed);
	}

	function stopProgress() {
		if (progressInterval) {
			clearInterval(progressInterval);
			progressInterval = null;
		}
	}

	function handleServerProgress(actualProgress: number) {
		progress = actualProgress;

		if (actualProgress > estimatedProgress) {
			estimatedProgress = actualProgress;
		}

		if (!progressInterval) {
			startProgress();
		}
	}

	function addMessage(message: string) {
		messages = [...messages, message].slice(-maxMessages);
	}
	onMount(() => {
		startProgress();
		const eventSource = source(`../../api/capsule-creation?token=${data.token}`).select('message');

		eventSource.subscribe((message: string) => {
			try {
				const data = JSON.parse(message);

				if (data.progress !== undefined) {
					handleServerProgress(data.progress);
				}
				if (data.appName !== undefined) {
					appName = data.appName;
				}

				if (data.content === 'END') {
					showEndMessage = true;
				} else {
					addMessage(data.content);
				}
			} catch (error) {
				console.error('Error processing message:', error);
				addMessage('Error processing server message');
			}
		});

		return () => {
			stopProgress();
		};
	});
</script>

<div class="loading-page background min-h-screen text-foreground">
	<h2
		class="custom-text absolute left-0 top-0 z-10 mt-4 pl-4 text-lg text-gray-400"
		in:fly={{ y: -50, duration: 800 }}
	>
		capsule
	</h2>
	<div class="loader" class:expanded={true}></div>
	<div class="gradient-circle flex items-center justify-center" class:expanded={true}>
		<div
			class="z-10 flex flex-col items-center justify-center text-center"
			in:fly={{ y: 20, duration: 800 }}
		>
			<div
				class="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-black/60 p-2 text-teal-500"
			>
				<Terminal class="h-8 w-8" />
			</div>

			{#if !showEndMessage}
				<h2 class="custom-text mb-6 text-2xl font-light text-gray-200">Creating Your Capsule</h2>

				<div
					class="terminal-container mb-8 w-full max-w-md overflow-hidden rounded-lg border border-gray-800 bg-black/60 backdrop-blur-md"
				>
					<div class="terminal-header flex items-center border-b border-gray-800 px-4 py-2">
						<div class="mr-2 h-3 w-3 rounded-full bg-red-500"></div>
						<div class="mr-2 h-3 w-3 rounded-full bg-yellow-500"></div>
						<div class="h-3 w-3 rounded-full bg-green-500"></div>
						<span class="ml-4 text-xs text-gray-400">capsule-creation</span>
					</div>
					<div class="terminal-body h-32 overflow-y-auto p-4 text-left">
						{#each messages as message, i (message + i)}
							<div
								in:fly={{ y: 10, duration: 300 }}
								class="terminal-line font-mono text-xs tracking-wider text-neutral-300"
							>
								<span class="mr-2 text-teal-500">></span>
								{message}
							</div>
						{/each}
					</div>
				</div>

				<div class="mb-2 w-full max-w-md">
					<div class="h-2 overflow-hidden rounded-full bg-gray-800">
						<div
							class="h-full bg-gradient-to-r from-teal-600 to-teal-400 transition-all duration-300"
							style="width: {progress}%"
						></div>
					</div>
				</div>

				<div class="text-center font-mono text-xs tracking-widest text-gray-400">
					{progress}%
				</div>
			{:else}
				<h2 class="custom-text mb-4 text-2xl font-light text-gray-200">Capsule Launch Initiated</h2>
				<p class="mb-2 text-gray-400">Your capsule is now launching...</p>
				<p class="text-xs text-gray-500">This process may take a few minutes to complete.</p>
				<div class="mb-4 mt-6">
					<p class="mb-2 text-gray-400">Your capsule URL:</p>
					<div
						class="flex w-full max-w-xs items-center overflow-hidden rounded-lg border border-teal-600 bg-black/40 font-mono text-gray-300 sm:max-w-sm"
					>
						<div class="flex-1 overflow-hidden px-4 py-2">
							<div class="select-all truncate">
								https://{appName}.fly.dev
							</div>
						</div>
						<button
							onclick={copyToClipboard}
							class="flex flex-shrink-0 items-center justify-center px-3 py-2 transition-colors duration-200"
							title="Copy to clipboard"
						>
							{#if copied}
								<Check class="h-5 w-5 text-white" />
							{:else}
								<Copy class="h-5 w-5 text-white" />
							{/if}
						</button>
					</div>
				</div>

				<p class="mb-2 text-gray-400">You can access it via</p>
				<div
					class="flex w-full max-w-xs items-center overflow-hidden rounded-lg border border-teal-600 bg-black/40 font-mono text-gray-300 sm:max-w-sm"
				>
					<a href="http://localhost:5173" class="truncate p-3">capsule-kit</a>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.loading-page {
		margin: 0;
		background: #000;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 100vh;
		position: relative;
		overflow: hidden;
	}

	.background {
		background: radial-gradient(circle at center, #101820 0%, #000 100%);
		position: relative;
		z-index: 1;
	}

	.background::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: radial-gradient(circle at 30% 40%, rgba(20, 30, 48, 0.4) 0%, transparent 70%);
		z-index: -1;
	}

	.loader {
		width: 700px;
		height: 700px;
		position: absolute;
		z-index: 3;
		transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
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

	.gradient-circle {
		width: 700px;
		height: 700px;
		border-radius: 100%;
		background: linear-gradient(
			165deg,
			rgba(40, 45, 55, 1) 0%,
			rgb(30, 35, 45) 40%,
			rgb(20, 25, 35) 98%,
			rgb(10, 15, 25) 100%
		);
		position: absolute;
		z-index: 4;
		transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		padding: 2rem;
	}

	/* Add this new style for the inner content container */
	.gradient-circle > div {
		max-width: 100%;
		width: 100%;
	}

	.loader,
	.gradient-circle {
		transform-origin: center center;
	}

	.loader.expanded,
	.gradient-circle.expanded {
		transform: scale(1);
	}

	.custom-text {
		font-family: 'DelightExtraLight';
	}

	.terminal-line {
		line-height: 1.6;
		position: relative;
	}

	.terminal-body {
		scrollbar-width: thin;
		scrollbar-color: rgba(75, 85, 99, 0.5) rgba(0, 0, 0, 0.1);
	}

	.terminal-body::-webkit-scrollbar {
		width: 6px;
	}

	.terminal-body::-webkit-scrollbar-track {
		background: rgba(0, 0, 0, 0.1);
	}

	.terminal-body::-webkit-scrollbar-thumb {
		background-color: rgba(75, 85, 99, 0.5);
		border-radius: 6px;
	}
</style>
