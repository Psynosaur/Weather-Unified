<template>
  <UDropdownMenu
    v-slot="{ open }"
    :modal="false"
    :items="[{
      label: 'Weather Today',
      to: '/',
      color: 'primary'
    }, {
      label: 'Hourly Weather Today',
      to: '/hour',
    }, {
      label: 'Past Weekly Weather',
      to: '/week'
    }, {
      label: 'Past Monthly Weather',
      to: '/month'
    }, {
      label: 'Six Day Weather Forecast',
      to: '/forecast'
    }, {
      label: 'Historical Weather',
      to: '/date'
    }, {
      label: 'About',
      to: '/about'
    }, {
      label: 'Photograhpy',
      to: 'https://flickr.com/ohansmit'
    }]"
    :content="{ align: 'start' }"
    :ui="{ content: 'min-w-fit' }"
    size="xs"
  >
    <UButton
      label="Weather Today"
      variant="subtle"
      trailing-icon="i-lucide-chevron-down"
      size="xs"
      class="-mb-[6px] font-semibold rounded-full truncate"
      :class="[open && 'bg-primary/15']"
      :ui="{
        trailingIcon: ['transition-transform duration-200', open ? 'rotate-180' : undefined].filter(Boolean).join(' ')
      }"
    />
  </UDropdownMenu>
</template>
