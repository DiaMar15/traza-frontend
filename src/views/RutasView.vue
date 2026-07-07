<script setup lang="ts">
import TablaRutas from '@/components/TablaRutas.vue'

import { ref } from 'vue'

import GoogleSheetsService from '@/services/googleSheetsService'

/*
--------------------------------
SERVICE
--------------------------------
*/

const googleSheetsService = new GoogleSheetsService()

/*
--------------------------------
TABLA
--------------------------------
*/

const tabla = ref<InstanceType<typeof TablaRutas> | null>(null)

/*
--------------------------------
LOADING
--------------------------------
*/

const loading = ref(false)

/*
--------------------------------
RECARGAR TABLA
--------------------------------
*/

function recargarTabla() {
  tabla.value?.cargarRutas()
}

/*
--------------------------------
SINCRONIZAR
--------------------------------
*/

async function syncRutas() {
  try {
    loading.value = true

    const response = await googleSheetsService.sincronizarRutas()

    alert(response.message)

    recargarTabla()
  } catch (error) {
    console.error(error)

    alert('Error sincronizando rutas')
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
</template>
