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
  <div class="mb-6">
    <h1 class="text-h4 font-weight-bold">📊 Dashboard de Rendimiento</h1>

    <p class="text-medium-emphasis mt-2">Análisis operativo del período seleccionado.</p>

    <div class="text-body-2 text-grey mt-2">
      {{ descripcionPeriodo }}
      •
      {{ totalRutas }} rutas • {{ totalVehiculos }} vehículos
    </div>
  </div>
</template>

<style scoped>
.text-grey {
  color: rgb(var(--v-theme-on-surface));
  opacity: 0.65;
}
</style>
