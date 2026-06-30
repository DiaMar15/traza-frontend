<script setup lang="ts">
const props = defineProps<{
  cumplenJornada: number
  noCumplenJornada: number
  trabajadoresConHorasExtra: number
  totalHoras: number
  promedioHoras: number
}>()

const emit = defineEmits<{
  (e: 'verNoCumplen'): void
  (e: 'verHorasExtra'): void
}>()
</script>

<template>
  <v-row class="mb-4">
    <!-- ==========================
         CUMPLEN JORNADA
    =========================== -->

    <v-col cols="12" sm="6" lg>
      <v-card class="indicador-card card-green" elevation="4" rounded="xl">
        <v-icon size="24">mdi-check-circle</v-icon>

        <div class="titulo">Trabajadores que cumplen la jornada laboral</div>

        <div class="numero">
          {{ props.cumplenJornada }}
        </div>

        <div class="subtitulo">Jornada cumplida</div>
      </v-card>
    </v-col>

    <!-- ==========================
         NO CUMPLEN
    =========================== -->

    <v-col cols="12" sm="6" lg>
      <v-card
        class="indicador-card indicador-click card-red"
        elevation="4"
        rounded="xl"
        @click="emit('verNoCumplen')"
      >
        <v-icon size="24">mdi-close-circle</v-icon>

        <div class="titulo">Trabajadores que NO cumplen la jornada laboral</div>

        <div class="numero">
          {{ props.noCumplenJornada }}
        </div>

        <div class="subtitulo clickable">Ver trabajadores</div>
      </v-card>
    </v-col>

    <!-- ==========================
         HORAS EXTRA
    =========================== -->

    <v-col cols="12" sm="6" lg>
      <v-card
        class="indicador-card indicador-click card-purple"
        elevation="4"
        rounded="xl"
        @click="emit('verHorasExtra')"
      >
        <v-icon size="24">mdi-clock-plus</v-icon>

        <div class="titulo">Trabajadores con horas extras</div>

        <div class="numero">
          {{ props.trabajadoresConHorasExtra }}
        </div>

        <div class="subtitulo clickable">Ver trabajadores</div>
      </v-card>
    </v-col>

    <!-- ==========================
         HORAS
    =========================== -->

    <v-col cols="12" sm="6" lg>
      <v-card class="indicador-card card-blue" elevation="4" rounded="xl">
        <v-icon size="24">mdi-clock-outline</v-icon>

        <div class="titulo">Horas trabajadas</div>

        <div class="numero">{{ props.totalHoras }} h</div>

        <div class="subtitulo">Total</div>
      </v-card>
    </v-col>

    <!-- ==========================
         PROMEDIO
    =========================== -->

    <v-col cols="12" sm="6" lg>
      <v-card class="indicador-card card-indigo" elevation="4" rounded="xl">
        <v-icon size="24">mdi-chart-line</v-icon>

        <div class="titulo">Promedio</div>

        <div class="numero">{{ props.promedioHoras }} h</div>

        <div class="subtitulo">Horas por trabajador</div>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped>
.indicador-card {
  min-height: 75px;
  padding: 10px 12px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  text-align: center;
  color: white;

  transition: all 0.2s ease;
}

.indicador-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.18);
}

.indicador-click {
  cursor: pointer;
}

.indicador-click:hover {
  transform: translateY(-4px);
}

.titulo {
  margin-top: 4px;
  min-height: 24px;

  font-size: 0.72rem;
  font-weight: 600;
  line-height: 1.15;
}

.numero {
  margin: 4px 0;

  font-size: 1.45rem;
  font-weight: 700;
  line-height: 1;
}

.subtitulo {
  font-size: 0.68rem;
  opacity: 0.9;
}

.clickable {
  font-weight: 600;
  text-decoration: underline;
}

.card-green {
  background: linear-gradient(135deg, #2e7d32, #43a047);
}

.card-red {
  background: linear-gradient(135deg, #c62828, #e53935);
}

.card-purple {
  background: linear-gradient(135deg, #6a1b9a, #8e24aa);
}

.card-blue {
  background: linear-gradient(135deg, #1565c0, #1e88e5);
}

.card-indigo {
  background: linear-gradient(135deg, #3949ab, #5c6bc0);
}

@media (max-width: 960px) {
  .indicador-card {
    min-height: 90px;
  }

  .numero {
    font-size: 1.3rem;
  }

  .titulo {
    min-height: auto;
    font-size: 0.7rem;
  }

  .subtitulo {
    font-size: 0.65rem;
  }
}
</style>
