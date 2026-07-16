<script setup lang="ts">
import { computed } from 'vue'

import { Bar } from 'vue-chartjs'

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js'

import ChartDataLabels from 'chartjs-plugin-datalabels'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ChartDataLabels)

interface ZonaKm {
  zona: string
  total: number
}

interface HoraExtra {
  zona: string
  horasExtra: number
}

const props = defineProps<{
  zonas: ZonaKm[]
  horasExtraZona: HoraExtra[]
}>()

const colores = [
  '#60A5FA',
  '#4ADE80',
  '#F59E0B',
  '#C026D3',
  '#22D3EE',
  '#F43F5E',
  '#8B5CF6',
  '#84CC16',
  '#F97316',
  '#14B8A6',
]

const topZonas = computed(() => [...props.zonas].sort((a, b) => b.total - a.total).slice(0, 10))

const topHorasExtra = computed(() =>
  [...props.horasExtraZona].sort((a, b) => b.horasExtra - a.horasExtra).slice(0, 10),
)

const chartKmZona = computed(() => ({
  labels: topZonas.value.map((item) =>
    item.zona.length > 25 ? item.zona.slice(0, 25) + '...' : item.zona,
  ),

  datasets: [
    {
      label: 'Kilómetros',

      data: topZonas.value.map((item) => item.total),

      backgroundColor: colores,

      borderRadius: 8,

      borderSkipped: false,

      barThickness: 18,
    },
  ],
}))

const chartHorasExtra = computed(() => ({
  labels: topHorasExtra.value.map((item) =>
    item.zona.length > 25 ? item.zona.slice(0, 25) + '...' : item.zona,
  ),

  datasets: [
    {
      label: 'Horas Extra',

      data: topHorasExtra.value.map((item) => item.horasExtra),

      backgroundColor: colores,

      borderRadius: 8,

      borderSkipped: false,

      barThickness: 18,
    },
  ],
}))

const chartOptions = {
  responsive: true,

  maintainAspectRatio: false,

  indexAxis: 'y' as const,

  plugins: {
    legend: {
      display: false,
    },

    datalabels: {
      anchor: 'center' as const,

      align: 'center' as const,

      color: '#000000',

      font: {
        weight: 'bold' as const,
        size: 11,
      },

      formatter(value: number) {
        return `${value} km`
      },
    },
  },

  scales: {
    x: {
      ticks: {
        color: '#00BEFF',
      },

      grid: {
        color: '#2A2A40',
      },
    },

    y: {
      ticks: {
        color: '#00BEFF',
      },

      grid: {
        display: false,
      },
    },
  },
}

const chartHorasOptions = {
  ...chartOptions,

  plugins: {
    ...chartOptions.plugins,

    datalabels: {
      anchor: 'center' as const,

      align: 'center' as const,

      color: '#000000',

      font: {
        weight: 'bold' as const,
        size: 11,
      },

      formatter(value: number) {
        return `${value} h`
      },
    },
  },
}
</script>

<template>
  <v-row class="mt-6">
    <!-- KM POR ZONA -->
    <v-col cols="12" xl="6">
      <v-card rounded="xl" elevation="6" class="pa-4 h-100">
        <div class="d-flex flex-column flex-sm-row justify-space-between align-sm-center ga-3 mb-4">
          <div class="text-h6 font-weight-bold">📍 Kilómetros por Zona</div>

          <v-chip color="primary" variant="tonal"> Top {{ topZonas.length }} </v-chip>
        </div>

        <div class="chart-container">
          <Bar :data="chartKmZona" :options="chartOptions" />
        </div>
      </v-card>
    </v-col>

    <!-- HORAS EXTRA -->
    <v-col cols="12" xl="6">
      <v-card rounded="xl" elevation="6" class="pa-4 h-100">
        <div class="d-flex flex-column flex-sm-row justify-space-between align-sm-center ga-3 mb-4">
          <div class="text-h6 font-weight-bold">⏱ Horas Extra por Zona</div>

          <v-chip color="deep-orange" variant="tonal"> Top {{ topHorasExtra.length }} </v-chip>
        </div>

        <div class="chart-container">
          <Bar :data="chartHorasExtra" :options="chartHorasOptions" />
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped>
.chart-container {
  height: 340px;
}

@media (max-width: 1280px) {
  .chart-container {
    height: 300px;
  }
}

@media (max-width: 960px) {
  .chart-container {
    height: 260px;
  }
}
</style>
