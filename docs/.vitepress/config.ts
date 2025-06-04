import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'Util Modules',
  description: 'A comprehensive collection of utility modules for modern web development',
  
  // Theme configuration
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'Util Modules',
    
    // Navigation
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { 
        text: 'Packages',
        items: [
          { text: 'Chrome Storage', link: '/packages/storage/' },
          { text: 'AI Toolkit', link: '/packages/ai-toolkit/' },
          { text: 'Content Extractor', link: '/packages/content-extractor/' },
          { text: 'Analysis', link: '/packages/analysis/' }
        ]
      },
      { text: 'API', link: '/api/storage' },
      {
        text: 'v1.0.0',
        items: [
          { text: 'Changelog', link: '/changelog' },
          { text: 'Contributing', link: '/contributing' }
        ]
      }
    ],
    
    // Sidebar
    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          items: [
            { text: 'Getting Started', link: '/guide/getting-started' },
            { text: 'Why Util Modules?', link: '/guide/why' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Quick Start', link: '/guide/quick-start' }
          ]
        },
        {
          text: 'Core Concepts',
          items: [
            { text: 'Monorepo Structure', link: '/guide/monorepo' },
            { text: 'TypeScript First', link: '/guide/typescript' },
            { text: 'Testing Strategy', link: '/guide/testing' },
            { text: 'Best Practices', link: '/guide/best-practices' }
          ]
        },
        {
          text: 'Advanced',
          items: [
            { text: 'Custom Plugins', link: '/guide/plugins' },
            { text: 'Performance', link: '/guide/performance' },
            { text: 'Security', link: '/guide/security' },
            { text: 'Deployment', link: '/guide/deployment' }
          ]
        }
      ],
      
      '/packages/storage/': [
        {
          text: 'Chrome Storage',
          items: [
            { text: 'Overview', link: '/packages/storage/' },
            { text: 'Installation', link: '/packages/storage/installation' },
            { text: 'Basic Usage', link: '/packages/storage/usage' },
            { text: 'API Reference', link: '/packages/storage/api' }
          ]
        },
        {
          text: 'Features',
          items: [
            { text: 'Encryption', link: '/packages/storage/encryption' },
            { text: 'Compression', link: '/packages/storage/compression' },
            { text: 'Sync Storage', link: '/packages/storage/sync' },
            { text: 'Migration', link: '/packages/storage/migration' }
          ]
        },
        {
          text: 'Examples',
          items: [
            { text: 'Basic Example', link: '/packages/storage/examples/basic' },
            { text: 'With React', link: '/packages/storage/examples/react' },
            { text: 'Advanced Patterns', link: '/packages/storage/examples/advanced' }
          ]
        }
      ],
      
      '/packages/ai-toolkit/': [
        {
          text: 'AI Toolkit',
          items: [
            { text: 'Overview', link: '/packages/ai-toolkit/' },
            { text: 'Installation', link: '/packages/ai-toolkit/installation' },
            { text: 'Configuration', link: '/packages/ai-toolkit/configuration' },
            { text: 'API Reference', link: '/packages/ai-toolkit/api' }
          ]
        },
        {
          text: 'Providers',
          items: [
            { text: 'OpenAI', link: '/packages/ai-toolkit/providers/openai' },
            { text: 'Anthropic', link: '/packages/ai-toolkit/providers/anthropic' },
            { text: 'Google AI', link: '/packages/ai-toolkit/providers/google' },
            { text: 'Custom Provider', link: '/packages/ai-toolkit/providers/custom' }
          ]
        },
        {
          text: 'Features',
          items: [
            { text: 'Caching', link: '/packages/ai-toolkit/caching' },
            { text: 'Rate Limiting', link: '/packages/ai-toolkit/rate-limiting' },
            { text: 'Streaming', link: '/packages/ai-toolkit/streaming' },
            { text: 'Error Handling', link: '/packages/ai-toolkit/error-handling' }
          ]
        }
      ],
      
      '/api/': [
        {
          text: 'API Reference',
          items: [
            { text: 'Chrome Storage', link: '/api/storage' },
            { text: 'AI Toolkit', link: '/api/ai-toolkit' },
            { text: 'Content Extractor', link: '/api/content-extractor' },
            { text: 'Analysis', link: '/api/analysis' }
          ]
        }
      ]
    },
    
    // Social links
    socialLinks: [
      { icon: 'github', link: 'https://github.com/matthew-ngo/util-modules' },
      { icon: 'twitter', link: 'https://twitter.com/matthewngo' }
    ],
    
    // Search
    search: {
      provider: 'local'
    },
    
    // Edit link
    editLink: {
      pattern: 'https://github.com/matthew-ngo/util-modules/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    },
    
    // Footer
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present Matthew Ngo'
    },
    
    // Page metadata
    lastUpdated: {
      text: 'Last updated',
      formatOptions: {
        dateStyle: 'medium',
        timeStyle: 'short'
      }
    },
    
    // Carbon ads (optional)
    // carbonAds: {
    //   code: 'your-carbon-code',
    //   placement: 'your-carbon-placement'
    // }
  },
  
  // Markdown configuration
  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    },
    lineNumbers: true,
    config: (md) => {
      // Add custom markdown plugins here
    }
  },
  
  // Build configuration
  srcDir: 'src',
  outDir: '../dist/docs',
  
  // Head tags
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'en' }],
    ['meta', { property: 'og:title', content: 'Util Modules - Modern Utility Collection' }],
    ['meta', { property: 'og:description', content: 'A comprehensive collection of utility modules for modern web development' }],
    ['meta', { property: 'og:site_name', content: 'Util Modules' }],
    ['meta', { property: 'og:image', content: 'https://util-modules.dev/og-image.png' }],
    ['meta', { property: 'og:url', content: 'https://util-modules.dev' }]
  ],
  
  // Sitemap
  sitemap: {
    hostname: 'https://util-modules.dev'
  }
});