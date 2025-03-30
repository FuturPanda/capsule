<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { fly } from 'svelte/transition';
	import { CheckCircle } from 'lucide-svelte';

	let { data } = $props();

	onMount(() => {
		const countdownInterval = setTimeout(() => {
			goto(`/signup/create-capsule/${data.token}`);
		}, 2000);

		return () => {
			clearInterval(countdownInterval);
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
		<div class="z-10 max-w-xl px-8 text-center" in:fly={{ y: 20, duration: 500 }}>
			<div class="mb-8 text-teal-500">
				<CheckCircle class="mx-auto h-16 w-16" />
			</div>

			<h1 class="custom-text mb-6 text-3xl font-light text-white">Email Verified</h1>

			<p class="mb-6 text-lg leading-relaxed text-gray-400">
				Your email has been successfully verified. You'll be redirected to create your capsule in a
				moment...
			</p>

			<div class="loader-dots">
				<span></span>
				<span></span>
				<span></span>
			</div>
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
		animation: 2s rotate linear;
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

	.loader-dots {
		display: flex;
		justify-content: center;
		gap: 8px;
	}

	.loader-dots span {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background-color: #14b8a6;
		animation: bounce 1.4s infinite ease-in-out both;
	}

	.loader-dots span:nth-child(1) {
		animation-delay: -0.32s;
	}

	.loader-dots span:nth-child(2) {
		animation-delay: -0.16s;
	}

	@keyframes bounce {
		0%,
		80%,
		100% {
			transform: scale(0);
			opacity: 0.5;
		}
		40% {
			transform: scale(1);
			opacity: 1;
		}
	}
</style>
