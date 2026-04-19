<script setup lang="ts">

import { ref, onMounted, watch } from "vue"
import { obtenerRutas, crearRuta, actualizarRuta, eliminarRuta } from "@/services/rutasService"

/* -------------------------
   TYPES
------------------------- */

type FormRuta = {
  id: number | null
  placa: string
  conductor: string
  empresa: string
  destino: string
  inicio_ruta: string
  fin_ruta: string
  km_inicial: number
  km_final: number
}

/* -------------------------
   DATA
------------------------- */

const rutas = ref<any[]>([])
const total = ref(0)
const vehiculos = ref<any[]>([])

const dialog = ref(false)
const editando = ref(false)

const options = ref({
  page: 1,
  itemsPerPage: 10
})

const headers = [
  { title: "Placa", key: "placa" },
  { title: "Conductor", key: "conductor" },
  { title: "Empresa", key: "empresa" },
  { title: "Destino", key: "destino" },
  { title: "Hora Inicio", key: "inicioRuta" },
  { title: "Hora Fin", key: "finRuta" },
  { title: "Tiempo", key: "tiempoEnRuta" },
  { title: "KM Inicial", key: "kmInicial" },
  { title: "KM Final", key: "kmFinal" },
  { title: "Total KM", key: "totalKilometros" },
  { title: "Acciones", key: "acciones", sortable: false }
]

const form = ref<FormRuta>({
  id: null,
  placa: "",
  conductor: "",
  empresa: "",
  destino: "",
  inicio_ruta: "",
  fin_ruta: "",
  km_inicial: 0,
  km_final: 0
})

/* -------------------------
   CARGA DATOS
------------------------- */

async function cargarRutas() {

  const res = await obtenerRutas(
    options.value.page,
    options.value.itemsPerPage
  )

  rutas.value = res.data
  total.value = res.meta.total
}

async function cargarVehiculos(){

  const res = await fetch("http://localhost:3333/api/v1/vehiculos")
  vehiculos.value = await res.json()
}

/* -------------------------
   AUTO COMPLETAR VEHICULO
------------------------- */

watch(() => form.value.placa, (placa) => {

  const vehiculo = vehiculos.value.find(v => v.placa === placa)

  if (vehiculo) {
    form.value.conductor = vehiculo.conductor
    form.value.empresa = vehiculo.empresa || ""
  }

})

/* -------------------------
   CRUD
------------------------- */

function nuevaRuta(){

  editando.value = false

  form.value = {
    id: null,
    placa: "",
    conductor: "",
    empresa: "",
    destino: "",
    inicio_ruta: "",
    fin_ruta: "",
    km_inicial: 0,
    km_final: 0
  }

  dialog.value = true
}

function editarRuta(ruta:any){

  editando.value = true

  form.value = {
    id: ruta.id,
    placa: ruta.placa,
    conductor: ruta.conductor,
    empresa: ruta.empresa,
    destino: ruta.destino,
    inicio_ruta: ruta.inicioRuta,
    fin_ruta: ruta.finRuta,
    km_inicial: ruta.kmInicial,
    km_final: ruta.kmFinal
  }

  dialog.value = true
}

async function guardarRuta(){

  const data = {
    placa: form.value.placa,
    conductor: form.value.conductor,
    empresa: form.value.empresa,
    destino: form.value.destino,
    inicio_ruta: form.value.inicio_ruta,
    fin_ruta: form.value.fin_ruta,
    km_inicial: Number(form.value.km_inicial),
    km_final: Number(form.value.km_final),
    peso: 1,
    volumen: 1,
    numero_facturas: 0,
    numero_clientes: 0
  }

  if(editando.value && form.value.id !== null){

    await actualizarRuta(form.value.id, data)

  }else{

    await crearRuta(data)

  }

  dialog.value = false

  await cargarRutas()
}

async function borrarRuta(ruta:any){

  await eliminarRuta(ruta.id)

  await cargarRutas()
}

/* -------------------------
   INIT
------------------------- */

onMounted(() => {
  cargarRutas()
  cargarVehiculos()
})

</script>



<template>

<v-card>

<v-card-title class="d-flex justify-space-between">

<span>Rutas</span>

<v-btn color="primary" @click="nuevaRuta">
Nueva Ruta
</v-btn>

</v-card-title>


<v-data-table-server
:headers="headers"
:items="rutas"
:items-length="total"
v-model:options="options"
@update:options="cargarRutas"
>

<template #item.acciones="{ item }">

<v-btn icon color="blue" @click="editarRuta(item)">
✏
</v-btn>

<v-btn icon color="red" @click="borrarRuta(item)">
🗑
</v-btn>

</template>

</v-data-table-server>

</v-card>


<v-dialog v-model="dialog" width="800">

<v-card>

<v-card-title>
{{ editando ? "Editar Ruta" : "Nueva Ruta" }}
</v-card-title>

<v-card-text>

<v-row>

<v-col cols="12" md="3">
<v-select
  v-model="form.placa"
  :items="vehiculos"
  item-title="placa"
  item-value="placa"
  label="Placa"
/>
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
<v-text-field v-model="form.inicio_ruta" label="Hora Inicio" type="time"/>
</v-col>

<v-col cols="12" md="3">
<v-text-field v-model="form.fin_ruta" label="Hora Fin" type="time"/>
</v-col>

<v-col cols="12" md="3">
<v-text-field v-model="form.km_inicial" label="KM Inicial" type="number"/>
</v-col>

<v-col cols="12" md="3">
<v-text-field v-model="form.km_final" label="KM Final" type="number"/>
</v-col>

</v-row>

</v-card-text>

<v-card-actions>

<v-spacer/>

<v-btn @click="dialog=false">Cancelar</v-btn>

<v-btn color="success" @click="guardarRuta">
Guardar
</v-btn>

</v-card-actions>

</v-card>

</v-dialog>

</template>