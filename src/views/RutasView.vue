<script setup lang="ts">

import ExcelUploader from "@/components/ExcelUploader.vue"
import TablaRutas from "@/components/TablaRutas.vue"

import { ref } from "vue"

const tabla = ref<InstanceType<typeof TablaRutas> | null>(null)

function recargarTabla() {

  tabla.value?.cargarRutas()

}

</script>

<template>

<v-row>

<v-col cols="12">

<ExcelUploader @importado="recargarTabla" />

</v-col>

<v-col cols="12">

<TablaRutas ref="tabla" />

</v-col>

</v-row>

</template>