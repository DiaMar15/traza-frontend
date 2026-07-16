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
    <v-col cols="12" sm="6" xl="3">
      <v-card class="pa-4 card-blue h-100" rounded="xl" elevation="6">
        <div class="d-flex justify-space-between align-center">
          <div>
            <div class="text-subtitle-2">Total Km</div>

            <div class="text-h4 font-weight-bold mt-2">
              {{ totalKm }}
            </div>
          </div>

          <v-icon size="42"> mdi-road-variant </v-icon>
        </div>
      </v-card>
    </v-col>

    <v-col cols="12" sm="6" xl="3">
      <v-card class="pa-4 card-purple h-100" rounded="xl" elevation="6">
        <div class="d-flex justify-space-between align-center">
          <div>
            <div class="text-subtitle-2">Total Rutas</div>

            <div class="text-h4 font-weight-bold mt-2">
              {{ totalRutas }}
            </div>
          </div>

          <v-icon size="42"> mdi-map-marker-path </v-icon>
        </div>
      </v-card>
    </v-col>

    <v-col cols="12" sm="6" xl="3">
      <v-card class="pa-4 card-dark h-100" rounded="xl" elevation="6">
        <div class="d-flex justify-space-between align-center">
          <div>
            <div class="text-subtitle-2">Tiempo Promedio</div>

            <div class="text-h4 font-weight-bold mt-2">{{ promedioTiempo }} min</div>
          </div>

          <v-icon size="42"> mdi-timer-outline </v-icon>
        </div>
      </v-card>
    </v-col>

    <v-col cols="12" sm="6" xl="3">
      <v-card class="pa-4 card-green h-100" rounded="xl" elevation="6">
        <div class="d-flex justify-space-between align-center">
          <div>
            <div class="text-subtitle-2">Efectividad</div>

            <div class="text-h4 font-weight-bold mt-2">{{ efectividad }}%</div>
          </div>

          <v-icon size="42"> mdi-chart-line </v-icon>
        </div>
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

.v-card {
  transition: transform 0.2s ease;
}

.v-card:hover {
  transform: translateY(-3px);
}
</style>
