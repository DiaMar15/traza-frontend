<template>
  <v-app>
    <div class="auth-layout">

      <HeaderComponent />

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
</script>

<style scoped>
.auth-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 30px;
  padding: 20px;
}

.form-container {
  width: 100%;
  max-width: 420px;
}
</style>