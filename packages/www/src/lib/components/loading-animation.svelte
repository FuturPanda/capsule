<script>
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	let showBackground = false;
  let showLoader = false;
  let showGradientCircle = false;
  let isExpanded = false;

  onMount(() => {
    setTimeout(() => (showBackground = true), 500);
    setTimeout(() => (showLoader = true), 1500);
    setTimeout(() => (showGradientCircle = true), 3500);
    setTimeout(() => (isExpanded = true), 4500);
  });
</script>

<div class="loading-page min-h-screen bg-background text-foreground">
  {#if showBackground}
    <div class="background" transition:fade={{ duration: 1000 }}></div>
  {/if}

  {#if showLoader}
    <div class="loader" in:fade={{ duration: 500 }} class:expanded={isExpanded}></div>
  {/if}

  {#if showGradientCircle}
    <div class="gradient-circle" in:fade={{ duration: 1000 }} class:expanded={isExpanded}></div>
  {/if}
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
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(#323232, #000);
        z-index: 1;
    }

    .loader {
        width: 350px;
        height: 350px;
        position: absolute;
        z-index: 3;
        transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1); /* Add this */
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
        box-shadow: 0 -10px 20px 20px #00000040 inset,
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
        width: 350px;
        height: 350px;
        border-radius: 100%;
        background: linear-gradient(
                165deg,
                rgba(40, 40, 40, 1) 0%,
                rgb(30, 30, 30) 40%,
                rgb(20, 20, 20) 98%,
                rgb(0, 0, 0) 100%
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
        transform: scale(2);
    }

    :global(.dark) {
        color-scheme: dark;
    }
</style>
