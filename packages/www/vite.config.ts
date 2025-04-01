import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit()],

	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	build: {
		rollupOptions: {
			external: ['@capsulesh/capsule-client']
		}
	},
	optimizeDeps: {
		include: ['@capsulesh/capsule-client'],
		esbuildOptions: {
			define: {
				global: 'globalThis'
			}
		}
	},
	resolve: {
		dedupe: ['@capsulesh/capsule-client']
	},
	ssr: {
		noExternal: ['@capsulesh/capsule-client']
	}
});
