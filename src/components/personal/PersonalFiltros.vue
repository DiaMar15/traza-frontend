<script setup lang="ts">
const fecha = defineModel<string>('fecha', { default: '' })

const semana = defineModel<number | null>('semana', { default: null })

const mes = defineModel<string>('mes', { default: '' })

const cargo = defineModel<string>('cargo', { default: 'Todos' })

const buscar = defineModel<string>('buscar', { default: '' })

defineProps<{
  periodo: 'diario' | 'semanal' | 'mensual'
  semanas: number[]
  meses: string[]
  cargos: string[]
}>()
</script>
<template>
  <v-row class="mb-6" align="center">
    <v-col cols="12" sm="6" md="4" lg="3">
      <v-text-field
        v-if="periodo === 'diario'"
        v-model="fecha"
        type="date"
        label="Fecha"
        prepend-inner-icon="mdi-calendar"
        variant="outlined"
        density="comfortable"
        hide-details
      />

      <v-select
        v-else-if="periodo === 'semanal'"
        v-model="semana"
        :items="semanas"
        label="Semana"
        prepend-inner-icon="mdi-calendar-week"
        variant="outlined"
        density="comfortable"
        hide-details
      />

      <v-select
        v-else
        v-model="mes"
        :items="meses"
        label="Mes"
        prepend-inner-icon="mdi-calendar-month"
        variant="outlined"
        density="comfortable"
        hide-details
      />
    </v-col>

    <v-col cols="12" sm="6" md="4" lg="3">
      <v-select
        v-model="cargo"
        :items="cargos"
        label="Cargo"
        prepend-inner-icon="mdi-account-group"
        variant="outlined"
        density="comfortable"
        hide-details
      />
    </v-col>

    <v-col cols="12" md="8" lg="6">
      <v-text-field
        v-model="buscar"
        label="Buscar trabajador"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        density="comfortable"
        clearable
        hide-details
      />
    </v-col>
  </v-row>
</template>
