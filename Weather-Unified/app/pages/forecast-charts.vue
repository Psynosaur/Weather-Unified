<script setup lang="ts">
import type { Forecasts } from '~/types/weather'

const { data: forecast, status, error } = await useFetch<Forecasts>('/api/forecast')

useHead({
  title: 'Forecast Charts',
  meta: [
    { name: 'description', content: '15-Day weather forecast visualizations' }
  ]
})
</script>

<template>
  <div class="container mx-auto px-4">
    <br>

    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold mb-2">
        15-Day Forecast Charts
      </h1>
      <p class="text-muted">
        Visual representation of weather forecast data
      </p>
    </div>

    <!-- Loading state -->
    <div v-if="status === 'pending'" class="text-center py-8">
      <p>Loading forecast data...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="text-center py-8 text-red-500">
      <p>Error loading forecast: {{ error.message }}</p>
    </div>

    <!-- Chart Component -->
    <ClientOnly>
      <WeatherForecastCharts v-if="forecast" :forecast="forecast" />
    </ClientOnly>
  </div>
</template>
