<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  periodo: 'diario' | 'semanal' | 'mensual'
  dia: string
  semana: number | null
  mes: string
  totalRutas: number
  totalVehiculos: number
}>()

const descripcionPeriodo = computed(() => {
  switch (props.periodo) {
    case 'diario':
      return props.dia

    case 'semanal':
      return `Semana ${props.semana ?? '-'}`

    case 'mensual':
      return props.mes

    default:
      return ''
  }
})
</script>

<template>
  <div class="d-flex flex-column flex-lg-row justify-space-between align-lg-center ga-3 mb-6">
    <div>
      <div class="d-flex align-center">
        <v-icon color="primary" size="36" class="me-3"> mdi-chart-line </v-icon>

        <h1 class="text-h4 font-weight-bold">Dashboard de Rendimiento</h1>
      </div>

      <p class="text-medium-emphasis mt-2 mb-1">Análisis operativo del período seleccionado.</p>

      <div class="text-body-2 text-grey">
        {{ descripcionPeriodo }}
        •
        {{ totalRutas }} rutas • {{ totalVehiculos }} vehículos
      </div>
    </div>

    <v-chip color="primary" variant="tonal" size="large"> {{ totalVehiculos }} vehículos </v-chip>
  </div>
</template>

<style scoped>
.text-grey {
  color: rgb(var(--v-theme-on-surface));
  opacity: 0.65;
}
</style>
