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
const { data, pending, error } = await useFetch<DatePageData>('/api/date', {
  query: computed(() => ({
    date: selectedDate.value
  })),
  watch: [selectedDate]
})

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
</script>

<template>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-full overflow-x-hidden">
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
          <FormDatePicker
            v-model="selectedDate"
            type="date"
          />
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
        <WeatherChartsGrid
          :observations="data.observations"
          timeframe="day"
        />

        <!-- Right sidebar - Date Summary (Rain & Sunlight) -->
        <WeatherDateSummary
          :latest="data.latest"
          :observations="data.observations"
          :wind-data="data.windData"
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
