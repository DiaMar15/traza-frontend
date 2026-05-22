<template>
  <v-app>
    <div class="auth-layout">
      <HeaderComponent />

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

<script setup lang="ts">
import { RouterView } from 'vue-router'

import HeaderComponent from '@/components/HeaderComponent.vue'
import FooterComponent from '@/components/FooterComponent.vue'

import logo from '@/assets/Logo.jpg'
</script>

<style scoped>
.auth-layout {
  min-height: 100vh;

  display: flex;

  flex-direction: column;

  justify-content: center;

  align-items: center;

  gap: 20px;

  padding: 20px;
}

.logo-container {
  display: flex;

  justify-content: center;

  align-items: center;
}

.logo {
  width: 260px;

  margin-bottom: 10px;

  height: auto;

  object-fit: contain;

  filter: drop-shadow(0 0 8px rgba(0, 0, 0, 0.25));
}

.form-container {
  width: 100%;

  max-width: 500px;
}
</style>
