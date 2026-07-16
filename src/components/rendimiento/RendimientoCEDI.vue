<script setup lang="ts">
import { computed } from 'vue'

type TiempoVehiculo = {
  placa: string
  tiempo: number
}

type TiempoZona = {
  zona: string
  tiempo: number
}

const props = defineProps<{
  tiempoCediAmVehiculos: TiempoVehiculo[]
  tiempoCediPmVehiculos: TiempoVehiculo[]
  tiempoCediAmZona: TiempoZona[]
  tiempoCediPmZona: TiempoZona[]
}>()

/* ==========================================
   VEHÍCULOS
========================================== */

const vehiculos = computed(() => {
  const mapa = new Map<
    string,
    {
      placa: string
      am: number | null
      pm: number | null
    }
  >()

  props.tiempoCediAmVehiculos.forEach((item) => {
    mapa.set(item.placa, {
      placa: item.placa,
      am: item.tiempo,
      pm: null,
    })
  })

  props.tiempoCediPmVehiculos.forEach((item) => {
    const existente = mapa.get(item.placa)

    if (existente) {
      existente.pm = item.tiempo
    } else {
      mapa.set(item.placa, {
        placa: item.placa,
        am: null,
        pm: item.tiempo,
      })
    }
  })

  return [...mapa.values()]
})

/* ==========================================
   ZONAS
========================================== */

const zonas = computed(() => {
  const mapa = new Map<
    string,
    {
      zona: string
      am: number | null
      pm: number | null
    }
  >()

  props.tiempoCediAmZona.forEach((item) => {
    mapa.set(item.zona, {
      zona: item.zona,
      am: item.tiempo,
      pm: null,
    })
  })

  props.tiempoCediPmZona.forEach((item) => {
    const existente = mapa.get(item.zona)

    if (existente) {
      existente.pm = item.tiempo
    } else {
      mapa.set(item.zona, {
        zona: item.zona,
        am: null,
        pm: item.tiempo,
      })
    }
  })

  return [...mapa.values()]
})
</script>

<template>
  <!-- ==========================================
       INDICADORES CEDI
  ========================================== -->

  <v-divider class="my-6" />

  <div class="d-flex flex-column flex-md-row align-md-center ga-3 mb-4">
    <div class="d-flex align-center">
      <v-icon color="primary" class="me-3" size="32"> mdi-office-building </v-icon>

      <div>
        <h2 class="text-h5 font-weight-bold">Indicadores CEDI</h2>

        <div class="text-medium-emphasis">
          Comparativo de tiempos registrados durante la jornada AM y PM.
        </div>
      </div>
    </div>
  </div>

  <v-row>
    <!-- ==========================================
         VEHÍCULOS
    ========================================== -->

    <v-col cols="12" xl="6">
      <v-card rounded="xl" elevation="6" class="pa-4 h-100">
        <div class="d-flex flex-column flex-sm-row justify-space-between align-sm-center ga-3 mb-4">
          <div class="text-h6 font-weight-bold">🚛 Tiempo CEDI por Vehículo</div>

          <v-chip color="primary" variant="tonal"> {{ vehiculos.length }} vehículos </v-chip>
        </div>

        <div class="tabla-cedi">
          <div class="overflow-x-auto">
            <v-table density="compact">
              <thead>
                <tr>
                  <th>Vehículo</th>

                  <th class="text-center">AM</th>

                  <th class="text-center">PM</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="item in vehiculos" :key="item.placa">
                  <td>{{ item.placa }}</td>

                  <td class="text-center">
                    <v-chip v-if="item.am !== null" color="warning" size="small" variant="tonal">
                      {{ item.am }} min
                    </v-chip>

                    <v-chip v-else color="grey" size="small" variant="outlined"> N/D </v-chip>
                  </td>

                  <td class="text-center">
                    <v-chip v-if="item.pm !== null" color="primary" size="small" variant="tonal">
                      {{ item.pm }} min
                    </v-chip>

                    <v-chip v-else color="grey" size="small" variant="outlined"> N/D </v-chip>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </div>
        </div>
      </v-card>
    </v-col>

    <!-- ==========================================
         ZONAS
    ========================================== -->

    <v-col cols="12" xl="6">
      <v-card rounded="xl" elevation="6" class="pa-4 h-100">
        <div class="d-flex flex-column flex-sm-row justify-space-between align-sm-center ga-3 mb-4">
          <div class="text-h6 font-weight-bold">📍 Tiempo CEDI por Zona</div>

          <v-chip color="primary" variant="tonal"> {{ zonas.length }} zonas </v-chip>
        </div>

        <div class="tabla-cedi">
          <div class="overflow-x-auto">
            <v-table density="compact">
              <thead>
                <tr>
                  <th>Zona</th>

                  <th class="text-center">AM</th>

                  <th class="text-center">PM</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="item in zonas" :key="item.zona">
                  <td>{{ item.zona }}</td>

                  <td class="text-center">
                    <v-chip v-if="item.am !== null" color="warning" size="small" variant="tonal">
                      {{ item.am }} min
                    </v-chip>

                    <v-chip v-else color="grey" size="small" variant="outlined"> N/D </v-chip>
                  </td>

                  <td class="text-center">
                    <v-chip v-if="item.pm !== null" color="primary" size="small" variant="tonal">
                      {{ item.pm }} min
                    </v-chip>

                    <v-chip v-else color="grey" size="small" variant="outlined"> N/D </v-chip>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </div>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped>
.tabla-cedi {
  max-height: 340px;
  overflow-y: auto;
}

.overflow-x-auto {
  overflow-x: auto;
}
</style>
