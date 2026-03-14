<script setup lang="ts">

import { ref } from "vue"
import { importarExcel } from "@/services/importacionesService"

const archivo = ref<File | null>(null)

const cargando = ref(false)

const snackbar = ref(false)
const mensaje = ref("")
const color = ref("success")

const emit = defineEmits<{
  (e: "importado"): void
}>()

async function subirExcel() {

  if (!archivo.value) return

  cargando.value = true

  try {

    const res = await importarExcel(archivo.value)

    mensaje.value = res.message || "Excel importado correctamente"
    color.value = "success"
    snackbar.value = true

    emit("importado")

  } catch (error) {

    mensaje.value = "Error importando Excel"
    color.value = "error"
    snackbar.value = true

  } finally {

    cargando.value = false

  }

}

</script>

<template>

<v-card class="mb-6">

<v-card-title>
Importar Excel
</v-card-title>

<v-card-text>

<v-file-input
label="Seleccionar archivo Excel"
accept=".xlsx"
@change="archivo = $event.target.files[0]"
/>

<v-btn
color="primary"
class="mt-4"
@click="subirExcel"
:disabled="cargando"
>

<span v-if="!cargando">
Importar
</span>

<v-progress-circular
v-if="cargando"
indeterminate
size="20"
color="white"
/>

</v-btn>

</v-card-text>

</v-card>

<!-- NOTIFICACIÓN -->

<v-snackbar
v-model="snackbar"
:color="color"
timeout="3000"
location="top right"
>

{{ mensaje }}

</v-snackbar>

</template>