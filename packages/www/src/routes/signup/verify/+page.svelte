<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  let secondsLeft = $state(3);
  onMount(() => {
    console.log(secondsLeft);
    const countdownInterval = setInterval(() => {
      if (secondsLeft > 0) {
        secondsLeft -= 1;
      } else {
        goto('/signup/create-capsule');
      }
    }, 1000);

    return () => {
      clearInterval(countdownInterval);
    };
  });

</script>

<div class="min-h-screen flex items-center justify-center bg-[#020617] p-4">
  <div class="text-center max-w-xl px-8">
    <div class="mb-8">
      <svg
        class="h-16 w-16 mx-auto text-white"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M22 12.5V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8.5" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        <path d="M16 19h6" />
        <path d="m19 16 3 3-3 3" />
      </svg>
    </div>

    <h1 class="text-5xl font-semibold text-white mb-6">
      Email Verified!
    </h1>

    <p class="text-xl text-slate-400 leading-relaxed">
      Your email has been successfully verified. Your will be redirected to the creation capsule screen.
    </p>
  </div>
</div>
