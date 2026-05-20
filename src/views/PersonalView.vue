<script setup lang="ts">
import {
  ref,
  onMounted,
  computed
} from "vue"

/* --------------------------
   TIPOS
-------------------------- */

type RutaConductor = {
  conductor: string
  total: number
  horas: number
  extras: number
}

type PersonalData = {
  semana?: number
  conductores: number
  auxiliares: number
  rutasPorConductor: RutaConductor[]
}

/* --------------------------
   STATE
-------------------------- */

const data = ref<PersonalData>({
  semana: 0,
  conductores: 0,
  auxiliares: 0,
  rutasPorConductor: [],
})

const loading = ref(true)

/* --------------------------
   FETCH
-------------------------- */

async function cargar() {

  try {

    const res = await fetch(
      "http://localhost:3333/api/v1/dashboard/personal"
    )

    const json = await res.json()

    data.value = {

      semana:
        Number(json.semana) || 0,

      conductores:
        Number(json.conductores) || 0,

      auxiliares:
        Number(json.auxiliares) || 0,

      rutasPorConductor:

        Array.isArray(
          json.rutasPorConductor
        )

          ? json.rutasPorConductor.map(
              (item: any) => ({

                conductor:
                  item.conductor ??
                  "Sin nombre",

                total:
                  Number(item.total) || 0,

                horas:
                  Number(item.horas) || 0,

                extras:
                  Number(item.extras) || 0,
              })
            )

          : [],
    }

  } catch (error) {

    console.error(
      "Error personal:",
      error
    )

  } finally {

    loading.value = false
  }
}

onMounted(cargar)

/* --------------------------
   KPIS
-------------------------- */

const totalHorasExtras = computed(() =>
  data.value.rutasPorConductor.reduce(
    (acc, item) =>
      acc + item.extras,
    0
  )
)

const personalCercanoLimite =
  computed(() =>

    data.value.rutasPorConductor.filter(
      item =>
        item.horas >= 40 &&
        item.horas <= 44
    ).length
  )

const personalExcedido =
  computed(() =>

    data.value.rutasPorConductor.filter(
      item => item.horas > 44
    ).length
  )

/* --------------------------
   ALERTAS
-------------------------- */

const alertas = computed(() => [

  {
    texto:
      `${personalExcedido.value} personas exceden el límite semanal`,

    tipo: "error" as const,

    icono: "mdi-alert",
  },

  {
    texto:
      `${personalCercanoLimite.value} personas cerca de las 44h o con 44h cumplidas`,

    tipo: "warning" as const,

    icono: "mdi-clock-alert",
  },

  {
    texto:
      `${totalHorasExtras.value.toFixed(1)} horas extras acumuladas`,

    tipo: "info" as const,

    icono: "mdi-timer-plus",
  },
])

/* --------------------------
   COLOR ESTADO
-------------------------- */

function colorHoras(
  horas: number
) {

  if (horas > 44) {
    return "red"
  }

  if (horas >= 40) {
    return "orange"
  }

  return "green"
}

/* --------------------------
   TEXTO ESTADO
-------------------------- */

function estadoHoras(
  horas: number
) {

  if (horas > 44) {
    return "Excedido"
  }

  if (horas >= 40) {
    return "Límite"
  }

  return "Normal"
}
</script>

<template>

<v-container fluid class="py-2">

  <!-- HEADER -->

  <div
    class="d-flex align-center justify-space-between mb-4"
  >

    <div>

      <h2 class="text-h5 font-weight-bold">
        Personal Operativo
      </h2>

      <div class="text-caption text-grey">
        Seguimiento laboral semanal
      </div>

    </div>

    <v-chip
      color="primary"
      variant="tonal"
      size="small"
    >
      Semana {{ data.semana }}
    </v-chip>

  </div>

  <!-- ALERTAS -->

  <v-row dense class="mb-2">

    <v-col
      v-for="(alerta, i) in alertas"
      :key="i"
      cols="12"
      md="4"
    >

      <v-alert
        :type="alerta.tipo"
        variant="tonal"
        border="start"
        rounded="lg"
        density="compact"
        class="mini-alert"
      >

        <v-icon start size="14">
          {{ alerta.icono }}
        </v-icon>

        {{ alerta.texto }}

      </v-alert>

    </v-col>

  </v-row>

  <!-- KPIS -->

  <v-row dense>

    <v-col cols="12" sm="6" md="3">

      <v-card
        class="mini-card card-blue"
        elevation="6"
        rounded="xl"
      >

        <div
          class="d-flex align-center ga-3"
        >

          <div class="icon-box">

            <v-icon size="18">
              mdi-account-group
            </v-icon>

          </div>

          <div>

            <div class="mini-title">
              Conductores
            </div>

            <div class="mini-number">
              {{ data.conductores }}
            </div>

            <div class="mini-subtitle">
              Personal activo
            </div>

          </div>

        </div>

      </v-card>

    </v-col>

    <!-- AUX -->

    <v-col cols="12" sm="6" md="3">

      <v-card
        class="mini-card card-green"
        elevation="6"
        rounded="xl"
      >

        <div
          class="d-flex align-center ga-3"
        >

          <div class="icon-box">

            <v-icon size="18">
              mdi-account-hard-hat
            </v-icon>

          </div>

          <div>

            <div class="mini-title">
              Auxiliares
            </div>

            <div class="mini-number">
              {{ data.auxiliares }}
            </div>

            <div class="mini-subtitle">
              Operación diaria
            </div>

          </div>

        </div>

      </v-card>

    </v-col>

    <!-- EXTRAS -->

    <v-col cols="12" sm="6" md="3">

      <v-card
        class="mini-card card-orange"
        elevation="6"
        rounded="xl"
      >

        <div
          class="d-flex align-center ga-3"
        >

          <div class="icon-box">

            <v-icon size="18">
              mdi-timer-plus
            </v-icon>

          </div>

          <div>

            <div class="mini-title">
              Horas extras
            </div>

            <div class="mini-number">
              {{ totalHorasExtras.toFixed(1) }}
            </div>

            <div class="mini-subtitle">
              Acumuladas
            </div>

          </div>

        </div>

      </v-card>

    </v-col>

    <!-- LIMITE -->

    <v-col cols="12" sm="6" md="3">

      <v-card
        class="mini-card card-purple"
        elevation="6"
        rounded="xl"
      >

        <div
          class="d-flex align-center ga-3"
        >

          <div class="icon-box">

            <v-icon size="18">
              mdi-clock-alert
            </v-icon>

          </div>

          <div>

            <div class="mini-title">
              Cerca límite
            </div>

            <div class="mini-number">
              {{ personalCercanoLimite }}
            </div>

            <div class="mini-subtitle">
              40h - 44h
            </div>

          </div>

        </div>

      </v-card>

    </v-col>

  </v-row>

  <!-- CARDS -->

  <v-row dense class="mt-3">

    <v-col
      v-for="item in data.rutasPorConductor"
      :key="item.conductor"
      cols="12"
      sm="6"
      md="4"
      lg="3"
    >

      <v-card
        class="personal-card"
        elevation="4"
        rounded="xl"
      >

        <!-- TOP -->

        <div
          class="d-flex justify-space-between align-start"
        >

          <div
            class="d-flex ga-2 align-center"
          >

            <div class="avatar-box">

              <v-icon size="16">
                mdi-account
              </v-icon>

            </div>

            <div>

              <!-- TOOLTIP -->

              <v-tooltip location="top">

                <template #activator="{ props }">

                  <div
                    v-bind="props"
                    class="nombre"
                  >

                    {{ item.conductor }}

                  </div>

                </template>

                <span>
                  {{ item.conductor }}
                </span>

              </v-tooltip>

              <div class="detalle">
                {{ item.total }} rutas
              </div>

            </div>

          </div>

          <v-chip
            :color="
              colorHoras(item.horas)
            "
            size="x-small"
            variant="flat"
          >

            {{
              estadoHoras(
                item.horas
              )
            }}

          </v-chip>

        </div>

        <!-- INFO -->

        <div class="info-grid mt-3">

          <div class="info-box">

            <div class="info-label">
              Horas
            </div>

            <div
              :class="[
                'info-value',

                item.horas > 44
                  ? 'text-red'

                  : item.horas >= 40
                  ? 'text-orange'

                  : 'text-green'
              ]"
            >

              {{ item.horas }} h

            </div>

          </div>

          <!-- EXTRAS -->

          <div class="info-box">

            <div class="info-label">
              Extras
            </div>

            <div class="info-value">

              {{ item.extras }} h

            </div>

          </div>

        </div>

      </v-card>

    </v-col>

  </v-row>

</v-container>

</template>

<style scoped>

/* ALERTAS */
.mini-alert {

  font-size: 11px;
}

/* KPI */

.mini-card {

  min-height: 82px;

  padding: 14px;

  display: flex;

  align-items: center;

  color: white;

  transition: 0.25s;
}

.mini-card:hover {

  transform: translateY(-2px);
}

/* ICONOS */

.icon-box {

  width: 34px;

  height: 34px;

  border-radius: 10px;

  display: flex;

  align-items: center;

  justify-content: center;

  background:
    rgba(255,255,255,0.15);

  flex-shrink: 0;
}

/* TEXTOS KPI */

.mini-title {

  font-size: 11px;

  font-weight: 700;
}

.mini-number {

  font-size: 22px;

  font-weight: 700;
}

.mini-subtitle {

  font-size: 10px;

  opacity: 0.8;
}

/* CARD PERSONAL */

.personal-card {

  background:
    linear-gradient(
      135deg,
      rgba(40,40,40,0.95),
      rgba(28,28,28,0.95)
    );

  border:
    1px solid
    rgba(255,255,255,0.05);

  color: white;

  padding: 14px;

  min-height: 160px;

  transition: 0.2s;

  display: flex;

  flex-direction: column;

  justify-content: space-between;
}

.personal-card:hover {

  transform: translateY(-3px);

  border:
    1px solid
    rgba(255,255,255,0.12);
}

/* AVATAR */

.avatar-box {

  width: 34px;

  height: 34px;

  border-radius: 10px;

  display: flex;

  align-items: center;

  justify-content: center;

  background:
    rgba(255,255,255,0.08);

  flex-shrink: 0;
}

/* NOMBRE COMPLETO */

.nombre {

  font-size: 13px;

  font-weight: 700;

  line-height: 1.3;

  word-break: break-word;

  white-space: normal;

  overflow: visible;

  text-overflow: unset;

  color: white;
}

/* DETALLE */

.detalle {

  font-size: 10px;

  opacity: 0.7;

  margin-top: 2px;
}

/* GRID INFO */

.info-grid {

  display: grid;

  grid-template-columns:
    1fr 1fr;

  gap: 10px;

  margin-top: 14px;
}

/* BOX INFO */

.info-box {

  background:
    rgba(255,255,255,0.03);

  border-radius: 10px;

  padding: 10px;

  min-height: 60px;

  display: flex;

  flex-direction: column;

  justify-content: center;
}

/* LABEL */

.info-label {

  font-size: 10px;

  opacity: 0.7;
}

/* VALUE */

.info-value {

  font-size: 16px;

  font-weight: 700;

  margin-top: 2px;
}

/* COLORES */

.text-red {

  color: #ff5252;
}

.text-orange {

  color: #ff9800;
}

.text-green {

  color: #4caf50;
}

/* COLORES KPI */

.card-blue {

  background:
    linear-gradient(
      135deg,
      #304ffe,
      #6200ea
    );
}

.card-green {

  background:
    linear-gradient(
      135deg,
      #00a32a,
      #00c853
    );
}

.card-orange {

  background:
    linear-gradient(
      135deg,
      #ef6c00,
      #ff9100
    );
}

.card-purple {

  background:
    linear-gradient(
      135deg,
      #9c27b0,
      #e100ff
    );
}

/* RESPONSIVE */

@media (max-width: 960px) {

  .personal-card {

    min-height: auto;
  }

  .nombre {

    font-size: 12px;
  }

  .info-value {

    font-size: 14px;
  }
}
</style>