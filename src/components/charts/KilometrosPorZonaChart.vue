<script setup lang="ts">
import { computed } from 'vue'
import {
  Chart as ChartJS,
  Tooltip, Legend,
  ArcElement
} from 'chart.js'
import { Doughnut } from 'vue-chartjs'

ChartJS.register(Tooltip, Legend, ArcElement)

type Item = { zona: string; total: number }

const props = defineProps<{ data: Item[] }>()

const chartData = computed(() => ({
  labels: props.data.map(i => i.zona),
  datasets: [
    {
      label: 'Kilómetros',
      data: props.data.map(i => i.total),
    }
  ]
}))

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { position: 'bottom' as const }
  }
}
</script>

<template>
  <Doughnut :data="chartData" :options="chartOptions" />
</template>