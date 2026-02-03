<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

// Accept orientation prop to allow switching between horizontal and vertical
defineProps<{
  orientation?: 'horizontal' | 'vertical'
}>()

const items: NavigationMenuItem[] = [
  {
    label: 'Today',
    icon: 'i-lucide-cloud-sun',
    to: '/'
  },
  {
    label: 'Hourly',
    icon: 'i-lucide-clock',
    to: '/hour'
  },
  {
    label: 'Week',
    icon: 'i-lucide-calendar-days',
    to: '/week'
  },
  {
    label: 'Month',
    icon: 'i-lucide-calendar-range',
    to: '/month'
  },
  {
    label: 'Forecast',
    icon: 'i-lucide-cloud-sun-rain',
    to: '/forecast'
  },
  {
    label: 'History',
    icon: 'i-lucide-calendar-search',
    to: '/date'
  },
  {
    label: 'About',
    icon: 'i-lucide-info',
    to: '/about'
  },
  {
    label: 'Photos',
    icon: 'i-lucide-camera',
    to: 'https://flickr.com/ohansmit',
    target: '_blank'
  }
]
</script>

<template>
  <UNavigationMenu
    :items="items"
    :orientation="orientation"
  />
</template>
