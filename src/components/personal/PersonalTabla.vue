<script setup lang="ts">
interface Trabajador {
  nombre: string
  cargo: string
  rutas: number
  horas: number
  extras: number
  negativas: number
}

interface Props {
  trabajadores: Trabajador[]
  periodo?: string
}

const props = defineProps<Props>()
const headers = [
  {
    title: 'Trabajador',
    key: 'nombre',
  },
  {
    title: 'Cargo',
    key: 'cargo',
  },
  {
    title: 'Rutas',
    key: 'rutas',
  },
  {
    title: 'Horas trabajadas',
    key: 'horas',
  },
  {
    title: 'Extras',
    key: 'extras',
  },
  {
    title: 'Faltantes',
    key: 'negativas',
  },
]

function colorCargo(cargo: string) {
  const texto = cargo.toUpperCase()

  if (texto.includes('CONDUCTOR')) return 'primary'

  if (texto.includes('AUXILIAR')) return 'success'

  if (texto.includes('SUPERNUMERARIO')) return 'orange'

  return 'grey'
}
</script>

<template>
  <v-card rounded="xl" elevation="6" class="mt-5">
    <v-card-title class="d-flex justify-space-between align-start">
      <div>
        <div class="text-h6 font-weight-bold">Personal operativo</div>

        <div v-if="props.periodo" class="text-subtitle-2 text-grey-darken-1 mt-1">
          {{ props.periodo }}
        </div>
      </div>

      <v-chip color="primary" variant="tonal">
        {{ props.trabajadores.length }} trabajadores
      </v-chip>
    </v-card-title>

    <v-divider />

    <v-data-table
      class="tabla-personal"
      :headers="headers"
      :items="trabajadores"
      items-per-page="10"
      density="comfortable"
    >
      <!-- Trabajador -->

      <template #item.nombre="{ item }">
        <strong>
          {{ item.nombre }}
        </strong>
      </template>

      <!-- Cargo -->

      <template #item.cargo="{ item }">
        <v-chip :color="colorCargo(item.cargo)" size="small" variant="elevated">
          {{ item.cargo }}
        </v-chip>
      </template>

      <!-- Horas -->

      <template #item.horas="{ item }"> {{ item.horas }} h </template>

      <!-- Extras -->

      <template #item.extras="{ item }">
        <v-chip v-if="item.extras > 0" color="yellow" variant="elevated">
          +{{ item.extras }} h
        </v-chip>

        <span v-else>—</span>
      </template>

      <!-- Negativas -->

      <template #item.negativas="{ item }">
        <v-chip v-if="item.negativas > 0" color="red" variant="elevated">
          -{{ item.negativas }} h
        </v-chip>

        <span v-else>—</span>
      </template>
    </v-data-table>
  </v-card>
</template>

<style scoped>
.tabla-personal :deep(thead th) {
  background-color: #1b63ff !important;
  color: white !important;
  font-weight: bold !important;
}

.tabla-personal :deep(thead tr) {
  background-color: #1b63ff !important;
}
</style>
