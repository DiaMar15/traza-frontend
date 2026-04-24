<script setup lang="ts">
import { computed } from 'vue'
import {
  Chart as ChartJS,
  Title, Tooltip, Legend,
  BarElement, CategoryScale, LinearScale
} from 'chart.js'
import { Bar } from 'vue-chartjs'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

type Item = { dia: string; total: number }

const props = defineProps<{ data: Item[] }>()

const chartData = computed(() => ({
  labels: props.data.map(i => i.dia),
  datasets: [
    {
      label: 'Rutas',
      data: props.data.map(i => i.total),
    }
  ]
}))

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false }
  }
}
</script>

<template>
  <Bar :data="chartData" :options="chartOptions" />
</template>