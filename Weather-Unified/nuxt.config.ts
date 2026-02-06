// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxt/eslint", "@nuxt/ui", "@nuxt/scripts"],

  scripts: {
    registry: {
      googleAnalytics: {
        id: 'YOUR TAG ID',
      }
    }
  },

  devtools: {
    enabled: true,
  },

  css: ["~/assets/css/main.css"],

  runtimeConfig: {
    public: {
      WUREQUEST_API_URL: process.env.WUREQUEST_API_URL,
      WEATHER_STATION: process.env.WEATHER_STATION,
      datePickerMinDate: process.env.DATE_PICKER_MIN_DATE || '2019-07-20',
      datePickerGapStart: process.env.DATE_PICKER_GAP_START || '2019-08-29',
      datePickerGapEnd: process.env.DATE_PICKER_GAP_END || '2019-10-07',
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
