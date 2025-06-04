import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'Util Modules',
  description: 'A collection of utility modules for modern web development',
  
  // Paths
  srcDir: './src',
  outDir: './dist',
  cacheDir: './.vitepress/cache',
  
  // Theme
  themeConfig: {
    logo: '/logo.svg',
    
    nav: [
      { text: 'Guide', link: '/guide/' },
      { text: 'Packages', link: '/packages/' },
      { text: 'API', link: '/api/' }
    ],
    
    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction', link: '/guide/' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Quick Start', link: '/guide/quick-start' }
          ]
        }
      ],
      
      '/packages/': [
        {
          text: 'Packages',
          items: [
            { text: 'Overview', link: '/packages/' },
            { text: 'Chrome Storage', link: '/packages/storage/' },
            { text: 'AI Toolkit', link: '/packages/ai-toolkit/' },
            { text: 'Content Extractor', link: '/packages/content-extractor/' },
            { text: 'Analysis', link: '/packages/analysis/' }
          ]
        }
      ]
    },
    
    socialLinks: [
      { icon: 'github', link: 'https://github.com/matthew-ngo/util-modules' }
    ],
    
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025 Matthew Ngo'
    },
    
    search: {
      provider: 'local'
    }
  },
  
  // Markdown
  markdown: {
    lineNumbers: true,
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    }
  },
  
  // Build
  build: {
    chunkSizeWarningLimit: 1600
  }
});