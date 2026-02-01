<script setup lang="ts">
import type { DatePageData } from '~/types/weather'

// Meta information
useHead({
  title: 'Weather Date View',
  meta: [
    { name: 'description', content: 'View historical weather data by date' }
  ]
})

// Reactive date selection
const selectedDate = ref(new Date().toISOString().split('T')[0])

// Fetch weather data for the selected date
const { data, pending, error, refresh } = await useFetch<DatePageData>('/api/date', {
  query: computed(() => ({
    date: selectedDate.value
  })),
  watch: [selectedDate]
})

// App settings (will be moved to config/env later)
const appSettings = ref({
  stationName: 'Weather Station',
  lat: -33.8,
  lon: 18.6,
  magneticDeclination: -23.5
})

// Format date for display
const formattedDate = computed(() => {
  if (!data.value?.latest) return ''
  const date = new Date(data.value.latest.obsTime)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
})

// Handle date picker change (placeholder for now)
const handleDateChange = (newDate: string) => {
  selectedDate.value = newDate
}
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

        <!-- Date picker placeholder -->
        <div class="flex justify-center">
          <input
            id="date"
            v-model="selectedDate"
            type="date"
            class="px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
            :max="new Date().toISOString().split('T')[0]"
            min="2019-07-20"
          >
        </div>

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
      <!-- Three column layout: Stats | Charts | DateSummary -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Left sidebar - Stats -->
        <WeatherStats
          :observations="data.observations"
          :rain-data="data.rainData"
        />

        <!-- Middle section - Charts -->
        <WeatherChartsGrid :observations="data.observations" />

        <!-- Right sidebar - Date Summary (Rain & Sunlight) -->
        <WeatherDateSummary
          :latest="data.latest"
          :observations="data.observations"
          :wind-data="data.windData"
          :magnetic-declination="appSettings.magneticDeclination"
          :lat="appSettings.lat"
        />
      </div>

      <!-- Record count -->
      <div class="text-center text-sm text-muted py-4">
        {{ data.count }} total records
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
            No weather data available for the selected date.
          </p>
          <p class="text-sm text-muted">
            Please select a different date.
          </p>
        </div>
      </UCard>
    </div>
  </div>
</template>
