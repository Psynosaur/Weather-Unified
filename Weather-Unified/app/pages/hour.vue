<script setup lang="ts">
import type { HourPageData } from '~/types/weather'

// Use weather layout
definePageMeta({
  layout: 'weather'
})

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

// App settings from composable
const appSettings = useAppSettings()

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
  <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-full overflow-x-hidden">
    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold mb-2">
        Hourly Weather
      </h1>
      <h2 class="text-2xl mb-4">
        {{ appSettings.stationName }}
      </h2>

      <div class="space-y-2">
        <p class="text-md text-muted">
          {{ formattedDateTime }}
        </p>

        <!-- Time picker -->
        <div class="flex justify-center">
          <FormTimePicker
            v-model="selectedTime"
            :max="new Date().toTimeString().slice(0, 5)"
            step="3600"
          />
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
      <NuxtLayout name="weather">
        <template #left-sidebar>
          <!-- Left sidebar - Current Conditions -->
          <WeatherCurrentConditions
            :latest="data.latest"
            :observations="data.observations"
            :wind-data="data.windData"
            :count="data.count"
          />
        </template>

        <template #top-bar>
          <!-- Top Bar - Summary Cards -->
          <WeatherTopBar
            v-if="data.latest"
            :latest="data.latest"
          />
        </template>

        <template #charts>
          <!-- Charts Grid -->
          <WeatherChartsGrid
            :observations="data.observations"
            timeframe="default"
          />
        </template>

        <template #right-sidebar>
          <!-- Right sidebar - Stats -->
          <WeatherStats
            :observations="data.observations"
            :rain-data="data.rainData"
            timeframe="hour"
          />
        </template>

        <template #footer>
          <!-- Record count -->
          <div class="text-center text-sm text-muted py-4">
            {{ data.count }} total records
            <!-- <span v-if="rainHour > 0"> | Rain this hour: {{ rainHour.toFixed(2) }} mm</span> -->
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
