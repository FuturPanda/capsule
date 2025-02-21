<div class="v-badge flex h-6 w-12 items-center justify-center">
	<p class="text-sm">v3.2</p>
	<span></span>
</div>

<style>
	.v-badge {
		position: relative;
		text-decoration: none;
		padding: 8px 16px;
		color: white;

		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
		/* lighten($grd-mix,12%) would be approximately #6A4FBE */
		background: linear-gradient(to bottom, #6a4fbe, #533ca1);
		border-radius: 999px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
		user-select: none;
	}

	.v-badge:before {
		content: '';
		position: absolute;
		z-index: -1;
		/* lighten($grd-mix, 16%) would be approximately #7459CB */
		background: linear-gradient(30deg, #7459cb 60%, white);
		top: -1px;
		right: -1px;
		bottom: -1px;
		left: -1px;
		border-radius: 999px;
	}
</style>
