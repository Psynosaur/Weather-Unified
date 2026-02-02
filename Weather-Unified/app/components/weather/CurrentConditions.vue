<script setup lang="ts">
import type { Observation, GraphDataPoint, WindDataPoint } from '~/types/weather'

const props = defineProps<{
  latest: Observation
  observations: GraphDataPoint[]
  windData: WindDataPoint[]
  count: number
  magneticDeclination: number
  lat: number
}>()

// Calculate wind speeds in km/h
const windSpeeds = computed(() => ({
  currWind: props.latest.windSpeedCur * 3.6,
  currGust: props.latest.windGust10 * 3.6,
  currWAvg: props.latest.windAvgSpeedCur * 3.6
}))

// Check if there's any wind
const hasWind = computed(() => {
  return windSpeeds.value.currWind > 0
    || windSpeeds.value.currWAvg > 0
    || windSpeeds.value.currGust > 0
})

// Calculate sunlight information
const sunlightInfo = computed(() => {
  // Find observations with solar radiation
  const daylightObs = props.observations.filter(o => o.sr > 0)
  const totalObservations = daylightObs.length
  if (totalObservations === 0 || !daylightObs[0]) {
    return null
  }
  const lastObservation = daylightObs[totalObservations - 1] as GraphDataPoint
  const sunrise = new Date(daylightObs[0].ot)
  const sunlightLatest = new Date(lastObservation.ot)
  const latestObsTime = new Date(props.latest.obsTime)

  const duration = sunlightLatest.getTime() - sunrise.getTime()
  const hours = Math.floor(duration / (1000 * 60 * 60))
  const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60))

  // Check if sunset has occurred
  const isSet = props.latest.solarRad === 0 && sunlightLatest < latestObsTime

  // Calculate max solar elevation
  const halfdisk = 0.26667
  const magDeclinationRad = (props.magneticDeclination * Math.PI) / 180
  const numday = latestObsTime.getUTCDate()
  const elevat = magDeclinationRad * Math.sin((Math.PI * 2 / 365) * (284 + numday)) / (Math.PI * 2) * 360 - (90 - Math.abs(props.lat))
  const secs = 1 / 3600
  const radh = (elevat * Math.PI) / 180
  const tanradh = Math.tan(radh)
  const atmosRefrac = secs * (58.1 / tanradh - 0.07 / Math.pow(tanradh, 3) + 0.000086 / Math.pow(tanradh, 5))
  const finalEle = -(Math.round(10 * (elevat + atmosRefrac + halfdisk)) / 10)

  return {
    sunrise,
    sunset: isSet ? sunlightLatest : null,
    durationHours: hours,
    durationMinutes: minutes,
    maxSolarElevation: finalEle,
    shouldShow: props.count < 5050 && props.count > 210
  }
})

// Format time to HH:mm
const formatTime = (date: Date) => {
  return date.toLocaleTimeString('en-ZA', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}

// Check if there's wind data for wind rose
const hasWindData = computed(() => {
  return props.windData && props.windData.length > 0
})

const { createPolarChart, disposeChart } = useAmCharts()

// Initialize wind rose chart after component is mounted
onMounted(() => {
  if (hasWindData.value) {
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
      <div class="space-y-4">
        <!-- Outdoor Section -->
        <div>
          <h3 class="text-lg font-semibold mb-3">
            Outdoor
          </h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span>Temp</span>
              <span class="font-medium">{{ latest.tempOutCur }}°C</span>
            </div>
            <div class="flex justify-between">
              <span>R.H.</span>
              <span class="font-medium">{{ latest.humOutCur }}%</span>
            </div>
            <div class="flex justify-between">
              <span>Dew Point</span>
              <span class="font-medium">{{ latest.dewCur }}°C</span>
            </div>
          </div>
        </div>

        <!-- Wind Section -->
        <div>
          <h3 class="text-lg font-semibold mb-3">
            Wind
          </h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span>Direction</span>
              <span class="font-medium">{{ latest.windDirCur }}° / {{ latest.windDirCurEng }}</span>
            </div>
            <div class="flex justify-between">
              <span>Direction Avg</span>
              <span class="font-medium">{{ latest.windDirAvg10 }}° / {{ latest.windDirAvg10Eng }}</span>
            </div>
            <div class="flex justify-between">
              <span>Chill</span>
              <span class="font-medium">{{ latest.windChillCur }}°C</span>
            </div>
          </div>
        </div>

        <!-- Wind Speed Section (only if there's wind) -->
        <div v-if="hasWind">
          <h3 class="text-lg font-semibold mb-3">
            Speed
          </h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span>Current</span>
              <span class="font-medium">{{ windSpeeds.currWind.toFixed(2) }} km/h</span>
            </div>
            <div class="flex justify-between">
              <span>Average</span>
              <span class="font-medium">{{ windSpeeds.currWAvg.toFixed(2) }} km/h</span>
            </div>
            <div class="flex justify-between">
              <span>Gust</span>
              <span class="font-medium">{{ windSpeeds.currGust.toFixed(2) }} km/h</span>
            </div>
          </div>
        </div>

        <!-- Sunlight Section -->
        <div v-if="sunlightInfo && sunlightInfo.shouldShow">
          <h3 class="text-lg font-semibold mb-3">
            Sunlight
          </h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span>Rise</span>
              <span class="font-medium">{{ formatTime(sunlightInfo.sunrise) }}</span>
            </div>
            <div
              v-if="sunlightInfo.sunset"
              class="flex justify-between"
            >
              <span>Set</span>
              <span class="font-medium">{{ formatTime(sunlightInfo.sunset) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Total hours</span>
              <span class="font-medium">{{ sunlightInfo.durationHours }}:{{ String(sunlightInfo.durationMinutes).padStart(2, '0') }}</span>
            </div>
            <div class="flex justify-between">
              <span>Max Solar Elevation</span>
              <span class="font-medium">{{ sunlightInfo.maxSolarElevation }}°</span>
            </div>
          </div>
        </div>

        <!-- Wind Rose Section -->
        <div v-if="hasWindData">
          <h3
            class="text-lg font-semibold mb-3"
            title="Summary of wind intensity and its direction"
          >
            Wind Rose
          </h3>
          <div
            id="windrose"
            class="h-[300px]"
          >
            <!-- Wind rose chart will be rendered here via amCharts JavaScript -->
          </div>
        </div>
        <div
          v-else
          id="windrose"
          hidden
        />
      </div>
    </UCard>
  </div>
</template>
