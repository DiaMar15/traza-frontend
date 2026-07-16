<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

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
import ChartDataLabels from 'chartjs-plugin-datalabels'

import { obtenerSemanas } from '@/services/dashboardService'
import RendimientoFiltros from '@/components/rendimiento/RendimientoFiltros.vue'
import RendimientoHeader from '@/components/rendimiento/RendimientoHeader.vue'
import RendimientoKPIs from '@/components/rendimiento/RendimientoKPIs.vue'
import RendimientoAlertas from '@/components/rendimiento/RendimientoAlertas.vue'
import RendimientoRankings from '@/components/rendimiento/RendimientoRankings.vue'
import RendimientoVehiculos from '@/components/rendimiento/RendimientoVehiculos.vue'
import RendimientoCEDI from '@/components/rendimiento/RendimientoCEDI.vue'
import RendimientoOperativo from '@/components/rendimiento/RendimientoOperativo.vue'

import {
  obtenerRendimiento,
  obtenerRendimientoVehiculos,
  obtenerKmPorZona,
  obtenerVehiculoMenorKilometraje,
  obtenerTiempoCediAmVehiculos,
  obtenerTiempoCediPmVehiculos,
  obtenerTiempoCediAmZona,
  obtenerTiempoCediPmZona,
  obtenerHorasExtraZona,
} from '@/services/rendimientoService'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ChartDataLabels)
/* ==========================
   TYPES
========================== */

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

type Zona = {
  zona: string
  total: number
}

type TiempoZona = {
  zona: string
  tiempo: number
}

type TiempoVehiculo = {
  placa: string
  tiempo: number
}

type HorasExtraZona = {
  zona: string
  horasExtra: number
}

/* ==========================
   DATA
========================== */

const loading = ref(false)

const rendimiento = ref<any>({})

const vehiculos = ref<Vehiculo[]>([])

const zonas = ref<Zona[]>([])

const vehiculoMenorKm = ref<any>(null)

const tiempoCediAmVehiculos = ref<TiempoVehiculo[]>([])

const tiempoCediPmVehiculos = ref<TiempoVehiculo[]>([])

const tiempoCediAmZona = ref<TiempoZona[]>([])

const tiempoCediPmZona = ref<TiempoZona[]>([])

const horasExtraZona = ref<HorasExtraZona[]>([])

/* ==========================
   FILTROS
========================== */

const periodo = ref<'diario' | 'semanal' | 'mensual'>('semanal')

const dia = ref('')

const semana = ref<number | null>(null)

const mes = ref('')

const semanas = ref<number[]>([])

const meses = ref([
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
])

/* ==========================
   CARGAR SEMANAS
========================== */

async function cargarSemanas() {
  try {
    const data = await obtenerSemanas()

    semanas.value = [...data.semanas].sort((a, b) => a - b)

    if (!semana.value) {
      semana.value = data.semana
    }
  } catch (error) {
    console.error(error)
  }
}
/* ==========================
   CARGAR INFORMACIÓN
========================== */

async function cargarRendimiento() {
  loading.value = true

  try {
    const filtros = {
      dia: periodo.value === 'diario' ? dia.value : undefined,

      semana: periodo.value === 'semanal' ? (semana.value ?? undefined) : undefined,

      mes: periodo.value === 'mensual' ? mes.value : undefined,
    }

    const [
      rendimientoData,
      vehiculosData,
      zonasData,
      menorKmData,
      cediAmVehiculosData,
      cediPmVehiculosData,
      cediAmZonaData,
      cediPmZonaData,
      horasExtraZonaData,
    ] = await Promise.all([
      obtenerRendimiento(filtros),

      obtenerRendimientoVehiculos(filtros),

      obtenerKmPorZona(filtros),

      obtenerVehiculoMenorKilometraje(filtros),

      obtenerTiempoCediAmVehiculos(filtros),

      obtenerTiempoCediPmVehiculos(filtros),

      obtenerTiempoCediAmZona(filtros),

      obtenerTiempoCediPmZona(filtros),

      obtenerHorasExtraZona(filtros),
    ])

    console.log(horasExtraZonaData)
    rendimiento.value = rendimientoData

    vehiculos.value = vehiculosData

    zonas.value = zonasData

    console.log('menorKmData:', menorKmData)
    vehiculoMenorKm.value = menorKmData

    tiempoCediAmVehiculos.value = cediAmVehiculosData

    tiempoCediPmVehiculos.value = cediPmVehiculosData

    tiempoCediAmZona.value = cediAmZonaData

    tiempoCediPmZona.value = cediPmZonaData

    horasExtraZona.value = horasExtraZonaData
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

/* ==========================
   INICIALIZACIÓN
========================== */

onMounted(async () => {
  dia.value = new Date().toISOString().slice(0, 10)

  await cargarSemanas()

  await cargarRendimiento()
})

/* ==========================
   WATCHS
========================== */

watch(periodo, () => {
  if (periodo.value === 'diario' && !dia.value) {
    dia.value = new Date().toISOString().slice(0, 10)
  }

  if (periodo.value === 'mensual' && !mes.value) {
    mes.value = meses.value[new Date().getMonth()] ?? ''
  }

  cargarRendimiento()
})

watch(dia, (nuevoDia) => {
  console.log('Fecha enviada:', nuevoDia)

  if (periodo.value === 'diario') {
    cargarRendimiento()
  }
})

watch(semana, (nuevaSemana) => {
  if (periodo.value === 'semanal' && nuevaSemana !== null) {
    cargarRendimiento()
  }
})

watch(mes, (nuevoMes) => {
  if (periodo.value === 'mensual' && nuevoMes) {
    cargarRendimiento()
  }
})

/* ==========================
   MÉTRICAS
========================== */

const zonaMayorKm = computed(() => {
  return [...zonas.value].sort((a, b) => b.total - a.total)[0] ?? null
})

const totalKm = computed(() => {
  return rendimiento.value?.totalKm ?? 0
})

const totalRutas = computed(() => {
  return rendimiento.value?.totalRutas ?? 0
})

const efectividad = computed(() => {
  return rendimiento.value?.efectividad ?? 0
})

const promedioTiempo = computed(() => {
  if (!vehiculos.value.length) {
    return 0
  }

  const total = vehiculos.value.reduce((acumulado, vehiculo) => {
    return acumulado + vehiculo.tiempo
  }, 0)

  return Math.round(total / vehiculos.value.length)
})

const vehiculoMasKm = computed(() => {
  return [...vehiculos.value].sort((a, b) => b.km - a.km)[0] ?? null
})

const vehiculoMenosKm = computed(() => {
  return [...vehiculos.value].sort((a, b) => a.km - b.km)[0] ?? null
})

const vehiculoMasLento = computed(() => {
  return [...vehiculos.value].sort((a, b) => b.tiempo - a.tiempo)[0] ?? null
})

const vehiculoMayorCarga = computed(() => {
  return [...vehiculos.value].sort((a, b) => b.peso - a.peso)[0] ?? null
})

/* ==========================
   TOP VEHÍCULOS
========================== */

const topVehiculos = computed(() => {
  return [...vehiculos.value].sort((a, b) => b.km - a.km).slice(0, 13)
})

/* ==========================
   TOP ZONAS
========================== */

const topZonas = computed(() => {
  return [...zonas.value].sort((a, b) => b.total - a.total).slice(0, 13)
})

/* ==========================
   GRÁFICA
========================== */

const vehiculosChartData = computed(() => ({
  labels: topVehiculos.value.map((vehiculo) => vehiculo.placa),

  datasets: [
    {
      label: 'Kilómetros',

      data: topVehiculos.value.map((vehiculo) => vehiculo.km),

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
      barThickness: 18,
      maxBarThickness: 22,
    },
  ],
}))

const zonasChartData = computed(() => ({
  labels: topZonas.value.map((zona) => zona.zona),

  datasets: [
    {
      label: 'Kilómetros',

      data: topZonas.value.map((zona) => zona.total),

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
        '#26A69A',
        '#EC407A',
        '#7E57C2',
      ],

      borderRadius: 8,
      barThickness: 18,
      maxBarThickness: 22,
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
      color: '#000000',

      anchor: 'center',

      align: 'left',

      offset: -8,

      formatter(value: number) {
        return `${value} km`
      },

      font: {
        weight: 'bold',
        size: 11,
      },
    },
  },

  scales: {
    x: {
      suggestedMax: Math.max(...topZonas.value.map((z) => z.total)) * 1.15,

      ticks: {
        color: '#00BEFF',
      },

      grid: {
        color: '#000000',
      },
    },

    y: {
      ticks: {
        color: '#00BEFF',
        padding: 8,
      },

      grid: {
        color: '#2A2A40',
      },
    },
  },
}

function colorEfectividad(valor: number) {
  if (valor >= 90) {
    return 'green'
  }

  if (valor >= 70) {
    return 'orange'
  }

  return 'red'
}

function colorTiempo(valor: number) {
  if (valor <= 450) {
    return 'green'
  }

  if (valor <= 520) {
    return 'orange'
  }

  return 'red'
}

function formatearTiempo(minutos: number) {
  const horas = Math.floor(minutos / 60)

  const minutosRestantes = minutos % 60

  if (minutosRestantes === 0) {
    return `${horas} h`
  }

  return `${horas} h ${minutosRestantes} min`
}
/* ==========================
   TABLA
========================== */

const headers = [
  {
    title: 'Vehículo',
    key: 'placa',
  },

  {
    title: 'Rutas',
    key: 'rutas',
  },

  {
    title: 'Km',
    key: 'km',
  },

  {
    title: 'Tiempo (min)',
    key: 'tiempo',
  },

  {
    title: 'Clientes',
    key: 'clientes',
  },

  {
    title: 'Peso',
    key: 'peso',
  },

  {
    title: 'Volumen',
    key: 'volumen',
  },

  {
    title: 'Efectividad',
    key: 'efectividad',
  },
]
</script>

<template>
  <v-container fluid class="pa-4 pa-md-6">
    <!-- ==========================================
         HEADER
    ========================================== -->

    <RendimientoHeader
      :periodo="periodo"
      :dia="dia"
      :semana="semana"
      :mes="mes"
      :total-rutas="totalRutas"
      :total-vehiculos="vehiculos.length"
    />

    <!-- ==========================================
         FILTROS
    ========================================== -->

    <RendimientoFiltros
      v-model:periodo="periodo"
      v-model:dia="dia"
      v-model:semana="semana"
      v-model:mes="mes"
      :semanas="semanas"
      :meses="meses"
    />

    <!-- ==========================================
         KPIs
    ========================================== -->

    <RendimientoKPIs
      :total-km="totalKm"
      :total-rutas="totalRutas"
      :promedio-tiempo="promedioTiempo"
      :efectividad="efectividad"
    />

    <!-- ==========================================
         ALERTAS DEL PERÍODO
    ========================================== -->

    <RendimientoAlertas
      :vehiculo-mayor-km="vehiculoMasKm"
      :vehiculo-menor-km="vehiculoMenorKm"
      :zona-mayor-km="zonaMayorKm"
    />

    <RendimientoRankings
      :vehiculos-chart-data="vehiculosChartData"
      :zonas-chart-data="zonasChartData"
      :chart-options="chartOptions"
    />

    <!-- ==========================================
         RENDIMIENTO POR VEHÍCULO
    ========================================== -->

    <RendimientoVehiculos
      :headers="headers"
      :vehiculos="vehiculos"
      :color-tiempo="colorTiempo"
      :color-efectividad="colorEfectividad"
    />

    <RendimientoOperativo :zonas="zonas" :horas-extra-zona="horasExtraZona" />

    <RendimientoCEDI
      :tiempo-cedi-am-vehiculos="tiempoCediAmVehiculos"
      :tiempo-cedi-pm-vehiculos="tiempoCediPmVehiculos"
      :tiempo-cedi-am-zona="tiempoCediAmZona"
      :tiempo-cedi-pm-zona="tiempoCediPmZona"
    />
  </v-container>
</template>

<style scoped>
.chart-container {
  position: relative;
  height: 450px;
  width: 100%;
}
</style>
