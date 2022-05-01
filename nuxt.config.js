import theme from '@nuxt/content-theme-docs'
import pkg from './package.json';

const routerBase = process.env.DEPLOY_ENV === 'GH_PAGES'
  ? '/Code-Study/' : '/'

export default theme({
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
  }
})
