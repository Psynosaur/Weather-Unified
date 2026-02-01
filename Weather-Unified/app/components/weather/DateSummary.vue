<script setup lang="ts">
import type { Observation, GraphDataPoint, WindDataPoint } from '~/types/weather'

interface Props {
  latest: Observation | null
  observations: GraphDataPoint[]
  windData?: WindDataPoint[]
  magneticDeclination?: number
  lat?: number
}

const props = withDefaults(defineProps<Props>(), {
  magneticDeclination: 0,
  lat: 0,
  windData: () => []
})

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

  if (daylightObs.length === 0) {
    return {
      sunrise: null,
      sunset: null,
      duration: null,
      maxSolarElevation: null
    }
  }

  // Get sunrise (first solar > 0)
  const sunriseTime = new Date(daylightObs[0].ot)
  const sunlightLatestTime = new Date(daylightObs[daylightObs.length - 1].ot)
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
    sunset = sunlightLatestTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
  }

  // Calculate max solar elevation
  const halfdisk = 0.26667
  const declin = (props.magneticDeclination * Math.PI / 180)
  const obsDate = new Date(props.latest.obsTime)
  const numday = getDayOfYear(obsDate)
  const elevat = declin * Math.sin(Math.PI * 2 / 365 * (284 + numday)) / (Math.PI * 2) * 360 - (90 - Math.abs(props.lat))
  const secs = 1 / 3600
  const radh = elevat * Math.PI / 180
  const tanradh = Math.tan(radh)
  const atmosRefrac = secs * (58.1 / tanradh - 0.07 / Math.pow(tanradh, 3) + 0.000086 / Math.pow(tanradh, 5))
  const finalEle = -(Math.round(10 * (elevat + atmosRefrac + halfdisk)) / 10)

  return {
    sunrise: sunriseTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
    sunset,
    duration,
    maxSolarElevation: finalEle
  }
})

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0)
  const diff = date.getTime() - start.getTime()
  const oneDay = 1000 * 60 * 60 * 24
  return Math.floor(diff / oneDay)
}

const hasWind = computed(() => {
  return props.windData && props.windData.length > 0
})

const { createPolarChart, disposeChart } = useAmCharts()

// Initialize wind rose chart after component is mounted
onMounted(() => {
  if (hasWind.value) {
    initializeWindRose()
  }
})

// Reinitialize chart when windData changes
watch(() => props.windData, (newWindData) => {
  if (newWindData && newWindData.length > 0) {
    initializeWindRose()
  }
})

// Cleanup on unmount
onUnmounted(() => {
  disposeChart('windrose')
})

const initializeWindRose = () => {
  if (!props.windData || props.windData.length === 0) return

  createPolarChart({
    id: 'windrose',
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
          id="windrose"
          class="h-[300px]"
        />
      </div>
    </UCard>
  </div>
</template>
