<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import UsuariosService, { type Usuario } from '@/services/usuariosService'

const usuariosService = new UsuariosService()

const loading = ref(false)

const busqueda = ref('')

const usuarios = ref<Usuario[]>([])

const headers = [
  {
    title: 'Nombre',
    key: 'nombreCompleto',
  },
  {
    title: 'Correo',
    key: 'correo',
  },
  {
    title: 'Teléfono',
    key: 'numero_telefono',
  },
  {
    title: 'Registro',
    key: 'created_at',
  },
  {
    title: 'Acciones',
    key: 'acciones',
    sortable: false,
  },
]

const estadisticas = computed(() => {
  return {
    total: usuarios.value.length,

    conTelefono: usuarios.value.filter((u) => u.numero_telefono && u.numero_telefono.trim() !== '')
      .length,
  }
})

const usuariosFiltrados = computed(() => {
  if (!busqueda.value) {
    return usuarios.value
  }

  const texto = busqueda.value.toLowerCase()

  return usuarios.value.filter((usuario) => {
    return (
      `${usuario.nombre} ${usuario.apellido || ''}`.toLowerCase().includes(texto) ||
      usuario.correo.toLowerCase().includes(texto) ||
      (usuario.numero_telefono || '').toLowerCase().includes(texto)
    )
  })
})

async function cargarUsuarios() {
  try {
    loading.value = true

    usuarios.value = await usuariosService.obtenerUsuarios()
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}
function editarUsuario(usuario: Usuario) {
  console.log('Editar usuario:', usuario)
}

function eliminarUsuario(usuario: Usuario) {
  console.log('Eliminar usuario:', usuario)
}
onMounted(() => {
  cargarUsuarios()
})
</script>

<template>
  <v-container fluid>
    <v-row class="mb-3">
      <v-col cols="12" md="4">
        <v-card color="primary" density="compact" height="75">
          <v-card-text class="d-flex flex-column justify-center h-100 py-2">
            <div class="text-caption">Total Usuarios</div>

            <div class="text-h5 font-weight-bold">
              {{ estadisticas.total }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card color="success" density="compact" height="75">
          <v-card-text class="d-flex flex-column justify-center h-100 py-2">
            <div class="text-caption">Con Teléfono</div>

            <div class="text-h5 font-weight-bold">
              {{ estadisticas.conTelefono }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card color="info" density="compact" height="75">
          <v-card-text class="d-flex flex-column justify-center h-100 py-2">
            <div class="text-caption">Registrados</div>

            <div class="text-h5 font-weight-bold">
              {{ usuarios.length }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center flex-wrap ga-3">
        <span class="text-h5"> Usuarios </span>

        <v-text-field
          v-model="busqueda"
          label="Buscar usuario"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="comfortable"
          hide-details
          style="width: 300px"
        />
      </v-card-title>

      <v-data-table :headers="headers" :items="usuariosFiltrados" :loading="loading">
        <template #item.nombreCompleto="{ item }">
          <strong>
            {{ item.nombre }}
            {{ item.apellido || '' }}
          </strong>
        </template>

        <template #item.numero_telefono="{ item }">
          {{ item.numero_telefono || '-' }}
        </template>

        <template #item.created_at="{ item }">
          {{ new Date(item.created_at).toLocaleDateString('es-CO') }}
        </template>

        <template #item.acciones="{ item }">
          <div class="d-flex ga-2">
            <v-btn icon="mdi-pencil" size="small" color="primary" @click="editarUsuario(item)" />

            <v-btn icon="mdi-delete" size="small" color="error" @click="eliminarUsuario(item)" />
          </div>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>
