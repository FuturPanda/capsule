<script lang="ts">
	import { goto } from '$app/navigation';
	import useCapsuleClient from '$lib/capsule-client.svelte';
	import type { CapsuleClient } from '@capsule-mono-repo/capsule-client';
	import { onMount } from 'svelte';

	let username = $state('');
	let password = $state('');
	let errorMessage = $state('');

	async function handleLogin() {
		if (!username || !password) {
			errorMessage = 'Please enter both username and password';
			return;
		}
		if (username === 'admin' && password === 'password') {
			console.log(username, password);
			localStorage.setItem('isLoggedIn', 'true');
			goto('/');
		} else {
			errorMessage = 'Invalid username or password';
		}
	}

	async function handleLoginWithCapsule() {
		if (capsuleClient) {
			capsuleClient.handleOnLoginClick();
		}
	}

	let capsuleClient: CapsuleClient | null = $state(null);
	onMount(() => {
		capsuleClient = useCapsuleClient();
	});
</script>

<main>
	<h1>Login</h1>

	<form onsubmit={handleLogin}>
		{#if errorMessage}
			<div class="error-message">{errorMessage}</div>
		{/if}

		<div class="input-group">
			<label for="username">Username</label>
			<input id="username" bind:value={username} placeholder="Enter your username" type="text" />
		</div>

		<div class="input-group">
			<label for="password">Password</label>
			<input
				id="password"
				bind:value={password}
				placeholder="Enter your password"
				type="password"
			/>
		</div>

		<button type="submit">Login</button>
	</form>

	<button onclick={handleLoginWithCapsule}>Login with your Capsule</button>
</main>

<style>
	main {
		max-width: 400px;
		margin: 2rem auto;
		padding: 1.5rem;
		font-family: monospace;
		border: 2px solid #000;
	}

	h1 {
		font-size: 2rem;
		margin-bottom: 2rem;
		text-transform: uppercase;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.input-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	label {
		font-weight: bold;
	}

	input {
		padding: 0.5rem;
		border: 2px solid #000;
		font-family: monospace;
		width: 100%;
	}

	button {
		padding: 0.5rem 1rem;
		background: #000;
		color: #fff;
		border: none;
		cursor: pointer;
		margin-top: 1rem;
	}

	button:hover {
		background: #333;
	}

	.error-message {
		background-color: #ffebe9;
		border: 1px solid #ff0000;
		color: #ff0000;
		padding: 0.5rem;
		margin-bottom: 1rem;
	}
</style>
