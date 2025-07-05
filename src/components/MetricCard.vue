<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title: string
  value: string
  updated: string
  color: 'purple' | 'purple-light' | 'blue' | 'dark'
}>()

const colors = {
  purple: 'bg-purple',
  'purple-light': 'bg-purple-light',
  blue: 'bg-blue',
  dark: 'bg-dark'
} as const

const colorClass = computed(() => colors[props.color])
</script>

<template>
  <div :class="['card', colorClass]">
    <p class="card-title">{{ title }}</p>
    <p class="card-value">{{ value }}</p>
    <p class="card-updated">Last update {{ updated }}</p>
  </div>
</template>

<style scoped>
.card {
  padding: 1rem;
  border-radius: 1rem;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-title {
  font-size: 0.8rem;
  text-transform: uppercase;
  opacity: 0.8;
}

.card-value {
  font-size: 1.8rem;
  font-weight: bold;
  margin: 0.25rem 0;
}

.card-updated {
  font-size: 0.75rem;
  opacity: 0.7;
}

/* COLOR THEMES */
.bg-purple {
  background: linear-gradient(135deg, #a78bfa, #7c3aed);
}

.bg-purple-light {
  background: linear-gradient(135deg, #c4b5fd, #8b5cf6);
}

.bg-blue {
  background: linear-gradient(135deg, #60a5fa, #2563eb);
}

.bg-dark {
  background: linear-gradient(135deg, #4b5563, #1f2937);
}
</style>
