<script setup lang="ts">
import { RouterView } from 'vue-router'

import FooterComponent from '@/components/FooterComponent.vue'

import logo from '@/assets/Logo.jpg'
</script>

<template>
  <v-app>
    <div class="auth-layout">
      <div class="logo-container">
        <img :src="logo" alt="Logo" class="logo" />
      </div>

      <div class="form-container">
        <RouterView />
      </div>
    </div>

    <FooterComponent />
  </v-app>
</template>

<style scoped>
.auth-layout {
  min-height: 100vh;

  display: flex;

  flex-direction: column;

  justify-content: center;

  align-items: center;

  gap: 28px;

  padding: 24px;
}

.logo-container {
  display: flex;

  justify-content: center;

  align-items: center;
}

.logo {
  width: 280px;

  max-width: 90%;

  height: auto;

  transition: transform 0.25s ease;
}

.logo:hover {
  transform: scale(1.03);
}

.form-container {
  width: 100%;

  max-width: 460px;
}

@media (max-width: 960px) {
  .logo {
    width: 180px;
  }
}

@media (max-width: 600px) {
  .logo {
    width: 150px;
  }
}
</style>
