<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { CardContent, CardDescription, CardHeader, CardTitle, Root } from '$lib/components/ui/card';

	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
</script>

<Root class="mx-auto max-w-sm">
	<CardHeader>
		<CardTitle class="text-2xl">Login</CardTitle>
		<CardDescription>Enter your email below to login to your account</CardDescription>
	</CardHeader>
	<CardContent>
		<div class="grid gap-4">
			<div class="grid gap-2">
				<Label for="email">Email</Label>
				<Input id="email" placeholder="m@example.com" required type="email" />
			</div>
			<div class="grid gap-2">
				<div class="flex items-center">
					<Label for="password">Password</Label>
					<a class="ml-auto inline-block text-sm underline" href="##">
						Forgot your password?
					</a>
				</div>
				<Input id="password" required type="password" />
			</div>
			<Button class="w-full" type="submit">Login</Button>
		</div>
		<div class="mt-4 text-center text-sm">
			Don't have an account?
			<a class="underline" href="/signup"> Sign up </a>
		</div>
	</CardContent>
</Root>
