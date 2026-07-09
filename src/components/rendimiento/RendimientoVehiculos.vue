<script setup lang="ts">
defineProps<{
  headers: any[]
  vehiculos: any[]
  colorTiempo: (valor: number) => string
  colorEfectividad: (valor: number) => string
}>()

function formatearTiempo(minutos: number) {
  const horas = Math.floor(minutos / 60)

  const minutosRestantes = minutos % 60

  if (minutosRestantes === 0) {
    return `${horas} h`
  }

  return `${horas} h ${minutosRestantes} min`
}
</script>

<template>
  <v-divider class="my-6" />

  <div class="d-flex align-center justify-space-between mb-4">
    <div class="d-flex align-center">
      <v-icon color="primary" class="me-3" size="32"> mdi-truck </v-icon>

      <div>
        <h2 class="text-h5 font-weight-bold">Rendimiento por Vehículo</h2>

        <div class="text-medium-emphasis">Detalle operativo del período seleccionado.</div>
      </div>
    </div>

    <v-chip color="primary" variant="tonal"> {{ vehiculos.length }} vehículos </v-chip>
  </div>

  <v-card elevation="2">
    <v-data-table
      class="tabla-rendimiento"
      :headers="headers"
      :items="vehiculos"
      :items-per-page="10"
      density="compact"
    >
      <template #item.km="{ item }">
        <strong>{{ item.km }} km</strong>
      </template>

      <template #item.tiempo="{ item }">
        <v-chip :color="colorTiempo(item.tiempo)" size="small" variant="elevated">
          {{ formatearTiempo(item.tiempo) }}
        </v-chip>
      </template>

      <template #item.efectividad="{ item }">
        <v-chip :color="colorEfectividad(item.efectividad)" size="small" variant="elevated">
          {{ item.efectividad }}%
        </v-chip>
      </template>
    </v-data-table>
  </v-card>
</template>

<style scoped>
.tabla-rendimiento :deep(thead th) {
  background: #1b7dec !important;
  color: white !important;
  font-weight: bold !important;
}
</style>
