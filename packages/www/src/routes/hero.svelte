<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { ArrowRight, Shield, Database, Code, Star, Terminal, Lock } from 'lucide-svelte';

	let isVisible = $state(false);

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					isVisible = true;
					observer.disconnect();
				}
			},
			{ threshold: 0.2 }
		);

		const section = document.getElementById('features-section');
		if (section) observer.observe(section);

		return () => observer.disconnect();
	});

	const features = [
		{
			title: 'Personal VM, Enterprise Power',
			description:
				'Deploy your sovereign cloud in seconds. Each instance is a dedicated, private VM optimized for performance and security.',
			icon: Shield,
			delay: 0,
			color: 'from-teal-500/5 to-transparent'
		},
		{
			title: 'One Source, Infinite Possibilities',
			description:
				'Break free from data silos with our interoperability layer where applications seamlessly share and sync information.',
			icon: Database,
			delay: 150,
			color: 'from-teal-500/5 to-transparent'
		},
		{
			title: 'Privacy by Architecture',
			description:
				"Security isn't just a feature—it's the foundation. Built with zero-trust principles and end-to-end encryption.",
			icon: Lock,
			delay: 300,
			color: 'from-teal-500/5 to-transparent'
		},
		{
			title: 'Developer-First Experience',
			description:
				'Build and deploy with familiar tools and workflows. Our platform provides flexible development options with comprehensive support.',
			icon: Terminal,
			delay: 450,
			color: 'from-teal-500/5 to-transparent'
		},
		{
			title: 'Seamless Integration',
			description:
				'Connect with your existing tools and services. Import, export, and sync your data without friction.',
			icon: Code,
			delay: 600,
			color: 'from-teal-500/5 to-transparent'
		},
		{
			title: 'Community-Driven Innovation',
			description:
				'Join a thriving ecosystem of developers, creators, and privacy advocates building the future of personal cloud computing.',
			icon: Star,
			delay: 750,
			color: 'from-teal-500/5 to-transparent'
		}
	];
</script>

<section id="features-section" class="bg-black pb-32 pt-40">
	<div class="container mx-auto px-8">
		<!-- Section header -->
		<div class="mb-28 text-center">
			<h2
				class="custom-text mb-8 text-3xl font-light text-gray-200 md:text-4xl"
				in:fade={{ duration: 1000, delay: 200 }}
			>
				Your Digital Life, <span class="text-teal-500">Reimagined</span>
			</h2>
			<p class="mx-auto max-w-2xl text-sm text-gray-400" in:fade={{ duration: 1000, delay: 400 }}>
				One personal virtual machine. All your data. Complete sovereignty.
			</p>
		</div>

		<div class="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
			{#each features as feature}
				{#if isVisible}
					<div
						in:fly={{ y: 20, duration: 800, delay: feature.delay }}
						class="relative overflow-hidden rounded-lg border border-gray-900 bg-gradient-to-b from-gray-950 to-black p-8 transition-all duration-300 hover:border-gray-800 hover:shadow-md hover:shadow-teal-900/5"
					>
						<div
							class="absolute -inset-1 -z-10 bg-gradient-to-br {feature.color} opacity-20 blur-lg"
						></div>

						<div
							class="mb-7 inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/60 p-2 text-teal-500"
						>
							<svelte:component this={feature.icon} class="h-5 w-5" />
						</div>

						<h3 class="custom-text mb-5 text-lg font-light tracking-wide text-gray-200">
							{feature.title}
						</h3>
						<p class="mb-8 text-xs leading-relaxed tracking-wide text-gray-400">
							{feature.description}
						</p>

						<a
							href="#"
							class="inline-flex items-center text-xs text-teal-500 transition-colors hover:text-teal-400"
						>
							Learn more
							<ArrowRight class="ml-1 h-3 w-3" />
						</a>
					</div>
				{/if}
			{/each}
		</div>
	</div>
</section>

<style>
	section {
		overflow: hidden;
	}

	.custom-text {
		font-family: 'DelightExtraLight';
	}
</style>
