<script lang="ts">
	import { Github } from 'lucide-svelte';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { ThemeToggle } from '$lib/components/ui/theme-toggle';

	let searchQuery = '';
</script>

<nav
	class="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
	<div class="container flex h-14 items-center">
		<div class="mr-4 flex">
			<a class="mr-6 flex items-center space-x-2" href="/">
				<span class="font-bold">Docs</span>
			</a>
			<nav class="flex items-center space-x-6 text-sm font-medium">
				<a class="transition-colors hover:text-foreground/80" href="/news">News</a>
				<a class="transition-colors hover:text-foreground/80" href="/themes">Themes</a>
			</nav>
		</div>
		<div class="flex flex-1 items-center space-x-2">
			<div class="flex-1">
				<Input
					bind:value={searchQuery}
					class="md:w-[300px] lg:w-[400px]"
					placeholder="Search..."
					type="search"
				/>
			</div>
			<ThemeToggle />

			<Button size="icon" variant="ghost">
				<Github class="h-5 w-5" />
			</Button>
			<Button>
				<a href="/signup">
					Try for Free
				</a>
			</Button>
		</div>
	</div>
</nav>

