import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import adapter from '@sveltejs/adapter-node';
import { escapeSvelte, mdsvex } from 'mdsvex';
import { createHighlighter } from 'shiki';
import remarkToc from 'remark-toc';
import rehypeSlug from 'rehype-slug';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://svelte.dev/docs/kit/integrations
  // for more information about preprocessors
  preprocess: [
    vitePreprocess(),
    // https://joshcollinsworth.com/blog/build-static-sveltekit-markdown-blog#approach-2-dynamic-routes
    mdsvex({
      extensions: [".md", ".svx"],
      // https://mdsvex.com/docs#layouts
      // layout: './src/routes/post.svelte'
      // layout: {
      //   // _: './src/routes/post.svelte'
      //   blog: './src/routes/post.svelte'
      // }
      remarkPlugins: [[remarkToc, { tight: true }]],
      rehypePlugins: [rehypeSlug],
      highlight: {
        highlighter: async (code, lang = "text") => {
          const highlighter = await createHighlighter({
            themes: ["poimandres"],
            langs: ["javascript", "typescript"],
          });
          await highlighter.loadLanguage("javascript", "typescript");
          const html = escapeSvelte(
            highlighter.codeToHtml(code, { lang, theme: "poimandres" }),
          );
          return `{@html \`${html}\` }`;
        },
      },
    }),
  ],
  extensions: [".svelte", ".svx", ".md"],

  kit: {
    // adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
    // If your environment is not supported, or you settled on a specific environment, switch out the adapter.
    // See https://svelte.dev/docs/kit/adapters for more information about adapters.
    adapter: adapter(),
    csp: {
			mode: 'auto'
		}
	}
};

export default config;
