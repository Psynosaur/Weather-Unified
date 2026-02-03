<script setup lang="ts">
import { CalendarDate, type DateValue } from '@internationalized/date'

// Props
interface Props {
  modelValue?: string // Make it optional
  placeholder?: string
  type?: 'date' | 'time'
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Select a date',
  type: 'date'
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

// Data gap range (no data available) - 2019-08-29 to 2019-10-07
const GAP_START = new CalendarDate(2019, 8, 29)
const GAP_END = new CalendarDate(2019, 10, 7)

// Min and max dates
const MIN_DATE = new CalendarDate(2019, 7, 20)
const MAX_DATE = computed(() => {
  const now = new Date()
  return new CalendarDate(now.getFullYear(), now.getMonth() + 1, now.getDate())
})

// Convert string date to CalendarDate
const stringToCalendarDate = (dateString: string): CalendarDate => {
  const [year, month, day] = dateString.split('-').map(Number)

  if (year === undefined || month === undefined || day === undefined) {
    throw new Error(`Invalid date string: ${dateString}`)
  }

  return new CalendarDate(year, month, day)
}

// Convert CalendarDate to string
const calendarDateToString = (date: CalendarDate): string => {
  const year = date.year
  const month = String(date.month).padStart(2, '0')
  const day = String(date.day).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Calendar model value
const calendarValue = computed({
  get: () => props.modelValue ? stringToCalendarDate(props.modelValue) : undefined,
  set: (value: CalendarDate | undefined) => {
    if (value) {
      emit('update:modelValue', calendarDateToString(value))
    }
  }
})

// Format date for display
const formattedDate = computed(() => {
  if (!props.modelValue) return props.placeholder

  const date = stringToCalendarDate(props.modelValue)
  return date.toDate('UTC').toLocaleDateString('en-ZA', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
})

// Function to check if a date is in the disabled range
const isDateUnavailable = (date: DateValue): boolean => {
  // Check if date is in the gap range
  if (date.compare(GAP_START) >= 0 && date.compare(GAP_END) <= 0) {
    return true
  }
  return false
}
</script>

<template>
  <UPopover>
    <UButton
      color="neutral"
      variant="outline"
      icon="i-lucide-calendar"
      class="px-4 py-2"
    >
      {{ formattedDate }}
    </UButton>

    <template #content>
      <UCalendar
        v-model="calendarValue"
        :min-value="MIN_DATE"
        :max-value="MAX_DATE"
        :is-date-unavailable="isDateUnavailable"
        color="primary"
        variant="solid"
        class="p-2"
      />
    </template>
  </UPopover>
</template>
