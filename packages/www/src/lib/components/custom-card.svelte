<script>
	export let width = '400px';
	export let height = 'auto';
	export let color = '255, 255, 255';
	export let opacity = 0.1;
	export let borderRadius = '12px';
	export let hover = true;
</script>

<div
	class="card"
	class:hover-effect={hover}
	style="
    --width: {width};
    --height: {height};
    --color: {color};
    --opacity: {opacity};
    --border-radius: {borderRadius};
  "
>
	<div class="card-content">
		<slot />
	</div>
</div>

<style>
	.card {
		width: var(--width);
		height: var(--height);
		position: relative;
		padding: 1.5rem;
		background: rgba(0, 0, 0, 0.2);
		border-radius: var(--border-radius);
		transition:
			transform 0.2s ease,
			background 0.2s ease;
	}

	.card::before {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: var(--border-radius);
		border: 1px solid transparent;
		background: linear-gradient(
				to bottom right,
				rgba(var(--color), calc(var(--opacity) * 1.5)),
				rgba(var(--color), calc(var(--opacity) * 0.5))
			)
			border-box;
		-webkit-mask:
			linear-gradient(#fff 0 0) padding-box,
			linear-gradient(#fff 0 0);
		-webkit-mask-composite: destination-out;
		mask-composite: exclude;
		pointer-events: none;
	}

	.hover-effect:hover {
		transform: translateY(-2px);
		background: rgba(0, 0, 0, 0.25);
	}

	.hover-effect:hover::before {
		background: linear-gradient(
				to bottom right,
				rgba(var(--color), calc(var(--opacity) * 2)),
				rgba(var(--color), calc(var(--opacity) * 0.8))
			)
			border-box;
	}

	.card-content {
		position: relative;
		z-index: 1;
	}
</style>
