<script setup lang="ts">
import type { DatePageData } from '~/types/weather'

// Use weather layout
definePageMeta({
  layout: 'weather'
})

// Meta information
useHead({
  title: 'Weather Today',
  meta: [
    { name: 'description', content: 'View today\'s weather data and charts' }
  ]
})

// Fetch today's weather data
const { data, pending, error, refresh } = await useFetch<DatePageData>('/api/day')

// App settings from composable
const appSettings = useAppSettings()

// Format date for display
const formattedDate = computed(() => {
  if (!data.value?.latest) return ''
  const date = new Date(data.value.latest.obsTime)
  return date.toLocaleDateString('en-ZA', {
    weekday: 'long',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
})

// Format time for display
const formattedTime = computed(() => {
  if (!data.value?.latest) return ''
  const date = new Date(data.value.latest.obsTime)
  return date.toLocaleTimeString('en-ZA', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZoneName: 'short'
  })
})

// Auto-refresh every 2 minutes
const refreshInterval = 120000 // 2 minutes
let refreshTimer: NodeJS.Timeout | null = null

onMounted(() => {
  refreshTimer = setInterval(() => {
    refresh()
  }, refreshInterval)
})

onUnmounted(() => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
  }
})
</script>

<template>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-full overflow-x-hidden">
    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold mb-2">
        Today's Weather
      </h1>
      <h2 class="text-2xl mb-4">
        {{ appSettings.stationName }}
      </h2>

      <div class="space-y-2">
        <p class="text-md text-muted">
          {{ formattedDate }} {{ formattedTime }}
        </p>

        <!-- Cloudiness indicator -->
        <p
          v-if="data?.cloudiness"
          class="text-xl font-semibold text-primary"
        >
          {{ data.cloudiness }}
        </p>
      </div>
    </div>

    <!-- Loading state -->
    <div
      v-if="pending"
      class="text-center py-12"
    >
      <p class="text-lg text-muted">
        Loading weather data...
      </p>
    </div>

    <!-- Error state -->
    <div
      v-else-if="error"
      class="text-center py-12"
    >
      <UCard>
        <p class="text-lg text-red-500">
          Error loading weather data. Please try again.
        </p>
      </UCard>
    </div>

    <!-- Main content -->
    <div
      v-else-if="data && data.latest"
      class="space-y-6"
    >
      <NuxtLayout name="weather">
        <template #left-sidebar>
          <!-- Left sidebar - Current Conditions with Wind Rose -->
          <WeatherCurrentConditions
            :latest="data.latest"
            :observations="data.observations"
            :wind-data="data.windData"
            :count="data.count"
          />
        </template>

        <template #top-bar>
          <!-- Top bar with indoor/solar/rain info -->
          <WeatherTopBar :latest="data.latest" />
        </template>

        <template #charts>
          <!-- Charts Grid -->
          <WeatherChartsGrid
            :observations="data.observations"
            timeframe="day"
          />
        </template>

        <template #right-sidebar>
          <!-- Right sidebar - Stats Summary with Rain Rose -->
          <WeatherStats
            :observations="data.observations"
            :rain-data="data.rainData"
          />
        </template>

        <template #footer>
          <!-- Record count -->
          <div class="text-center text-sm text-muted py-4">
            {{ data.count }} total records
          </div>

          <!-- Auto-refresh info -->
          <div class="text-center text-sm text-muted pb-4">
            Auto-refreshing every 2 minutes
          </div>
        </template>
      </NuxtLayout>
    </div>

    <!-- No data state -->
    <div
      v-else
      class="text-center py-12"
    >
      <UCard>
        <div class="space-y-4">
          <p class="text-lg">
            No weather data available for today.
          </p>
          <p class="text-sm text-muted">
            Please try again later.
          </p>
        </div>
      </UCard>
    </div>
  </div>
</template>
