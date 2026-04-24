// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

const SITE = 'https://mentoria.rominagaudiano.com';

// https://astro.build/config
export default defineConfig({
  site: SITE,
  integrations: [sitemap()],
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()],
  },
});
