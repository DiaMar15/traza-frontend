<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

import PersonalKPIs from '@/components/personal/PersonalKPIs.vue'
import PersonalIndicadores from '@/components/personal/PersonalIndicadores.vue'
import PersonalFiltros from '@/components/personal/PersonalFiltros.vue'
import PersonalDetalleModal from '@/components/personal/modals/PersonalDetalleModal.vue'
import PersonalTabla from '@/components/personal/PersonalTabla.vue'

import {
  obtenerPersonalSemanal,
  obtenerPersonalDiario,
  obtenerPersonalMensual,
} from '@/services/personalService'

/* ==========================
   DATA
========================== */

const data = ref<any>({})
const loading = ref(false)

/* ==========================
   MODALES
========================== */

const mostrarNoCumplen = ref(false)
const mostrarHorasExtra = ref(false)

/* ==========================
   PERÍODO
========================== */

const periodo = ref<'diario' | 'semanal' | 'mensual'>('semanal')

/* ==========================
   FILTROS
========================== */

const fecha = ref('')
const semana = ref<number | null>(null)
const mes = ref('')
const cargo = ref('Todos')
const buscar = ref('')

/* ==========================
   LISTAS
========================== */

const cargos = ['Todos', 'Conductores', 'Auxiliares', 'Supernumerarios']

const meses = [
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
]

const semanas = ref<number[]>([])

/* ==========================
   MAPA CARGOS
========================== */

const mapaCargo: Record<string, string> = {
  Todos: '',
  Conductores: 'CONDUCTOR',
  Auxiliares: 'AUXILIAR',
  Supernumerarios: 'SUPERNUMERARIO',
}

/* ==========================
   COMPUTED
========================== */

const trabajadoresFiltrados = computed(() => {
  let trabajadores = data.value.horasPersonal || []

  const cargoFiltro = mapaCargo[cargo.value]

  if (cargoFiltro) {
    trabajadores = trabajadores.filter((trabajador: any) =>
      trabajador.cargo?.toUpperCase().includes(cargoFiltro),
    )
  }

  if (buscar.value.trim()) {
    const texto = buscar.value.trim().toUpperCase()

    trabajadores = trabajadores.filter((trabajador: any) =>
      trabajador.nombre?.toUpperCase().includes(texto),
    )
  }

  return trabajadores
})

const textoPeriodo = computed(() => {
  const formatearFecha = (fecha?: string) => {
    if (!fecha) {
      return ''
    }

    const partes = fecha.split('/')

    if (partes.length !== 3) {
      return fecha
    }

    const [mes = '', dia = '', anio = ''] = partes

    return `${dia.padStart(2, '0')}/${mes.padStart(2, '0')}/${anio}`
  }

  if (periodo.value === 'diario') {
    return formatearFecha(data.value.fecha)
  }

  if (periodo.value === 'semanal') {
    if (!data.value.fechaInicio || !data.value.fechaFin) {
      return `Semana ${data.value.semana}`
    }

    return `Semana ${data.value.semana} • ${formatearFecha(data.value.fechaInicio)} al ${formatearFecha(data.value.fechaFin)}`
  }

  return data.value.mes || ''
})

/* ==========================
   CARGAR INFORMACIÓN
========================== */

async function cargarPersonal() {
  loading.value = true

  try {
    if (periodo.value === 'diario') {
      if (!fecha.value) return

      data.value = await obtenerPersonalDiario(fecha.value)
    }

    if (periodo.value === 'semanal') {
      data.value = await obtenerPersonalSemanal(semana.value ?? undefined)

      if (data.value.semanas) {
        semanas.value = data.value.semanas
      }

      if (!semana.value) {
        semana.value = data.value.semana
      }
    }

    if (periodo.value === 'mensual') {
      if (!mes.value) {
        mes.value = meses[new Date().getMonth()] ?? ''
      }

      data.value = await obtenerPersonalMensual(mes.value)
    }
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

/* ==========================
   INICIALIZACIÓN
========================== */

onMounted(() => {
  fecha.value = new Date().toISOString().slice(0, 10)

  cargarPersonal()
})

/* ==========================
   WATCHS
========================== */

watch(periodo, () => {
  if (periodo.value === 'diario' && !fecha.value) {
    fecha.value = new Date().toISOString().slice(0, 10)
  }

  if (periodo.value === 'mensual' && !mes.value) {
    mes.value = meses[new Date().getMonth()] ?? ''
  }

  cargarPersonal()
})

watch(fecha, () => {
  if (periodo.value === 'diario') {
    cargarPersonal()
  }
})

watch(semana, (nuevaSemana) => {
  if (periodo.value === 'semanal' && nuevaSemana !== null) {
    cargarPersonal()
  }
})

watch(mes, (nuevoMes) => {
  if (periodo.value === 'mensual' && nuevoMes) {
    cargarPersonal()
  }
})
</script>

<template>
  <v-container fluid class="pa-4 pa-md-6">
    <!-- =======================
         HEADER
    ======================== -->

    <div class="d-flex align-center">
      <v-icon color="primary" size="34" class="me-3"> mdi-account-group </v-icon>

      <div>
        <h2 class="text-h5 font-weight-bold">Personal Operativo</h2>

        <div class="text-caption text-grey">Seguimiento laboral del personal</div>
      </div>

      <v-chip color="primary" size="large" class="semana-chip">
        <template v-if="periodo === 'diario'">
          {{ data.fecha }}
        </template>

        <template v-else-if="periodo === 'semanal'"> Semana {{ data.semana }} </template>

        <template v-else>
          {{ data.mes }}
        </template>
      </v-chip>
    </div>

    <!-- =======================
         TABS
    ======================== -->

    <v-tabs v-model="periodo" color="primary" grow class="mb-4">
      <v-tab value="diario">
        <v-icon start>mdi-calendar-today</v-icon>
        Diario
      </v-tab>

      <v-tab value="semanal">
        <v-icon start>mdi-calendar-week</v-icon>
        Semanal
      </v-tab>

      <v-tab value="mensual">
        <v-icon start>mdi-calendar-month</v-icon>
        Mensual
      </v-tab>
    </v-tabs>

    <!-- =======================
         FILTROS
    ======================== -->

    <PersonalFiltros
      v-model:fecha="fecha"
      v-model:semana="semana"
      v-model:mes="mes"
      v-model:cargo="cargo"
      v-model:buscar="buscar"
      :periodo="periodo"
      :semanas="semanas"
      :meses="meses"
      :cargos="cargos"
    />
    <!-- =======================
         CONTENIDO
    ======================== -->

    <PersonalKPIs
      :conductores="data.conductores"
      :auxiliares="data.auxiliares"
      :supernumerarios="data.supernumerarios"
      :retirados="data.retirados"
    />

    <PersonalIndicadores
      :cumplen-jornada="data.cumplenJornada"
      :no-cumplen-jornada="data.noCumplenJornada"
      :trabajadores-con-horas-extra="data.trabajadoresConHorasExtra"
      :total-horas="data.totalHoras"
      :promedio-horas="data.promedioHoras"
      @ver-no-cumplen="mostrarNoCumplen = true"
      @ver-horas-extra="mostrarHorasExtra = true"
    />

    <PersonalTabla :trabajadores="trabajadoresFiltrados" :periodo="textoPeriodo" />
    <!-- =======================
         MODALES
    ======================== -->

    <PersonalDetalleModal
      v-model="mostrarNoCumplen"
      titulo="Trabajadores que NO cumplen la jornada laboral"
      :periodo="textoPeriodo"
      :trabajadores="data.detalleNoCumplen || []"
      tipo="negativas"
    />

    <PersonalDetalleModal
      v-model="mostrarHorasExtra"
      titulo="Trabajadores con horas extras"
      :periodo="textoPeriodo"
      :trabajadores="data.detalleHorasExtra || []"
      tipo="extras"
    />
  </v-container>
</template>

<style scoped>
/* RESPONSIVE */

@media (max-width: 960px) {
  .personal-card {
    min-height: auto;
  }

  .nombre {
    font-size: 12px;
  }

  .info-value {
    font-size: 14px;
  }
}
</style>
