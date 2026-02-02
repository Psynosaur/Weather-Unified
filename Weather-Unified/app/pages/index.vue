<script setup lang="ts">
import type { DatePageData } from '~/types/weather'

// Meta information
useHead({
  title: 'Weather Today',
  meta: [
    { name: 'description', content: 'View today\'s weather data and charts' }
  ]
})

// Fetch today's weather data
const { data, pending, error, refresh } = await useFetch<DatePageData>('/api/day')

// App settings (will be moved to config/env later)
const appSettings = ref({
  stationName: process.env.WEATHER_STATION,
  lat: -33.8,
  lon: 18.6,
  magneticDeclination: -23.5
})

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
  <div class="container-full mx-auto">
    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold mb-4">
        {{ appSettings.stationName }}
      </h1>

      <div class="space-y-2">
        <p class="text-lg">
          {{ formattedDate }}
        </p>
        <p class="text-md text-muted">
          {{ formattedTime }}
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
      <!-- Top bar with indoor/solar/rain info -->
      <WeatherTopBar :latest="data.latest" />

      <!-- Three column layout: CurrentConditions | Charts | Stats -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Left sidebar - Current Conditions with Wind Rose -->
        <WeatherCurrentConditions
          :latest="data.latest"
          :observations="data.observations"
          :wind-data="data.windData"
          :count="data.count"
          :magnetic-declination="appSettings.magneticDeclination"
          :lat="appSettings.lat"
        />

        <!-- Middle section - Charts -->
        <WeatherChartsGrid
          :observations="data.observations"
          timeframe="day"
        />

        <!-- Right sidebar - Stats Summary with Rain Rose -->
        <WeatherStats
          :observations="data.observations"
          :rain-data="data.rainData"
        />
      </div>

      <!-- Record count -->
      <div class="text-center text-sm text-muted py-4">
        {{ data.count }} total records
      </div>

      <!-- Auto-refresh info -->
      <div class="text-center text-sm text-muted pb-4">
        Auto-refreshing every 2 minutes
      </div>
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
