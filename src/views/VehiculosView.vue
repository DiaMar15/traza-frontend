<script setup lang="ts">
import { ref, onMounted, computed } from "vue"

const vehiculos = ref<any[]>([])

const dialog = ref(false)
const editando = ref(false)

const busqueda = ref("")

const form = ref({
  id: null,
  placa: "",
  tipo: "",
  capacidad_kilo: "",
  modelo: "",
  clase_vehiculo: "",
  marca: "",
  estado: ""
})

const headers = [

  {
    title: "Placa",
    key: "placa"
  },

  {
    title: "Tipo",
    key: "tipo"
  },

  {
    title: "Capacidad",
    key: "capacidad_kilo"
  },

  {
    title: "Modelo",
    key: "modelo"
  },

  {
    title: "Clase",
    key: "clase_vehiculo"
  },

  {
    title: "Marca",
    key: "marca"
  },

  {
    title: "Estado",
    key: "estado"
  },

  {
    title: "Acciones",
    key: "acciones",
    sortable: false
  }
]

/* --------------------------
   FILTRADOS
-------------------------- */

const vehiculosFiltrados = computed(() => {

  if (!busqueda.value) {
    return vehiculos.value
  }

  const texto =
    busqueda.value.toLowerCase()

  return vehiculos.value.filter(
    (v) =>

      v.placa
        ?.toLowerCase()
        .includes(texto)

      ||

      v.tipo
        ?.toLowerCase()
        .includes(texto)

      ||

      v.marca
        ?.toLowerCase()
        .includes(texto)

      ||

      v.modelo
        ?.toString()
        .includes(texto)
  )
})

/* --------------------------
   CARGAR
-------------------------- */

async function cargarVehiculos() {

  const res = await fetch(
    "http://localhost:3333/api/v1/vehiculos"
  )

  vehiculos.value =
    await res.json()
}

/* --------------------------
   CREAR
-------------------------- */

async function crearVehiculo(
  data: any
) {

  await fetch(

    "http://localhost:3333/api/v1/vehiculos",

    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json"
      },

      body: JSON.stringify(data)
    }
  )
}

/* --------------------------
   ACTUALIZAR
-------------------------- */

async function actualizarVehiculo(
  id: number,
  data: any
) {

  await fetch(

    `http://localhost:3333/api/v1/vehiculos/${id}`,

    {
      method: "PUT",

      headers: {
        "Content-Type":
          "application/json"
      },

      body: JSON.stringify(data)
    }
  )
}

/* --------------------------
   ELIMINAR
-------------------------- */

async function eliminarVehiculo(
  id: number
) {

  await fetch(

    `http://localhost:3333/api/v1/vehiculos/${id}`,

    {
      method: "DELETE"
    }
  )
}

/* --------------------------
   NUEVO
-------------------------- */

function nuevoVehiculo() {

  editando.value = false

  form.value = {

    id: null,

    placa: "",

    tipo: "",

    capacidad_kilo: "",

    modelo: "",

    clase_vehiculo: "",

    marca: "",

    estado: ""
  }

  dialog.value = true
}

/* --------------------------
   EDITAR
-------------------------- */

function editarVehiculo(
  item: any
) {

  editando.value = true

  form.value = {

    id: item.id,

    placa: item.placa,

    tipo: item.tipo,

    capacidad_kilo:
      item.capacidad_kilo,

    modelo: item.modelo,

    clase_vehiculo:
      item.clase_vehiculo,

    marca: item.marca,

    estado: item.estado
  }

  dialog.value = true
}

/* --------------------------
   GUARDAR
-------------------------- */

async function guardarVehiculo() {

  const data = {

    placa:
      form.value.placa,

    tipo:
      form.value.tipo,

    capacidad_kilo:
      form.value.capacidad_kilo,

    modelo:
      form.value.modelo,

    clase_vehiculo:
      form.value.clase_vehiculo,

    marca:
      form.value.marca,

    estado:
      form.value.estado
  }

  if (

    editando.value &&

    form.value.id !== null

  ) {

    await actualizarVehiculo(
      form.value.id,
      data
    )

  } else {

    await crearVehiculo(data)
  }

  dialog.value = false

  await cargarVehiculos()
}

/* --------------------------
   BORRAR
-------------------------- */

async function borrarVehiculo(
  item: any
) {

  await eliminarVehiculo(
    item.id
  )

  await cargarVehiculos()
}

/* --------------------------
   INIT
-------------------------- */

onMounted(
  cargarVehiculos
)
</script>

<template>

  <v-container>

    <v-card>

      <!-- HEADER -->

      <v-card-title
        class="d-flex justify-space-between align-center flex-wrap ga-3"
      >

        <span class="text-h6">
          Vehículos
        </span>

        <div
          class="d-flex ga-2 flex-wrap"
        >

          <!-- BUSCADOR -->

          <v-text-field
            v-model="busqueda"
            label="Buscar vehículo"
            density="compact"
            hide-details
            prepend-inner-icon="mdi-magnify"
            style="max-width: 250px"
          />

          <!-- BOTON -->

          <v-btn
            color="primary"
            @click="nuevoVehiculo"
          >
            Nuevo Vehículo
          </v-btn>

        </div>

      </v-card-title>

      <!-- TABLA -->

      <v-data-table
        :headers="headers"
        :items="vehiculosFiltrados"
        class="elevation-1"
      >

        <!-- CAPACIDAD -->

        <template
          #item.capacidad_kilo="{ item }"
        >

          <span>

            {{
              item.capacidad_kilo
                ? `${item.capacidad_kilo} kg`
                : "-"
            }}

          </span>

        </template>

        <!-- ESTADO -->

        <template
          #item.estado="{ item }"
        >

          <v-chip
            :color="
              item.estado === 'RETIRADO'
                ? 'red'
                : 'green'
            "
            size="small"
          >

            {{ item.estado }}

          </v-chip>

        </template>

        <!-- ACCIONES -->

        <template
          #item.acciones="{ item }"
        >

          <div
            class="d-flex ga-2"
          >

            <v-btn
              icon
              color="blue"
              @click="editarVehiculo(item)"
            >
              ✏
            </v-btn>

            <v-btn
              icon
              color="red"
              @click="borrarVehiculo(item)"
            >
              🗑
            </v-btn>

          </div>

        </template>

      </v-data-table>

    </v-card>

    <!-- DIALOG -->

    <v-dialog
      v-model="dialog"
      width="700"
    >

      <v-card>

        <v-card-title>

          {{
            editando
              ? "Editar Vehículo"
              : "Nuevo Vehículo"
          }}

        </v-card-title>

        <v-card-text>

          <v-row>

            <v-col cols="12" md="6">

              <v-text-field
                v-model="form.placa"
                label="Placa"
              />

            </v-col>

            <v-col cols="12" md="6">

              <v-text-field
                v-model="form.tipo"
                label="Tipo"
              />

            </v-col>

            <v-col cols="12" md="6">

              <v-text-field
                v-model="form.capacidad_kilo"
                label="Capacidad"
              />

            </v-col>

            <v-col cols="12" md="6">

              <v-text-field
                v-model="form.modelo"
                label="Modelo"
              />

            </v-col>

            <v-col cols="12" md="6">

              <v-text-field
                v-model="form.clase_vehiculo"
                label="Clase"
              />

            </v-col>

            <v-col cols="12" md="6">

              <v-text-field
                v-model="form.marca"
                label="Marca"
              />

            </v-col>

            <v-col cols="12" md="6">

              <v-text-field
                v-model="form.estado"
                label="Estado"
              />

            </v-col>

          </v-row>

        </v-card-text>

        <v-card-actions>

          <v-spacer />

          <v-btn
            @click="dialog = false"
          >
            Cancelar
          </v-btn>

          <v-btn
            color="success"
            @click="guardarVehiculo"
          >
            Guardar
          </v-btn>

        </v-card-actions>

      </v-card>

    </v-dialog>

  </v-container>

</template>