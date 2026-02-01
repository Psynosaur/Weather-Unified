<script setup lang="ts">
import type { GraphDataPoint } from '~/types/weather'

interface Props {
  observations: GraphDataPoint[]
}

const props = defineProps<Props>()

const { createXYChart, createPolarChart, disposeAllCharts } = useAmCharts()

// Chart configuration
const charts = [
  { id: 'chartemp', title: 'Temperature' },
  { id: 'chartminmax', title: 'Min/Max Temperature' },
  { id: 'charthum', title: 'Humidity' },
  { id: 'chartpressure', title: 'Pressure' },
  { id: 'chartwind', title: 'Wind Speed' },
  { id: 'chartrain', title: 'Rain' },
  { id: 'chartsolar', title: 'Solar Radiation' },
  { id: 'chartuv', title: 'UV Index' }
]

const fullWidthCharts = [
  { id: 'chartwd', title: 'Wind Direction' }
]

const roseCharts = [
  { id: 'chartTR', title: 'Temperature Rose' },
  { id: 'chartPR', title: 'Pressure Rose' },
  { id: 'chartHR', title: 'Humidity Rose' }
]

// Initialize charts after component is mounted
onMounted(() => {
  if (props.observations && props.observations.length > 0) {
    initializeCharts()
  }
})

// Reinitialize charts when observations change
watch(() => props.observations, (newObs) => {
  if (newObs && newObs.length > 0) {
    initializeCharts()
  }
})

// Cleanup on unmount
onUnmounted(() => {
  disposeAllCharts()
})

const initializeCharts = () => {
  // Temperature & Dew Point
  createXYChart({
    id: 'chartemp',
    valueFields: ['to', 'dc'],
    tooltipText: ['Outdoor {to} °C', 'Dew Point {dc} °C'],
    strokeFillColors: ['#ff8145', '#87f7ff'],
    labelText: 'Temp & Dew point',
    fps: 60
  }, props.observations)

  // Min/Max Temperature
  createXYChart({
    id: 'chartminmax',
    valueFields: ['tmn', 'tmx'],
    tooltipText: ['{tmn} °C min', '{tmx} °C max'],
    strokeFillColors: ['#0ec7ff', '#ff2955'],
    labelText: 'Temp Min/Max',
    fps: 60
  }, props.observations)

  // Humidity
  createXYChart({
    id: 'charthum',
    valueFields: ['ho', 'hi'],
    tooltipText: ['Outdoors {ho} %', 'Indoors {hi} %'],
    strokeFillColors: ['#5c8fff', '#0ec7ff'],
    labelText: 'Humidity',
    fps: 60
  }, props.observations)

  // Pressure
  createXYChart({
    id: 'chartpressure',
    valueFields: ['p'],
    tooltipText: ['{p} hPa'],
    strokeFillColors: ['#ff8d8d'],
    labelText: 'Pressure',
    fps: 60
  }, props.observations)

  // Wind Speed
  createXYChart({
    id: 'chartwind',
    valueFields: ['ws', 'wg', 'was'],
    tooltipText: ['Current {ws} km/h', 'Gust {wg} km/h', 'Avg {was} km/h'],
    strokeFillColors: ['#11ff1e', '#ffbf8d', '#ff8d8d'],
    labelText: 'Wind Speed',
    fps: 60,
    min: 0
  }, props.observations)

  // Rain
  createXYChart({
    id: 'chartrain',
    valueFields: ['rd', 'rr'],
    tooltipText: ['{rd} mm', '{rr} mm/h from {wda}° {wdae}'],
    strokeFillColors: ['#5c8fff', '#87f7ff'],
    labelText: 'Rain',
    fps: 60,
    min: 0
  }, props.observations)

  // Solar Radiation
  createXYChart({
    id: 'chartsolar',
    valueFields: ['sr'],
    tooltipText: ['{sr} W/m²'],
    strokeFillColors: ['#ffdf43'],
    labelText: 'Radiation',
    fps: 60,
    min: 0
  }, props.observations)

  // UV Index
  createXYChart({
    id: 'chartuv',
    valueFields: ['uv'],
    tooltipText: ['{UV}'],
    strokeFillColors: ['#ffdf43'],
    labelText: 'UV index',
    fps: 60,
    min: 0
  }, props.observations)

  // Wind Direction
  createXYChart({
    id: 'chartwd',
    valueFields: ['wd', 'wda'],
    tooltipText: ['{wd}° / {wdce} current', '{wda}° / {wdae} average'],
    strokeFillColors: ['#7fdfff', '#dafaff'],
    labelText: 'Wind Direction',
    min: 0,
    max: 360,
    bullets: true,
    fps: 60
  }, props.observations)

  // Temperature Rose (polar chart)
  createPolarChart({
    id: 'chartTR',
    valueYFields: ['tmn', 'tmx'],
    strokeFillColors: ['#0ec5fd', '#ff4343'],
    tooltipText: ['{tmn} °C from {wda}° {wdae}', '{tmx} °C from {wda}° {wdae}'],
    valueXFields: ['wda', 'wda'],
    min: 0,
    max: 360,
    data: props.observations,
    strokeWidth: 0.5,
    fps: 60,
    seriesNames: ['Min Temp', 'Max Temp'],
    showLegend: false,
    labelText: 'Temperature Min/Max'
  })

  // Pressure Rose (polar chart)
  createPolarChart({
    id: 'chartPR',
    valueYFields: ['p'],
    strokeFillColors: ['#42fdf7'],
    tooltipText: ['{p} hPa from {wda}° {wdae}'],
    valueXFields: ['wda'],
    min: 0,
    max: 360,
    data: props.observations,
    strokeWidth: 0.5,
    fps: 60,
    showLegend: false,
    labelText: 'Pressure'
  })

  // Humidity Rose (polar chart)
  createPolarChart({
    id: 'chartHR',
    valueYFields: ['ho'],
    strokeFillColors: ['#42fdf7'],
    tooltipText: ['{ho} % from {wda}° {wdae}'],
    valueXFields: ['wda'],
    min: 0,
    max: 360,
    data: props.observations,
    strokeWidth: 0.5,
    fps: 60,
    showLegend: false,
    labelText: 'Humidity'
  })
}
</script>

<template>
  <div class="lg:col-span-8">
    <div class="space-y-4">
      <!-- Two column charts -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UCard
          v-for="chart in charts"
          :key="chart.id"
        >
          <template #header>
            <h3 class="text-base font-semibold">
              {{ chart.title }}
            </h3>
          </template>
          <div
            :id="chart.id"
            class="h-[300px]"
          />
        </UCard>
      </div>

      <!-- Full width charts -->
      <UCard
        v-for="chart in fullWidthCharts"
        :key="chart.id"
      >
        <template #header>
          <h3 class="text-base font-semibold">
            {{ chart.title }}
          </h3>
        </template>
        <div
          :id="chart.id"
          class="h-[300px]"
        />
      </UCard>

      <!-- Rose charts (3 columns on desktop, stacked on mobile) -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <UCard
          v-for="chart in roseCharts"
          :key="chart.id"
        >
          <template #header>
            <h3 class="text-base font-semibold">
              {{ chart.title }}
            </h3>
          </template>
          <div
            :id="chart.id"
            class="h-[400px]"
          />
        </UCard>
      </div>
    </div>
  </div>
</template>
