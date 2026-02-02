<script setup lang="ts">
import type { Forecasts } from '~/types/weather'

const { data: forecast, status, error } = await useFetch<Forecasts>('/api/forecast')

// Helper function to format time
const formatTime = (time: string | undefined): string => {
  if (!time) return '--'

  const date = new Date(time)
  return date.toLocaleTimeString('en-ZA', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Calculate day length differences
const calculateDayLengthDiff = (index: number) => {
  if (!forecast.value || index === 0) return null

  const currentSunrise = forecast.value.sunriseTimeLocal[index]
  const currentSunset = forecast.value.sunsetTimeLocal[index]
  const prevSunrise = forecast.value.sunriseTimeLocal[index - 1]
  const prevSunset = forecast.value.sunsetTimeLocal[index - 1]

  // Guard against undefined values
  if (!currentSunrise || !currentSunset || !prevSunrise || !prevSunset) {
    return null
  }

  const currentSunriseDate = new Date(currentSunrise)
  const currentSunsetDate = new Date(currentSunset)
  const prevSunriseDate = new Date(prevSunrise)
  const prevSunsetDate = new Date(prevSunset)

  const currentLength = currentSunsetDate.getTime() - currentSunriseDate.getTime()
  const prevLength = prevSunsetDate.getTime() - prevSunriseDate.getTime()
  const diff = currentLength - prevLength

  const diffMinutes = Math.abs(Math.floor(diff / 60000))
  const diffSeconds = Math.abs(Math.floor((diff % 60000) / 1000))
  const direction = diff >= 0 ? 'longer' : 'shorter'

  return { minutes: diffMinutes, seconds: diffSeconds, direction }
}

// Check if daytime data is available (after 3pm, we don't get daytime values anymore)
const isDaytimeAvailable = (index: number) => {
  if (!forecast.value) return false
  return (forecast.value.daypart[0]?.relativeHumidity[index * 2] ?? 0) > 0
}
</script>

<template>
  <div class="container mx-auto px-4">
    <br>

    <div
      v-if="status === 'pending'"
      class="text-center py-8"
    >
      <p>Loading forecast...</p>
    </div>

    <div
      v-else-if="error"
      class="text-center py-8 text-red-500"
    >
      <p>Error loading forecast: {{ error.message }}</p>
    </div>

    <div
      v-else-if="forecast"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      <div
        v-for="(day, i) in forecast.dayOfWeek"
        :key="i"
        class="bg-gray-800 text-gray-100 rounded-lg p-4"
      >
        <!-- Header with temperatures and day name -->
        <div class="grid grid-cols-3 gap-2 mb-4">
          <div class="text-center">
            <h3
              class="text-blue-400 text-lg"
              :title="'Temp min'"
            >
              {{ forecast.temperatureMin[i] }}°C
            </h3>
          </div>
          <div class="text-center">
            <h2 class="text-xl font-bold">
              {{ day }}
            </h2>
          </div>
          <div class="text-center">
            <h3
              class="text-red-400 text-lg"
              :title="'Temp max'"
            >
              <template v-if="forecast.temperatureMax[i] == null">
                {{ forecast.daypart[0]?.temperatureHeatIndex[i * 2 + 1] }}°C
              </template>
              <template v-else>
                {{ forecast.temperatureMax[i] }}°C
              </template>
            </h3>
          </div>
        </div>

        <!-- Sunrise, rainfall, sunset -->
        <div class="grid grid-cols-3 gap-2 mb-4">
          <div class="text-center">
            <h3
              class="text-yellow-400 text-sm"
              :title="'Sunrise'"
            >
              {{ formatTime(forecast.sunriseTimeLocal[i]) }}
            </h3>
          </div>
          <div class="text-center">
            <h3
              v-if="forecast.qpf[i] && forecast.qpf[i]! > 0"
              class="text-blue-300 text-sm"
              :title="'Expected rainfall'"
            >
              {{ forecast.qpf[i] }} mm
            </h3>
          </div>
          <div class="text-center">
            <h3
              class="text-yellow-400 text-sm"
              :title="'Sunset'"
            >
              {{ formatTime(forecast.sunsetTimeLocal[i]) }}
            </h3>
          </div>
        </div>

        <!-- Daytime Section (conditional) -->
        <template v-if="isDaytimeAvailable(i)">
          <hr class="border-gray-600 my-4">

          <div class="text-center">
            <h2
              class="text-lg font-semibold mb-2"
              :title="i > 0 && calculateDayLengthDiff(i)
                ? `${calculateDayLengthDiff(i)!.minutes}m and ${calculateDayLengthDiff(i)!.seconds}s ${calculateDayLengthDiff(i)!.direction} than previous day`
                : undefined"
            >
              Daytime
            </h2>
          </div>

          <div class="flex justify-center my-4">
            <img
              :src="`/img/Weather Icons - 200x200_SVGs/SVGs/${forecast.daypart[0]?.iconCode[i * 2]}.svg`"
              alt="Weather icon"
              class="w-32 h-32"
            >
          </div>

          <div class="text-sm text-center mb-4 h-[4.5rem] overflow-hidden flex items-center justify-center">
            <p class="line-clamp-3">
              {{ forecast.daypart[0]?.narrative[i * 2] }}
            </p>
          </div>

          <div class="grid grid-cols-3 gap-2 text-center text-sm mb-4">
            <div>
              <span :title="'Cloud cover for this period'">
                Clouds<br>{{ forecast.daypart[0]?.cloudCover[i * 2] }} %
              </span>
            </div>
            <div>
              <span :title="'Precipitation chance'">
                Precip.<br>{{ forecast.daypart[0]?.precipChance[i * 2] }} %
              </span>
            </div>
            <div>
              <span :title="'Relative humidity'">
                R.H.<br>{{ forecast.daypart[0]?.relativeHumidity[i * 2] }} %
              </span>
            </div>
          </div>
        </template>

        <!-- Nighttime Section -->
        <hr class="border-gray-600 my-4">
        <h2 class="text-lg font-semibold text-center mb-2">
          Nighttime
        </h2>

        <div class="flex justify-center my-4">
          <img
            :src="`/img/Weather Icons - 200x200_SVGs/SVGs/${forecast.daypart[0]?.iconCode[i * 2 + 1]}.svg`"
            alt="Weather icon"
            class="w-32 h-32"
          >
        </div>

        <div class="text-sm text-center mb-4 h-[4.5rem] overflow-hidden flex items-center justify-center">
          <p class="line-clamp-3">
            {{ forecast.daypart[0]?.narrative[i * 2 + 1] }}
          </p>
        </div>

        <div class="grid grid-cols-3 gap-2 text-center text-sm mb-4">
          <div>
            <span :title="'Cloud cover for this period'">
              Clouds<br>{{ forecast.daypart[0]?.cloudCover[i * 2 + 1] }} %
            </span>
          </div>
          <div>
            <span :title="'Precipitation chance'">
              Precip.<br>{{ forecast.daypart[0]?.precipChance[i * 2 + 1] }} %
            </span>
          </div>
          <div>
            <span :title="'Relative humidity'">
              R.H.<br>{{ forecast.daypart[0]?.relativeHumidity[i * 2 + 1] }} %
            </span>
          </div>
        </div>

        <!-- Moon Section -->
        <hr class="border-gray-600 my-4">
        <h2 class="text-lg font-semibold text-center mb-2">
          Moon
        </h2>

        <div class="flex justify-center my-4">
          <img
            :src="`/img/moon/wi-moon-alt-${forecast.moonPhaseDay[i]}.svg`"
            alt="Moon phase"
            class="w-24 h-24"
          >
        </div>

        <div class="text-sm text-center mb-4">
          {{ forecast.moonPhase[i] }}
          <strong>{{ forecast.moonPhaseDay[i] }}</strong>
          {{ forecast.moonPhaseDay[i]! > 1 ? 'days old' : 'day old' }}
        </div>

        <div class="grid grid-cols-2 gap-2 text-center text-sm">
          <div
            v-if="forecast.moonriseTimeLocal[i]"
            class="text-gray-400"
          >
            <h3 :title="'Moonrise time'">
              {{ formatTime(forecast.moonriseTimeLocal[i]) }}
            </h3>
          </div>
          <div
            v-if="forecast.moonsetTimeLocal[i]"
            class="text-gray-400"
          >
            <h3 :title="'Moonset time'">
              {{ formatTime(forecast.moonsetTimeLocal[i]) }}
            </h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
