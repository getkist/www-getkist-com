import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "kist",
  description: "Lightweight Package Pipeline Processor with Plugin Architecture",
  base: "/",
  srcExclude: ['**/projects/**'],

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: 'https://raw.githubusercontent.com/getkist/brand/master/src/logo/kist.png',

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Plugins', link: '/plugins/' },
      { text: 'API', link: '/api/' },
      {
        text: 'v0.1.62',
        items: [
          { text: 'Changelog', link: '/changelog' },
          { text: 'npm', link: 'https://npmjs.com/package/kist' }
        ]
      }
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          items: [
            { text: 'Getting Started', link: '/guide/getting-started' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Configuration', link: '/guide/configuration' }
          ]
        },
        {
          text: 'Core Concepts',
          items: [
            { text: 'Pipeline Architecture', link: '/guide/architecture' },
            { text: 'Actions', link: '/guide/actions' },
            { text: 'Stages & Steps', link: '/guide/stages-steps' }
          ]
        },
        {
          text: 'Advanced',
          items: [
            { text: 'Plugin Development', link: '/guide/plugin-development' },
            { text: 'Best Practices', link: '/guide/best-practices' },
            { text: 'Migration Guide', link: '/guide/migration' }
          ]
        }
      ],
      '/plugins/': [
        {
          text: 'Plugins',
          items: [
            { text: 'Overview', link: '/plugins/' },
            { text: 'Using Plugins', link: '/plugins/using-plugins' }
          ]
        },
        {
          text: 'Style Plugins',
          items: [
            { text: 'action-sass', link: '/plugins/action-sass' },
            { text: 'action-postcss', link: '/plugins/action-postcss' }
          ]
        },
        {
          text: 'Build Plugins',
          items: [
            { text: 'action-typescript', link: '/plugins/action-typescript' },
            { text: 'action-terser', link: '/plugins/action-terser' },
            { text: 'action-tsup', link: '/plugins/action-tsup' }
          ]
        },
        {
          text: 'Quality Plugins',
          items: [
            { text: 'action-eslint', link: '/plugins/action-eslint' },
            { text: 'action-prettier', link: '/plugins/action-prettier' },
            { text: 'action-jest', link: '/plugins/action-jest' }
          ]
        },
        {
          text: 'Asset Plugins',
          items: [
            { text: 'action-svg', link: '/plugins/action-svg' },
            { text: 'action-nunjucks', link: '/plugins/action-nunjucks' }
          ]
        }
      ],
      '/api/': [
        {
          text: 'API Reference',
          items: [
            { text: 'Overview', link: '/api/' },
            { text: 'CLI', link: '/api/cli' },
            { text: 'Configuration', link: '/api/configuration' }
          ]
        },
        {
          text: 'Core Classes',
          items: [
            { text: 'Kist', link: '/api/kist' },
            { text: 'Pipeline', link: '/api/pipeline' },
            { text: 'ActionRegistry', link: '/api/action-registry' },
            { text: 'PluginManager', link: '/api/plugin-manager' }
          ]
        },
        {
          text: 'Interfaces',
          items: [
            { text: 'ActionPlugin', link: '/api/action-plugin' },
            { text: 'ActionInterface', link: '/api/action-interface' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/getkist/kist' },
      { icon: 'npm', link: 'https://npmjs.com/package/kist' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025-2026 Scape Agency'
    },

    search: {
      provider: 'local'
    },

    editLink: {
      pattern: 'https://github.com/getkist/www-getkist-com/edit/main/src/:path',
      text: 'Edit this page on GitHub'
    }
  },

  head: [
    ['link', { rel: 'icon', type: 'image/png', href: 'https://raw.githubusercontent.com/getkist/brand/master/src/logo/kist.png' }],
    ['meta', { name: 'theme-color', content: '#5e4d34' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'kist - Package Pipeline Processor' }],
    ['meta', { property: 'og:description', content: 'Lightweight Package Pipeline Processor with Plugin Architecture' }],
    ['meta', { property: 'og:image', content: 'https://raw.githubusercontent.com/getkist/brand/master/src/logo/kist.png' }]
  ]
})
