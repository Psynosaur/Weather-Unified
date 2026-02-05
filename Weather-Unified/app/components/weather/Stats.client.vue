<script setup lang="ts">
import type { GraphDataPoint, RainDataPoint } from '~/types/weather'

interface Props {
  observations: GraphDataPoint[]
  rainData?: RainDataPoint[]
  timeframe?: 'day' | 'week' | 'month' | 'hour'
}

const props = withDefaults(defineProps<Props>(), {
  rainData: () => [],
  timeframe: 'day'
})

interface StatItem {
  label: string
  value: string
  timestamp?: string // For min/max values, the time when this value was recorded
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
  const addStat = (label: string, value: number, unit: string, decimals: number = 1, timestamp?: string) => {
    if (value > 0) {
      items.push({
        label,
        value: `${value.toFixed(decimals)} ${unit}`,
        timestamp
      })
    }
  }

  // Helper to find timestamp for min/max values
  const findTimestamp = (observations: GraphDataPoint[], field: keyof GraphDataPoint, value: number): string => {
    const obs = observations.find(o => o[field] === value)
    if (obs?.ot) {
      const date = new Date(obs.ot)

      // For week/month views, include the date
      if (props.timeframe === 'week' || props.timeframe === 'month') {
        return date.toLocaleString('en-ZA', {
          month: 'short',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })
      }

      // For day/hour views, just show time
      return date.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit', hour12: true })
    }
    return ''
  }

  const tempMin = Math.min(...temps)
  const tempMax = Math.max(...temps)
  const humidityMin = Math.min(...humidity)
  const humidityMax = Math.max(...humidity)
  const dewMin = Math.min(...dew)
  const dewMax = Math.max(...dew)
  const windMax = Math.max(...windGusts)
  const rainRateMax = Math.max(...rainRates)
  const solarMax = Math.max(...solarAll)
  const uvMax = Math.max(...uv)
  const pressureMin = Math.min(...pressure)
  const pressureMax = Math.max(...pressure)

  addStat('Temp Min', tempMin, '°C', 1, findTimestamp(props.observations, 'to', tempMin))
  addStat('Temp Avg', temps.reduce((a, b) => a + b, 0) / temps.length, '°C')
  addStat('Temp Max', tempMax, '°C', 1, findTimestamp(props.observations, 'to', tempMax))
  addStat('R.H. Min', humidityMin, '%', 1, findTimestamp(props.observations, 'ho', humidityMin))
  addStat('R.H. Avg', humidity.reduce((a, b) => a + b, 0) / humidity.length, '%')
  addStat('R.H. Max', humidityMax, '%', 1, findTimestamp(props.observations, 'ho', humidityMax))
  addStat('Dew Min', dewMin, '°C', 1, findTimestamp(props.observations, 'dc', dewMin))
  addStat('Dew Avg', dew.reduce((a, b) => a + b, 0) / dew.length, '°C')
  addStat('Dew Max', dewMax, '°C', 1, findTimestamp(props.observations, 'dc', dewMax))
  addStat('Wind Max', windMax, 'km/h', 1, findTimestamp(props.observations, 'wg', windMax))
  addStat('Wind Avg', windSpeeds.reduce((a, b) => a + b, 0) / windSpeeds.length, 'km/h')
  addStat('WindDir Avg', windDirs.reduce((a, b) => a + b, 0) / windDirs.length, '°')
  addStat('Rain Avg', rain.reduce((a, b) => a + b, 0) / rain.length, 'mm')
  addStat('RainRate Max', rainRateMax, 'mm/h', 1, findTimestamp(props.observations, 'rr', rainRateMax))

  if (solar.length > 0) {
    addStat('Solar Avg', solar.reduce((a, b) => a + b, 0) / solar.length, 'W/m²')
  } else {
    addStat('Solar Avg', 0, 'W/m²')
  }

  addStat('Solar Max', solarMax, 'W/m²', 1, findTimestamp(props.observations, 'sr', solarMax))
  addStat('Max UV', uvMax, '', 1, findTimestamp(props.observations, 'uv', uvMax))
  addStat('Pressure Min', pressureMin, 'hPa', 1, findTimestamp(props.observations, 'p', pressureMin))
  addStat('Pressure Avg', pressure.reduce((a, b) => a + b, 0) / pressure.length, 'hPa')
  addStat('Pressure Max', pressureMax, 'hPa', 1, findTimestamp(props.observations, 'p', pressureMax))

  return items
})

const hasRain = computed(() => {
  return props.rainData && props.rainData.length > 0
})

const { createPolarChart, disposeChart, colorMode } = useAmCharts()

// Initialize rain rose chart after component is mounted
onMounted(() => {
  // Add a small delay to ensure DOM is fully ready after hydration
  nextTick(() => {
    if (hasRain.value) {
      initializeRainRose()
    }
  })
})

// Reinitialize chart when rainData changes
watch(() => props.rainData, (newRainData) => {
  if (newRainData && newRainData.length > 0) {
    initializeRainRose()
  }
})

// Reinitialize chart when color mode changes
watch(() => colorMode.value, () => {
  if (hasRain.value) {
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
          <UTooltip
            v-if="stat.timestamp"
            :text="`Recorded at ${stat.timestamp}`"
            :content="{ side: 'left', sideOffset: 8 }"
            :delay-duration="300"
          >
            <span class="font-medium cursor-help underline decoration-dotted decoration-gray-400 dark:decoration-gray-600 underline-offset-2">
              {{ stat.value }}
            </span>
          </UTooltip>
          <span
            v-else
            class="font-medium"
          >
            {{ stat.value }}
          </span>
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
          class="h-[350px]"
        />
      </div>
    </UCard>
  </div>
</template>
