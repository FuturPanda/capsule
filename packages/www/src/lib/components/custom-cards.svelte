<!-- <div class="card">
	<slot />
</div>
<div class="accents">
	<div class="acc-card"></div>
	<div class="acc-card"></div>
	<div class="acc-card"></div>
	<div class="light"></div>
	<div class="light sm"></div>
	<div class="top-light"></div>
</div>

<style>
	.card {
		position: absolute;
		left: 0;
		right: 0;
		top: 19%;
		margin: auto;
		width: 320px;
		height: 500px;
		border-radius: 16px;
		background: #191919aa;
		background: linear-gradient(180deg, #292929aa 0%, #191919cc 50%);
		backdrop-filter: blur(4px);
		box-shadow:
			inset 0 2px 2px 0 #e7c4a088,
			inset 0 -2px 2px 0 #0003;

		color: #ccc;
		text-shadow: 1px 1px 3px #333a;
		padding: 24px;
		padding-right: 42px;
		display: flex;
		flex-direction: column;
		justify-content: end;
	}
	.card.h2,
	.card.p {
		margin: 8px 0;
	}
	.card.h2 {
		font-size: 1.1em;
	}
	.card.p {
		font-size: 0.9em;
		font-weight: 800;
		color: #aaa;
	}
	.card.button {
		width: fit-content;
		border-radius: 100px;
		padding: 8px 36px;
		margin-top: 12px;
		background: #fff2;
		box-shadow:
			0 0 0 1px #fff3,
			inset 120px 0 100px -100px #000c,
			0 0 0 0 #fff1;

		transition: box-shadow 0.4s ease-in-out;
		cursor: pointer;
		&:hover {
			box-shadow:
				0 0 0 1px #fff3,
				inset 200px 0px 100px -100px #000a,
				-4px 0 8px 2px #fff2;
		}
	}
	.card.img {
		position: absolute;
		top: 32px;
		left: 0;
		right: 0;
		width: 80%;
		margin: auto;
		object-fit: contain;
		user-select: none;
		pointer-events: none;
	}

	.accents {
		user-select: none;
		pointer-events: none;
		position: absolute;
		left: 0;
		right: 0;
		top: 20%;
		.acc-card {
			width: 330px;
			height: 500px;
			background: #eee1;
			opacity: 0.8;
			z-index: -1;
			position: absolute;
			left: 0;
			right: 0;
			top: 20%;
			margin: auto;
			border-radius: 16px;
			box-shadow:
				inset 0 2px 2px 0 #e0c9b266,
				inset 0 -2px 2px 0 #0004;
			backdrop-filter: blur(4px);
			transition: all 0.1s linear;
			transform-origin: 20% 80%;

			&:nth-child(1) {
				animation: wobble 18s ease-in-out infinite;
			}
			&:nth-child(2) {
				animation: wobble 22s ease-in-out -6s infinite reverse;
			}
			&:nth-child(3) {
				animation: wobble 26s ease-in-out -18s infinite;
			}
		}
		.light {
			--bgref: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg id='Layer_1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 487 487'%3E%3Ccircle cx='243' cy='243.5' r='233' style='fill:none; opacity:.1; stroke:%23aaa; stroke-linecap:round; stroke-miterlimit:10; stroke-width:18px;'/%3E%3Ccircle cx='243.5' cy='243.5' r='243' style='fill:none; stroke:%23111; stroke-linecap:round; stroke-miterlimit:10;'/%3E%3Ccircle cx='243' cy='243.5' r='222' style='fill:none; stroke:%23111; stroke-linecap:round; stroke-miterlimit:10;'/%3E%3Cpath d='m10,243.5C10,114.82,114.32,10.5,243,10.5' style='fill:none; stroke:%23ddd; stroke-linecap:round; stroke-miterlimit:10; stroke-width:18px;'/%3E%3C/svg%3E");
			position: absolute;
			left: 0;
			right: calc(0% + 300px);
			top: 264px;
			margin: auto;
			width: 164px;
			height: 164px;
			z-index: -2;
			background-image: var(--bgref);
			animation: rotate360 22s linear infinite;

			&::before,
			&::after {
				content: '';
				display: block;
				width: 100%;
				height: 100%;
				position: absolute;
				left: 0;
				right: 0;
				top: 0;
				bottom: 0;
				margin: auto;
				background-image: var(--bgref);
				filter: blur(3px);
				scale: 1.01;
			}
			&::after {
				filter: blur(8px);
			}
			&.sm {
				width: 100px;
				height: 100px;
				left: calc(0% + 300px);
				right: 0;
				top: 142px;
				bottom: 0;
				animation: rotate360 18s linear -10s infinite;
			}
		}
		.top-light {
			position: absolute;
			left: 0;
			right: 0;
			top: -42px;
			margin: auto;
			width: 284px;
			height: 6px;
			border-radius: 10px;
			background: #fffef9;
			box-shadow:
				0 0px 1px 1px #ffc78e,
				0 1px 2px 1px #ff942977,
				0 2px 6px 1px #e98b2d77,
				0 4px 12px 0px #ff9e3d99,
				0 12px 20px 12px #ff800044;
		}
	}

	@keyframes rotate360 {
		to {
			rotate: 360deg;
		}
	}
	@keyframes wobble {
		0% {
			transform: translateX(10px) translateY(20px) rotate(-3deg) scale(1);
		}
		20% {
			transform: translateX(-44px) translateY(-8px) rotate(6deg) scale(1.02);
		}
		60% {
			transform: translateX(32px) translateY(18px) rotate(-8deg) scale(1);
		}
		80% {
			transform: translateX(-42px) translateY(-22px) rotate(12deg) scale(0.94);
		}
		100% {
			transform: translateX(10px) translateY(20px) rotate(-3deg) scale(1);
		}
	}

	@media screen and (max-height: 600px) {
		.card {
			height: fit-content !important;
			img {
				display: none;
			}
		}
		.acc-card {
			height: 180px !important;
		}
		.card,
		.accents {
			top: 30%;
		}
		.accents {
			.light {
				top: 124px;
				bottom: 0;
				&.sm {
					top: 42px;
				}
			}
		}
	}
</style> -->
