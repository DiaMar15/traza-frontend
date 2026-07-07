<script setup lang="ts">
defineProps<{
  totalKm: number
  totalRutas: number
  promedioTiempo: number
  efectividad: number
}>()
</script>

<template>
  <v-row class="mb-6">
    <v-col cols="12" md="3">
      <v-card class="pa-4 card-blue">
        <div class="text-subtitle-2">Total Km</div>

        <div class="text-h4 font-weight-bold">
          {{ totalKm }}
        </div>
      </v-card>
    </v-col>

    <v-col cols="12" md="3">
      <v-card class="pa-4 card-purple">
        <div class="text-subtitle-2">Total Rutas</div>

        <div class="text-h4 font-weight-bold">
          {{ totalRutas }}
        </div>
      </v-card>
    </v-col>

    <v-col cols="12" md="3">
      <v-card class="pa-4 card-dark">
        <div class="text-subtitle-2">Tiempo Promedio</div>

        <div class="text-h4 font-weight-bold">{{ promedioTiempo }} min</div>
      </v-card>
    </v-col>

    <v-col cols="12" md="3">
      <v-card class="pa-4 card-green">
        <div class="text-subtitle-2">Efectividad</div>

        <div class="text-h4 font-weight-bold">{{ efectividad }}%</div>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped>
.card-blue {
  background: linear-gradient(135deg, #1e3c72, #2a5298);
  color: white;
}

.card-purple {
  background: linear-gradient(135deg, #42275a, #734b6d);
  color: white;
}

.card-dark {
  background: #1e1e1e;
  color: white;
}

.card-green {
  background: linear-gradient(135deg, #1b5e20, #43a047);
  color: white;
}
</style>
