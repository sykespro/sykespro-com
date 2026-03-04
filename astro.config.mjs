// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://sykespro.com',
	output: 'static',
	integrations: [mdx(), sitemap(), tailwind({ applyBaseStyles: false })],
	markdown: {
		shikiConfig: {
			// github-light: comment color #6a737d achieves 4.55:1 on its own background —
			// meets WCAG AA. github-dark fails (same color, 3.04:1 on #24292e).
			// A light theme also matches our light-mode site design.
			theme: 'github-light',
		},
	},
});
