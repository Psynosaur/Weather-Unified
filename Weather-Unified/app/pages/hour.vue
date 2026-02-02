<script setup lang="ts">
import type { HourPageData } from '~/types/weather'

// Meta information
useHead({
  title: 'Hourly Weather',
  meta: [
    { name: 'description', content: 'View hourly weather data for today' }
  ]
})

// Reactive time selection - default to current hour
const now = new Date()
const selectedTime = ref(now.toTimeString().slice(0, 5)) // HH:mm format

// Fetch weather data for the selected hour
const { data, pending, error } = await useFetch<HourPageData>('/api/hour', {
  query: computed(() => ({
    time: selectedTime.value
  })),
  watch: [selectedTime]
})

// App settings (will be moved to config/env later)
const appSettings = ref({
  stationName: process.env.WEATHER_STATION,
  lat: -33.8,
  lon: 18.6,
  magneticDeclination: -23.5
})

// Format date for display
const formattedDateTime = computed(() => {
  if (!data.value?.latest) return ''
  const date = new Date(data.value.latest.obsTime)
  return date.toLocaleString('en-ZA', {
    weekday: 'long',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
  })
})

// // Calculate rain for the hour
// const rainHour = computed(() => {
//   if (!data.value?.observations || data.value.observations.length === 0) return 0
//   const obs = data.value.observations
//   return obs[obs.length - 1].rainDay - obs[0].rainDay
// })
</script>

<template>
  <div class="container-full mx-auto">
    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold mb-4">
        Hourly weather<br>
        {{ appSettings.stationName }}
      </h1>

      <div class="space-y-2">
        <p class="text-lg">
          {{ formattedDateTime }}
        </p>

        <!-- Time picker -->
        <div class="flex justify-center">
          <input
            id="time"
            v-model="selectedTime"
            type="time"
            class="px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
            :max="new Date().toTimeString().slice(0, 5)"
            step="3600"
          >
        </div>
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
      <!-- Top Bar - Summary Cards -->
      <WeatherTopBar
        v-if="data.latest"
        :latest="data.latest"
      />

      <!-- Three column layout: CurrentConditions | Charts | Stats -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Left sidebar - Current Conditions -->
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
          timeframe="default"
        />

        <!-- Right sidebar - Stats -->
        <WeatherStats
          :observations="data.observations"
          :rain-data="data.rainData"
        />
      </div>

      <!-- Record count -->
      <div class="text-center text-sm text-muted py-4">
        {{ data.count }} total records
        <!-- <span v-if="rainHour > 0"> | Rain this hour: {{ rainHour.toFixed(2) }} mm</span> -->
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
            No weather data available for the selected hour.
          </p>
          <p class="text-sm text-muted">
            Please select a different time.
          </p>
        </div>
      </UCard>
    </div>
  </div>
</template>
