<script setup lang="ts">
// Props
interface Props {
  modelValue: string
  max?: string
  step?: string
}

const props = withDefaults(defineProps<Props>(), {
  max: undefined,
  step: undefined
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

// Local value for v-model
const localValue = computed({
  get: () => props.modelValue,
  set: (value: string) => {
    emit('update:modelValue', value)
  }
})

// Computed max time (current time by default)
const maxTime = computed(() => {
  return props.max || new Date().toTimeString().slice(0, 5)
})
</script>

<template>
  <input
    id="time"
    v-model="localValue"
    type="time"
    class="px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
    :max="maxTime"
    :step="step"
  >
</template>
