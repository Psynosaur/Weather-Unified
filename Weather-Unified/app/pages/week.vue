<script setup lang="ts">
import type { WeekPageData } from '~/types/weather'

// Use weather layout
definePageMeta({
  layout: 'weather'
})

// Meta information
useHead({
  title: 'Weekly Weather',
  meta: [
    { name: 'description', content: 'View weekly weather data and trends' }
  ]
})

// Reactive date selection
const selectedDate = ref(new Date().toISOString().split('T')[0])

// Fetch weather data for the selected week
const { data, pending, error } = await useFetch<WeekPageData>('/api/week', {
  query: computed(() => ({
    date: selectedDate.value
  })),
  watch: [selectedDate]
})

// App settings from composable
const appSettings = useAppSettings()

// Format date range for display
const formattedDateRange = computed(() => {
  if (!data.value?.weekStart || !data.value?.weekEnd) return ''

  const start = new Date(data.value.weekStart)
  const end = new Date(data.value.weekEnd)

  const startFormatted = start.toLocaleDateString('en-ZA', {
    day: '2-digit',
    month: 'short'
  })

  const endFormatted = end.toLocaleDateString('en-ZA', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })

  return `${startFormatted} - ${endFormatted}`
})

// Format latest observation time
// const formattedLatestTime = computed(() => {
//   if (!data.value?.latest) return ''
//   const date = new Date(data.value.latest.obsTime)
//   return date.toLocaleString('en-ZA', {
//     weekday: 'long',
//     day: '2-digit',
//     month: 'short',
//     year: 'numeric',
//     hour: '2-digit',
//     minute: '2-digit',
//     second: '2-digit',
//     timeZoneName: 'short'
//   })
// })

// Navigation functions
const navigateToPreviousWeek = () => {
  if (!selectedDate.value) return

  const current = new Date(selectedDate.value)
  current.setDate(current.getDate() - 7)
  selectedDate.value = current.toISOString().split('T')[0]
}

const navigateToNextWeek = () => {
  if (!selectedDate.value) return

  const current = new Date(selectedDate.value)
  current.setDate(current.getDate() + 7)
  selectedDate.value = current.toISOString().split('T')[0]
}
</script>

<template>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-full overflow-x-hidden">
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
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold mb-2">
          Weekly Weather
        </h1>
        <h2 class="text-2xl mb-4">
          {{ appSettings.stationName }}
        </h2>

        <!-- Navigation row -->
        <div class="grid grid-cols-3 gap-4 items-center max-w-4xl mx-auto mb-4">
          <!-- Previous Week Button -->
          <div class="text-left">
            <UButton
              color="neutral"
              variant="solid"
              icon="i-lucide-arrow-left"
              @click="navigateToPreviousWeek"
            >
              Previous Week
            </UButton>
          </div>

          <!-- Date Display and Picker -->
          <div class="text-center space-y-2">
            <p class="text-sm text-muted">
              Week: {{ formattedDateRange }}
            </p>

            <!-- Date picker -->
            <div class="flex justify-center">
              <FormDatePicker
                v-model="selectedDate"
                type="date"
              />
            </div>

            <!-- <p class="text-sm text-muted">
              Latest: {{ formattedLatestTime }}
            </p> -->
          </div>

          <!-- Next Week Button (only show if not current week) -->
          <div class="text-right">
            <UButton
              v-if="!data.isCurrentWeek"
              color="neutral"
              variant="solid"
              trailing-icon="i-lucide-arrow-right"
              @click="navigateToNextWeek"
            >
              Next Week
            </UButton>
          </div>
        </div>
      </div>

      <!-- Three column layout: CurrentConditions | TopBar + Charts | Stats -->
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
            timeframe="week"
          />
        </template>

        <template #right-sidebar>
          <!-- Right sidebar - Stats -->
          <WeatherStats
            :observations="data.observations"
            :rain-data="data.rainData"
            timeframe="week"
          />
        </template>

        <template #footer>
          <!-- Record count -->
          <div class="text-center text-sm text-muted py-4">
            {{ data.count }} total records
          </div>
        </template>
      </NuxtLayout>
    </div>

    <!-- No data state -->
    <div
      v-else
      class="space-y-6"
    >
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold mb-2">
          Weekly Weather
        </h1>
        <h2 class="text-2xl mb-4">
          {{ appSettings.stationName }}
        </h2>

        <!-- Date picker -->
        <div class="flex justify-center mb-4">
          <FormDatePicker
            v-model="selectedDate"
            type="date"
          />
        </div>
      </div>

      <div class="text-center py-12">
        <UCard>
          <div class="space-y-4">
            <p class="text-lg">
              No weather data available for the selected week.
            </p>
            <p class="text-sm text-muted">
              Please select a different date.
            </p>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>
