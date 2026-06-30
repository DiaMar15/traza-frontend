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
  <v-container fluid class="py-2">
    <!-- =======================
         HEADER
    ======================== -->

    <div class="d-flex align-center justify-space-between mb-4">
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

    <PersonalTabla :trabajadores="trabajadoresFiltrados" />

    <!-- =======================
         MODALES
    ======================== -->

    <PersonalDetalleModal
      v-model="mostrarNoCumplen"
      titulo="Trabajadores que NO cumplen la jornada laboral"
      :trabajadores="data.detalleNoCumplen || []"
      tipo="negativas"
    />

    <PersonalDetalleModal
      v-model="mostrarHorasExtra"
      titulo="Trabajadores con horas extras"
      :trabajadores="data.detalleHorasExtra || []"
      tipo="extras"
    />
  </v-container>
</template>

<style scoped>
/* ALERTAS */
.mini-alert {
  font-size: 11px;
}

/* KPI */

.mini-card {
  min-height: 82px;

  padding: 14px;

  display: flex;

  align-items: center;

  color: white;

  transition: 0.25s;
}

.mini-card:hover {
  transform: translateY(-2px);
}

/* ICONOS */

.icon-box {
  width: 34px;

  height: 34px;

  border-radius: 10px;

  display: flex;

  align-items: center;

  justify-content: center;

  background: rgba(255, 255, 255, 0.15);

  flex-shrink: 0;
}

/* TEXTOS KPI */

.mini-title {
  font-size: 11px;

  font-weight: 700;
}

.mini-number {
  font-size: 22px;

  font-weight: 700;
}

.mini-subtitle {
  font-size: 10px;

  opacity: 0.8;
}

/* CARD PERSONAL */

.personal-card {
  background: linear-gradient(135deg, rgba(40, 40, 40, 0.95), rgba(28, 28, 28, 0.95));

  border: 1px solid rgba(255, 255, 255, 0.05);

  color: white;

  padding: 14px;

  min-height: 160px;

  transition: 0.2s;

  display: flex;

  flex-direction: column;

  justify-content: space-between;
}

.personal-card:hover {
  transform: translateY(-3px);

  border: 1px solid rgba(255, 255, 255, 0.12);
}

/* AVATAR */

.avatar-box {
  width: 34px;

  height: 34px;

  border-radius: 10px;

  display: flex;

  align-items: center;

  justify-content: center;

  background: rgba(255, 255, 255, 0.08);

  flex-shrink: 0;
}

/* NOMBRE COMPLETO */

.nombre {
  font-size: 13px;

  font-weight: 700;

  line-height: 1.3;

  word-break: break-word;

  white-space: normal;

  overflow: visible;

  text-overflow: unset;

  color: white;
}

/* DETALLE */

.detalle {
  font-size: 10px;

  opacity: 0.7;

  margin-top: 2px;
}

/* GRID INFO */

.info-grid {
  display: grid;

  grid-template-columns: 1fr 1fr;

  gap: 10px;

  margin-top: 14px;
}

/* BOX INFO */

.info-box {
  background: rgba(255, 255, 255, 0.03);

  border-radius: 10px;

  padding: 10px;

  min-height: 60px;

  display: flex;

  flex-direction: column;

  justify-content: center;
}

/* LABEL */

.info-label {
  font-size: 10px;

  opacity: 0.7;
}

/* VALUE */

.info-value {
  font-size: 16px;

  font-weight: 700;

  margin-top: 2px;
}

/* COLORES */

.text-red {
  color: #ff5252;
}

.text-orange {
  color: #ff9800;
}

.text-green {
  color: #4caf50;
}

/* COLORES KPI */

.card-blue {
  background: linear-gradient(135deg, #304ffe, #6200ea);
}

.card-green {
  background: linear-gradient(135deg, #00a32a, #00c853);
}

.card-orange {
  background: linear-gradient(135deg, #ef6c00, #ff9100);
}

.card-purple {
  background: linear-gradient(135deg, #9c27b0, #e100ff);
}

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
