<script setup lang="ts">
import type { Observation, GraphDataPoint, WindDataPoint } from '~/types/weather'

interface Props {
  latest: Observation | null
  observations: GraphDataPoint[]
  windData?: WindDataPoint[]
}

const props = withDefaults(defineProps<Props>(), {
  windData: () => []
})

const appSettings = useAppSettings()
const { calculateMaxSolarElevation } = useSolarCalculations()

interface SunlightData {
  sunrise: string | null
  sunset: string | null
  duration: string | null
  maxSolarElevation: number | null
}

const sunlightInfo = computed<SunlightData>(() => {
  if (!props.latest || !props.observations || props.observations.length === 0) {
    return {
      sunrise: null,
      sunset: null,
      duration: null,
      maxSolarElevation: null
    }
  }

  // Find observations with solar radiation > 0
  const daylightObs = props.observations.filter(o => o.sr > 0)
  const totalObservations = daylightObs.length
  if (totalObservations === 0 || !daylightObs[0]) {
    return {
      sunrise: null,
      sunset: null,
      duration: null,
      maxSolarElevation: null
    }
  }
  const lastObservation = daylightObs[totalObservations - 1] as GraphDataPoint
  // Get sunrise (first solar > 0)
  const sunriseTime = new Date(daylightObs[0].ot)

  const sunlightLatestTime = new Date(lastObservation.ot)
  const latestTime = new Date(props.latest.obsTime)

  // Calculate duration
  const durationMs = sunlightLatestTime.getTime() - sunriseTime.getTime()
  const hours = Math.floor(durationMs / (1000 * 60 * 60))
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60))
  const duration = `${hours}:${minutes.toString().padStart(2, '0')}`

  // Check if sunset has occurred
  let sunset: string | null = null
  const isSet = props.latest.solarRad === 0 && sunlightLatestTime < latestTime
  if (isSet) {
    sunset = sunlightLatestTime.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit', hour12: false })
  }

  // Calculate max solar elevation using the composable
  const obsDate = new Date(props.latest.obsTime)
  const finalEle = calculateMaxSolarElevation(obsDate, appSettings.lat)

  return {
    sunrise: sunriseTime.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit', hour12: false }),
    sunset,
    duration,
    maxSolarElevation: finalEle
  }
})

const hasWind = computed(() => {
  return props.windData && props.windData.length > 0
})

const { createPolarChart, disposeChart, colorMode } = useAmCharts()

// Initialize wind rose chart after component is mounted
onMounted(() => {
  // Add a small delay to ensure DOM is fully ready after hydration
  nextTick(() => {
    if (hasWind.value) {
      initializeWindRose()
    }
  })
})

// Reinitialize chart when windData changes
watch(() => props.windData, (newWindData) => {
  if (newWindData && newWindData.length > 0) {
    initializeWindRose()
  }
})

// Reinitialize chart when color mode changes
watch(() => colorMode.value, () => {
  if (hasWind.value) {
    initializeWindRose()
  }
})

// Cleanup on unmount
onUnmounted(() => {
  disposeChart('windrose-summary')
})

const initializeWindRose = () => {
  if (!props.windData || props.windData.length === 0) return

  createPolarChart({
    id: 'windrose-summary',
    valueYFields: ['wg', 'was'],
    strokeFillColors: ['#ffdf43', '#8ebdf3'],
    tooltipText: ['{wg} km/h @ {wd}° {wdce}', '{was} km/h @ {wd}° {wdce}'],
    valueXFields: ['wd', 'wd'],
    min: 0,
    max: 360,
    data: props.windData,
    strokeWidth: 0.5,
    fps: 60,
    seriesNames: ['Gust', 'Average'],
    showLegend: false
  })
}
</script>

<template>
  <div class="lg:col-span-2">
    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold">
          Rain
        </h3>
      </template>

      <ul
        v-if="latest"
        class="space-y-2 text-sm"
      >
        <li class="flex justify-between">
          <span>Day</span>
          <span class="font-medium">{{ latest.rainDay.toFixed(1) }} mm</span>
        </li>
        <li class="flex justify-between">
          <span>Previous Day</span>
          <span class="font-medium">{{ latest.rainYest.toFixed(1) }} mm</span>
        </li>
        <li class="flex justify-between">
          <span>Month</span>
          <span class="font-medium">{{ latest.rainMonth.toFixed(1) }} mm</span>
        </li>
        <li class="flex justify-between">
          <span>Year</span>
          <span class="font-medium">{{ latest.rainYear.toFixed(1) }} mm</span>
        </li>
      </ul>

      <div
        v-if="sunlightInfo.sunrise"
        class="mt-6"
      >
        <h3 class="text-lg font-semibold mb-3">
          Sunlight
        </h3>
        <ul class="space-y-2 text-sm">
          <li class="flex justify-between">
            <span>Rise</span>
            <span class="font-medium">{{ sunlightInfo.sunrise }}</span>
          </li>
          <li
            v-if="sunlightInfo.sunset"
            class="flex justify-between"
          >
            <span>Set</span>
            <span class="font-medium">{{ sunlightInfo.sunset }}</span>
          </li>
          <li class="flex justify-between">
            <span>Total hours</span>
            <span class="font-medium">{{ sunlightInfo.duration }}</span>
          </li>
          <li class="flex justify-between">
            <span>Max Solar Elevation</span>
            <span class="font-medium">{{ sunlightInfo.maxSolarElevation }}°</span>
          </li>
        </ul>
      </div>

      <div
        v-if="hasWind"
        class="mt-6"
      >
        <h4 class="text-base font-semibold mb-2">
          Wind Rose
        </h4>
        <div
          id="windrose-summary"
          class="h-[350px]"
        />
      </div>
    </UCard>
  </div>
</template>
