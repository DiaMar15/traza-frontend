<script setup lang="ts">
import { Bar } from 'vue-chartjs'

defineProps<{
  vehiculosChartData: any
  zonasChartData: any
  chartOptions: any
}>()
</script>

<template>
  <!-- ==========================================
       RANKINGS OPERATIVOS
  ========================================== -->

  <v-divider class="my-6" />

  <div class="d-flex flex-column flex-md-row align-md-center ga-3 mb-4">
    <div class="d-flex align-center">
      <v-icon color="primary" class="me-3" size="32"> mdi-chart-bar </v-icon>

      <div>
        <h2 class="text-h5 font-weight-bold">Rankings Operativos</h2>

        <div class="text-medium-emphasis">
          Comparativo de vehículos y zonas con mayor kilometraje.
        </div>
      </div>
    </div>
  </div>

  <v-row class="mt-4">
    <!-- VEHÍCULOS -->

    <v-col cols="12" xl="6">
      <v-card rounded="xl" elevation="6" class="pa-4 h-100">
        <div class="text-h6 font-weight-bold mb-1">🚛 Ranking de Vehículos</div>

        <div class="text-caption text-medium-emphasis mb-4">
          Top 13 vehículos con mayor kilometraje del período.
        </div>

        <div class="chart-container">
          <Bar :data="vehiculosChartData" :options="chartOptions" />
        </div>
      </v-card>
    </v-col>

    <!-- ZONAS -->

    <v-col cols="12" xl="6">
      <v-card rounded="xl" elevation="6" class="pa-4 h-100">
        <div class="text-h6 font-weight-bold mb-1">📍 Ranking de Zonas</div>

        <div class="text-caption text-medium-emphasis mb-4">
          Top 13 zonas con mayor kilometraje del período.
        </div>

        <div class="chart-container">
          <Bar :data="zonasChartData" :options="chartOptions" />
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
  height: 360px;
}

@media (max-width: 1280px) {
  .chart-container {
    height: 320px;
  }
}

@media (max-width: 960px) {
  .chart-container {
    height: 280px;
  }
}
</style>
