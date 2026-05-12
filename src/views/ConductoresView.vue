<script setup lang="ts">
import {
  ref,
  onMounted,
  computed,
} from 'vue'

/* --------------------------
   TIPOS
-------------------------- */
type Conductor = {

  id: number

  nombre: string

  estado:
    | 'activo'
    | 'inactivo'
}

/* --------------------------
   STATE
-------------------------- */
const conductores =
  ref<Conductor[]>([])

const loading =
  ref(false)

const dialog =
  ref(false)

const editando =
  ref(false)

const busqueda =
  ref('')

const tab =
  ref('activos')

const form = ref({

  id: null as number | null,

  nombre: '',

})

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
const activos = computed(() =>

  conductores.value.filter(

    (c) =>
      c.estado ===
      'activo'

  )

)

/* --------------------------
   INACTIVOS
-------------------------- */
const inactivos = computed(() =>

  conductores.value.filter(

    (c) =>
      c.estado ===
      'inactivo'

  )

)

/* --------------------------
   DETECTAR PARECIDOS
-------------------------- */
function esParecido(
  nombre: string
) {

  /* --------------------------
     NORMALIZAR
  -------------------------- */
  const limpiar = (
    texto: string
  ) => {

    return texto

      .toLowerCase()

      // quitar tildes
      .normalize('NFD')

      .replace(
        /[\u0300-\u036f]/g,
        ''
      )

      // quitar espacios dobles
      .replace(
        /\s+/g,
        ' '
      )

      .trim()
  }

  /* --------------------------
     PALABRAS
  -------------------------- */
  const palabras =

    limpiar(nombre)

      .split(' ')

      .filter(

        p => p.length > 2

      )

  /* --------------------------
     BUSCAR COINCIDENCIAS
  -------------------------- */
  return conductores.value.some(

    (c) => {

      // ignorar mismo
      if (
        c.nombre === nombre
      ) {
        return false
      }

      const otras =

        limpiar(c.nombre)

          .split(' ')

          .filter(

            p => p.length > 2

          )

      let coincidencias = 0

      for (const palabra of palabras) {

        if (
          otras.includes(
            palabra
          )
        ) {

          coincidencias++
        }
      }

      // 3 coincidencias
      if (
        coincidencias >= 3
      ) {
        return true
      }

      // inclusión completa
      const nombreLimpio =
        limpiar(nombre)

      const otroLimpio =
        limpiar(c.nombre)

      if (

        nombreLimpio.includes(
          otroLimpio
        ) ||

        otroLimpio.includes(
          nombreLimpio
        )

      ) {

        return true
      }

      return false
    }

  )
}

/* --------------------------
   CARGAR
-------------------------- */
async function cargar() {

  loading.value = true

  try {

    const res =
      await fetch(
        'http://localhost:3333/api/v1/conductores'
      )

    conductores.value =
      await res.json()

  } catch (error) {

    console.error(
      'Error cargando conductores',
      error
    )

  } finally {

    loading.value = false
  }
}

/* --------------------------
   ABRIR CREAR
-------------------------- */
function abrirCrear() {

  editando.value =
    false

  form.value = {

    id: null,

    nombre: '',

  }

  dialog.value =
    true
}

/* --------------------------
   ABRIR EDITAR
-------------------------- */
function abrirEditar(
  conductor: Conductor
) {

  editando.value =
    true

  form.value = {

    id: conductor.id,

    nombre:
      conductor.nombre,

  }

  dialog.value =
    true
}

/* --------------------------
   GUARDAR
-------------------------- */
async function guardar() {

  try {

    const payload = {

      nombre:
        String(
          form.value.nombre
        ).trim(),

    }

    /* --------------------------
       EDITAR
    -------------------------- */
    if (editando.value) {

      await fetch(

        `http://localhost:3333/api/v1/conductores/${form.value.id}`,

        {

          method: 'PUT',

          headers: {

            'Content-Type':
              'application/json',

          },

          body:
            JSON.stringify(
              payload
            ),

        }

      )

    }

    /* --------------------------
       CREAR
    -------------------------- */
    else {

      await fetch(

        'http://localhost:3333/api/v1/conductores',

        {

          method: 'POST',

          headers: {

            'Content-Type':
              'application/json',

          },

          body:
            JSON.stringify(
              payload
            ),

        }

      )
    }

    dialog.value =
      false

    await cargar()

  } catch (error) {

    console.error(
      'Error guardando',
      error
    )
  }
}

/* --------------------------
   INACTIVAR
-------------------------- */
async function inactivar(
  id: number
) {

  try {

    await fetch(

      `http://localhost:3333/api/v1/conductores/${id}/inactivar`,

      {

        method: 'PUT',

      }

    )

    await cargar()

  } catch (error) {

    console.error(
      'Error inactivando',
      error
    )
  }
}

/* --------------------------
   REACTIVAR
-------------------------- */
async function reactivar(
  id: number
) {

  try {

    await fetch(

      `http://localhost:3333/api/v1/conductores/${id}/reactivar`,

      {

        method: 'PUT',

      }

    )

    await cargar()

  } catch (error) {

    console.error(
      'Error reactivando',
      error
    )
  }
}

/* --------------------------
   MOUNT
-------------------------- */
onMounted(cargar)
</script>

<template>

<v-container fluid>

  <!-- HEADER -->
  <div
    class="d-flex justify-space-between align-center mb-6"
  >

    <div>

      <h1
        class="text-h4 font-weight-bold"
      >
        Conductores
      </h1>

      <p
        class="text-subtitle-2 text-medium-emphasis"
      >
        Gestión de personal operativo
      </p>

    </div>

    <v-btn
      color="primary"
      prepend-icon="mdi-plus"
      rounded="lg"
      @click="abrirCrear"
    >
      Nuevo conductor
    </v-btn>

  </div>

  <!-- FILTROS -->
  <v-card
    rounded="xl"
    elevation="3"
    class="mb-5"
  >

    <v-card-text>

      <div
        class="d-flex flex-wrap ga-3 align-center"
      >

        <!-- BUSCADOR -->
        <v-text-field

          v-model="busqueda"

          label="Buscar conductor"

          prepend-inner-icon="mdi-magnify"

          variant="outlined"

          density="compact"

          hide-details

          style="max-width: 330px"

        />

        <!-- CONTADORES -->
        <v-chip
          color="green"
          variant="flat"
        >
          Activos:
          {{ activos.length }}
        </v-chip>

        <v-chip
          color="red"
          variant="flat"
        >
          Inactivos:
          {{ inactivos.length }}
        </v-chip>

      </div>

    </v-card-text>

  </v-card>

  <!-- TABS -->
  <v-tabs
    v-model="tab"
    class="mb-4"
  >

    <v-tab value="activos">
      Activos
    </v-tab>

    <v-tab value="inactivos">
      Inactivos
    </v-tab>

  </v-tabs>

  <!-- TAB CONTENT -->
  <v-window
    v-model="tab"
  >

    <!-- ACTIVOS -->
    <v-window-item
      value="activos"
    >

      <v-card
        rounded="xl"
        elevation="3"
      >

        <v-data-table

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

            <div
              class="d-flex align-center ga-2"
            >

              <span>

                {{ item.nombre }}

              </span>

              <!-- ALERTA -->
              <v-tooltip
                v-if="esParecido(item.nombre)"
                text="Posible duplicado"
              >

                <template #activator="{ props }">

                  <v-icon
                    v-bind="props"
                    color="orange"
                    size="18"
                  >
                    mdi-alert
                  </v-icon>

                </template>

              </v-tooltip>

            </div>

          </template>

          <!-- ESTADO -->
          <template #item.estado>

            <v-chip
              color="green"
              size="small"
              variant="flat"
            >
              Activo
            </v-chip>

          </template>

          <!-- ACCIONES -->
          <template #item.acciones="{ item }">

            <div
              class="d-flex justify-center ga-1"
            >

              <!-- EDITAR -->
              <v-btn
                icon="mdi-pencil"
                size="small"
                variant="text"
                @click="abrirEditar(item)"
              />

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

      </v-card>

    </v-window-item>

    <!-- INACTIVOS -->
    <v-window-item
      value="inactivos"
    >

      <v-card
        rounded="xl"
        elevation="3"
      >

        <v-data-table

          :headers="headers"

          :items="inactivos"

          :search="busqueda"

          :loading="loading"

          items-per-page="15"

          fixed-header

          height="650"

          density="compact"

        >

          <!-- ESTADO -->
          <template #item.estado>

            <v-chip
              color="red"
              size="small"
              variant="flat"
            >
              Inactivo
            </v-chip>

          </template>

          <!-- ACCIONES -->
          <template #item.acciones="{ item }">

            <div
              class="d-flex justify-center"
            >

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
  <v-dialog
    v-model="dialog"
    max-width="500"
  >

    <v-card
      rounded="xl"
    >

      <v-card-title
        class="text-h6 font-weight-bold"
      >

        {{
          editando

            ? 'Editar conductor'

            : 'Nuevo conductor'
        }}

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

        <v-btn
          variant="text"
          @click="dialog = false"
        >
          Cancelar
        </v-btn>

        <v-btn
          color="primary"
          @click="guardar"
        >
          Guardar
        </v-btn>

      </v-card-actions>

    </v-card>

  </v-dialog>

</v-container>
</template>