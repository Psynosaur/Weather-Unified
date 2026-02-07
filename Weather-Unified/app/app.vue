<script setup>
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

const title = 'Weather Unified'
const description = 'Weather information for Durbanville, captured using a WH2303 weather station using Meteobridge'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: 'https://new.weatheru.co.za/img/FullSpectrumOhanssss.jpg',
  twitterImage: 'https://new.weatheru.co.za/img/FullSpectrumOhanssss.jpg',
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <UApp>
    <UHeader>
      <template #left>
        <NuxtLink to="/">
          <AppLogo class="w-auto h-6 shrink-0" />
        </NuxtLink>

        <!-- Desktop Navigation - Hidden on mobile -->
        <TemplateMenu class="hidden lg:flex" />
      </template>

      <template #right>
        <UColorModeButton />

        <UButton
          to="https://github.com/psynosaur/weather-unified"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
          color="neutral"
          variant="ghost"
        />
      </template>

      <!-- Mobile Navigation Menu -->
      <template #body>
        <TemplateMenu orientation="vertical" class="lg:hidden -mx-2.5" />
      </template>
    </UHeader>

    <UMain>
      <NuxtPage />
    </UMain>

    <USeparator icon="i-simple-icons-nuxtdotjs" />

    <UFooter>
      <template #left>
        <p class="text-sm text-muted">
          Built with Nuxt UI • © {{ new Date().getFullYear() }}
        </p>
      </template>

      <!-- <template #right>
        <UButton
          to="https://github.com/nuxt-ui-templates/starter"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
          color="neutral"
          variant="ghost"
        />
      </template> -->
    </UFooter>
  </UApp>
</template>
