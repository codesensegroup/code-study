import theme from '@nuxt/content-theme-docs'
import pkg from './package.json';
import rt from 'reading-time';

const routerBase = process.env.DEPLOY_ENV === 'GH_PAGES'
  ? '/code-study/' : '/'

export default theme({
  head: {
    meta: [{ name: 'referrer', content: 'no-referrer-when-downgrade' }],
  },
  router: {
    base: routerBase
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
  },
})
