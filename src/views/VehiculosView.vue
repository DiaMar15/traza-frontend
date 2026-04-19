<script setup lang="ts">
import { ref, onMounted } from "vue"

const vehiculos = ref<any[]>([])
const total = ref(0)

const dialog = ref(false)
const editando = ref(false)

const options = ref({
  page: 1,
  itemsPerPage: 10
})

const form = ref({
  id: null,
  placa: "",
  tipo: "",
  capacidad_kilo: "",
  modelo: "",
  clase_vehiculo: "",
  marca: "",
  estado: "",
  conductor: ""
})

const snackbar = ref(false)
const snackbarText = ref("")
const snackbarColor = ref("success")

const headers = [
  { title: "Placa", key: "placa" },
  { title: "Tipo", key: "tipo" },
  { title: "Capacidad", key: "capacidad_kilo" },
  { title: "Modelo", key: "modelo" },
  { title: "Clase", key: "clase_vehiculo" },
  { title: "Marca", key: "marca" },
  { title: "Estado", key: "estado" },
  { title: "Acciones", key: "acciones", sortable: false }
]

async function cargarVehiculos() {
  const res = await fetch("http://localhost:3333/api/v1/vehiculos")
  vehiculos.value = await res.json()
  total.value = vehiculos.value.length
}

async function crearVehiculo(data: any) {
  await fetch("http://localhost:3333/api/v1/vehiculos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
}

async function actualizarVehiculo(id: number, data: any) {
  await fetch(`http://localhost:3333/api/v1/vehiculos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
}

async function eliminarVehiculo(id: number) {
  await fetch(`http://localhost:3333/api/v1/vehiculos/${id}`, {
    method: "DELETE"
  })
}

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
    estado: "",
    conductor: ""
  }

  dialog.value = true
}

function editarVehiculo(item: any) {
  editando.value = true

  form.value = {
    id: item.id,
    placa: item.placa,
    tipo: item.tipo,
    capacidad_kilo: item.capacidad_kilo,
    modelo: item.modelo,
    clase_vehiculo: item.clase_vehiculo,
    marca: item.marca,
    estado: item.estado,
    conductor: item.conductor
  }

  dialog.value = true
}

async function guardarVehiculo() {
  const data = {
    placa: form.value.placa,
    tipo: form.value.tipo,
    capacidad_kilo: form.value.capacidad_kilo,
    modelo: form.value.modelo,
    clase_vehiculo: form.value.clase_vehiculo,
    marca: form.value.marca,
    estado: form.value.estado,
    conductor: form.value.conductor
  }

  if (editando.value && form.value.id !== null) {
    await actualizarVehiculo(form.value.id, data)
  } else {
    await crearVehiculo(data)
  }

  dialog.value = false
  await cargarVehiculos()
}

async function borrarVehiculo(item: any) {
  await eliminarVehiculo(item.id)
  await cargarVehiculos()
}

onMounted(cargarVehiculos)
</script>

<template>
  <v-container>

    <v-card>

      <v-card-title class="d-flex justify-space-between">
        <span>Vehículos</span>

        <v-btn color="primary" @click="nuevoVehiculo">
          Nuevo Vehículo
        </v-btn>
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="vehiculos"
        class="elevation-1"
      >

        <template #item.acciones="{ item }">
          <v-btn icon color="blue" @click="editarVehiculo(item)">✏</v-btn>
          <v-btn icon color="red" @click="borrarVehiculo(item)">🗑</v-btn>
        </template>

      </v-data-table>

    </v-card>

    <v-dialog v-model="dialog" width="600">
      <v-card>

        <v-card-title>
          {{ editando ? "Editar Vehículo" : "Nuevo Vehículo" }}
        </v-card-title>

        <v-card-text>
          <v-row>

            <v-col cols="12" md="6">
              <v-text-field v-model="form.placa" label="Placa" />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field v-model="form.tipo" label="Tipo" />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field v-model="form.capacidad_kilo" label="Capacidad (kg)" />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field v-model="form.modelo" label="Modelo" />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field v-model="form.clase_vehiculo" label="Clase" />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field v-model="form.marca" label="Marca" />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field v-model="form.estado" label="Estado" />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field v-model="form.conductor" label="Conductor" />
            </v-col>

          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn @click="dialog = false">Cancelar</v-btn>
          <v-btn color="success" @click="guardarVehiculo">
            Guardar
          </v-btn>
        </v-card-actions>

      </v-card>
    </v-dialog>

  </v-container>
</template>