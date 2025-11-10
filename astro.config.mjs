// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://styvonix.com',
  integrations: [sitemap()],

  redirects: {
  // For your old pages
  '/html/about.html': '/about',
  '/html/Blog.html': '/blog',
  '/html/listing.html': '/listing',

  }

});
