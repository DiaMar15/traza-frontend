<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

/* CHART JS */
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'

import { Bar } from 'vue-chartjs'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

type Vehiculo = {
  placa: string
  rutas: number
  km: number
  tiempo: number
  clientes: number
  peso: number
  volumen: number
  efectividad: number
}

const vehiculos = ref<Vehiculo[]>([])

async function cargar() {
  const res = await fetch('http://localhost:3333/api/v1/dashboard/rendimiento-vehiculos')

  vehiculos.value = await res.json()
}

onMounted(cargar)

/* =========================
   MÉTRICAS
========================= */

const totalKm = computed(() => vehiculos.value.reduce((a, b) => a + b.km, 0))

const totalRutas = computed(() => vehiculos.value.reduce((a, b) => a + b.rutas, 0))

const promedioTiempo = computed(() =>
  vehiculos.value.length
    ? Math.round(vehiculos.value.reduce((a, b) => a + b.tiempo, 0) / vehiculos.value.length)
    : 0,
)

const vehiculoMasKm = computed(() => [...vehiculos.value].sort((a, b) => b.km - a.km)[0])

const vehiculoMasLento = computed(() => [...vehiculos.value].sort((a, b) => b.tiempo - a.tiempo)[0])

const vehiculoMayorCarga = computed(() => [...vehiculos.value].sort((a, b) => b.peso - a.peso)[0])

/* =========================
   TOP 10 VEHÍCULOS
========================= */

const topVehiculos = computed(() => [...vehiculos.value].sort((a, b) => b.km - a.km).slice(0, 10))

/* =========================
   GRÁFICA
========================= */

const chartData = computed(() => ({
  labels: topVehiculos.value.map((v) => v.placa),

  datasets: [
    {
      label: 'Kilómetros',

      data: topVehiculos.value.map((v) => v.km),

      backgroundColor: [
        '#42A5F5',
        '#66BB6A',
        '#FFA726',
        '#AB47BC',
        '#26C6DA',
        '#EF5350',
        '#5C6BC0',
        '#9CCC65',
        '#FF7043',
        '#8D6E63',
      ],

      borderRadius: 8,
    },
  ],
}))

const chartOptions = {
  responsive: true,

  maintainAspectRatio: false,

  indexAxis: 'y' as const,

  plugins: {
    legend: {
      labels: {
        color: '#FFFFFF',
      },
    },
  },

  scales: {
    x: {
      ticks: {
        color: '#FFFFFF',
      },

      grid: {
        color: '#2A2A40',
      },
    },

    y: {
      ticks: {
        color: '#FFFFFF',
      },

      grid: {
        color: '#2A2A40',
      },
    },
  },
}

/* =========================
   COLORES
========================= */

function colorEfectividad(val: number) {
  if (val >= 90) return 'green'
  if (val >= 70) return 'orange'

  return 'red'
}

function colorTiempo(val: number) {
  if (val <= 450) return 'green'
  if (val <= 520) return 'orange'

  return 'red'
}

/* =========================
   TABLA
========================= */

const headers = [
  { title: 'Vehículo', key: 'placa' },
  { title: 'Rutas', key: 'rutas' },
  { title: 'Km', key: 'km' },
  { title: 'Tiempo (min)', key: 'tiempo' },
  { title: 'Clientes', key: 'clientes' },
  { title: 'Peso', key: 'peso' },
  { title: 'Volumen', key: 'volumen' },
  { title: 'Efectividad', key: 'efectividad' },
]
</script>

<template>
  <v-container>
    <h2 class="text-h5 font-weight-bold mb-6">Rendimiento Operativo</h2>

    <!-- CARDS -->
    <v-row>
      <v-col cols="12" md="4">
        <v-card class="pa-4 card-blue">
          <div>Total Km</div>

          <div class="text-h4">
            {{ totalKm }}
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="pa-4 card-purple">
          <div>Total Rutas</div>

          <div class="text-h4">
            {{ totalRutas }}
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="pa-4 card-dark">
          <div>Tiempo Promedio</div>

          <div class="text-h4">{{ promedioTiempo }} min</div>
        </v-card>
      </v-col>
    </v-row>

    <!-- INSIGHTS -->
    <v-row class="mt-4">
      <v-col cols="12" md="6">
        <v-card class="pa-4">
          <strong>🚛 Vehículo con más km</strong>

          <div v-if="vehiculoMasKm">
            {{ vehiculoMasKm.placa }}
            -
            {{ vehiculoMasKm.km }} km
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="pa-4">
          <strong>⚠ Vehículo más lento</strong>

          <div v-if="vehiculoMasLento">
            {{ vehiculoMasLento.placa }}
            -
            {{ vehiculoMasLento.tiempo }} min
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- ALERTAS / INSIGHTS OPERATIVOS -->
    <v-row class="mt-4">
      <!-- MAYOR RENDIMIENTO -->
      <v-col cols="12" md="4">
        <v-alert type="success" variant="tonal" border="start">
          ✅
          {{ vehiculoMasKm?.placa }}
          lidera el rendimiento con
          {{ vehiculoMasKm?.km }} km recorridos
        </v-alert>
      </v-col>

      <!-- MAYOR TIEMPO -->
      <v-col cols="12" md="4">
        <v-alert type="warning" variant="tonal" border="start">
          ⚠
          {{ vehiculoMasLento?.placa }}
          supera el tiempo ideal con
          {{ vehiculoMasLento?.tiempo }} min
        </v-alert>
      </v-col>

      <!-- MAYOR CARGA -->
      <v-col cols="12" md="4">
        <v-alert type="info" variant="tonal" border="start">
          📦
          {{ vehiculoMayorCarga?.placa }}
          transporta la mayor carga ({{ ((vehiculoMayorCarga?.peso ?? 0) / 1000).toFixed(1) }} t)
        </v-alert>
      </v-col>
    </v-row>

    <!-- GRÁFICA -->
    <v-row class="mt-4">
      <v-col cols="12">
        <v-card class="pa-4 card-dark">
          <div class="text-h6 mb-4">Top 10 Vehículos por Kilómetros</div>

          <div class="chart-container">
            <Bar :data="chartData" :options="chartOptions" />
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- TABLA -->
    <v-data-table :headers="headers" :items="vehiculos" :items-per-page="10" class="mt-6">
      <template #item.km="{ item }"> {{ item.km }} km </template>

      <template #item.tiempo="{ item }">
        <v-chip :color="colorTiempo(item.tiempo)" variant="tonal"> {{ item.tiempo }} min </v-chip>
      </template>

      <template #item.efectividad="{ item }">
        <v-chip :color="colorEfectividad(item.efectividad)"> {{ item.efectividad }}% </v-chip>
      </template>
    </v-data-table>
  </v-container>
</template>

<style scoped>
.card-blue {
  background: linear-gradient(135deg, #1e3c72, #2a5298);
  color: white;
}

.card-purple {
  background: linear-gradient(135deg, #42275a, #734b6d);
  color: white;
}

.card-dark {
  background: #1e1e1e;
  color: white;
}

.chart-container {
  height: 400px;
}
</style>
