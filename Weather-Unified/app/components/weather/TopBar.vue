<script setup lang="ts">
import type { Observation } from '~/types/weather'

defineProps<{
  latest: Observation
}>()
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <!-- Solar Card -->
    <UCard>
      <div class="space-y-3">
        <h3 class="text-center font-semibold text-lg border-b border-primary pb-2">
          Solar
        </h3>
        <div class="space-y-2">
          <div class="flex justify-between text-sm">
            <span>Solar Radiation</span>
            <span class="font-medium">{{ latest.solarRad }} W/m²</span>
          </div>
          <div class="flex justify-between text-sm">
            <span>UV Index</span>
            <span class="font-medium">{{ latest.uv }}</span>
          </div>
        </div>
      </div>
    </UCard>

    <!-- Indoor Card -->
    <UCard>
      <div class="space-y-3">
        <h3 class="text-center font-semibold text-lg border-b border-primary pb-2">
          Indoor
        </h3>
        <div class="space-y-2">
          <div class="flex justify-between text-sm">
            <span>Temp / R.H.</span>
            <span class="font-medium">{{ latest.tempInCur }}°C / {{ latest.humInCur }}%</span>
          </div>
          <div class="flex justify-between text-sm">
            <span>Pressure</span>
            <span class="font-medium">{{ latest.pressCur }} hPa</span>
          </div>
        </div>
      </div>
    </UCard>

    <!-- Rain Card -->
    <UCard>
      <div class="space-y-3">
        <h3 class="text-center font-semibold text-lg border-b border-primary pb-2">
          Rain
          <span
            v-if="latest.rainRateCur > 0"
            class="ml-2 text-blue-500"
          >
            {{ latest.rainRateCur }} mm/h
          </span>
        </h3>
        <div class="space-y-2">
          <div class="flex justify-between text-sm">
            <span>Day / Yesterday</span>
            <span class="font-medium">{{ latest.rainDay }} / {{ latest.rainYest }} mm</span>
          </div>
          <div class="flex justify-between text-sm">
            <span>Month / Year</span>
            <span class="font-medium">{{ latest.rainMonth }} / {{ latest.rainYear }} mm</span>
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>
