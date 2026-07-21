<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Bar } from 'vue-chartjs'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import GoogleSheetsService from '@/services/googleSheetsService'
import { API } from '@/config/api'

const googleSheetsService = new GoogleSheetsService()
const loading = ref(false)
async function syncRutas() {
  try {
    loading.value = true

    const response = await googleSheetsService.sincronizarRutas()

    dialogoMensaje.value = response.message

    dialogoColor.value = 'success'

    dialogoIcono.value = 'mdi-check-circle'

    mostrarDialogo.value = true

    await cargarDashboard()
  } catch (error) {
    console.error(error)

    dialogoMensaje.value = 'No fue posible sincronizar Google Sheets.'

    dialogoColor.value = 'error'

    dialogoIcono.value = 'mdi-alert-circle'

    mostrarDialogo.value = true
  } finally {
    loading.value = false
  }
}
const mostrarDialogo = ref(false)

const dialogoMensaje = ref('')

const dialogoColor = ref<'success' | 'error'>('success')

const dialogoIcono = ref('')

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, ChartDataLabels)

type DashboardPrincipalResponse = {
  vistaGeneral: boolean

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

type DetalleRuta = {
  placa: string
  zona: string

  fecha?: string
  semana?: string | number
  mes?: string

  clientes: number
  peso: number
  valor: number
}

const dialogDetalle = ref(false)

const detalle = ref<DetalleRuta[]>([])

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

      color: '#039BE5',

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
        color: '#039BE5',
      },
    },

    y: {
      ticks: {
        color: '#039BE5',
      },
    },
  },
}

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

  /* --------------------------
     VALOR POR ZONA
  -------------------------- */

  if (tipoGrafico.value === 'zona') {
    const zonas: Record<string, number> = {}

    datos.forEach((item) => {
      const zona = item.zona || 'SIN ZONA'

      if (!zonas[zona]) {
        zonas[zona] = 0
      }

      zonas[zona] += Number(item.valor || 0)
    })

    let ordenado = Object.entries(zonas).sort((a, b) => b[1] - a[1])

    // Solo limitar cuando se está viendo el total general
    if (vistaGeneral.value) {
      ordenado = ordenado.slice(0, 15)
    }

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

  /* --------------------------
     CLIENTES / PESO / VALOR
  -------------------------- */

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
const semana = ref<number | null>(null)
const mes = ref('')
const semanas = ref<number[]>([])
const vistaGeneral = ref(false)

/* --------------------------
   FETCH
-------------------------- */

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url)

  if (!res.ok) throw new Error(url)

  return await res.json()
}

async function cargarSemanas() {
  try {
    const data = await fetchJSON<{
      semana: number
      semanas: number[]
    }>(`${API}/dashboard/semanas`)

    semanas.value = data.semanas

    if (!semana.value && data.semana) {
      semana.value = data.semana
    }
  } catch (error) {
    console.error('Error cargando semanas:', error)
  }
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
      params.append('semana', `${semana.value}`)
    }

    if (tipoFiltro.value === 'mes' && mes.value) {
      params.append('mes', mes.value)
    }

    const data = await fetchJSON<DashboardPrincipalResponse>(`${API}/dashboard/principal?${params}`)
    vistaGeneral.value = data.vistaGeneral

    detalle.value = data.detalle
  } catch (error) {
    console.error('Error dashboard:', error)
  }
}

onMounted(async () => {
  await cargarSemanas()

  await cargarDashboard()
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
    headers.push(
      {
        title: 'Semana',
        key: 'semana',
      },
      {
        title: 'Fecha',
        key: 'fecha',
      },
    )
  }

  if (tipoFiltro.value === 'mes') {
    headers.push(
      {
        title: 'Mes',
        key: 'mes',
      },
      {
        title: 'Fecha',
        key: 'fecha',
      },
    )
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
  <v-container fluid class="pa-4 pa-md-6">
    <!-- ENCABEZADO -->
    <div class="d-flex flex-column flex-md-row justify-space-between align-md-center ga-3 mb-5">
      <h2 class="text-h5 font-weight-bold">Dashboard Logístico</h2>

      <v-btn
        color="success"
        prepend-icon="mdi-sync"
        :loading="loading"
        size="large"
        class="text-none"
        @click="syncRutas"
      >
        Sincronizar Google Sheets
      </v-btn>
    </div>

    <v-dialog v-model="mostrarDialogo" max-width="500" persistent>
      <v-card rounded="xl">
        <v-card-text class="text-center pa-8">
          <v-icon :icon="dialogoIcono" :color="dialogoColor" size="70" class="mb-4" />

          <div class="text-h5 font-weight-bold mb-3">
            {{
              dialogoColor === 'success' ? '¡Sincronización completada!' : 'Error al sincronizar'
            }}
          </div>

          <div class="text-body-1 mb-6">
            {{ dialogoMensaje }}
          </div>

          <v-btn :color="dialogoColor" size="large" rounded="lg" @click="mostrarDialogo = false">
            Aceptar
          </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-row class="mb-6" align="center">
      <v-col cols="12" lg="8">
        <v-btn-toggle
          class="flex-wrap"
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
      <v-col v-if="tipoFiltro === 'dia'" cols="12" sm="6" md="4" lg="3">
        <v-text-field
          v-model="fecha"
          type="date"
          label="Fecha"
          variant="outlined"
          density="comfortable"
          hide-details
          prepend-inner-icon="mdi-calendar"
          @change="cargarDashboard"
        />
      </v-col>

      <!-- FILTRO SEMANA -->
      <v-col v-if="tipoFiltro === 'semana'" cols="12" sm="6" md="4" lg="3">
        <v-select
          v-model="semana"
          :items="semanas"
          label="Semana"
          prepend-inner-icon="mdi-calendar-week"
          variant="outlined"
          density="comfortable"
          hide-details
          @update:model-value="cargarDashboard"
        />
      </v-col>

      <!-- FILTRO MES -->
      <v-col v-if="tipoFiltro === 'mes'" cols="12" sm="6" md="4" lg="3">
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
          prepend-inner-icon="mdi-calendar-month"
          variant="outlined"
          density="comfortable"
          hide-details
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

          <v-data-table class="tabla-dashboard" :items="detalle" :headers="headersTabla">
            <template #item.fecha="{ item }">
              {{ item.fecha ? new Date(item.fecha).toLocaleDateString('es-CO') : '' }}
            </template>

            <template #item.peso="{ item }">
              {{ Number(item.peso || 0).toLocaleString('es-CO') }} kg
            </template>

            <template #item.valor="{ item }">
              $
              {{ Math.round(Number(item.valor || 0)).toLocaleString('es-CO') }}
            </template>
          </v-data-table>

          <v-dialog v-model="dialogDetalle" width="95%" max-width="1500" max-height="90vh">
            <v-card rounded="xl">
              <v-card-title class="text-h5"> Analisis Operativo </v-card-title>

              <v-card-text>
                <v-row>
                  <v-col cols="12">
                    <v-btn-toggle class="flex-wrap" v-model="tipoGrafico" mandatory color="primary">
                      <v-btn value="clientes">Clientes</v-btn>

                      <v-btn value="peso">Peso</v-btn>

                      <v-btn value="valor">Valor</v-btn>

                      <v-btn value="zona">Zona</v-btn>
                    </v-btn-toggle>
                  </v-col>
                </v-row>

                <v-row class="mt-4">
                  <v-col cols="12">
                    <v-card rounded="xl" elevation="6" class="pa-4" min-height="520">
                      <div class="chart-wrapper">
                        <Bar :data="graficoActual" :options="chartOptions" />
                      </div>
                    </v-card>
                  </v-col>
                </v-row>
              </v-card-text>

              <!-- BOTÓN CERRAR -->
              <v-card-actions>
                <v-spacer />

                <v-btn
                  variant="tonal"
                  color="red"
                  prepend-icon="mdi-close"
                  @click="dialogDetalle = false"
                >
                  Cerrar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<style scoped>
.tabla-dashboard :deep(thead th) {
  background-color: #0f77ff !important;
  color: white !important;
  font-weight: bold !important;
}

.tabla-dashboard :deep(thead tr) {
  background-color: #3b64e7 !important;
}

.chart-wrapper {
  height: 500px;
}

@media (max-width: 1280px) {
  .chart-wrapper {
    height: 420px;
  }
}

@media (max-width: 960px) {
  .chart-wrapper {
    height: 360px;
  }
}
</style>
