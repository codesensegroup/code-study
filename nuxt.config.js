import theme from '@nuxt/content-theme-docs'
import pkg from './package.json';
import rt from 'reading-time';

const routerBase = process.env.DEPLOY_ENV === 'GH_PAGES'
  ? '/code-study/' : '/'
const path = require('path');

export default theme({
  head: {
    meta: [{ name: 'referrer', content: 'no-referrer-when-downgrade' }],
  },
  router: {
    base: routerBase
  },
  // https://github.com/nuxt/content/issues/376   
  content: {
    markdown: {
      rehypePlugins: [
        ['rehype-urls', function addBaseToImages(url) {
          if (url.href && url.href.startsWith('images/')) {
            return path.join(routerBase, url.href);
          }
        }]
      ]
    }
  },
  docs: {
    primaryColor: '#00CD81'
  },
  generate: {
    dir: 'dist'
  },
  i18n: {
    locales: () => [
      {
        code: 'zh',
        iso: 'zh-TW',
        file: 'zh-TW.js',
        name: '中文'
      }
    ],
    defaultLocale: 'zh',
    vueI18n: {
      fallbackLocale: 'zh'
    },
  },
  css: ['~~/assets/css/main.css'],
  colorMode: {
    preference: 'dark',
    fallback: 'light'
  },
  publicRuntimeConfig: {
    clientVersion: pkg.version,
  },
  pwa: {
    manifest: {
      name: 'CodeSense Document',
      short_name: 'CodeSense Document'
    }
  },
  hooks: {
    'content:file:beforeInsert': (document) => {
      if (document.extension === '.md') {
        const stats = rt(document.text);
        document.readingStats = stats;
      }
    },
    "vue-renderer:ssr:templateParams": function (params) {
      params.HEAD = params.HEAD.replace(`<base href="${routerBase}">`, "");
    }
  },
  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~~/plugins/material-icons.js' },
  ],
  build: {
    transpile: ['screenfull']
  }
})
