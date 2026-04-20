<template>
  <v-app-bar app flat color="#2e2e2e">

    <!-- ☰ HAMBURGUESA (SIEMPRE VISIBLE) -->
    <v-app-bar-nav-icon @click="$emit('toggle-drawer')" />

    <v-toolbar-title>Sistema de Rutas</v-toolbar-title>

    <v-spacer />

    <v-btn color="error" @click="logout">
      Cerrar sesión
    </v-btn>

  </v-app-bar>
</template>

<script setup lang="ts">
import { authSetStore } from '@/stores/AuthStore'
import { useRouter } from 'vue-router'

const auth = authSetStore()
const router = useRouter()

const logout = () => {
  auth.logout()
  router.push('/auth/login')
}
</script>