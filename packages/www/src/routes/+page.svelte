<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import Separator from '$lib/components/separator.svelte';
	import CustomCard from '$lib/components/custom-card.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	let showBackground = false;
	let showLoader = false;
	let showGradientCircle = false;
	let isExpanded = false;
	let showContent = false;
	const adjectives = ['better', 'private', 'sovereign', 'yours', 'secure', 'lame'];
	let currentIndex = 0;
	let currentWord = adjectives[0];

	let visible = true;
	const cycleWord = () => {
		visible = false;
		setTimeout(() => {
			currentIndex = (currentIndex + 1) % adjectives.length;
			currentWord = adjectives[currentIndex];
			visible = true;
		}, 300);
	};
	onMount(() => {
		let interval: any;
		setTimeout(() => (showBackground = true), 500);
		setTimeout(() => (showLoader = true), 1500);
		setTimeout(() => (showGradientCircle = true), 3500);
		setTimeout(() => (isExpanded = true), 4500);
		setTimeout(() => (showContent = true), 5000);
		setTimeout(() => {
			interval = setInterval(cycleWord, 3000);
		}, 6000);
		return () => clearInterval(interval);
	});
	const features = [
		{
			title: 'Personal VM, Enterprise Power',
			content:
				'Deploy your sovereign cloud in seconds. Each instance is a dedicated, private VM optimized for performance and security. No shared resources, no compromises. Your data lives exclusively on your infrastructure, giving you complete control over your digital footprint while maintaining the convenience of cloud computing.'
		},
		{
			title: 'One Source, Infinite Possibilities',
			content:
				"Break free from data silos. Our interoperability layer creates a unified data foundation where applications seamlessly share and sync information through a robust SDK. Whether it's your calendar, documents, or custom apps, everything stays in perfect harmony. Developers can focus on building features while we handle the complex data orchestration."
		},
		{
			title: 'Privacy by Architecture, Not Afterthought',
			content:
				"Security isn't just a feature—it's the foundation. Every aspect of the platform is built with zero-trust principles and end-to-end encryption. Your VM operates as a sovereign entity, with cryptographic guarantees ensuring that only you and your authorized applications can access your data. Take control of your digital sovereignty without sacrificing modern cloud conveniences."
		}
	];
</script>

<main class="mx-auto">
	{#if showContent}
		<h2
			class="custom-text absolute left-0 top-0 z-10 mt-4 pl-4 text-lg text-gray-400"
			in:fly={{ y: -50, duration: 800 }}
		>
			capsule
		</h2>
		<div
			class="custom-text absolute right-0 top-0 z-10 mr-3 mt-4 flex flex-row gap-3 pl-4 text-lg text-gray-400"
		>
			<Button class="" variant="ghost">
				<a href="https://docs.capsule.sh">Docs</a>
			</Button>
			<Button variant="outline"><a href="./signup" data-sveltekit-reload>Get Started</a></Button>
		</div>
	{/if}
	{#if showBackground}
		<div class="min-w-screen flex min-h-screen flex-col">
			<section>
				<div
					class="loading-page background min-h-screen text-foreground"
					transition:fade={{ duration: 1000 }}
				>
					{#if showLoader}
						<div class="loader" in:fade={{ duration: 500 }} class:expanded={isExpanded}></div>
					{/if}

					{#if showGradientCircle}
						<div
							class="gradient-circle flex items-center justify-center"
							in:fade={{ duration: 1000 }}
							class:expanded={isExpanded}
						>
							{#if showContent}
								<div
									class="text-content custom-text max-w-3xl p-8 text-center"
									in:fly={{ y: -50, duration: 800 }}
								>
									<h1 class="mb-4 text-lg font-bold text-gray-200">
										Like iCloud, but
										{#if visible}
											<span class="text-teal-500" transition:fade={{ duration: 400 }}>
												{currentWord}
											</span>
										{/if}.
									</h1>
									<p class="mb-4 text-sm text-gray-400">
										One private VM. All your data. Complete control.
									</p>
								</div>
							{/if}
						</div>
					{/if}
					{#if showContent}
						<div
							class="absolute bottom-0 left-1/2 -translate-x-1/2"
							in:fly={{ y: 50, duration: 1000 }}
						>
							<Separator />
						</div>
					{/if}
				</div>
			</section>

			{#if showContent}
				<section class="bg-black">
					<div class="mx-auto flex max-w-6xl flex-col space-y-24 px-4 py-16">
						{#each features as feature, i}
							<div
								class="flex {i % 2 === 0 ? 'justify-end' : 'justify-start'}"
								in:fly={{ y: 50, duration: 800, delay: i * 200 }}
							>
								<div class="justify-end">
									<CustomCard>
										<h2 class="mb-4 text-2xl font-bold">{feature.title}</h2>
										<p>{feature.content}</p>
									</CustomCard>
								</div>
							</div>
						{/each}
					</div>
				</section>
			{/if}
		</div>
	{/if}
</main>

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
		background: radial-gradient(#323232, #000);
		z-index: 1;
	}

	.loader {
		width: 350px;
		height: 350px;
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
		animation: 2s rotate linear;
	}
	@keyframes rotate {
		100% {
			transform: rotate(360deg);
		}
	}

	.gradient-circle {
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
		position: absolute;
		z-index: 4;
		transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.loader,
	.gradient-circle {
		transform-origin: center center;
	}

	.loader.expanded,
	.gradient-circle.expanded {
		transform: scale(2);
	}

	:global(.dark) {
		color-scheme: dark;
	}
	.custom-text {
		font-family: 'DelightExtraLight';
	}

	.text-content {
		color: #fff;
		max-height: 100%;
		overflow-y: auto;
	}
</style>
