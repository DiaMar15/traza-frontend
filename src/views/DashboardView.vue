<script setup lang="ts">
import { ref } from "vue"

/* --------------------------
   TARJETAS DEL DASHBOARD
-------------------------- */
const dashboardCards = ref([
  { title: "Rutas Registradas", icon: "mdi-map-marker-path", value: "128" },
  { title: "Kilómetros Recorridos", icon: "mdi-road-variant", value: "3,450 km" },
  { title: "Conductores Activos", icon: "mdi-account-group", value: "24" },
  { title: "Viajes Realizados", icon: "mdi-truck-delivery", value: "560" }
])

/* --------------------------
   DATOS VISUALES
-------------------------- */
const rutasSemana = [12, 18, 10, 22, 17, 25, 20]
const diasSemana = ["Lun","Mar","Mie","Jue","Vie","Sab","Dom"]

const kilometrosZona = [
  { zona: "Norte", value: 70 },
  { zona: "Centro", value: 50 },
  { zona: "Sur", value: 35 },
  { zona: "Occidente", value: 60 }
]
</script>

<template>
<v-container>

<h2 class="text-h5 font-weight-bold mb-4">
Dashboard Logístico
</h2>

<!-- TARJETAS -->

<v-row class="mt-4" justify="center">

<v-col
v-for="card in dashboardCards"
:key="card.title"
cols="12"
sm="6"
md="3"
>

<v-card class="pa-4 text-center" elevation="10" rounded="xl">

<v-icon
:icon="card.icon"
size="36"
class="mb-2"
color="primary"
/>

<h3 class="text-subtitle-1 font-weight-bold">
{{ card.title }}
</h3>

<p class="text-h6 mt-2">
{{ card.value }}
</p>

</v-card>

</v-col>

</v-row>


<!-- GRÁFICOS -->

<v-row class="mt-6">

<!-- RUTAS POR DÍA (BARRAS) -->

<v-col cols="12" md="6">

<v-card elevation="8" rounded="xl" class="pa-4">

<h3 class="text-subtitle-1 font-weight-bold mb-4">
Rutas por día
</h3>

<v-row class="align-end" style="height:200px">

<v-col
v-for="(valor,i) in rutasSemana"
:key="i"
class="text-center"
>

<div
style="background:#1976d2;width:100%;border-radius:6px 6px 0 0;"
:style="{height:(valor*6)+'px'}"
></div>

<div class="text-caption mt-2">
{{ diasSemana[i] }}
</div>

<div class="text-body-2 font-weight-medium">
{{ valor }}
</div>

</v-col>

</v-row>

</v-card>

</v-col>


<!-- KILÓMETROS POR ZONA -->

<v-col cols="12" md="6">

<v-card elevation="8" rounded="xl" class="pa-4">

<h3 class="text-subtitle-1 font-weight-bold mb-3">
Kilómetros por zona
</h3>

<div
v-for="zona in kilometrosZona"
:key="zona.zona"
class="mb-3"
>

<span class="text-caption font-weight-medium">
{{ zona.zona }}
</span>

<v-progress-linear
:model-value="zona.value"
height="10"
color="primary"
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
:model-value="78"
size="100"
width="10"
color="primary"
>
78%
</v-progress-circular>

</v-card>

</v-col>


<v-col cols="12" md="6">

<v-card class="pa-4 text-center" elevation="8" rounded="xl">

<h3 class="text-subtitle-1 font-weight-bold mb-3">
Capacidad logística
</h3>

<v-progress-circular
:model-value="65"
size="100"
width="10"
color="green"
>
65%
</v-progress-circular>

</v-card>

</v-col>

</v-row>

</v-container>
</template>