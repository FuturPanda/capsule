<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';

	const features = [
		{
			title: 'Themes',
			description: 'The Skeleton theme system.'
		},
		{
			title: 'Colors',
			description: 'The Skeleton color system.'
		},
		{
			title: 'Presets',
			description: 'Provides a robust preset combination of classes.'
		}
	];
</script>

<section class="container mx-auto px-4 py-16">
	<div class="text-center mb-16">
		<h2 class="text-3xl font-bold mb-4">The Design System</h2>
		<p class="text-muted-foreground">The core features of Skeleton.</p>
	</div>
	<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
		{#each features as feature}
			<Card>
				<CardHeader>
					<CardTitle>{feature.title}</CardTitle>
				</CardHeader>
				<CardContent>
					<p class="text-muted-foreground">{feature.description}</p>
				</CardContent>
			</Card>
		{/each}
	</div>
</section>

