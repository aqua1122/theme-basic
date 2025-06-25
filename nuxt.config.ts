import { defineNuxtConfig } from 'nuxt'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineNuxtConfig({
  ssr: true,
  devtools: { enabled: true },
  runtimeConfig: {
    idatariverMerchantSecret: process.env.IDATARIVER_MERCHANT_SECRET || '',
    public: {
      idatariver: process.env.IDATARIVER_URL || 'https://www.idatariver.com',
      idatariverServer: process.env.IDATARIVER_SERVER_URL || 'https://open.idatariver.com',
      apiEncryptKey: 'Powered By iDataRiver.com',
    },
  },
  components: [
    {
      path: '~/components',
      extensions: ['.vue']
    },
  ],
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n',
    '@nuxtjs/robots',
    '@nuxtjs/sitemap',
    '@nuxt/image',
  ],
  css: [
    '~/assets/css/main.css',
    '~/assets/css/luxury-theme.css'
  ],
  nitro: {
    preset: 'vercel-edge',
    storage: {
      data: {
        driver: 'vercelKV',
      }
    },
    compatibilityDate: '2025-06-25',
    compressPublicAssets: true,
  },
  vite: {
    plugins: [vueJsx()],
  },
  i18n: {
    vueI18n: './i18n.config.js',
    locales: [
      { code: 'en', iso: 'en' },
      { code: 'es', iso: 'es' },
      { code: 'de', iso: 'de' },
      { code: 'fr', iso: 'fr' },
      { code: 'ja', iso: 'ja' },
      { code: 'zh-cn', iso: 'zh-cn' },
      { code: 'zh-hk', iso: 'zh-hk' },
      { code: 'ko', iso: 'ko' },
      { code: 'tr', iso: 'tr' },
      { code: 'ru', iso: 'ru' },
      { code: 'uk', iso: 'uk' },
      { code: 'uz', iso: 'uz' },
      { code: 'kk', iso: 'kk' },
      { code: 'pl', iso: 'pl' },
      { code: 'ar', iso: 'ar' },
      { code: 'pt', iso: 'pt' },
      { code: 'fa', iso: 'fa' },
      { code: 'pa', iso: 'pa' },
    ],
    defaultLocale: 'en',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      alwaysRedirect: true,
    },
  },
  robots: {
    configPath: './robots.config.js',
  },
  sitemap: {
    autoLastmod: true,
  },
})
