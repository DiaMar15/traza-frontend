<script setup lang="ts">
interface Props {
  conductores: number
  auxiliares: number
  supernumerarios: number
  retirados: number
}

defineProps<Props>()
</script>

<template>
  <v-row class="mb-4">
    <!-- CONDUCTORES -->

    <v-col cols="12" sm="6" lg="3">
      <v-card class="mini-card card-blue" elevation="6" rounded="xl">
        <div class="d-flex align-center ga-3">
          <div class="icon-box">
            <v-icon size="28"> mdi-account-group </v-icon>
          </div>

          <div>
            <div class="mini-title">Conductores</div>

            <div class="mini-number">
              {{ conductores }}
            </div>

            <div class="mini-subtitle">Conductores activos</div>
          </div>
        </div>
      </v-card>
    </v-col>

    <!-- AUXILIARES -->

    <v-col cols="12" sm="6" lg="3">
      <v-card class="mini-card card-green" elevation="6" rounded="xl">
        <div class="d-flex align-center ga-3">
          <div class="icon-box">
            <v-icon size="28"> mdi-account-hard-hat </v-icon>
          </div>

          <div>
            <div class="mini-title">Auxiliares</div>

            <div class="mini-number">
              {{ auxiliares }}
            </div>

            <div class="mini-subtitle">Auxiliares activos</div>
          </div>
        </div>
      </v-card>
    </v-col>

    <!-- SUPERNUMERARIOS -->

    <v-col cols="12" sm="6" md="3">
      <v-card class="mini-card card-orange" elevation="6" rounded="xl">
        <div class="d-flex align-center ga-3">
          <div class="icon-box">
            <v-icon size="24"> mdi-account-supervisor </v-icon>
          </div>

          <div>
            <div class="mini-title">Supernumerarios</div>

            <div class="mini-number">
              {{ supernumerarios }}
            </div>

            <div class="mini-subtitle">Supernumerarios activos</div>
          </div>
        </div>
      </v-card>
    </v-col>

    <!-- RETIRADOS -->

    <v-col cols="12" sm="6" md="3">
      <v-card class="mini-card card-red" elevation="6" rounded="xl">
        <div class="d-flex align-center ga-3">
          <div class="icon-box">
            <v-icon size="24"> mdi-account-off </v-icon>
          </div>

          <div>
            <div class="mini-title">Retirados</div>

            <div class="mini-number">
              {{ retirados }}
            </div>

            <div class="mini-subtitle">Personal retirado</div>
          </div>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped>
.mini-card {
  padding: 18px;

  min-height: 120px;

  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;

  cursor: default;

  border-top: 4px solid rgba(255, 255, 255, 0.35);
}

.mini-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.18);
}

.icon-box {
  width: 50px;

  height: 50px;

  border-radius: 14px;

  display: flex;

  justify-content: center;

  align-items: center;

  background: rgba(255, 255, 255, 0.12);

  flex-shrink: 0;
}

.mini-title {
  font-size: 0.8rem;

  font-weight: 600;

  opacity: 0.95;
}

.mini-number {
  font-size: 1.9rem;

  font-weight: 700;

  line-height: 1.15;
}

.mini-subtitle {
  font-size: 0.74rem;

  opacity: 0.85;
}

.card-blue {
  background: linear-gradient(135deg, #1565c0, #1e88e5);
  color: white;
}

.card-green {
  background: linear-gradient(135deg, #2e7d32, #43a047);
  color: white;
}

.card-orange {
  background: linear-gradient(135deg, #ef6c00, #fb8c00);
  color: white;
}

.card-red {
  background: linear-gradient(135deg, #c62828, #e53935);
  color: white;
}

.v-card {
  overflow: hidden;
}
@media (max-width: 960px) {
  .mini-card {
    min-height: 110px;

    padding: 16px;
  }

  .mini-number {
    font-size: 1.6rem;
  }

  .icon-box {
    width: 44px;

    height: 44px;
  }
}

@media (max-width: 600px) {
  .mini-card {
    min-height: 100px;
  }
}
</style>
