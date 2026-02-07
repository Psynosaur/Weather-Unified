<script setup lang="ts">
import type { DatePageData, Observation } from '~/types/weather'

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

// Real-time update state
const lastUpdateTime = ref<string>('')
const isLiveUpdateActive = ref(false)
let eventSource: EventSource | null = null

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

// Handle real-time observation update
const handleObservationUpdate = (newObservation: Observation) => {
  if (!data.value) return
  
  // Update the latest observation
  const oldObsTime = data.value.latest?.obsTime
  
  // Convert Observation to GraphDataPoint for the observations array
  const graphDataPoint = {
    ot: new Date(newObservation.obsTime).getTime(),
    to: newObservation.tempOutCur,
    dc: newObservation.dewCur,
    tmn: newObservation.tmin,
    tmx: newObservation.tmax,
    ho: newObservation.humOutCur,
    hi: newObservation.humInCur,
    p: newObservation.pressCur,
    ws: newObservation.windSpeedCur,
    was: newObservation.windAvgSpeedCur,
    wd: newObservation.windDirCur,
    wdce: newObservation.windDirCurEng,
    wg: newObservation.windGust10,
    wda: newObservation.windDirAvg10,
    wdae: newObservation.windDirAvg10Eng,
    rr: newObservation.rainRateCur,
    rd: newObservation.rainDay,
    sr: newObservation.solarRad,
    uv: newObservation.uv
  }
  
  // Force reactivity by creating a new observations array with the new data point
  // Add to the END of the array since charts display chronologically (oldest to newest)
  const updatedObservations = data.value.observations 
    ? [...data.value.observations, graphDataPoint]
    : [graphDataPoint]
  
  // Update the entire data object to ensure reactivity
  data.value = {
    ...data.value,
    latest: newObservation,
    observations: updatedObservations,
    count: (data.value.count || 0) + 1
  }
  
  lastUpdateTime.value = new Date().toLocaleTimeString('en-ZA', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
  
  console.log('✅ Real-time observation update:', {
    old: oldObsTime,
    new: newObservation.obsTime,
    updateTime: lastUpdateTime.value,
    observationsCount: updatedObservations.length,
    totalCount: data.value.count,
    formattedTime: new Date(newObservation.obsTime).toLocaleTimeString('en-ZA', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZoneName: 'short'
    })
  })
}

// Setup SSE connection for real-time updates
const setupSSE = () => {
  if (eventSource) {
    eventSource.close()
  }
  
  eventSource = new EventSource('/api/observations/stream')
  
  eventSource.onopen = () => {
    isLiveUpdateActive.value = true
    console.log('✅ Real-time observation stream connected')
  }
  
  eventSource.onmessage = (event) => {
    try {
      const message = JSON.parse(event.data)
      
      if (message.type === 'initial') {
        console.log('📡 Received initial observation', message.data?.obsTime)
      } else if (message.type === 'update') {
        console.log('🔄 New observation received:', message.data?.obsTime, '- Update time:', message.timestamp)
        handleObservationUpdate(message.data)
      } else if (message.type === 'heartbeat') {
        console.log('💓 Heartbeat:', message.timestamp)
      } else if (message.type === 'info') {
        console.log('ℹ️ Info:', message.message)
      } else if (message.type === 'error') {
        console.error('❌ SSE Error:', message.message)
      }
    } catch (error) {
      console.error('Error parsing SSE message:', error)
    }
  }
  
  eventSource.onerror = (error) => {
    console.error('SSE connection error:', error)
    isLiveUpdateActive.value = false
    eventSource?.close()
    
    // Reconnect after 10 seconds
    setTimeout(() => {
      console.log('Reconnecting SSE...')
      setupSSE()
    }, 10000)
  }
}

onMounted(() => {
  // Setup SSE connection for real-time updates
  if (data.value) {
    setupSSE()
  }
})

onUnmounted(() => {
  // Close SSE connection
  if (eventSource) {
    eventSource.close()
    eventSource = null
  }
  isLiveUpdateActive.value = false
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

        <!-- Live update indicator -->
        <div class="flex items-center justify-center gap-2">
          <div 
            class="w-2 h-2 rounded-full"
            :class="isLiveUpdateActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'"
          />
          <span class="text-xs text-muted">
            {{ isLiveUpdateActive ? 'Live Updates Active' : 'Connecting...' }}
          </span>
          <span v-if="lastUpdateTime" class="text-xs text-muted">
            (Last: {{ lastUpdateTime }})
          </span>
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
            timeframe="day"
          />
        </template>

        <template #footer>
          <!-- Record count -->
          <div class="text-center text-sm text-muted py-4">
            {{ data.count }} total records
          </div>

          <!-- Real-time update info -->
          <div class="text-center text-sm text-muted pb-4">
            <span v-if="isLiveUpdateActive" class="text-green-600">
              ● Real-time updates enabled
            </span>
            <span v-else class="text-gray-400">
              ○ Connecting to real-time stream...
            </span>
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
