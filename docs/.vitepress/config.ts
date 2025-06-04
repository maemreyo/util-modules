import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'Util Modules',
  description: 'A comprehensive collection of utility modules',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
      { text: 'API', link: '/api/' },
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction', link: '/guide/' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Quick Start', link: '/guide/quick-start' },
          ],
        },
        {
          text: 'Packages',
          items: [
            { text: 'Chrome Storage', link: '/guide/storage' },
            { text: 'AI Toolkit', link: '/guide/ai-toolkit' },
            { text: 'Content Extractor', link: '/guide/content-extractor' },
            { text: 'Analysis', link: '/guide/analysis' },
          ],
        },
      ],
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/matthew-ngo/util-modules' },
    ],
  },
});
