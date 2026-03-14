<script setup lang="ts">

import { ref, onMounted } from "vue"
import { obtenerRutas, crearRuta, actualizarRuta, eliminarRuta } from "@/services/rutasService"

const rutas = ref<any[]>([])
const total = ref(0)

const dialog = ref(false)
const editando = ref(false)

/* CONFIRMACIONES */

const dialogConfirm = ref(false)
const confirmText = ref("")
const accionConfirm = ref<null | (() => Promise<void>)>(null)

/* SNACKBAR */

const snackbar = ref(false)
const snackbarText = ref("")
const snackbarColor = ref("success")

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

const form = ref({
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

async function cargarRutas() {

  const res = await obtenerRutas(
    options.value.page,
    options.value.itemsPerPage
  )

  rutas.value = res.data
  total.value = res.meta.total
}

function nuevaRuta() {

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

function confirmarGuardar(){

  confirmText.value = editando.value
    ? "¿Confirmar actualización de la ruta?"
    : "¿Confirmar creación de la ruta?"

  accionConfirm.value = guardarRuta

  dialogConfirm.value = true
}

async function guardarRuta(){

  dialogConfirm.value = false

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

  try{

    if(editando.value){

      await actualizarRuta(form.value.id,data)

      snackbarText.value = "Ruta actualizada correctamente"
      snackbarColor.value = "info"

    }else{

      await crearRuta(data)

      snackbarText.value = "Ruta creada correctamente"
      snackbarColor.value = "success"

    }

    snackbar.value = true

    dialog.value = false

    await cargarRutas()

  }catch{

    snackbarText.value = "Error guardando ruta"
    snackbarColor.value = "error"
    snackbar.value = true

  }

}

function confirmarEliminar(ruta:any){

  confirmText.value = "¿Seguro que deseas eliminar esta ruta?"

  accionConfirm.value = async () => {

    await eliminarRuta(ruta.id)

    snackbarText.value = "Ruta eliminada correctamente"
    snackbarColor.value = "error"
    snackbar.value = true

    await cargarRutas()

  }

  dialogConfirm.value = true
}

async function ejecutarAccion(){

  if(accionConfirm.value){

    await accionConfirm.value()

  }

  dialogConfirm.value = false
}

onMounted(cargarRutas)

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
:items-per-page-options="[10,20,50,100]"
@update:options="cargarRutas"
>

<template #item.acciones="{ item }">

<v-btn icon color="blue" @click="editarRuta(item)">
✏
</v-btn>

<v-btn icon color="red" @click="confirmarEliminar(item)">
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

<v-btn @click="dialog=false">
Cancelar
</v-btn>

<v-btn color="success" @click="confirmarGuardar">
Guardar
</v-btn>

</v-card-actions>

</v-card>

</v-dialog>


<v-dialog v-model="dialogConfirm" width="420">

<v-card>

<v-card-title class="text-h6">
Confirmación
</v-card-title>

<v-card-text>
{{ confirmText }}
</v-card-text>

<v-card-actions>

<v-spacer/>

<v-btn variant="text" @click="dialogConfirm=false">
Cancelar
</v-btn>

<v-btn color="primary" @click="ejecutarAccion">
Confirmar
</v-btn>

</v-card-actions>

</v-card>

</v-dialog>


<v-snackbar
v-model="snackbar"
:color="snackbarColor"
timeout="3000"
location="bottom right"
>

{{ snackbarText }}

<template #actions>

<v-btn variant="text" @click="snackbar=false">
Cerrar
</v-btn>

</template>

</v-snackbar>

</template>