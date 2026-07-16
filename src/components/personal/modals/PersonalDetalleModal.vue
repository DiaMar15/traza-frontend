<script setup lang="ts">
import { computed, ref } from 'vue'

interface Trabajador {
  nombre: string
  cargo: string
  horas: number
  extras?: number
  negativas?: number
}

interface Props {
  modelValue: boolean
  titulo: string
  periodo?: string
  trabajadores: Trabajador[]
  tipo: 'extras' | 'negativas'
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const buscar = ref('')

const trabajadoresFiltrados = computed(() => {
  if (!buscar.value) {
    return props.trabajadores
  }

  return props.trabajadores.filter((t) =>
    t.nombre.toLowerCase().includes(buscar.value.toLowerCase()),
  )
})

const headers = computed(() => [
  {
    title: 'Trabajador',
    key: 'nombre',
  },
  {
    title: 'Cargo',
    key: 'cargo',
  },
  {
    title: 'Horas',
    key: 'horas',
  },
  {
    title: props.tipo === 'extras' ? 'Horas extras' : 'Horas faltantes',
    key: 'valor',
  },
])

function cerrar() {
  emit('update:modelValue', false)
}

function colorCargo(cargo: string) {
  const texto = cargo.toUpperCase()

  if (texto.includes('CONDUCTOR')) return 'primary'

  if (texto.includes('AUXILIAR')) return 'success'

  if (texto.includes('SUPERNUMERARIO')) return 'orange'

  return 'grey'
}
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    width="95%"
    max-width="950"
    persistent
    @update:model-value="cerrar"
  >
    <v-card rounded="xl">
      <v-card-title
        class="d-flex flex-column flex-md-row justify-space-between align-md-center ga-3"
      >
        <div>
          <div class="text-h6 font-weight-bold">
            {{ titulo }}
          </div>

          <div v-if="props.periodo" class="text-subtitle-2 text-grey mt-1">
            {{ props.periodo }}
          </div>
        </div>

        <v-btn icon="mdi-close" variant="text" @click="cerrar" />
      </v-card-title>

      <v-divider />

      <v-card-text>
        <div class="d-flex flex-column flex-md-row justify-space-between align-md-center ga-3 mb-4">
          <v-text-field
            v-model="buscar"
            label="Buscar trabajador"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="comfortable"
            clearable
            hide-details
            style="min-width: 250px; max-width: 350px"
          />

          <v-chip color="primary" variant="tonal">
            {{ trabajadoresFiltrados.length }}
            trabajadores
          </v-chip>
        </div>

        <div class="overflow-x-auto">
          <v-data-table
            class="tabla-detalle"
            :headers="headers"
            :items="trabajadoresFiltrados"
            density="comfortable"
            :items-per-page="10"
          >
            <template #item.cargo="{ item }">
              <v-chip
                :color="colorCargo(item.cargo)"
                size="small"
                variant="flat"
                class="text-black"
              >
                {{ item.cargo }}
              </v-chip>
            </template>

            <template #item.horas="{ item }"> {{ item.horas }} h </template>

            <template #item.valor="{ item }">
              <v-chip v-if="tipo === 'extras'" color="yellow" variant="flat">
                +{{ item.extras }} h
              </v-chip>

              <v-chip v-else color="red" variant="flat"> -{{ item.negativas }} h </v-chip>
            </template>
          </v-data-table>
        </div>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4 justify-end">
        <v-btn color="red" variant="tonal" size="large" rounded="lg" @click="cerrar">
          Cerrar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.overflow-x-auto {
  overflow-x: auto;
}

.tabla-detalle {
  min-width: 850px;
}
</style>
