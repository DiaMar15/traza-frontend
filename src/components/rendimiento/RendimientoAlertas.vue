<script setup lang="ts">
defineProps<{
  vehiculoMayorKm: any
  vehiculoMenorKm: any
  zonaMayorKm: any
}>()
</script>

<template>
  <div class="mb-6">
    <h3 class="text-h6 font-weight-bold mb-4">🚨 Alertas del Período</h3>

    <v-row>
      <!-- MAYOR KM -->
      <v-col cols="12" md="4">
        <v-alert type="success" variant="tonal" border="start" rounded="lg">
          <strong>Mayor kilometraje</strong>

          <div v-if="vehiculoMayorKm" class="mt-3 text-body-1">
            <strong>{{ vehiculoMayorKm.placa }}</strong>

            recorrió

            <strong class="text-success"> {{ vehiculoMayorKm.km }} km </strong>
          </div>
        </v-alert>
      </v-col>

      <!-- MENOR KM -->
      <v-col cols="12" md="4">
        <v-alert type="warning" variant="tonal" border="start" rounded="lg">
          <strong>Menor kilometraje</strong>

          <div v-if="vehiculoMenorKm" class="mt-3 text-body-1">
            <strong>{{ vehiculoMenorKm.placa }}</strong>

            realizó solamente

            <strong class="text-warning"> {{ vehiculoMenorKm.kilometros }} km </strong>
          </div>
        </v-alert>
      </v-col>

      <!-- ZONA -->
      <v-col cols="12" md="4">
        <v-alert type="info" variant="tonal" border="start" rounded="lg">
          <strong>Zona con mayor kilometraje</strong>

          <div v-if="zonaMayorKm" class="mt-3 text-body-1">
            <strong>{{ zonaMayorKm.zona }}</strong>

            acumuló

            <strong class="text-info"> {{ zonaMayorKm.total }} km </strong>
          </div>
        </v-alert>
      </v-col>
    </v-row>
  </div>
</template>
