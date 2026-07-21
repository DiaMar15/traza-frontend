<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { API } from '@/config/api'

type CostoRuta = {
  fecha: string
  placa: string
  ruta: string
  zona: string
  tarifa: number
  total_kilometros: number
  combustible: number
  peajes: number
  calibrada: number
  parqueadero: number
  taxis: number
  estado: string
}

const costos = ref<CostoRuta[]>([])
const dialogPerdidas = ref(false)
const filtros = ref({
  desde: '',
  hasta: '',
  placa: '',
  ruta: '',
})

function money(valor: number) {
  return Number(valor || 0).toLocaleString('es-CO')
}

/* =========================
   FETCH
========================= */

async function cargar() {
  const res = await fetch(`${API}/dashboard/costos-detalle`)
  const data = await res.json()
  costos.value = Array.isArray(data)
    ? data.map((i: any) => ({
        fecha: i.fecha ?? '',
        placa: i.placa ?? '',
        ruta: i.ruta ?? '',
        zona: i.zona ?? '',
        tarifa: Number(i.tarifa) || 0,
        total_kilometros: Number(i.total_kilometros) || 0,
        combustible: Number(i.combustible) || 0,
        peajes: Number(i.peajes) || 0,
        calibrada: Number(i.calibrada) || 0,
        parqueadero: Number(i.parqueadero) || 0,
        taxis: Number(i.taxis) || 0,

        estado:
          (Number(i.combustible) || 0) +
            (Number(i.peajes) || 0) +
            (Number(i.calibrada) || 0) +
            (Number(i.parqueadero) || 0) +
            (Number(i.taxis) || 0) >
          (Number(i.tarifa) || 0)
            ? 'Sobrecosto'
            : 'Rentable',
      }))
    : []
}

onMounted(cargar)

/* =========================
   FILTROS
========================= */

const placas = computed(() => [...new Set(costos.value.map((i) => i.placa))])

const costosFiltrados = computed(() => {
  return costos.value.filter((item) => {
    const p = item.fecha.split('/')

    if (p.length !== 3) return false

    const fechaItem = new Date(Number(p[2]), Number(p[0]) - 1, Number(p[1]))

    const desde = filtros.value.desde ? new Date(filtros.value.desde) : null

    const hasta = filtros.value.hasta ? new Date(filtros.value.hasta + 'T23:59:59') : null

    return (
      (!desde || fechaItem >= desde) &&
      (!hasta || fechaItem <= hasta) &&
      (!filtros.value.placa || item.placa === filtros.value.placa) &&
      (!filtros.value.ruta || item.ruta.toLowerCase().includes(filtros.value.ruta.toLowerCase()))
    )
  })
})

/* =========================
   TOTALES
========================= */
const totales = computed(() => {
  let tarifa = 0
  let km = 0
  let combustible = 0
  let peajes = 0
  let calibrada = 0
  let parqueadero = 0
  let taxis = 0

  costosFiltrados.value.forEach((i) => {
    tarifa += i.tarifa || 0

    km += i.total_kilometros > 0 ? i.total_kilometros : 0

    combustible += i.combustible
    peajes += i.peajes
    calibrada += i.calibrada
    parqueadero += i.parqueadero
    taxis += i.taxis
  })

  return {
    tarifa,
    km,
    combustible,
    peajes,
    calibrada,
    parqueadero,
    taxis,
    total: combustible + peajes + calibrada + parqueadero + taxis,
  }
})

const costoPorKm = computed(() =>
  totales.value.km > 0 ? totales.value.total / totales.value.km : 0,
)
const rutasConPerdida = computed(() => {
  return costosFiltrados.value.filter((ruta) => {
    const costoTotal =
      ruta.combustible + ruta.peajes + ruta.calibrada + ruta.parqueadero + ruta.taxis

    return costoTotal > ruta.tarifa
  })
})

const sobreCostoTotal = computed(() => {
  return rutasConPerdida.value.reduce((acc, ruta) => {
    const costoTotal =
      ruta.combustible + ruta.peajes + ruta.calibrada + ruta.parqueadero + ruta.taxis

    return acc + (costoTotal - ruta.tarifa)
  }, 0)
})

const topRutasSobrecosto = computed(() => {
  return [...rutasConPerdida.value]
    .map((ruta) => ({
      ...ruta,

      perdida:
        ruta.combustible +
        ruta.peajes +
        ruta.calibrada +
        ruta.parqueadero +
        ruta.taxis -
        ruta.tarifa,
    }))
    .sort((a, b) => b.perdida - a.perdida)
    .slice(0, 5)
})

/* =========================
   ANALÍTICAS
========================= */

const rankingVehiculos = computed(() => {
  const map = new Map<string, number>()

  costosFiltrados.value.forEach((i) => {
    const total = i.combustible + i.peajes + i.calibrada + i.parqueadero + i.taxis

    map.set(i.placa, (map.get(i.placa) || 0) + total)
  })

  return Array.from(map.entries())
    .map(([placa, total]) => ({
      placa,
      total,
    }))
    .sort((a, b) => b.total - a.total)
})

const rankingRutas = computed(() => {
  const map = new Map<string, number>()

  costosFiltrados.value.forEach((i) => {
    const total = i.combustible + i.peajes + i.calibrada + i.parqueadero + i.taxis

    map.set(i.ruta, (map.get(i.ruta) || 0) + total)
  })

  return Array.from(map.entries())
    .map(([ruta, total]) => ({
      ruta,
      total,
    }))
    .sort((a, b) => b.total - a.total)
})

const maxCostoVehiculo = computed(() => Math.max(...rankingVehiculos.value.map((v) => v.total), 1))

function limpiarFiltros() {
  filtros.value = {
    desde: '',
    hasta: '',
    placa: '',
    ruta: '',
  }
}

const tieneSobrecosto = (item: CostoRuta) => {
  const total = item.combustible + item.peajes + item.calibrada + item.parqueadero + item.taxis

  return total > item.tarifa
}
const mayorPerdida = computed(() => {
  return topRutasSobrecosto.value.length > 0 ? topRutasSobrecosto.value[0]!.perdida : 1
})

/* =========================
   HEADERS
========================= */

const headers = [
  { title: 'Fecha', key: 'fecha' },
  { title: 'Placa', key: 'placa' },
  { title: 'Ruta', key: 'ruta' },
  { title: 'Tarifa', key: 'tarifa' },
  { title: 'Combustible', key: 'combustible' },
  { title: 'Peajes', key: 'peajes' },
  { title: 'Calibrada', key: 'calibrada' },
  { title: 'Parqueadero', key: 'parqueadero' },
  { title: 'Taxis', key: 'taxis' },
  { title: 'Total', key: 'total' },
  { title: 'Estado', key: 'estado' },
]

const headersPerdidas = [
  { title: 'Fecha', key: 'fecha' },
  { title: 'Placa', key: 'placa' },
  { title: 'Ruta', key: 'ruta' },
  { title: 'Tarifa', key: 'tarifa' },
  { title: 'Costo', key: 'costo' },
  { title: 'Pérdida', key: 'perdida' },
]
</script>

<template>
  <v-container fluid class="pa-4 pa-md-6">
    <div class="d-flex flex-column flex-md-row justify-space-between align-md-center ga-3 mb-6">
      <div class="d-flex align-center">
        <v-icon color="primary" size="34" class="me-3"> mdi-cash-multiple </v-icon>

        <div>
          <h2 class="text-h5 font-weight-bold">Costos por Ruta</h2>

          <div class="text-medium-emphasis">Control de costos operativos por ruta.</div>
        </div>
      </div>
    </div>

    <!-- FILTROS -->
    <v-card class="pa-4 mb-4" rounded="xl" elevation="8">
      <v-row>
        <v-col cols="12" sm="6" md="4" lg="3">
          <v-text-field
            v-model="filtros.desde"
            type="date"
            label="Desde"
            variant="outlined"
            density="compact"
          />
        </v-col>

        <v-col cols="12" sm="6" md="4" lg="3">
          <v-text-field
            v-model="filtros.hasta"
            type="date"
            label="Hasta"
            variant="outlined"
            density="compact"
          />
        </v-col>

        <v-col cols="12" sm="6" md="4" lg="3">
          <v-select
            v-model="filtros.placa"
            :items="placas"
            label="Placa"
            variant="outlined"
            density="compact"
          />
        </v-col>

        <v-col cols="12" sm="6" md="4" lg="3">
          <v-text-field v-model="filtros.ruta" label="Ruta" variant="outlined" density="compact" />
        </v-col>

        <v-col cols="12">
          <v-btn
            color="red"
            prepend-icon="mdi-filter-remove"
            size="large"
            rounded="lg"
            @click="limpiarFiltros"
          >
            Limpiar filtros
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <!-- KPIs -->
    <v-row class="mb-4">
      <!-- TARIFA -->
      <v-col cols="12" sm="6" md="4" lg="3">
        <v-card class="pa-3 compact-card card-blue" rounded="xl" elevation="8">
          <div class="d-flex align-center ga-3">
            <div class="icon-box blue-box">
              <v-icon icon="mdi-cash" size="18" />
            </div>

            <div>
              <div class="text-caption font-weight-bold">Tarifa</div>

              <div class="text-subtitle-1 font-weight-bold">${{ money(totales.tarifa) }}</div>
            </div>
          </div>
        </v-card>
      </v-col>
      <!-- COMBUSTIBLE -->
      <v-col cols="12" md="3">
        <v-card class="pa-2 compact-card card-orange" rounded="xl" elevation="8">
          <div class="d-flex align-center ga-3">
            <div class="icon-box orange-box">
              <v-icon icon="mdi-fuel" size="18" />
            </div>

            <div>
              <div class="text-caption font-weight-bold">Combustible</div>

              <div class="text-subtitle-1 font-weight-bold">${{ money(totales.combustible) }}</div>
            </div>
          </div>
        </v-card>
      </v-col>

      <!-- PEAJES -->
      <v-col cols="12" md="3">
        <v-card class="pa-2 compact-card card-purple" rounded="xl" elevation="8">
          <div class="d-flex align-center ga-3">
            <div class="icon-box purple-box">
              <v-icon icon="mdi-boom-gate-outline" size="18" />
            </div>

            <div>
              <div class="text-caption font-weight-bold">Peajes</div>

              <div class="text-subtitle-1 font-weight-bold">${{ money(totales.peajes) }}</div>
            </div>
          </div>
        </v-card>
      </v-col>

      <!-- TOTAL -->
      <v-col cols="12" md="3">
        <v-card class="pa-2 compact-card card-green" rounded="xl" elevation="8">
          <div class="d-flex align-center ga-3">
            <div class="icon-box green-box">
              <v-icon icon="mdi-cash-multiple" size="18" />
            </div>

            <div>
              <div class="text-caption font-weight-bold">Total</div>

              <div class="text-subtitle-1 font-weight-bold">${{ money(totales.total) }}</div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- ALERTAS -->
    <v-row class="mb-2">
      <v-col cols="12" md="6">
        <v-alert
          :type="rutasConPerdida.length > 0 ? 'error' : 'success'"
          variant="tonal"
          density="compact"
          rounded="lg"
          class="cursor-pointer"
          @click="dialogPerdidas = true"
        >
          <div class="font-weight-medium">
            🚨 {{ rutasConPerdida.length }}
            rutas superaron la tarifa asignada
          </div>

          <div style="font-size: 11px; opacity: 0.7">Dar clic para ver más detalles</div>
        </v-alert>
      </v-col>

      <v-col cols="auto">
        <v-alert type="success" variant="tonal" density="compact" rounded="lg">
          💰 Costo promedio:
          <strong>${{ money(costoPorKm) }}</strong>
          por km
        </v-alert>
      </v-col>
    </v-row>
    <!-- TABLA -->

    <v-card rounded="xl" elevation="8">
      <div class="overflow-x-auto">
        <v-data-table
          :headers="headers"
          :items="costosFiltrados"
          :items-per-page="10"
          hover
          density="comfortable"
          class="tabla-costos"
        >
          <template #item.placa="{ item }">
            <v-chip color="primary" variant="flat" size="small">
              {{ item.placa }}
            </v-chip>
          </template>

          <template #item.ruta="{ item }">
            <v-chip color="brown" variant="flat" size="small"> Ruta {{ item.ruta }} </v-chip>
          </template>

          <template #item.combustible="{ item }">
            <v-chip color="teal lighten-1" variant="flat" size="small">
              ${{ money(item.combustible) }}
            </v-chip>
          </template>

          <template #item.tarifa="{ item }">
            <v-chip color="orange" variant="flat" size="small"> ${{ money(item.tarifa) }} </v-chip>
          </template>

          <template #item.peajes="{ item }">
            <v-chip color="blue-grey darken-2" variant="flat" size="small">
              ${{ money(item.peajes) }}
            </v-chip>
          </template>
          <template #item.total="{ item }">
            <v-chip color="yellow" variant="flat" size="small">
              ${{
                money(
                  item.combustible + item.peajes + item.calibrada + item.parqueadero + item.taxis,
                )
              }}
            </v-chip>
          </template>

          <template #item.estado="{ item }">
            <v-chip
              :color="item.estado === 'Sobrecosto' ? 'red' : 'success'"
              variant="flat"
              size="small"
            >
              {{ item.estado }}
            </v-chip>
          </template>
        </v-data-table>
      </div>
    </v-card>

    <!-- RANKINGS -->
    <v-row class="mt-5">
      <!-- VEHÍCULOS -->
      <v-col cols="12" xl="4">
        <v-card class="pa-4 top-card" rounded="xl" elevation="8">
          <div class="d-flex align-center justify-space-between mb-4">
            <h3 class="text-subtitle-1 font-weight-bold text-white">Vehículos más costosos</h3>

            <v-chip color="yellow" variant="flat" size="small"> Top 5 </v-chip>
          </div>

          <div v-for="(v, index) in rankingVehiculos.slice(0, 5)" :key="v.placa" class="mb-4">
            <div class="d-flex justify-space-between align-center">
              <div class="d-flex align-center ga-2">
                <v-avatar size="22" color="white">
                  <span class="text-primary font-weight-bold">
                    {{ index + 1 }}
                  </span>
                </v-avatar>

                <span class="text-body-2 text-white font-weight-bold">
                  {{ v.placa }}
                </span>
              </div>

              <v-chip color="yellow" variant="flat" size="small"> ${{ money(v.total) }} </v-chip>
            </div>
          </div>
        </v-card>
      </v-col>

      <!-- SOBRECOSTO -->
      <v-col cols="12" xl="4">
        <v-card class="pa-4 top-card" rounded="xl" elevation="8">
          <div class="d-flex align-center justify-space-between mb-4">
            <h3 class="text-subtitle-1 font-weight-bold text-white">Rutas con mayor sobrecosto</h3>

            <v-chip color="yellow" variant="flat" size="small"> Top 5 </v-chip>
          </div>

          <div v-for="(ruta, index) in topRutasSobrecosto" :key="index" class="mb-4">
            <div class="d-flex justify-space-between align-center">
              <div class="d-flex align-center ga-2">
                <v-avatar size="22" color="white">
                  <span class="text-primary font-weight-bold">
                    {{ index + 1 }}
                  </span>
                </v-avatar>

                <span class="text-body-2 text-white font-weight-bold"> Ruta {{ ruta.ruta }} </span>
              </div>

              <v-chip color="yellow" variant="flat" size="small">
                ${{ money(ruta.perdida) }}
              </v-chip>
            </div>
          </div>
        </v-card>
      </v-col>

      <!-- RUTAS -->
      <v-col ccols="12" xl="4">
        <v-card class="pa-4 top-card" rounded="xl" elevation="8">
          <div class="d-flex align-center justify-space-between mb-4">
            <h3 class="text-subtitle-1 font-weight-bold text-white">Rutas más costosas</h3>

            <v-chip color="yellow" variant="flat" size="small"> Top 5 </v-chip>
          </div>

          <div v-for="(r, index) in rankingRutas.slice(0, 5)" :key="r.ruta" class="mb-4">
            <div class="d-flex justify-space-between align-center">
              <div class="d-flex align-center ga-2">
                <v-avatar size="22" color="white">
                  <span class="text-primary font-weight-bold">
                    {{ index + 1 }}
                  </span>
                </v-avatar>

                <span class="text-body-2 text-white font-weight-bold"> Ruta {{ r.ruta }} </span>
              </div>

              <v-chip color="yellow" variant="flat" size="small"> ${{ money(r.total) }} </v-chip>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="dialogPerdidas" width="95%" max-width="1200" persistent>
      <v-card rounded="xl">
        <v-card-title class="text-h5"> Rutas con Sobrecosto </v-card-title>

        <v-card-subtitle> Sobrecosto acumulado: ${{ money(sobreCostoTotal) }} </v-card-subtitle>

        <v-card-text>
          <div class="overflow-x-auto">
            <v-data-table
              class="tabla-costos"
              :headers="headersPerdidas"
              :items="
                rutasConPerdida.map((ruta) => {
                  const costo =
                    ruta.combustible + ruta.peajes + ruta.calibrada + ruta.parqueadero + ruta.taxis

                  return {
                    ...ruta,
                    costo,
                    perdida: costo - ruta.tarifa,
                  }
                })
              "
            >
              <template #item.tarifa="{ item }"> ${{ money(item.tarifa) }} </template>

              <template #item.costo="{ item }">
                <v-chip color="lime accent-2" variant="flat">${{ money(item.costo) }} </v-chip>
              </template>

              <template #item.perdida="{ item }">
                <v-chip color="red" variant="flat"> ${{ money(item.perdida) }} </v-chip>
              </template>
            </v-data-table>
          </div>
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn color="primary" size="large" rounded="lg" @click="dialogPerdidas = false">
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
/* GLASS */
.glass-card {
  background: linear-gradient(135deg, rgba(35, 35, 35, 0.96), rgba(25, 25, 25, 0.96));

  border: 1px solid rgba(255, 255, 255, 0.05);

  color: white;

  backdrop-filter: blur(10px);
}

/* CARDS */
.compact-card {
  min-height: 78px;

  display: flex;
  align-items: center;

  transition: 0.2s;

  color: white;
}

.compact-card:hover {
  transform: translateY(-2px);
}

/* ICON BOX */
.icon-box {
  width: 34px;
  height: 34px;

  border-radius: 10px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: white;

  flex-shrink: 0;
}

.blue-box {
  background: rgba(255, 255, 255, 0.18);
}

.orange-box {
  background: rgba(255, 255, 255, 0.18);
}

.purple-box {
  background: rgba(255, 255, 255, 0.18);
}

.green-box {
  background: rgba(255, 255, 255, 0.18);
}

/* KPI COLORS */
.card-blue {
  background: linear-gradient(135deg, #1565c0, #1e88e5);
}

.card-orange {
  background: linear-gradient(135deg, #ef6c00, #fb8c00);
}

.card-purple {
  background: linear-gradient(135deg, #6a1b9a, #8e24aa);
}

.card-green {
  background: linear-gradient(135deg, #2e7d32, #43a047);
}

/* TABLA */
.tabla-costos :deep(thead) {
  background: #0228ff;
}

.tabla-costos :deep(thead th) {
  color: white !important;
  font-weight: 700 !important;
  border-bottom: 2px solid #0062ff;
}

.tabla-costos :deep(tbody tr:nth-child(even)) {
  background: rgba(255, 255, 255, 0.02);
}

.tabla-costos :deep(tbody tr:hover) {
  background: rgba(255, 255, 255, 0.05);
}

.filtros-card {
  background: rgb(121, 121, 121) !important;
}

.top-card {
  background: #0260ca !important;

  color: white;
  transition: 0.25s;
}

.top-card:hover {
  transform: translateY(-4px);
}

.overflow-x-auto {
  overflow-x: auto;
}

.tabla-costos {
  min-width: 1200px;
}

@media (max-width: 960px) {
  .compact-card {
    min-height: 90px;
  }

  .icon-box {
    width: 38px;
    height: 38px;
  }
}
</style>
