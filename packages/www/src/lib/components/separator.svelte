<script>
	export let width = '100%';
	export let height = '80px';
	export let color = '255, 255, 255';
	export let opacity = 0.1;
	export let curvature = 0.8;

	$: path = generatePath(curvature);

	function generatePath(curvature) {
		const controlY = 80 * (1 - curvature);
		return `M0 80 C 400 ${controlY}, 800 ${controlY}, 1200 80`;
	}
</script>

<div class="separator-container" style="--width: {width}; --height: {height};">
	<svg width="100%" {height} viewBox="0 0 1200 80" preserveAspectRatio="none">
		<defs>
			<!-- Gradient for smoother transition -->
			<linearGradient id="fade-gradient" x1="0" x2="0" y1="0" y2="1">
				<stop offset="0%" stop-color="transparent" />
				<stop offset="100%" stop-color="black" />
			</linearGradient>

			<!-- Line gradient -->
			<linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
				<stop offset="0%" style="stop-color:rgba({color}, 0)" />
				<stop offset="20%" style="stop-color:rgba({color}, {opacity})" />
				<stop offset="80%" style="stop-color:rgba({color}, {opacity})" />
				<stop offset="100%" style="stop-color:rgba({color}, 0)" />
			</linearGradient>

			<mask id="curve-mask">
				<rect width="1200" height="80" fill="white" />
				<path d={path} stroke="black" fill="none" stroke-width="1" />
			</mask>
		</defs>

		<!-- Background fill -->
		<rect x="0" y="0" width="1200" height="80" fill="url(#fade-gradient)" mask="url(#curve-mask)" />

		<!-- The curve line -->
		<path d={path} stroke="url(#line-gradient)" fill="none" stroke-width="1" />
	</svg>
</div>

<style>
	.separator-container {
		width: var(--width);
		height: var(--height);
		position: relative;
	}

	svg {
		filter: blur(0.5px);
	}

	path {
		vector-effect: non-scaling-stroke;
	}
</style>
