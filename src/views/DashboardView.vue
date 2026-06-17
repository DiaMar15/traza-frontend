<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Bar } from 'vue-chartjs'
import { Doughnut } from 'vue-chartjs'
import ChartDataLabels from 'chartjs-plugin-datalabels'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels)
type Card = {
  title: string
  icon: string
  value: number
  color: string
  extra: string
}

type DashboardPrincipalResponse = {
  kpis: {
    totalRutas: number
    totalClientes: number
    totalDinero: number
    conductoresActivos: number
    auxiliaresActivos: number
  }

  detalle: DetalleRuta[]
}
/* --------------------------
   TARJETAS
-------------------------- */

const dashboardCards = ref<Card[]>([
  {
    title: 'Total Rutas',
    icon: 'mdi-map-marker-path',
    value: 0,
    color: 'card-blue',
    extra: 'Operación actual',
  },

  {
    title: 'Total Clientes',
    icon: 'mdi-account-multiple',
    value: 0,
    color: 'card-cyan',
    extra: 'Clientes atendidos',
  },

  {
    title: 'Dinero Movido',
    icon: 'mdi-cash',
    value: 0,
    color: 'card-green',
    extra: 'Valor total rutas',
  },
])

type DetalleRuta = {
  placa: string
  zona: string
  clientes: number
  peso: number
  valor: number
}

const dialogDetalle = ref(false)

const detalleSeleccionado = ref<any>(null)

const detalle = ref<DetalleRuta[]>([])

const valorPorZona = computed(() => {
  const zonas: Record<string, number> = {}

  detalle.value.forEach((item) => {
    const zona = item.zona || 'SIN ZONA'

    if (!zonas[zona]) {
      zonas[zona] = 0
    }

    zonas[zona] += Number(item.valor || 0)
  })

  return zonas
})

const detalleChartData = computed(() => {
  if (!detalleSeleccionado.value) {
    return {
      labels: [],
      datasets: [],
    }
  }

  let valor = 0
  let color = '#42A5F5'

  if (indicadorActivo.value === 'clientes') {
    valor = Number(detalleSeleccionado.value.clientes || 0)
    color = '#1976D2'
  }

  if (indicadorActivo.value === 'peso') {
    valor = Number(detalleSeleccionado.value.peso || 0)
    color = '#2E7D32'
  }

  if (indicadorActivo.value === 'valor') {
    valor = Number(detalleSeleccionado.value.valor || 0)
    color = '#FB8C00'
  }

  return {
    labels: ['Valor', 'Resto'],

    datasets: [
      {
        data: [valor, valor * 0.25],

        backgroundColor: [color, '#2A2A40'],

        borderWidth: 0,

        hoverOffset: 15,
      },
    ],
  }
})
const detalleChartOptions = {
  responsive: true,

  maintainAspectRatio: false,

  plugins: {
    legend: {
      position: 'bottom' as const,
    },
  },
}

const chartOptions = {
  responsive: true,

  maintainAspectRatio: false,

  indexAxis: 'y' as const,

  layout: {
    padding: {
      right: 80,
    },
  },

  plugins: {
    legend: {
      display: false,
    },

    datalabels: {
      anchor: 'end' as const,

      align: 'end' as const,

      offset: 8,

      color: '#ffffff',

      font: {
        weight: 'bold' as const,
        size: 12,
      },

      formatter: (value: number) => {
        if (tipoGrafico.value === 'valor') {
          return '$' + Math.round(value).toLocaleString('es-CO')
        }

        if (tipoGrafico.value === 'peso') {
          return value.toLocaleString('es-CO') + ' kg'
        }

        return value.toLocaleString('es-CO')
      },
    },
  },

  scales: {
    x: {
      ticks: {
        color: '#ffffff',
      },
    },

    y: {
      ticks: {
        color: '#ffffff',
      },
    },
  },
}

const indicadorActivo = ref<'clientes' | 'peso' | 'valor'>('clientes')
const tipoGrafico = ref('clientes')
const graficoActual = computed(() => {
  const datos = [...detalle.value]

  // Agrupar por placa
  const agrupado: Record<string, any> = {}

  datos.forEach((item) => {
    if (!agrupado[item.placa]) {
      agrupado[item.placa] = {
        placa: item.placa,
        clientes: 0,
        peso: 0,
        valor: 0,
      }
    }

    agrupado[item.placa].clientes += Number(item.clientes || 0)
    agrupado[item.placa].peso += Number(item.peso || 0)
    agrupado[item.placa].valor += Number(item.valor || 0)
  })

  const datosAgrupados = Object.values(agrupado).sort((a: any, b: any) => {
    if (tipoGrafico.value === 'clientes') {
      return b.clientes - a.clientes
    }

    if (tipoGrafico.value === 'peso') {
      return b.peso - a.peso
    }

    return b.valor - a.valor
  })

  if (tipoGrafico.value === 'zona') {
    const zonas: Record<string, number> = {}

    datos.forEach((item) => {
      const zona = item.zona || 'SIN ZONA'

      if (!zonas[zona]) {
        zonas[zona] = 0
      }

      zonas[zona] += Number(item.valor || 0)
    })

    const ordenado = Object.entries(zonas).sort((a, b) => b[1] - a[1])
    console.log(detalle.value.slice(0, 13))
    return {
      labels: ordenado.map((z) => z[0]),

      datasets: [
        {
          label: 'Valor por Zona',

          data: ordenado.map((z) => z[1]),

          borderRadius: 8,

          backgroundColor: '#9C27B0',
        },
      ],
    }
  }

  let color = '#1976D2'
  let etiqueta = 'Clientes'

  if (tipoGrafico.value === 'peso') {
    color = '#2E7D32'
    etiqueta = 'Peso'
  }

  if (tipoGrafico.value === 'valor') {
    color = '#FB8C00'
    etiqueta = 'Valor'
  }

  return {
    labels: datosAgrupados.map((item: any) => item.placa),
    datasets: [
      {
        label: etiqueta,

        data: datosAgrupados.map((item: any) => {
          if (tipoGrafico.value === 'clientes') {
            return item.clientes
          }

          if (tipoGrafico.value === 'peso') {
            return item.peso
          }

          return item.valor
        }),

        backgroundColor: color,

        borderRadius: 8,
      },
    ],
  }
})
const tipoFiltro = ref('dia')

const fecha = ref('')
const semana = ref('')
const mes = ref('')

const ordenDias = ['DOMINGO', 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO']

const normalizar = (texto: string) =>
  texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()

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
    const params = new URLSearchParams()

    params.append('tipo', tipoFiltro.value)

    if (tipoFiltro.value === 'dia' && fecha.value) {
      params.append('fecha', fecha.value)
    }

    if (tipoFiltro.value === 'semana' && semana.value) {
      params.append('semana', semana.value)
    }

    if (tipoFiltro.value === 'mes' && mes.value) {
      params.append('mes', mes.value)
    }

    const data = await fetchJSON<DashboardPrincipalResponse>(
      `http://localhost:3333/api/v1/dashboard/principal?${params}`,
    )

    dashboardCards.value[0]!.value = data.kpis.totalRutas
    dashboardCards.value[1]!.value = data.kpis.totalClientes
    dashboardCards.value[2]!.value = data.kpis.totalDinero

    detalle.value = data.detalle
  } catch (error) {
    console.error('Error dashboard:', error)
  }
}

const abrirDetalle = (item: any) => {
  detalleSeleccionado.value = item

  dialogDetalle.value = true
}

onMounted(() => {
  cargarDashboard()
})

const headersTabla = computed(() => {
  const headers: any[] = []

  if (tipoFiltro.value === 'dia') {
    headers.push({
      title: 'Fecha',
      key: 'fecha',
    })
  }

  if (tipoFiltro.value === 'semana') {
    headers.push({
      title: 'Semana',
      key: 'semana',
    })
  }

  if (tipoFiltro.value === 'mes') {
    headers.push({
      title: 'Mes',
      key: 'mes',
    })
  }

  headers.push(
    { title: 'Placa', key: 'placa' },
    { title: 'Zona', key: 'zona' },
    { title: 'Clientes', key: 'clientes' },
    { title: 'Peso', key: 'peso' },
    { title: 'Valor', key: 'valor' },
  )

  return headers
})
</script>

<template>
  <v-container>
    <h2 class="text-h5 font-weight-bold mb-4">Dashboard Logístico</h2>
    <v-row class="mb-4">
      <v-col cols="12">
        <v-btn-toggle
          v-model="tipoFiltro"
          mandatory
          color="primary"
          @update:model-value="cargarDashboard"
        >
          <v-btn value="dia"> Día </v-btn>

          <v-btn value="semana"> Semana </v-btn>

          <v-btn value="mes"> Mes </v-btn>
        </v-btn-toggle>
      </v-col>

      <!-- FILTRO DÍA -->
      <v-col cols="12" md="3" v-if="tipoFiltro === 'dia'">
        <v-text-field v-model="fecha" type="date" label="Fecha" @change="cargarDashboard" />
      </v-col>

      <!-- FILTRO SEMANA -->
      <v-col cols="12" md="3" v-if="tipoFiltro === 'semana'">
        <v-text-field
          v-model="semana"
          label="Semana"
          type="number"
          min="1"
          max="53"
          @change="cargarDashboard"
        />
      </v-col>

      <!-- FILTRO MES -->
      <v-col cols="12" md="3" v-if="tipoFiltro === 'mes'">
        <v-select
          v-model="mes"
          label="Mes"
          :items="[
            'ENERO',
            'FEBRERO',
            'MARZO',
            'ABRIL',
            'MAYO',
            'JUNIO',
            'JULIO',
            'AGOSTO',
            'SEPTIEMBRE',
            'OCTUBRE',
            'NOVIEMBRE',
            'DICIEMBRE',
          ]"
          @update:model-value="cargarDashboard"
        />
      </v-col>
    </v-row>
    <v-row class="mt-5">
      <v-col cols="12">
        <v-card rounded="xl" elevation="10">
          <v-card-title> Analisis Operativo </v-card-title>
          <v-card-subtitle class="pb-4">
            <v-btn
              color="primary"
              size="large"
              prepend-icon="mdi-chart-box"
              @click="dialogDetalle = true"
            >
              Analizar Operación
            </v-btn>
          </v-card-subtitle>
          <v-data-table :items="detalle" :headers="headersTabla">
            <template #item.peso="{ item }">
              {{ Number(item.peso || 0).toLocaleString('es-CO') }} kg
            </template>

            <template #item.valor="{ item }">
              $
              {{ Math.round(Number(item.valor || 0)).toLocaleString('es-CO') }}
            </template>
          </v-data-table>
          <v-dialog v-model="dialogDetalle" max-width="1700" height="90vh">
            <v-card rounded="xl">
              <v-card-title class="text-h5"> Analisis Operativo </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12">
                    <v-btn-toggle v-model="tipoGrafico" mandatory color="primary">
                      <v-btn value="clientes"> Clientes </v-btn>

                      <v-btn value="peso"> Peso </v-btn>

                      <v-btn value="valor"> Valor </v-btn>

                      <v-btn value="zona"> Zona </v-btn>
                    </v-btn-toggle>
                  </v-col>
                </v-row>

                <v-row class="mt-4">
                  <v-col cols="12">
                    <v-card rounded="xl" elevation="6" class="pa-4" min-height="600">
                      <div style="height: 500px">
                        <Bar :data="graficoActual" :options="chartOptions" />
                      </div>
                    </v-card>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-dialog>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
/* KPI */
.dashboard-card {
  transition: 0.3s;
  color: white;
}

.dashboard-card:hover {
  transform: translateY(-4px);
}

.chart-container {
  height: 350px;
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

.donut-center {
  position: absolute;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  text-align: center;

  pointer-events: none;
}
</style>
