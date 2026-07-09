<template>
  <v-app>
    <!-- HEADER -->
    <HeaderWireframeComponent @toggle-drawer="toggleDrawer" />
    <!-- SIDEBAR -->
    <SidebarWireframeComponent :drawer="drawer" :fijado="drawerFijado" />
    <!-- CONTENIDO -->
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import SidebarWireframeComponent from '@/components/SidebarWireframeComponent.vue'
import HeaderWireframeComponent from '@/components/HeaderWireframeComponent.vue'

import { ref, computed, provide } from 'vue'
import { authSetStore } from '@/stores/AuthStore'

const auth = authSetStore()

// 🔥 RESPONSIVE
const drawer = ref(window.innerWidth >= 1280)

const drawerFijado = ref(false)
const toggleDrawer = () => {
  drawerFijado.value = !drawerFijado.value
  drawer.value = drawerFijado.value
}

// 👤 USER GLOBAL
const userData = computed(() => ({
  nombre: auth.user?.nombre || '',
  email: auth.user?.correo || '',
  roles: auth.user?.roles || [],
  avatar: auth.user?.avatar || '',
}))

provide('userData', userData)
</script>
