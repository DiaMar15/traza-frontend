<script setup lang="ts">

import { ref } from "vue"
import { crearRuta } from "@/services/rutasService"

const form = ref({
  placa: "",
  conductor: "",
  empresa: "",
  destino: "",
  inicio_ruta: "",
  fin_ruta: "",
  km_inicial: 0,
  km_final: 0
})

async function guardarRuta(){

  try{

    await crearRuta(form.value)

    form.value = {
      placa:"",
      conductor:"",
      empresa:"",
      destino:"",
      inicio_ruta:"",
      fin_ruta:"",
      km_inicial:0,
      km_final:0
    }

    alert("Ruta creada correctamente")

  }catch(e){

    console.error(e)
    alert("Error creando ruta")

  }

}

</script>

<template>

<v-container>

<v-card>

<v-card-title>
Crear Ruta
</v-card-title>

<v-card-text>

<v-row>

<v-col cols="12" md="3">
<v-text-field v-model="form.placa" label="Placa"/>
</v-col>

<v-col cols="12" md="3">
<v-text-field v-model="form.conductor" label="Conductor"/>
</v-col>

<v-col cols="12" md="3">
<v-text-field v-model="form.empresa" label="Empresa"/>
</v-col>

<v-col cols="12" md="3">
<v-text-field v-model="form.destino" label="Destino"/>
</v-col>

<v-col cols="12" md="3">
<v-text-field v-model="form.inicio_ruta" label="Hora Inicio"/>
</v-col>

<v-col cols="12" md="3">
<v-text-field v-model="form.fin_ruta" label="Hora Fin"/>
</v-col>

<v-col cols="12" md="3">
<v-text-field v-model="form.km_inicial" label="KM Inicial" type="number"/>
</v-col>

<v-col cols="12" md="3">
<v-text-field v-model="form.km_final" label="KM Final" type="number"/>
</v-col>

<v-col cols="12">
<v-btn color="primary" @click="guardarRuta">
Guardar Ruta
</v-btn>
</v-col>

</v-row>

</v-card-text>

</v-card>

</v-container>

</template>