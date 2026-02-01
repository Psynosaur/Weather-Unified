// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],
  
  routeRules: {
    '/': { prerender: true },
    '/hour': { prerender: true },
    '/week': { prerender: true },
    '/month': { prerender: true },
    '/forecast': { prerender: true },
    '/date': { prerender: true },
    '/about': { prerender: true }
  },

  compatibilityDate: '2025-01-15',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
