<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

const vehiculos = ref<any[]>([])

const loading = ref(false)

const dialog = ref(false)

const editando = ref(false)

const busqueda = ref('')

const mostrarRetirados = ref(true)

const filtroEstado = ref('TODOS')

const form = ref({
  id: null as number | null,

  placa: '',

  tipo: '',

  capacidad_kilo: '',

  modelo: '',

  clase_vehiculo: '',

  marca: '',

  conductor_fijo: '',

  estado: 'ACTIVO',
})

const headers = [
  {
    title: 'Placa',
    key: 'placa',
  },

  {
    title: 'Tipo',
    key: 'tipo',
  },

  {
    title: 'Capacidad',
    key: 'capacidad_kilo',
  },

  {
    title: 'Modelo',
    key: 'modelo',
  },

  {
    title: 'Clase',
    key: 'claseVehiculo',
  },

  {
    title: 'Marca',
    key: 'marca',
  },

  {
    title: 'Conductor fijo',
    key: 'conductorFijo',
  },

  {
    title: 'Estado',
    key: 'estado',
  },

  {
    title: 'Acciones',
    key: 'acciones',
    sortable: false,
  },
]

const estadisticas = computed(() => {
  const total = vehiculos.value.length

  const activos = vehiculos.value.filter((v) => v.estado === 'ACTIVO').length

  const retirados = vehiculos.value.filter((v) => v.estado === 'RETIRADO').length

  return {
    total,
    activos,
    retirados,
  }
})

const vehiculosFiltrados = computed(() => {
  let lista = [...vehiculos.value]

  if (!mostrarRetirados.value) {
    lista = lista.filter((v) => v.estado !== 'RETIRADO')
  }

  if (filtroEstado.value !== 'TODOS') {
    lista = lista.filter((v) => v.estado === filtroEstado.value)
  }

  if (busqueda.value) {
    const texto = busqueda.value.toLowerCase()

    lista = lista.filter(
      (v) =>
        v.placa?.toLowerCase().includes(texto) ||
        v.tipo?.toLowerCase().includes(texto) ||
        v.marca?.toLowerCase().includes(texto) ||
        v.modelo?.toString().toLowerCase().includes(texto) ||
        v.conductorFijo?.toLowerCase().includes(texto),
    )
  }

  return lista
})

async function cargarVehiculos() {
  try {
    loading.value = true

    const res = await fetch('http://localhost:3333/api/v1/vehiculos')

    vehiculos.value = await res.json()
  } catch (error) {
    console.error(error)

    alert('Error cargando vehículos')
  } finally {
    loading.value = false
  }
}

async function crearVehiculo(data: any) {
  const res = await fetch(
    'http://localhost:3333/api/v1/vehiculos',

    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(data),
    },
  )

  if (!res.ok) {
    const error = await res.json()

    throw new Error(error.message)
  }

  return await res.json()
}

async function actualizarVehiculo(id: number, data: any) {
  const res = await fetch(
    `http://localhost:3333/api/v1/vehiculos/${id}`,

    {
      method: 'PUT',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(data),
    },
  )

  if (!res.ok) {
    const error = await res.json()

    throw new Error(error.message)
  }

  return await res.json()
}

async function eliminarVehiculo(id: number) {
  const res = await fetch(
    `http://localhost:3333/api/v1/vehiculos/${id}`,

    {
      method: 'DELETE',
    },
  )

  if (!res.ok) {
    throw new Error('Error eliminando vehículo')
  }

  return await res.json()
}

async function sincronizarVehiculos() {
  try {
    loading.value = true

    const res = await fetch('http://localhost:3333/api/v1/vehiculos/sync')

    const data = await res.json()

    alert(data.message)

    await cargarVehiculos()
  } catch (error) {
    console.error(error)

    alert('Error sincronizando vehículos')
  } finally {
    loading.value = false
  }
}

function nuevoVehiculo() {
  editando.value = false

  form.value = {
    id: null,

    placa: '',

    tipo: '',

    capacidad_kilo: '',

    modelo: '',

    clase_vehiculo: '',

    marca: '',

    conductor_fijo: '',

    estado: 'ACTIVO',
  }

  dialog.value = true
}

function editarVehiculo(item: any) {
  editando.value = true

  form.value = {
    id: item.id,

    placa: item.placa || '',

    tipo: item.tipo || '',

    capacidad_kilo: item.capacidadKilo || '',

    modelo: item.modelo || '',

    clase_vehiculo: item.claseVehiculo || '',

    marca: item.marca || '',

    conductor_fijo: item.conductorFijo || '',

    estado: item.estado || 'ACTIVO',
  }

  dialog.value = true
}

async function guardarVehiculo() {
  try {
    const data = {
      placa: form.value.placa?.trim().toUpperCase(),

      tipo: form.value.tipo?.trim(),

      capacidad_kilo: form.value.capacidad_kilo,

      modelo: form.value.modelo?.trim(),

      clase_vehiculo: form.value.clase_vehiculo?.trim(),

      marca: form.value.marca?.trim(),

      conductor_fijo: form.value.conductor_fijo?.trim(),

      estado: form.value.estado,
    }

    if (!data.placa) {
      alert('La placa es obligatoria')
      return
    }

    if (editando.value && form.value.id !== null) {
      await actualizarVehiculo(form.value.id, data)

      alert('Vehículo actualizado')
    } else {
      await crearVehiculo(data)

      alert('Vehículo creado')
    }

    dialog.value = false

    await cargarVehiculos()
  } catch (error: any) {
    console.error(error)

    alert(error.message || 'Error guardando vehículo')
  }
}

async function borrarVehiculo(item: any) {
  const confirmar = confirm(`¿Retirar vehículo ${item.placa}?`)

  if (!confirmar) {
    return
  }

  try {
    await eliminarVehiculo(item.id)

    alert('Vehículo retirado')

    await cargarVehiculos()
  } catch (error) {
    console.error(error)

    alert('Error retirando vehículo')
  }
}

onMounted(cargarVehiculos)
</script>

<template>
  <v-container fluid>
    <v-row class="mb-3">
      <v-col cols="12" md="4">
        <v-card color="primary" density="compact" height="75">
          <v-card-text class="d-flex flex-column justify-center h-100 py-2">
            <div class="text-caption">Total Vehículos</div>

            <div class="text-h5 font-weight-bold">
              {{ estadisticas.total }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card color="success" density="compact" height="75">
          <v-card-text class="d-flex flex-column justify-center h-100 py-2">
            <div class="text-caption">Activos</div>

            <div class="text-h5 font-weight-bold">
              {{ estadisticas.activos }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card color="error" density="compact" height="75">
          <v-card-text class="d-flex flex-column justify-center h-100 py-2">
            <div class="text-caption">Retirados</div>

            <div class="text-h5 font-weight-bold">
              {{ estadisticas.retirados }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-card>
      <v-card-title class="d-flex justify-space-between align-center flex-wrap ga-3">
        <span class="text-h5"> Vehículos </span>

        <div class="d-flex align-center ga-3 flex-wrap">
          <v-text-field
            v-model="busqueda"
            label="Buscar vehículo"
            density="comfortable"
            hide-details
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            style="width: 260px"
            e
          />

          <v-select
            v-model="filtroEstado"
            :items="['TODOS', 'ACTIVO', 'RETIRADO']"
            label="Estado"
            density="comfortable"
            hide-details
            variant="outlined"
            style="width: 180px"
          />

          <v-checkbox
            v-model="mostrarRetirados"
            label="Mostrar retirados"
            hide-details
            density="comfortable"
          />

          <v-btn color="green" prepend-icon="mdi-sync" @click="sincronizarVehiculos">
            Sincronizar
          </v-btn>

          <v-btn color="primary" prepend-icon="mdi-plus" @click="nuevoVehiculo"> Nuevo </v-btn>
        </div>
      </v-card-title>

      <v-data-table
        class="tabla-vehiculos"
        :headers="headers"
        :items="vehiculosFiltrados"
        :loading="loading"
      >
        <template #item.placa="{ item }">
          <strong>
            {{ item.placa }}
          </strong>
        </template>

        <template #item.capacidad_kilo="{ item }">
          <span>
            {{
              item.capacidadKilo !== null && item.capacidadKilo !== undefined
                ? `${item.capacidadKilo} kg`
                : '-'
            }}
          </span>
        </template>

        <template #item.modelo="{ item }">
          <span>
            {{ item.modelo || '-' }}
          </span>
        </template>

        <template #item.claseVehiculo="{ item }">
          <span>
            {{ item.claseVehiculo || '-' }}
          </span>
        </template>

        <template #item.conductorFijo="{ item }">
          <span>
            {{ item.conductorFijo || '-' }}
          </span>
        </template>

        <template #item.estado="{ item }">
          <v-chip
            :color="item.estado === 'RETIRADO' ? 'error' : 'success'"
            variant="flat"
            size="small"
          >
            {{ item.estado }}
          </v-chip>
        </template>

        <template #item.acciones="{ item }">
          <div class="d-flex ga-2">
            <v-btn icon="mdi-pencil" size="small" color="primary" @click="editarVehiculo(item)" />

            <v-btn
              icon="mdi-truck-remove"
              size="small"
              color="error"
              @click="borrarVehiculo(item)"
            />
          </div>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog" max-width="900">
      <v-card>
        <v-card-title>
          {{ editando ? 'Editar Vehículo' : 'Nuevo Vehículo' }}
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
              <v-text-field v-model="form.capacidad_kilo" label="Capacidad KG" type="number" />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field v-model="form.modelo" label="Modelo" />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field v-model="form.clase_vehiculo" label="Clase vehículo" />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field v-model="form.marca" label="Marca" />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field v-model="form.conductor_fijo" label="Conductor fijo" />
            </v-col>

            <v-col cols="12" md="6">
              <v-select v-model="form.estado" label="Estado" :items="['ACTIVO', 'RETIRADO']" />
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn @click="dialog = false"> Cancelar </v-btn>

          <v-btn color="success" @click="guardarVehiculo"> Guardar </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<style scoped>
.tabla-vehiculos :deep(thead th) {
  background-color: #2563eb !important;
  color: white !important;
  font-weight: bold !important;
}

.tabla-vehiculos :deep(thead tr) {
  background-color: #2563eb !important;
}
</style>
