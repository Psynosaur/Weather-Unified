<script setup lang="ts">
import type { GraphDataPoint, RainDataPoint } from '~/types/weather'

interface Props {
  observations: GraphDataPoint[]
  rainData?: RainDataPoint[]
}

const props = withDefaults(defineProps<Props>(), {
  rainData: () => []
})

interface StatItem {
  label: string
  value: string
}

const stats = computed<StatItem[]>(() => {
  if (!props.observations || props.observations.length === 0) {
    return []
  }

  const temps = props.observations.map(o => o.to)
  const humidity = props.observations.map(o => o.ho)
  const dew = props.observations.map(o => o.dc)
  const windGusts = props.observations.map(o => o.wg)
  const windSpeeds = props.observations.map(o => o.ws)
  const windDirs = props.observations.map(o => o.wd)
  const rain = props.observations.map(o => o.rd)
  const rainRates = props.observations.map(o => o.rr)
  const solar = props.observations.filter(o => o.sr > 0).map(o => o.sr)
  const solarAll = props.observations.map(o => o.sr)
  const uv = props.observations.map(o => o.uv)
  const pressure = props.observations.map(o => o.p)

  const items: StatItem[] = []

  // Helper to add stat only if value > 0
  const addStat = (label: string, value: number, unit: string, decimals: number = 1) => {
    if (value > 0) {
      items.push({
        label,
        value: `${value.toFixed(decimals)} ${unit}`
      })
    }
  }

  addStat('Temp Min', Math.min(...temps), '°C')
  addStat('Temp Avg', temps.reduce((a, b) => a + b, 0) / temps.length, '°C')
  addStat('Temp Max', Math.max(...temps), '°C')
  addStat('R.H. Min', Math.min(...humidity), '%')
  addStat('R.H. Avg', humidity.reduce((a, b) => a + b, 0) / humidity.length, '%')
  addStat('R.H. Max', Math.max(...humidity), '%')
  addStat('Dew Min', Math.min(...dew), '°C')
  addStat('Dew Avg', dew.reduce((a, b) => a + b, 0) / dew.length, '°C')
  addStat('Dew Max', Math.max(...dew), '°C')
  addStat('Wind Max', Math.max(...windGusts), 'km/h')
  addStat('Wind Avg', windSpeeds.reduce((a, b) => a + b, 0) / windSpeeds.length, 'km/h')
  addStat('WindDir Avg', windDirs.reduce((a, b) => a + b, 0) / windDirs.length, '°')
  addStat('Rain Avg', rain.reduce((a, b) => a + b, 0) / rain.length, 'mm')
  addStat('RainRate Max', Math.max(...rainRates), 'mm/h')

  if (solar.length > 0) {
    addStat('Solar Avg', solar.reduce((a, b) => a + b, 0) / solar.length, 'W/m²')
  } else {
    addStat('Solar Avg', 0, 'W/m²')
  }

  addStat('Solar Max', Math.max(...solarAll), 'W/m²')
  addStat('Max UV', Math.max(...uv), '')
  addStat('Pressure Min', Math.min(...pressure), 'hPa')
  addStat('Pressure Avg', pressure.reduce((a, b) => a + b, 0) / pressure.length, 'hPa')
  addStat('Pressure Max', Math.max(...pressure), 'hPa')

  return items
})

const hasRain = computed(() => {
  return props.rainData && props.rainData.length > 0
})

const { createPolarChart, disposeChart } = useAmCharts()

// Initialize rain rose chart after component is mounted
onMounted(() => {
  if (hasRain.value) {
    initializeRainRose()
  }
})

// Reinitialize chart when rainData changes
watch(() => props.rainData, (newRainData) => {
  if (newRainData && newRainData.length > 0) {
    initializeRainRose()
  }
})

// Cleanup on unmount
onUnmounted(() => {
  disposeChart('rainrose')
})

const initializeRainRose = () => {
  if (!props.rainData || props.rainData.length === 0) return

  createPolarChart({
    id: 'rainrose',
    valueYFields: ['rr'],
    strokeFillColors: ['#8ebdf3'],
    tooltipText: ['{ot} : {rr} mm/h from {wda}° {wdae}'],
    min: 0,
    max: 360,
    valueXFields: ['wda'],
    data: props.rainData,
    strokeWidth: 0.5,
    fps: 60,
    showLegend: false
  })
}
</script>

<template>
  <div class="lg:col-span-2">
    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold">
          Summary
        </h3>
      </template>

      <ul class="space-y-2 text-sm">
        <li
          v-for="stat in stats"
          :key="stat.label"
          class="flex justify-between"
        >
          <span>{{ stat.label }}</span>
          <span class="font-medium">{{ stat.value }}</span>
        </li>
      </ul>

      <div
        v-if="hasRain"
        class="mt-6"
      >
        <h4 class="text-base font-semibold mb-2">
          Rain Rose
        </h4>
        <div
          id="rainrose"
          class="h-[300px]"
        />
      </div>
    </UCard>
  </div>
</template>
