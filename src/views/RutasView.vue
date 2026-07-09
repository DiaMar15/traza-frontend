<script setup lang="ts">
import TablaRutas from '@/components/TablaRutas.vue'

import { ref } from 'vue'

import GoogleSheetsService from '@/services/googleSheetsService'

const googleSheetsService = new GoogleSheetsService()
const tabla = ref<InstanceType<typeof TablaRutas> | null>(null)
const loading = ref(false)
const dialogo = ref(false)

const dialogoTitulo = ref('')

const dialogoMensaje = ref('')

const dialogoColor = ref<'success' | 'error'>('success')

const dialogoIcono = ref('')

function recargarTabla() {
  tabla.value?.cargarRutas()
}

async function syncRutas() {
  try {
    loading.value = true

    const response = await googleSheetsService.sincronizarRutas()

    dialogoTitulo.value = 'Sincronización completada'

    dialogoMensaje.value = response.message

    dialogoColor.value = 'success'

    dialogoIcono.value = 'mdi-check-circle'

    dialogo.value = true

    recargarTabla()
  } catch (error) {
    console.error(error)

    dialogoTitulo.value = 'Error'

    dialogoMensaje.value = 'No fue posible sincronizar las rutas.'

    dialogoColor.value = 'error'

    dialogoIcono.value = 'mdi-alert-circle'

    dialogo.value = true
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <v-row>
    <v-col cols="12">
      <div class="d-flex justify-end"></div>
    </v-col>

    <v-col cols="12">
      <TablaRutas ref="tabla" />
    </v-col>
  </v-row>
  <v-dialog v-model="dialogo" max-width="450">
    <v-card rounded="xl">
      <v-card-text class="text-center pa-8">
        <v-icon :icon="dialogoIcono" :color="dialogoColor" size="70" class="mb-4" />

        <div class="text-h5 font-weight-bold mb-2">
          {{ dialogoTitulo }}
        </div>

        <div class="text-body-1">
          {{ dialogoMensaje }}
        </div>

        <v-btn class="mt-6" :color="dialogoColor" @click="dialogo = false"> Aceptar </v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
