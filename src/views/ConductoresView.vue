<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { API } from '@/config/api'

/* --------------------------
   TIPOS
-------------------------- */
type Conductor = {
  id: number

  nombre: string

  cedula: string | null

  celular: string | null

  cargo: string | null

  estado: 'activo' | 'inactivo'
}

/* --------------------------
   STATE
-------------------------- */
const conductores = ref<Conductor[]>([])

const loading = ref(false)

const syncLoading = ref(false)

const dialog = ref(false)

const editando = ref(false)

const busqueda = ref('')

const tab = ref('activos')

const form = ref({
  id: null as number | null,

  nombre: '',
})

const mostrarDialogo = ref(false)

const dialogoMensaje = ref('')

const dialogoColor = ref<'success' | 'error'>('success')

const dialogoIcono = ref('')

/* --------------------------
   HEADERS
-------------------------- */
const headers = [
  {
    title: 'Nombre',
    key: 'nombre',
    sortable: true,
  },

  {
    title: 'Cédula',
    key: 'cedula',
    sortable: true,
  },

  {
    title: 'Celular',
    key: 'celular',
    sortable: true,
  },

  {
    title: 'Cargo',
    key: 'cargo',
    sortable: true,
  },

  {
    title: 'Estado',
    key: 'estado',
    sortable: true,
  },

  {
    title: 'Acciones',
    key: 'acciones',
    sortable: false,
  },
]

/* --------------------------
   ACTIVOS
-------------------------- */
const activos = computed(() => conductores.value.filter((c) => c.estado === 'activo'))

/* --------------------------
   INACTIVOS
-------------------------- */
const inactivos = computed(() => conductores.value.filter((c) => c.estado === 'inactivo'))

/* --------------------------
   DETECTAR PARECIDOS
-------------------------- */
function esParecido(nombre: string) {
  /* --------------------------
     NORMALIZAR
  -------------------------- */
  const limpiar = (texto: string) => {
    return (
      texto

        .toLowerCase()

        // quitar tildes
        .normalize('NFD')

        .replace(/[\u0300-\u036f]/g, '')

        // quitar espacios dobles
        .replace(/\s+/g, ' ')

        .trim()
    )
  }

  /* --------------------------
     PALABRAS
  -------------------------- */
  const palabras = limpiar(nombre)
    .split(' ')

    .filter((p) => p.length > 2)

  /* --------------------------
     BUSCAR COINCIDENCIAS
  -------------------------- */
  return conductores.value.some((c) => {
    // ignorar mismo
    if (c.nombre === nombre) {
      return false
    }

    const otras = limpiar(c.nombre)
      .split(' ')

      .filter((p) => p.length > 2)

    let coincidencias = 0

    for (const palabra of palabras) {
      if (otras.includes(palabra)) {
        coincidencias++
      }
    }

    // 3 coincidencias
    if (coincidencias >= 3) {
      return true
    }

    // inclusión completa
    const nombreLimpio = limpiar(nombre)

    const otroLimpio = limpiar(c.nombre)

    if (nombreLimpio.includes(otroLimpio) || otroLimpio.includes(nombreLimpio)) {
      return true
    }

    return false
  })
}

/* --------------------------
   CARGAR
-------------------------- */
async function cargar() {
  loading.value = true

  try {
    const res = await fetch(`${API}/conductores`)

    conductores.value = await res.json()
  } catch (error) {
    console.error('Error cargando conductores', error)
  } finally {
    loading.value = false
  }
}

/* --------------------------
   SINCRONIZAR PERSONAL
-------------------------- */

async function sincronizarPersonal() {
  try {
    syncLoading.value = true

    const response = await fetch(`${API}/conductores/sincronizar`, { method: 'POST' })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message)
    }

    dialogoMensaje.value = `${data.message}

Creados: ${data.creados}
Actualizados: ${data.actualizados}
Omitidos: ${data.omitidos}`

    dialogoColor.value = 'success'

    dialogoIcono.value = 'mdi-check-circle'

    mostrarDialogo.value = true

    await cargar()
  } catch (error) {
    console.error(error)

    dialogoMensaje.value = 'No fue posible sincronizar el personal.'

    dialogoColor.value = 'error'

    dialogoIcono.value = 'mdi-alert-circle'

    mostrarDialogo.value = true
  } finally {
    syncLoading.value = false
  }
}

/* --------------------------
   ABRIR CREAR
-------------------------- */
function abrirCrear() {
  editando.value = false

  form.value = {
    id: null,

    nombre: '',
  }

  dialog.value = true
}

/* --------------------------
   ABRIR EDITAR
-------------------------- */
function abrirEditar(conductor: Conductor) {
  editando.value = true

  form.value = {
    id: conductor.id,

    nombre: conductor.nombre,
  }

  dialog.value = true
}

/* --------------------------
   GUARDAR
-------------------------- */
async function guardar() {
  try {
    const payload = {
      nombre: String(form.value.nombre).trim(),
    }

    /* --------------------------
       EDITAR
    -------------------------- */
    if (editando.value) {
      await fetch(
        `${API}/conductores/${form.value.id}`,

        {
          method: 'PUT',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify(payload),
        },
      )
    } else {
      /* --------------------------
       CREAR
    -------------------------- */
      await fetch(
        `${API}/conductores`,

        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify(payload),
        },
      )
    }

    dialog.value = false

    await cargar()
  } catch (error) {
    console.error('Error guardando', error)
  }
}

/* --------------------------
   INACTIVAR
-------------------------- */
async function inactivar(id: number) {
  try {
    await fetch(
      `${API}/conductores/${id}/inactivar`,

      {
        method: 'PUT',
      },
    )

    await cargar()
  } catch (error) {
    console.error('Error inactivando', error)
  }
}

/* --------------------------
   REACTIVAR
-------------------------- */
async function reactivar(id: number) {
  try {
    await fetch(
      `${API}/conductores/${id}/reactivar`,

      {
        method: 'PUT',
      },
    )

    await cargar()
  } catch (error) {
    console.error('Error reactivando', error)
  }
}

/* --------------------------
   MOUNT
-------------------------- */
onMounted(cargar)
</script>

<template>
  <v-container fluid class="pa-4 pa-md-6">
    <!-- HEADER -->
    <div class="d-flex flex-column flex-lg-row justify-space-between align-lg-center ga-4 mb-6">
      <div class="d-flex align-center">
        <v-icon color="primary" size="34" class="me-3"> mdi-account-group </v-icon>

        <div>
          <h1 class="text-h4 font-weight-bold">Trabajadores Logísticos</h1>

          <p class="text-subtitle-2 text-medium-emphasis">Gestión de personal operativo</p>
        </div>
      </div>

      <div class="d-flex flex-wrap ga-2">
        <v-btn
          color="success"
          prepend-icon="mdi-sync"
          rounded="lg"
          size="large"
          :loading="syncLoading"
          @click="sincronizarPersonal"
        >
          Sincronizar Personal
        </v-btn>

        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          rounded="lg"
          size="large"
          @click="abrirCrear"
        >
          Nuevo conductor
        </v-btn>
      </div>
    </div>
    <!-- FILTROS -->
    <v-card rounded="xl" elevation="6" class="mb-5">
      <v-card-text>
        <div class="d-flex flex-wrap ga-3 align-center">
          <!-- BUSCADOR -->
          <v-text-field
            v-model="busqueda"
            label="Buscar conductor"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            hide-details
            style="min-width: 240px; max-width: 330px"
          />

          <!-- CONTADORES -->
          <v-chip color="green" variant="flat">
            Activos:
            {{ activos.length }}
          </v-chip>

          <v-chip color="red" variant="flat">
            Inactivos:
            {{ inactivos.length }}
          </v-chip>
        </div>
      </v-card-text>
    </v-card>

    <!-- TABS -->
    <v-tabs v-model="tab" color="primary" class="mb-4">
      <v-tab value="activos"> Activos </v-tab>

      <v-tab value="inactivos"> Inactivos </v-tab>
    </v-tabs>

    <!-- TAB CONTENT -->
    <v-window v-model="tab">
      <!-- ACTIVOS -->
      <v-window-item value="activos">
        <v-card rounded="xl" elevation="3">
          <div class="overflow-x-auto">
            <v-data-table
              class="tabla-conductores"
              :headers="headers"
              :items="activos"
              :search="busqueda"
              :loading="loading"
              items-per-page="15"
              fixed-header
              height="650"
              density="compact"
            >
              <!-- NOMBRE -->
              <template #item.nombre="{ item }">
                <div class="d-flex align-center ga-2">
                  <span>
                    {{ item.nombre }}
                  </span>

                  <!-- ALERTA -->
                  <v-tooltip v-if="esParecido(item.nombre)" text="Posible duplicado">
                    <template #activator="{ props }">
                      <v-icon v-bind="props" color="orange" size="18"> mdi-alert </v-icon>
                    </template>
                  </v-tooltip>
                </div>
              </template>

              <template #item.cedula="{ item }">
                {{ item.cedula || '-' }}
              </template>

              <template #item.celular="{ item }">
                {{ item.celular || '-' }}
              </template>

              <template #item.cargo="{ item }">
                <v-chip
                  v-if="item.cargo"
                  :color="
                    item.cargo.includes('CONDUCTOR')
                      ? 'blue darken-3'
                      : item.cargo.includes('AUXILIAR')
                        ? 'light-green darken-4'
                        : 'deep-orange darken-2'
                  "
                  size="small"
                  variant="flat"
                >
                  {{ item.cargo }}
                </v-chip>

                <span v-else>-</span>
              </template>

              <!-- ESTADO -->
              <template #item.estado>
                <v-chip color="green darken-4" size="small" variant="flat"> Activo </v-chip>
              </template>

              <!-- ACCIONES -->
              <template #item.acciones="{ item }">
                <div class="d-flex justify-center ga-1">
                  <!-- EDITAR -->
                  <v-btn icon="mdi-pencil" size="small" variant="text" @click="abrirEditar(item)" />

                  <!-- INACTIVAR -->
                  <v-btn
                    icon="mdi-account-off"
                    size="small"
                    color="red"
                    variant="text"
                    @click="inactivar(item.id)"
                  />
                </div>
              </template>
            </v-data-table>
          </div>
        </v-card>
      </v-window-item>

      <!-- INACTIVOS -->
      <v-window-item value="inactivos">
        <v-card rounded="xl" elevation="3">
          <v-data-table
            class="tabla-conductores"
            :headers="headers"
            :items="inactivos"
            :search="busqueda"
            :loading="loading"
            items-per-page="15"
            fixed-header
            height="600"
            density="compact"
          >
            <!-- ESTADO -->
            <template #item.estado>
              <v-chip color="red" size="small" variant="flat"> Inactivo </v-chip>
            </template>

            <!-- ACCIONES -->
            <template #item.acciones="{ item }">
              <div class="d-flex justify-center">
                <!-- REACTIVAR -->
                <v-btn
                  icon="mdi-refresh"
                  size="small"
                  color="green"
                  variant="text"
                  @click="reactivar(item.id)"
                />
              </div>
            </template>
          </v-data-table>
        </v-card>
      </v-window-item>
    </v-window>

    <!-- DIALOG -->
    <v-dialog v-model="dialog" width="95%" max-width="500" persistent>
      <v-card rounded="xl">
        <v-card-title class="text-h6 font-weight-bold">
          {{ editando ? 'Editar conductor' : 'Nuevo conductor' }}
        </v-card-title>

        <v-card-text>
          <v-text-field
            v-model="form.nombre"
            label="Nombre"
            variant="outlined"
            density="comfortable"
            autofocus
          />
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn variant="text" @click="dialog = false"> Cancelar </v-btn>

          <v-btn color="primary" size="large" rounded="lg" @click="guardar"> Guardar </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="mostrarDialogo" max-width="500" persistent>
      <v-card rounded="xl">
        <v-card-text class="text-center pa-8">
          <v-icon :icon="dialogoIcono" :color="dialogoColor" size="70" class="mb-4" />

          <div class="text-h5 font-weight-bold mb-3">
            {{ dialogoColor === 'success' ? '¡Sincronización completada!' : 'Error' }}
          </div>

          <div class="text-body-1" style="white-space: pre-line">
            {{ dialogoMensaje }}
          </div>

          <v-btn
            class="mt-6 text-none"
            :color="dialogoColor"
            size="large"
            rounded="lg"
            @click="mostrarDialogo = false"
          >
            Aceptar
          </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<style scoped>
.tabla-conductores :deep(thead th) {
  background-color: #2563eb !important;
  color: white !important;
  font-weight: bold !important;
}

.tabla-conductores :deep(thead tr) {
  background-color: #2563eb !important;
}
.overflow-x-auto {
  overflow-x: auto;
}

.tabla-conductores {
  min-width: 1050px;
}
</style>
