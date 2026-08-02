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
      { text: 'Compare', link: '/guide/comparison' },
      {
        text: 'v0.1.76',
        items: [
          { text: 'Releases', link: 'https://github.com/getkist/kist/releases' },
          { text: 'npm', link: 'https://npmjs.com/package/kist' }
        ]
      }
    ],

    sidebar: {
      // Organised along the four Diátaxis forms: tutorials teach, how-to
      // guides solve a problem you already have, reference describes, and
      // explanation gives background. Keeping them apart is what stops a
      // reference page from drifting into a tutorial.
      '/guide/': [
        {
          text: 'Tutorials',
          items: [
            { text: 'Getting Started', link: '/guide/getting-started' },
            { text: 'Installation', link: '/guide/installation' }
          ]
        },
        {
          text: 'How-to guides',
          items: [
            { text: 'Set up your editor', link: '/guide/editor-setup' },
            { text: 'Cache your build', link: '/guide/caching' },
            { text: 'Use plugins', link: '/plugins/using-plugins' },
            { text: 'Write a plugin', link: '/guide/plugin-development' },
            { text: 'Contribute', link: '/guide/contributing' }
          ]
        },
        {
          text: 'Reference',
          items: [
            { text: 'Configuration', link: '/guide/configuration' },
            { text: 'Core Actions', link: '/guide/core-actions' },
            { text: 'CLI', link: '/api/cli' }
          ]
        },
        {
          text: 'Explanation',
          items: [
            { text: 'Pipeline Architecture', link: '/guide/architecture' },
            { text: 'How kist compares', link: '/guide/comparison' },
            { text: 'Best Practices', link: '/guide/best-practices' }
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
            { text: 'action-tsup', link: '/plugins/action-tsup' },
            { text: 'action-tsdown', link: '/plugins/action-tsdown' }
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
            { text: 'action-fantasticon', link: '/plugins/action-fantasticon' },
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
            { text: 'Configuration Reference', link: '/guide/configuration' },
            { text: 'JSON Schema', link: 'https://www.getkist.com/schema.json' }
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
      copyright: 'Copyright © 2025-2026 Scape Press'
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
