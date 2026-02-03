// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxt/eslint", "@nuxt/ui"],

  devtools: {
    enabled: true,
  },

  css: ["~/assets/css/main.css"],

  runtimeConfig: {
    public: {
      WUREQUEST_API_URL: process.env.WUREQUEST_API_URL,
      WEATHER_STATION: process.env.WEATHER_STATION,
    },
  },

  routeRules: {
    "/": { ssr: true },
    "/hour": { ssr: true },
    "/week": { ssr: true },
    "/month": { ssr: true },
    "/forecast": { ssr: true },
    "/date": { ssr: true },
    "/about": { prerender: true },
  },

  compatibilityDate: "2025-01-15",

  eslint: {
    config: {
      stylistic: {
        commaDangle: "never",
        braceStyle: "1tbs",
      },
    },
  },

  nitro: {
    moduleSideEffects: ["tslib"],
  },

  vite: {
    optimizeDeps: {
      include: ["tslib"],
    },
  },
});
