<script setup lang="ts">
import { ref, onMounted, computed } from "vue"

/* --------------------------
   TIPOS
-------------------------- */
type TotalResponse = { total: number }

type RutasDia = {
  dia: string
  total: number
}

type Zona = {
  zona: string
  total: number
}

type Card = {
  title: string
  icon: string
  value: number
}

/* --------------------------
   TARJETAS
-------------------------- */
const dashboardCards = ref<Card[]>([
  { title: "Rutas Registradas", icon: "mdi-map-marker-path", value: 0 },
  { title: "Kilómetros Recorridos", icon: "mdi-road-variant", value: 0 },
  { title: "Conductores Activos", icon: "mdi-account-group", value: 0 },
  { title: "Viajes Realizados", icon: "mdi-truck-delivery", value: 0 }
])

/* --------------------------
   INDICADORES
-------------------------- */
const entregas = ref(0)
const capacidad = ref(0)

/* --------------------------
   DATOS
-------------------------- */
const rutasPorDia = ref<RutasDia[]>([])
const kmPorZona = ref<Zona[]>([])

/* --------------------------
   ORDEN DE DÍAS (🔥 CLAVE)
-------------------------- */
const ordenDias = [
  "DOMINGO",
  "LUNES",
  "MARTES",
  "MIERCOLES",
  "JUEVES",
  "VIERNES",
  "SABADO"
]

const normalizar = (texto: string) =>
  texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase()

/* --------------------------
   ESCALAS
-------------------------- */
const maxRutas = computed(() =>
  Math.max(...rutasPorDia.value.map(r => r.total), 1)
)

const maxZona = computed(() =>
  Math.max(...kmPorZona.value.map(z => z.total), 1)
)

/* --------------------------
   FETCH
-------------------------- */
async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(url)
  return await res.json()
}

/* --------------------------
   CARGAR DASHBOARD
-------------------------- */
const cargarDashboard = async () => {
  try {
    const base = "http://localhost:3333/api/v1/dashboard"

    const [
      dataRutas,
      dataKm,
      dataConductores,
      dataViajes,
      dataRutasDia,
      dataZonas,
      dataEntregas,
      dataCapacidad
    ] = await Promise.all([
      fetchJSON<TotalResponse>(`${base}/rutas-count`),
      fetchJSON<TotalResponse>(`${base}/kilometros`),
      fetchJSON<TotalResponse>(`${base}/conductores`),
      fetchJSON<TotalResponse>(`${base}/viajes`),
      fetchJSON<RutasDia[]>(`${base}/rutas-por-dia`),
      fetchJSON<Zona[]>(`${base}/km-por-zona`),
      fetchJSON<TotalResponse>(`${base}/entregas`),
      fetchJSON<TotalResponse>(`${base}/capacidad`)
    ])

    /* TARJETAS */
    dashboardCards.value[0]!.value = dataRutas.total
    dashboardCards.value[1]!.value = dataKm.total
    dashboardCards.value[2]!.value = dataConductores.total
    dashboardCards.value[3]!.value = dataViajes.total

    /* INDICADORES */
    entregas.value = dataEntregas.total
    capacidad.value = dataCapacidad.total

    /* 🔥 ORDENAR DÍAS */
    rutasPorDia.value = dataRutasDia.sort((a, b) => {
      const diaA = ordenDias.indexOf(normalizar(a.dia))
      const diaB = ordenDias.indexOf(normalizar(b.dia))
      return diaA - diaB
    })

    /* ZONAS */
    kmPorZona.value = dataZonas
      .sort((a, b) => b.total - a.total)
      .slice(0, 10)

  } catch (error) {
    console.error("Error dashboard:", error)
  }
}

onMounted(() => {
  cargarDashboard()
})
</script>

<template>
<v-container>

<h2 class="text-h5 font-weight-bold mb-4">
Dashboard Logístico
</h2>

<!-- TARJETAS -->
<v-row class="mt-4" justify="center">
  <v-col v-for="card in dashboardCards" :key="card.title" cols="12" sm="6" md="3">
    <v-card class="pa-4 text-center" elevation="10" rounded="xl">
      <v-icon :icon="card.icon" size="36" class="mb-2" color="primary"/>
      <h3 class="text-subtitle-1 font-weight-bold">{{ card.title }}</h3>
      <p class="text-h6 mt-2">{{ card.value }}</p>
    </v-card>
  </v-col>
</v-row>

<!-- GRÁFICOS -->
<v-row class="mt-6">

<!-- RUTAS POR DÍA -->
<v-col cols="12" md="6">
  <v-card elevation="8" rounded="xl" class="pa-4">

    <h3 class="text-subtitle-1 font-weight-bold mb-4">
      Rutas por día
    </h3>

    <v-row class="align-end" style="height:220px">

      <v-col v-for="(item,i) in rutasPorDia" :key="i" class="text-center">

        <div class="text-caption font-weight-bold">
          {{ item.total }}
        </div>

        <div
          style="background:#1976d2;width:100%;border-radius:6px 6px 0 0;"
          :style="{ height: (item.total / maxRutas * 180) + 'px' }"
        ></div>

        <div class="text-caption mt-2">
          {{ item.dia }}
        </div>

      </v-col>

    </v-row>

  </v-card>
</v-col>

<!-- KM POR ZONA -->
<v-col cols="12" md="6">
  <v-card elevation="8" rounded="xl" class="pa-4">

    <h3 class="text-subtitle-1 font-weight-bold mb-3">
      Kilómetros por zona (Top 10)
    </h3>

    <div v-for="zona in kmPorZona" :key="zona.zona" class="mb-3">

      <div class="d-flex justify-space-between">
        <span class="text-caption font-weight-medium">
          {{ zona.zona }}
        </span>
        <span class="text-caption">
          {{ zona.total }} km
        </span>
      </div>

      <v-progress-linear
        :model-value="(zona.total / maxZona) * 100"
        height="10"
        color="green"
        rounded
      />

    </div>

  </v-card>
</v-col>

</v-row>

<!-- INDICADORES -->
<v-row class="mt-6">

<v-col cols="12" md="6">
  <v-card class="pa-4 text-center" elevation="8" rounded="xl">
    <h3 class="text-subtitle-1 font-weight-bold mb-3">
      Entregas completadas
    </h3>

    <v-progress-circular
      :model-value="entregas"
      size="100"
      width="10"
      color="primary"
    >
      {{ entregas }}%
    </v-progress-circular>
  </v-card>
</v-col>

<v-col cols="12" md="6">
  <v-card class="pa-4 text-center" elevation="8" rounded="xl">
    <h3 class="text-subtitle-1 font-weight-bold mb-3">
      Capacidad logística
    </h3>

    <v-progress-circular
      :model-value="capacidad"
      size="100"
      width="10"
      color="green"
    >
      {{ capacidad }}%
    </v-progress-circular>
  </v-card>
</v-col>

</v-row>

</v-container>
</template>