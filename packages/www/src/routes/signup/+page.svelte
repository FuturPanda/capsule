<script lang="ts">
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle,
		Root
	} from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { formSchema, type FormSchema } from './schema';
	import { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { FormButton, FormControl, FormField, FormLabel } from '$lib/components/ui/form/index';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import { Button } from '$lib/components/ui/button';
	import { EyeClosedIcon, EyeIcon, Mail } from 'lucide-svelte';
	import { fly } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let { data }: { data: { form: SuperValidated<Infer<FormSchema>> } } = $props();
	const form = superForm(data.form, {
		validators: zodClient(formSchema),
		onSubmit: () => {
			isLoading = true;
			console.log('Form Action on submit');
		},
		onResult: () => {
			isLoading = false;
			isSecondScreen = true;
		}
	});
	const { form: formData, enhance, errors } = form;
	let isLoading = $state(false);
	let isSecondScreen = $state(false);
	let mounted = $state(false);

	let isOpen = $state(false);
	let showPassword = $state(false);
	let requirements = $state([
		{ text: 'Uppercase Letter', regex: /[A-Z]/, met: false },
		{ text: 'Lowercase Letter', regex: /[a-z]/, met: false },
		{ text: 'Number', regex: /[0-9]/, met: false },
		{ text: 'Special character (e.g !?<>@#*$%)', regex: /[!@#$%^&*(),.?":{}|<>]/, met: false },
		{ text: '8 characters or more', regex: /.{8,}/, met: false }
	]);

	function onPasswordClick() {
		isOpen = true;
	}

	function checkPassword() {
		requirements = requirements.map((req) => ({
			...req,
			met: req.regex.test($formData.password)
		}));
	}

	function togglePasswordVisibility() {
		showPassword = !showPassword;
	}

	onMount(() => {
		mounted = true;
		return () => {
			mounted = false;
		};
	});
	function onTurnstileCallback(token) {
		$formData['cf-turnstile-response'] = token;
	}

	if (browser) {
		window.onTurnstileCallback = onTurnstileCallback;
	}
</script>

<svelte:head>
	{#if browser}
		<script async defer src="https://challenges.cloudflare.com/turnstile/v0/api.js"></script>
	{/if}
</svelte:head>

{#if !isSecondScreen}
	<div class="loading-page background min-h-screen text-foreground">
		<h2
			class="custom-text absolute left-0 top-0 z-10 mt-4 pl-4 text-lg text-gray-400"
			in:fly={{ y: -50, duration: 800 }}
		>
			capsule
		</h2>
		<div class="loader" class:expanded={true}></div>
		<div class="gradient-circle flex items-center justify-center" class:expanded={true}>
			<Root
				class="mx-4 w-full max-w-md border-transparent bg-[rgba(20,25,35,0.7)] shadow-xl outline-none backdrop-blur-sm"
			>
				<CardHeader>
					<CardTitle class="custom-text text-2xl font-light text-gray-200">Get Started</CardTitle>
					<CardDescription class="text-gray-400"
						>Create your sovereign cloud in seconds.</CardDescription
					>
				</CardHeader>
				<form method="POST" use:enhance>
					<CardContent class="w-full">
						<FormField {form} name="email">
							<FormControl>
								{#snippet children({ props })}
									<FormLabel class="text-gray-300">Email</FormLabel>
									<Input
										{...props}
										bind:value={$formData.email}
										class="border-gray-700 bg-[rgba(20,25,35,0.7)] text-gray-200"
									/>
									{#if $errors.email}
										<p class="mt-1 text-sm text-red-500">{$errors.email[0]}</p>
									{/if}
								{/snippet}
							</FormControl>
						</FormField>
						<FormField {form} name="password">
							<FormControl>
								{#snippet children({ props })}
									<FormLabel class="text-gray-300">Password</FormLabel>
									<div class="relative min-w-[300px]">
										<Input
											data-cy="password-input"
											type={showPassword ? 'text' : 'password'}
											{...props}
											bind:value={$formData.password}
											onclick={onPasswordClick}
											oninput={checkPassword}
											class="border-gray-700 bg-[rgba(20,25,35,0.7)] text-gray-200"
										/>
										<Button
											data-cy="toggle-password"
											variant="ghost"
											size="icon"
											type="button"
											class="absolute right-0 top-0 h-full px-3 py-2 text-gray-400"
											onclick={togglePasswordVisibility}
										>
											{#if showPassword}
												<EyeIcon class="h-4 w-4" />
											{:else}
												<EyeClosedIcon class="h-4 w-4" />
											{/if}
										</Button>
									</div>
									{#if $errors.password}
										<p class="mt-1 text-sm text-red-500">{$errors.password[0]}</p>
									{/if}
								{/snippet}
							</FormControl>
						</FormField>
						{#if isOpen}
							<div class="mt-3 space-y-1 rounded-md bg-[rgba(20,25,35,0.7)] p-3">
								{#each requirements as r}
									<li data-cy={r.text} class="flex items-center text-xs">
										<Checkbox class="m-1 h-3 w-3" checked={r.met} disabled />
										<p class={r.met ? 'text-teal-500' : 'text-gray-500'}>
											{r.text}
										</p>
									</li>
								{/each}
							</div>
						{/if}

						<FormField {form} name="termsAccepted">
							<FormControl>
								{#snippet children({ props })}
									<div class="mt-4 flex items-start space-x-2">
										<Checkbox
											{...props}
											bind:checked={$formData.termsAccepted}
											id="terms"
											class="mt-1 data-[state=checked]:bg-teal-500 data-[state=checked]:text-white"
										/>
										<div class="space-y-1 leading-none">
											<label for="terms" class="cursor-pointer text-sm font-medium text-gray-300">
												I agree to the <a href="/terms" class="text-teal-400 hover:underline"
													>Terms of Service</a
												>
												and
												<a href="/privacy" class="text-teal-400 hover:underline">Privacy Policy</a>
											</label>
										</div>
									</div>
									{#if $errors.termsAccepted}
										<p class="mt-1 text-sm text-red-500">{$errors.termsAccepted[0]}</p>
									{/if}
								{/snippet}
							</FormControl>
						</FormField>

						<FormField {form} name="cf-turnstile-response">
							<FormControl>
								{#snippet children()}
									{#if mounted}
										<div data-cy="cf-turnstile-container" class="mt-4">
											<div
												class="cf-turnstile"
												data-sitekey="0x4AAAAAAA7oFhcbnoayUME5"
												data-size="flexible"
												data-callback="onTurnstileCallback"
											></div>
										</div>
									{/if}
									{#if $errors['cf-turnstile-response']}
										<p class="mt-1 text-sm text-red-500">{$errors['cf-turnstile-response'][0]}</p>
									{/if}
								{/snippet}
							</FormControl>
						</FormField>
						<FormButton
							class="mt-6 w-full bg-teal-700 text-white transition-colors duration-200 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 enabled:hover:bg-teal-600 disabled:bg-gray-800 disabled:text-gray-400"
							disabled={!$formData?.email ||
								!$formData?.password ||
								!$formData?.termsAccepted ||
								!$formData?.['cf-turnstile-response']}
						>
							{#if isLoading}
								<div class="flex items-center justify-center">
									<svg
										class="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
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
									Creating...
								</div>
							{:else}
								Create Capsule
							{/if}
						</FormButton>
					</CardContent>
				</form>
			</Root>
		</div>
	</div>
{:else}
	<div class="loading-page background min-h-screen">
		<h2 class="custom-text absolute left-0 top-0 z-10 mt-4 pl-4 text-lg text-gray-400">capsule</h2>
		<div in:fly={{ y: 20, duration: 300, delay: 150 }} class="z-10 w-full max-w-md text-center">
			<Card class="border-none bg-[rgba(20,25,35,0.7)] shadow-xl backdrop-blur-sm">
				<CardHeader class="space-y-6">
					<div class="mx-auto">
						<Mail class="h-12 w-12 text-teal-500" />
					</div>
					<div class="space-y-4">
						<CardTitle
							data-cy="check-email-screen"
							class="custom-text text-2xl font-light text-gray-200">Check your email</CardTitle
						>
						<p class="text-gray-400">
							We've just sent you an email to verify your account ! Please proceed to create your
							Capsule
						</p>
					</div>
				</CardHeader>
			</Card>
		</div>
	</div>
{/if}

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
</style>
