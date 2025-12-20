import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Kist",
  description: "Documentation for getkist projects",
  base: "/",
  srcDir: "src",

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: 'https://raw.githubusercontent.com/getkist/brand/master/src/logo/kist.png',

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Projects', link: '/projects/' },
      { text: 'API Reference', link: '/api/' }
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
          text: 'Concepts',
          items: [
            { text: 'Architecture', link: '/guide/architecture' },
            { text: 'Best Practices', link: '/guide/best-practices' }
          ]
        }
      ],
      '/projects/': [
        {
          text: 'Projects',
          items: [
            { text: 'Overview', link: '/projects/' },
            { text: "kist", link: "/projects/kist/" },
            { text: ".github-private", link: "/projects/.github-private/" },
            { text: "brand", link: "/projects/brand/" },
            { text: "kist.js.org", link: "/projects/kist.js.org/" },
            { text: "kist-cli", link: "/projects/kist-cli/" },
            { text: "kist-action-template", link: "/projects/kist-action-template/" },
            { text: "kist-action-svg", link: "/projects/kist-action-svg/" }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/getkist' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025 Scape Agency'
    },

    search: {
      provider: 'local'
    }
  },

  head: [
    ['link', { rel: 'icon', type: 'image/png', href: 'https://raw.githubusercontent.com/getkist/brand/master/src/logo/kist.png' }]
  ]
})
