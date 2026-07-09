<script setup lang="ts">
import { ref } from 'vue'
import { crearRuta } from '@/services/rutasService'

const form = ref({
  placa: '',
  conductor: '',
  empresa: '',
  destino: '',
  inicio_ruta: '',
  fin_ruta: '',
  km_inicial: 0,
  km_final: 0,
})

const dialogo = ref(false)

const dialogoTitulo = ref('')

const dialogoMensaje = ref('')

const dialogoColor = ref<'success' | 'error'>('success')

const dialogoIcono = ref('')

async function guardarRuta() {
  try {
    await crearRuta(form.value)

    form.value = {
      placa: '',
      conductor: '',
      empresa: '',
      destino: '',
      inicio_ruta: '',
      fin_ruta: '',
      km_inicial: 0,
      km_final: 0,
    }

    dialogoTitulo.value = 'Ruta creada'

    dialogoMensaje.value = 'La ruta fue creada correctamente.'

    dialogoColor.value = 'success'

    dialogoIcono.value = 'mdi-check-circle'

    dialogo.value = true
  } catch (e) {
    console.error(e)

    dialogoTitulo.value = 'Error'

    dialogoMensaje.value = 'No fue posible crear la ruta.'

    dialogoColor.value = 'error'

    dialogoIcono.value = 'mdi-alert-circle'

    dialogo.value = true
  }
}
</script>

<template>
  <v-container>
    <v-card>
      <v-card-title> Crear Ruta </v-card-title>

      <v-card-text>
        <v-row>
          <v-col cols="12" md="3">
            <v-text-field v-model="form.placa" label="Placa" />
          </v-col>

          <v-col cols="12" md="3">
            <v-text-field v-model="form.conductor" label="Conductor" />
          </v-col>

          <v-col cols="12" md="3">
            <v-text-field v-model="form.empresa" label="Empresa" />
          </v-col>

          <v-col cols="12" md="3">
            <v-text-field v-model="form.destino" label="Destino" />
          </v-col>

          <v-col cols="12" md="3">
            <v-text-field v-model="form.inicio_ruta" label="Hora Inicio" />
          </v-col>

          <v-col cols="12" md="3">
            <v-text-field v-model="form.fin_ruta" label="Hora Fin" />
          </v-col>

          <v-col cols="12" md="3">
            <v-text-field v-model="form.km_inicial" label="KM Inicial" type="number" />
          </v-col>

          <v-col cols="12" md="3">
            <v-text-field v-model="form.km_final" label="KM Final" type="number" />
          </v-col>

          <v-col cols="12">
            <v-btn color="primary" @click="guardarRuta"> Guardar Ruta </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
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
