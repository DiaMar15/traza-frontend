<script setup lang="ts">

import { ref, onMounted, watch } from "vue"

import {
  obtenerRutas,
  crearRuta,
  actualizarRuta,
  eliminarRuta
} from "@/services/rutasService"

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

const search = ref("")

const options = ref({
  page: 1,
  itemsPerPage: 10
})

/* -------------------------
   HEADERS
------------------------- */

const headers = [

  {
    title: "Fecha",
    key: "fecha"
  },

  {
    title: "Día",
    key: "dia"
  },

  {
    title: "Placa",
    key: "placa"
  },

  {
    title: "Conductor",
    key: "conductor"
  },

  {
    title: "Auxiliar",
    key: "auxiliar"
  },

  {
    title: "Empresa",
    key: "empresa"
  },

  {
    title: "Zona",
    key: "zona"
  },

  {
    title: "Destino",
    key: "destino"
  },

  {
    title: "Hora Inicio",
    key: "inicioRuta"
  },

  {
    title: "Hora Fin",
    key: "finRuta"
  },

  {
    title: "Tiempo Ruta",
    key: "tiempoEnRuta"
  },

  {
    title: "Hora Extra",
    key: "horaExtra"
  },

  {
    title: "KM Inicial",
    key: "kmInicial"
  },

  {
    title: "KM Final",
    key: "kmFinal"
  },

  {
    title: "Total KM",
    key: "totalKilometros"
  },

  {
    title: "Acciones",
    key: "acciones",
    sortable: false
  }
]

/* -------------------------
   FORM
------------------------- */

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
   CARGAR RUTAS
------------------------- */

async function cargarRutas() {

  try {

    const res = await obtenerRutas(
      options.value.page,
      options.value.itemsPerPage,
      search.value || ""
    )

    rutas.value = res.data

    total.value = res.meta.total

  } catch (error) {

    console.error(error)

    rutas.value = []

    total.value = 0
  }
}

/* -------------------------
   CARGAR VEHICULOS
------------------------- */

async function cargarVehiculos() {

  const res = await fetch(
    "http://localhost:3333/api/v1/vehiculos"
  )

  vehiculos.value = await res.json()
}

/* -------------------------
   AUTOCOMPLETAR
------------------------- */

watch(() => form.value.placa, (placa) => {

  const vehiculo =
    vehiculos.value.find(
      v => v.placa === placa
    )

  if (vehiculo) {

    form.value.conductor =
      vehiculo.conductor

    form.value.empresa =
      vehiculo.empresa || ""
  }
})

/* -------------------------
   BUSCADOR
------------------------- */

watch(search, async (value) => {

  if (
    value === null ||
    value === undefined
  ) {

    search.value = ""
  }

  options.value.page = 1

  await cargarRutas()
})

/* -------------------------
   NUEVA RUTA
------------------------- */

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

/* -------------------------
   EDITAR
------------------------- */

function editarRuta(ruta: any) {

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

/* -------------------------
   GUARDAR
------------------------- */

async function guardarRuta() {

  const data = {

    placa: form.value.placa,

    conductor: form.value.conductor,

    empresa: form.value.empresa,

    destino: form.value.destino,

    inicio_ruta: form.value.inicio_ruta,

    fin_ruta: form.value.fin_ruta,

    km_inicial: Number(
      form.value.km_inicial
    ),

    km_final: Number(
      form.value.km_final
    ),

    peso: 1,

    volumen: 1,

    numero_facturas: 0,

    numero_clientes: 0
  }

  if (
    editando.value &&
    form.value.id !== null
  ) {

    await actualizarRuta(
      form.value.id,
      data
    )

  } else {

    await crearRuta(data)
  }

  dialog.value = false

  await cargarRutas()
}

/* -------------------------
   ELIMINAR
------------------------- */

async function borrarRuta(ruta: any) {

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

defineExpose({
  cargarRutas
})

</script>

<template>

<v-card>

  <v-card-title
    class="d-flex justify-space-between"
  >

    <span>Rutas</span>

    <v-btn
      color="primary"
      @click="nuevaRuta"
    >
      Nueva Ruta
    </v-btn>

  </v-card-title>

  <!-- BUSCADOR -->

  <v-card-text>

    <v-row>

      <v-col cols="12" md="4">

        <v-text-field
          v-model="search"
          label="Buscar rutas"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="comfortable"
          clearable
        />

      </v-col>

    </v-row>

  </v-card-text>

  <!-- TABLA -->

  <v-data-table-server
    :headers="headers"
    :items="rutas"
    :items-length="total"
    v-model:options="options"
    @update:options="cargarRutas"
  >

    <template #item.fecha="{ item }">
      <span>{{ item.fecha || "-" }}</span>
    </template>

    <template #item.dia="{ item }">
      <span>{{ item.dia || "-" }}</span>
    </template>

    <template #item.auxiliar="{ item }">
      <span>{{ item.auxiliar || "-" }}</span>
    </template>

    <template #item.zona="{ item }">
      <span>{{ item.zona || "-" }}</span>
    </template>

    <template #item.inicioRuta="{ item }">
      <span>{{ item.inicioRuta || "-" }}</span>
    </template>

    <template #item.finRuta="{ item }">
      <span>{{ item.finRuta || "-" }}</span>
    </template>

    <template #item.tiempoEnRuta="{ item }">
      <span>{{ item.tiempoEnRuta || "-" }}</span>
    </template>

    <template #item.horaExtra="{ item }">
      <span>{{ item.horaExtra || "-" }}</span>
    </template>

    <template #item.kmInicial="{ item }">
      <span>
        {{ Number(item.kmInicial || 0).toFixed(0) }}
      </span>
    </template>

    <template #item.kmFinal="{ item }">
      <span>
        {{ Number(item.kmFinal || 0).toFixed(0) }}
      </span>
    </template>

    <template #item.totalKilometros="{ item }">
      <span>
        {{ Number(item.totalKilometros || 0).toFixed(0) }}
      </span>
    </template>

    <template #item.acciones="{ item }">

      <div class="d-flex ga-2">

        <v-btn
          icon
          color="blue"
          @click="editarRuta(item)"
        >
          ✏
        </v-btn>

        <v-btn
          icon
          color="red"
          @click="borrarRuta(item)"
        >
          🗑
        </v-btn>

      </div>

    </template>

  </v-data-table-server>

</v-card>

</template>