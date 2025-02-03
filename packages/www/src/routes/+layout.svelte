<script lang="ts">
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';
</script>

<div class="min-h-screen bg-background text-foreground">
	<ModeWatcher />
	<slot />
</div>

