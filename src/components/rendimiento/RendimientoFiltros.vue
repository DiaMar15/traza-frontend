<script setup lang="ts">
const periodo = defineModel<'diario' | 'semanal' | 'mensual'>('periodo', {
  default: 'semanal',
})

const dia = defineModel<string>('dia', {
  default: '',
})

const semana = defineModel<number | null>('semana', {
  default: null,
})

const mes = defineModel<string>('mes', {
  default: '',
})

defineProps<{
  semanas: number[]
  meses: string[]
}>()

const periodos = [
  {
    title: 'Diario',
    value: 'diario',
  },
  {
    title: 'Semanal',
    value: 'semanal',
  },
  {
    title: 'Mensual',
    value: 'mensual',
  },
]
</script>

<template>
  <v-row class="mb-5">
    <v-col cols="12" md="3">
      <v-select
        v-model="periodo"
        :items="['diario', 'semanal', 'mensual']"
        label="Período"
        prepend-inner-icon="mdi-calendar-range"
        hide-details
      />
    </v-col>

    <v-col cols="12" md="3">
      <v-text-field
        v-if="periodo === 'diario'"
        v-model="dia"
        type="date"
        label="Fecha"
        hide-details
      />

      <v-select
        v-else-if="periodo === 'semanal'"
        v-model="semana"
        :items="semanas"
        label="Semana"
        prepend-inner-icon="mdi-calendar-week"
        hide-details
      />

      <v-select
        v-else
        v-model="mes"
        :items="meses"
        label="Mes"
        prepend-inner-icon="mdi-calendar-month"
        hide-details
      />
    </v-col>
  </v-row>
</template>
