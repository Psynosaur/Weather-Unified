<script setup lang="ts">
import type { MonthPageData } from '~/types/weather'

// Use weather layout
definePageMeta({
  layout: 'weather'
})

// Meta information
useHead({
  title: 'Monthly Weather',
  meta: [
    { name: 'description', content: 'View monthly weather data and trends' }
  ]
})

// Reactive date selection
const selectedDate = ref(new Date().toISOString().split('T')[0])

// Fetch weather data for the selected month
const { data, pending, error } = await useFetch<MonthPageData>('/api/month', {
  query: computed(() => ({
    date: selectedDate.value
  })),
  watch: [selectedDate]
})

// App settings from composable
const appSettings = useAppSettings()

// Format date range for display
const formattedDateRange = computed(() => {
  if (!data.value?.monthStart || !data.value?.monthEnd) return ''

  const start = new Date(data.value.monthStart)
  const end = new Date(data.value.monthEnd)

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
const navigateToPreviousMonth = () => {
  if (!selectedDate.value) return

  const current = new Date(selectedDate.value)
  current.setMonth(current.getMonth() - 1)
  selectedDate.value = current.toISOString().split('T')[0]
}

const navigateToNextMonth = () => {
  if (!selectedDate.value) return

  const current = new Date(selectedDate.value)
  current.setMonth(current.getMonth() + 1)
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
          Monthly Weather
        </h1>
        <h2 class="text-2xl mb-4">
          {{ appSettings.stationName }}
        </h2>

        <!-- Navigation row -->
        <div class="grid grid-cols-3 gap-4 items-center max-w-4xl mx-auto mb-4">
          <!-- Previous Month Button -->
          <div class="text-left">
            <UButton
              color="neutral"
              variant="solid"
              icon="i-lucide-arrow-left"
              @click="navigateToPreviousMonth"
            >
              Previous Month
            </UButton>
          </div>

          <!-- Date Display and Picker -->
          <div class="text-center space-y-2">
            <p class="text-sm text-muted">
              Month: {{ formattedDateRange }}
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

          <!-- Next Month Button (only show if not current month) -->
          <div class="text-right">
            <UButton
              v-if="!data.isCurrentMonth"
              color="neutral"
              variant="solid"
              trailing-icon="i-lucide-arrow-right"
              @click="navigateToNextMonth"
            >
              Next Month
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
            timeframe="month"
          />
        </template>

        <template #right-sidebar>
          <!-- Right sidebar - Stats -->
          <WeatherStats
            :observations="data.observations"
            :rain-data="data.rainData"
            timeframe="month"
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
          Monthly Weather
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
              No weather data available for the selected month.
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
