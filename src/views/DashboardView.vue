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

/* --------------------------
   TIPOS
-------------------------- */

type TotalResponse = {
  total: number
}

type RutasDia = {
  dia: string
  total: number
}

type Zona = {
  zona: string
  total: number
}

type Card = {
  title: string
  icon: string
  value: number
  color: string
  extra: string
}

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

/* --------------------------
   TARJETAS
-------------------------- */

const dashboardCards = ref<Card[]>([
  {
    title: 'Rutas Registradas',
    icon: 'mdi-map-marker-path',
    value: 0,
    color: 'card-blue',
    extra: '+12% esta semana',
  },

  {
    title: 'Kilómetros Recorridos',
    icon: 'mdi-road-variant',
    value: 0,
    color: 'card-cyan',
    extra: '+8% rendimiento',
  },

  {
    title: 'Conductores Activos',
    icon: 'mdi-account-group',
    value: 0,
    color: 'card-purple',
    extra: 'Operación estable',
  },

  {
    title: 'Viajes Realizados',
    icon: 'mdi-truck-delivery',
    value: 0,
    color: 'card-orange',
    extra: '+15 viajes hoy',
  },
])

/* --------------------------
   DATOS
-------------------------- */

const rutasPorDia = ref<RutasDia[]>([])
const kmPorZona = ref<Zona[]>([])
const vehiculos = ref<Vehiculo[]>([])

/* --------------------------
   ORDEN DÍAS
-------------------------- */

const ordenDias = ['DOMINGO', 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO']

const normalizar = (texto: string) =>
  texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()

/* --------------------------
   TOPS
-------------------------- */

const maxZona = computed(() => Math.max(...kmPorZona.value.map((z) => z.total), 1))

const vehiculoMasKm = computed(() => [...vehiculos.value].sort((a, b) => b.km - a.km)[0])

const vehiculoMenorRendimiento = computed(
  () => [...vehiculos.value].sort((a, b) => a.efectividad - b.efectividad)[0],
)

const zonaMayorDemanda = computed(() => [...kmPorZona.value].sort((a, b) => b.total - a.total)[0])

const diaMasRutas = computed(() => [...rutasPorDia.value].sort((a, b) => b.total - a.total)[0])

/* --------------------------
   ALERTAS
-------------------------- */

const alertas = computed(() => [
  {
    texto: diaMasRutas.value
      ? `${diaMasRutas.value.dia} registra el mayor número de rutas (${diaMasRutas.value.total})`
      : 'Sin datos de rutas',

    tipo: 'warning' as const,

    icono: 'mdi-calendar-alert',
  },

  {
    texto: kmPorZona.value.length
      ? `${[...kmPorZona.value].sort((a, b) => a.total - b.total)[0]?.zona} presenta la menor operación logística`
      : 'Sin zonas destacadas',

    tipo: 'info' as const,

    icono: 'mdi-map-marker-radius',
  },

  {
    texto: vehiculoMenorRendimiento.value
      ? `${vehiculoMenorRendimiento.value.placa} presenta el menor rendimiento operativo`
      : 'Sin datos operativos',

    tipo: 'error' as const,

    icono: 'mdi-alert-circle',
  },
])
/* --------------------------
   CHART DATA
-------------------------- */

const chartData = computed(() => ({
  labels: rutasPorDia.value.map((r) => r.dia),

  datasets: [
    {
      label: 'Rutas',

      data: rutasPorDia.value.map((r) => r.total),

      backgroundColor: [
        '#42A5F5',
        '#29B6F6',
        '#26C6DA',
        '#26A69A',
        '#66BB6A',
        '#9CCC65',
        '#D4E157',
      ],

      borderRadius: 12,

      borderSkipped: false,
    },
  ],
}))

const chartOptions = {
  responsive: true,

  maintainAspectRatio: false,

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

/* --------------------------
   FETCH
-------------------------- */

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url)

  if (!res.ok) throw new Error(url)

  return await res.json()
}

/* --------------------------
   CARGAR DASHBOARD
-------------------------- */

const cargarDashboard = async () => {
  try {
    const base = 'http://localhost:3333/api/v1/dashboard'

    const [dataRutas, dataKm, dataConductores, dataViajes, dataRutasDia, dataZonas, dataVehiculos] =
      await Promise.all([
        fetchJSON<TotalResponse>(`${base}/rutas-count`),
        fetchJSON<TotalResponse>(`${base}/kilometros`),
        fetchJSON<TotalResponse>(`${base}/conductores`),
        fetchJSON<TotalResponse>(`${base}/viajes`),
        fetchJSON<RutasDia[]>(`${base}/rutas-por-dia`),
        fetchJSON<Zona[]>(`${base}/km-por-zona`),
        fetchJSON<Vehiculo[]>(`${base}/rendimiento-vehiculos`),
      ])

    dashboardCards.value[0]!.value = dataRutas.total
    dashboardCards.value[1]!.value = dataKm.total
    dashboardCards.value[2]!.value = dataConductores.total
    dashboardCards.value[3]!.value = dataViajes.total

    vehiculos.value = dataVehiculos

    rutasPorDia.value = dataRutasDia.sort((a, b) => {
      const diaA = ordenDias.indexOf(normalizar(a.dia))
      const diaB = ordenDias.indexOf(normalizar(b.dia))

      return diaA - diaB
    })

    kmPorZona.value = dataZonas.sort((a, b) => b.total - a.total).slice(0, 10)
  } catch (error) {
    console.error('Error dashboard:', error)
  }
}

onMounted(() => {
  cargarDashboard()
})
</script>

<template>
  <v-container>
    <h2 class="text-h5 font-weight-bold mb-4">Dashboard Logístico</h2>

    <!-- ALERTAS -->
    <v-row class="mb-3">
      <v-col v-for="(alerta, i) in alertas" :key="i" cols="12" md="4">
        <v-alert :type="alerta.tipo" variant="tonal" border="start" rounded="lg" density="compact">
          <v-icon start size="18">
            {{ alerta.icono }}
          </v-icon>

          {{ alerta.texto }}
        </v-alert>
      </v-col>
    </v-row>

    <!-- TARJETAS -->
    <v-row class="mt-1">
      <v-col v-for="card in dashboardCards" :key="card.title" cols="12" sm="6" md="3">
        <v-card class="dashboard-card compact-card" :class="card.color" elevation="10" rounded="xl">
          <div class="d-flex align-center ga-3">
            <!-- ICONO -->
            <div class="icon-box">
              <v-icon :icon="card.icon" size="20" />
            </div>

            <!-- TEXTO -->
            <div>
              <div class="text-caption font-weight-bold">
                {{ card.title }}
              </div>

              <div class="text-subtitle-1 font-weight-bold mt-1">
                {{ card.value }}
              </div>

              <div class="text-caption text-grey-lighten-1">
                {{ card.extra }}
              </div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- GRÁFICOS -->
    <v-row class="mt-5">
      <!-- RUTAS -->
      <v-col cols="12" md="6">
        <v-card elevation="10" rounded="xl" class="pa-5 glass-card">
          <div class="d-flex align-center justify-space-between mb-4">
            <h3 class="text-subtitle-1 font-weight-bold">Rutas por día</h3>

            <v-chip color="primary" variant="tonal" size="small"> Operación semanal </v-chip>
          </div>

          <div class="chart-container">
            <Bar :data="chartData" :options="chartOptions" />
          </div>
        </v-card>
      </v-col>

      <!-- ZONAS -->
      <v-col cols="12" md="6">
        <v-card elevation="10" rounded="xl" class="pa-5 glass-card">
          <div class="d-flex align-center justify-space-between mb-4">
            <h3 class="text-subtitle-1 font-weight-bold">Kilómetros por zona</h3>

            <v-chip color="green" variant="tonal" size="small"> Top 10 </v-chip>
          </div>

          <div v-for="(zona, index) in kmPorZona" :key="zona.zona" class="mb-5">
            <div class="d-flex justify-space-between align-center mb-1">
              <div class="d-flex align-center ga-2">
                <v-avatar size="22" color="green">
                  <span class="text-caption">
                    {{ index + 1 }}
                  </span>
                </v-avatar>

                <span class="font-weight-bold text-caption">
                  {{ zona.zona }}
                </span>
              </div>

              <span class="text-caption"> {{ zona.total }} km </span>
            </div>

            <v-progress-linear
              :model-value="(zona.total / maxZona) * 100"
              height="12"
              rounded
              bg-color="#1f3324"
              color="green"
            />
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- INSIGHTS -->
    <v-row class="mt-5">
      <!-- VEHÍCULO -->
      <v-col cols="12" md="6">
        <v-card class="pa-5 insight-card-blue" elevation="10" rounded="xl">
          <div class="d-flex align-center justify-space-between">
            <div>
              <div class="text-overline mb-1">VEHÍCULO MÁS ACTIVO</div>

              <div class="text-h6 font-weight-bold">
                {{ vehiculoMasKm?.placa }}
              </div>

              <div class="text-subtitle-1 mt-1">{{ vehiculoMasKm?.km }} km</div>

              <div class="text-caption mt-3 text-grey-lighten-1">
                Mayor rendimiento operativo actual
              </div>
            </div>

            <v-icon icon="mdi-truck-fast" size="54" color="white" />
          </div>
        </v-card>
      </v-col>

      <!-- ZONA -->
      <v-col cols="12" md="6">
        <v-card class="pa-5 insight-card-green" elevation="10" rounded="xl">
          <div class="d-flex align-center justify-space-between">
            <div>
              <div class="text-overline mb-1">ZONA LÍDER</div>

              <div class="text-h6 font-weight-bold">
                {{ zonaMayorDemanda?.zona }}
              </div>

              <div class="text-subtitle-1 mt-1">{{ zonaMayorDemanda?.total }} km</div>

              <div class="text-caption mt-3 text-grey-lighten-1">
                Mayor concentración logística actual
              </div>
            </div>

            <v-icon icon="mdi-map-marker-radius" size="54" color="white" />
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.chart-container {
  height: 320px;
}

/* KPI */
.dashboard-card {
  transition: 0.3s;
  color: white;
}

.dashboard-card:hover {
  transform: translateY(-4px);
}

.compact-card {
  min-height: 88px;

  padding: 14px 16px;

  display: flex;
  align-items: center;
}

/* ICONOS */
.icon-box {
  width: 36px;
  height: 36px;

  border-radius: 12px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: rgba(255, 255, 255, 0.15);

  flex-shrink: 0;
}

/* COLORES */
.card-blue {
  background: linear-gradient(135deg, #1565c0, #1e88e5);
}

.card-cyan {
  background: linear-gradient(135deg, #00838f, #00acc1);
}

.card-purple {
  background: linear-gradient(135deg, #6a1b9a, #8e24aa);
}

.card-orange {
  background: linear-gradient(135deg, #ef6c00, #fb8c00);
}

/* GLASS */
.glass-card {
  background: linear-gradient(135deg, rgba(35, 35, 35, 0.95), rgba(25, 25, 25, 0.95));

  border: 1px solid rgba(255, 255, 255, 0.05);

  color: white;

  backdrop-filter: blur(10px);

  transition: 0.3s;
}

.glass-card:hover {
  transform: translateY(-4px);
}

/* INSIGHTS */
.insight-card-blue {
  background: linear-gradient(135deg, #1565c0, #1e88e5);

  color: white;

  transition: 0.3s;
}

.insight-card-green {
  background: linear-gradient(135deg, #2e7d32, #43a047);

  color: white;

  transition: 0.3s;
}

.insight-card-blue:hover,
.insight-card-green:hover {
  transform: translateY(-4px);
}
</style>
