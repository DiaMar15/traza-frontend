<script setup lang="ts">
defineProps<{
  vehiculoMayorKm: any
  vehiculoMenorKm: any
  zonaMayorKm: any
}>()
</script>

<template>
  <div class="mb-4">
    <h3 class="text-h6 font-weight-bold mb-4">🚨 Alertas del Período</h3>

    <v-row>
      <!-- MAYOR KM -->
      <v-col cols="12" md="4">
        <v-alert type="success" variant="tonal" border="start">
          <strong>Mayor kilometraje</strong>

          <div class="mt-2" v-if="vehiculoMayorKm">
            {{ vehiculoMayorKm.placa }}

            recorrió

            <strong>{{ vehiculoMayorKm.km }} km</strong>
          </div>
        </v-alert>
      </v-col>

      <!-- MENOR KM -->
      <v-col cols="12" md="4">
        <v-alert type="warning" variant="tonal" border="start">
          <strong>Menor kilometraje</strong>

          <div class="mt-2" v-if="vehiculoMenorKm">
            {{ vehiculoMenorKm.placa }}

            realizó solamente

            <strong>{{ vehiculoMenorKm.km }} km</strong>
          </div>
        </v-alert>
      </v-col>

      <!-- ZONA -->
      <v-col cols="12" md="4">
        <v-alert type="info" variant="tonal" border="start">
          <strong>Zona con mayor kilometraje</strong>

          <div class="mt-2" v-if="zonaMayorKm">
            {{ zonaMayorKm.zona }}

            acumuló

            <strong>{{ zonaMayorKm.total }} km</strong>
          </div>
        </v-alert>
      </v-col>
    </v-row>
  </div>
</template>
