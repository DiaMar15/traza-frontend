<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import UsuariosService, { type Usuario } from '@/services/usuariosService'

const loading = ref(false)

const busqueda = ref('')

const usuarios = ref<Usuario[]>([])

const dialogConfirmar = ref(false)

const usuarioSeleccionado = ref<Usuario | null>(null)

const dialogo = ref(false)

const dialogoTitulo = ref('')

const dialogoMensaje = ref('')

const dialogoColor = ref<'success' | 'error'>('success')

const dialogoIcono = ref('')

const dialogEditar = ref(false)

const editando = ref(false)

const form = ref({
  id: null as number | null,

  nombre: '',

  apellido: '',

  correo: '',

  numero_telefono: '',
})

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
    title: 'Estado',
    key: 'estado',
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

    usuarios.value = await UsuariosService.obtenerUsuarios()
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

function editarUsuario(usuario: Usuario) {
  editando.value = true

  form.value = {
    id: usuario.id,

    nombre: usuario.nombre,

    apellido: usuario.apellido || '',

    correo: usuario.correo,

    numero_telefono: usuario.numero_telefono || '',
  }

  dialogEditar.value = true
}

async function guardarUsuario() {
  try {
    if (!form.value.id) {
      return
    }

    const data = {
      nombre: form.value.nombre.trim(),

      apellido: form.value.apellido.trim(),

      correo: form.value.correo.trim(),

      numero_telefono: form.value.numero_telefono.trim(),
    }

    await UsuariosService.update(form.value.id, data)

    cerrarDialogEditar()

    await cargarUsuarios()

    dialogoTitulo.value = 'Usuario actualizado'

    dialogoMensaje.value = 'El usuario fue actualizado correctamente.'

    dialogoColor.value = 'success'

    dialogoIcono.value = 'mdi-check-circle'

    dialogo.value = true
  } catch (error) {
    console.error(error)

    dialogoTitulo.value = 'Error'

    dialogoMensaje.value = 'No fue posible actualizar el usuario.'

    dialogoColor.value = 'error'

    dialogoIcono.value = 'mdi-alert-circle'

    dialogo.value = true
  }
}

function inactivarUsuario(usuario: Usuario) {
  usuarioSeleccionado.value = usuario

  dialogConfirmar.value = true
}

function cerrarDialogEditar() {
  dialogEditar.value = false

  form.value = {
    id: null,

    nombre: '',

    apellido: '',

    correo: '',

    numero_telefono: '',
  }

  editando.value = false
}

async function reactivarUsuario(usuario: Usuario) {
  try {
    await UsuariosService.reactivar(usuario.id)

    await cargarUsuarios()

    usuarioSeleccionado.value = null

    dialogoTitulo.value = 'Usuario reactivado'

    dialogoMensaje.value = 'El usuario fue reactivado correctamente.'

    dialogoColor.value = 'success'

    dialogoIcono.value = 'mdi-account-check'

    dialogo.value = true
  } catch (error) {
    console.error(error)

    dialogoTitulo.value = 'Error'

    dialogoMensaje.value = 'No fue posible reactivar el usuario.'

    dialogoColor.value = 'error'

    dialogoIcono.value = 'mdi-alert-circle'

    dialogo.value = true
  }
}

async function confirmarInactivacion() {
  if (!usuarioSeleccionado.value) return

  try {
    await UsuariosService.inactivar(usuarioSeleccionado.value.id)

    dialogConfirmar.value = false

    await cargarUsuarios()

    usuarioSeleccionado.value = null

    dialogoTitulo.value = 'Usuario inactivado'

    dialogoMensaje.value = 'El usuario fue inactivado correctamente.'

    dialogoColor.value = 'success'

    dialogoIcono.value = 'mdi-account-off'

    dialogo.value = true
  } catch (error) {
    console.error(error)

    dialogConfirmar.value = false

    dialogoTitulo.value = 'Error'

    dialogoMensaje.value = 'No fue posible inactivar el usuario.'

    dialogoColor.value = 'error'

    dialogoIcono.value = 'mdi-alert-circle'

    dialogo.value = true
  }
}
onMounted(() => {
  cargarUsuarios()
})
</script>

<template>
  <v-container fluid class="pa-4 pa-md-6">
    <!-- ==========================================
         TARJETAS
    ========================================== -->

    <v-row class="mb-3">
      <v-col cols="12" sm="6" xl="4">
        <v-card color="primary" density="compact" height="80" rounded="xl" elevation="6">
          <v-card-text class="d-flex flex-column justify-center h-100 py-2">
            <div class="text-caption">Total Usuarios</div>

            <div class="text-h5 font-weight-bold">
              {{ estadisticas.total }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" xl="4">
        <v-card color="success" density="compact" height="80" rounded="xl" elevation="6">
          <v-card-text class="d-flex flex-column justify-center h-100 py-2">
            <div class="text-caption">Con Teléfono</div>

            <div class="text-h5 font-weight-bold">
              {{ estadisticas.conTelefono }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" xl="4">
        <v-card color="info" density="compact" height="80" rounded="xl" elevation="6">
          <v-card-text class="d-flex flex-column justify-center h-100 py-2">
            <div class="text-caption">Registrados</div>

            <div class="text-h5 font-weight-bold">
              {{ usuarios.length }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- ==========================================
         TABLA
    ========================================== -->

    <v-card>
      <v-card-title
        class="d-flex flex-column flex-lg-row justify-space-between align-lg-center ga-4"
      >
        <span class="text-h5"> Usuarios </span>

        <v-text-field
          v-model="busqueda"
          label="Buscar usuario"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="comfortable"
          hide-details
          style="min-width: 240px; max-width: 300px"
        />
      </v-card-title>

      <div class="overflow-x-auto">
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

          <template #item.estado="{ item }">
            <v-chip
              :color="item.estado === 'ACTIVO' ? 'success' : 'error'"
              size="small"
              variant="flat"
            >
              {{ item.estado }}
            </v-chip>
          </template>

          <template #item.created_at="{ item }">
            {{ new Date(item.created_at).toLocaleDateString('es-CO') }}
          </template>

          <template #item.acciones="{ item }">
            <div class="d-flex justify-center ga-2">
              <v-btn icon="mdi-pencil" size="small" color="primary" @click="editarUsuario(item)" />

              <v-btn
                v-if="item.estado === 'ACTIVO'"
                icon="mdi-account-off"
                size="small"
                color="error"
                @click="inactivarUsuario(item)"
              />

              <v-btn
                v-else
                icon="mdi-account-check"
                size="small"
                color="success"
                @click="reactivarUsuario(item)"
              />
            </div>
          </template>
        </v-data-table>
      </div>
    </v-card>

    <v-dialog v-model="dialogEditar" width="95%" max-width="800" persistent>
      <v-card>
        <v-card-title class="bg-primary text-white">
          <v-icon class="me-2"> mdi-account-edit </v-icon>

          Editar Usuario
        </v-card-title>

        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field variant="outlined" density="comfortable" /> v-model="form.nombre"
              label="Nombre" />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field variant="outlined" density="comfortable" /> v-model="form.apellido"
              label="Apellido" />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field variant="outlined" density="comfortable" /> v-model="form.correo"
              label="Correo" type="email" />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field variant="outlined" density="comfortable" />
              v-model="form.numero_telefono" label="Teléfono" />
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn variant="text" @click="cerrarDialogEditar"> Cancelar </v-btn>

          <v-btn
            color="success"
            size="large"
            rounded="lg"
            :disabled="!form.nombre.trim() || !form.correo.trim()"
            @click="guardarUsuario"
          >
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ==========================================
         CONFIRMAR INACTIVACIÓN
    ========================================== -->

    <v-dialog v-model="dialogConfirmar" max-width="450" persistent>
      <v-card rounded="xl">
        <v-card-title class="text-h6"> Confirmar acción </v-card-title>

        <v-card-text> ¿Deseas inactivar este usuario? </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn @click="dialogConfirmar = false"> Cancelar </v-btn>

          <v-btn color="error" size="large" rounded="lg" @click="confirmarInactivacion">
            Inactivar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ==========================================
         MENSAJE
    ========================================== -->

    <v-dialog v-model="dialogo" max-width="450" persistent>
      <v-card rounded="xl">
        <v-card-text class="text-center pa-8">
          <v-icon :icon="dialogoIcono" :color="dialogoColor" size="70" class="mb-4" />

          <div class="text-h5 font-weight-bold mb-2">
            {{ dialogoTitulo }}
          </div>

          <div class="text-body-1">
            {{ dialogoMensaje }}
          </div>

          <v-btn
            class="mt-6 text-none"
            :color="dialogoColor"
            size="large"
            rounded="lg"
            @click="dialogo = false"
          >
            Aceptar
          </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<style scoped>
.overflow-x-auto {
  overflow-x: auto;
}

.tabla-usuarios {
  min-width: 950px;
}

.tabla-usuarios :deep(thead th) {
  background-color: #2563eb !important;
  color: white !important;
  font-weight: bold !important;
}

.tabla-usuarios :deep(thead tr) {
  background-color: #2563eb !important;
}
</style>
