<template>
  <v-app>
    <!-- HEADER -->
    <HeaderWireframeComponent @toggle-drawer="drawer = !drawer" />

    <!-- SIDEBAR -->
    <SidebarWireframeComponent :drawer="drawer" />

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

// 👤 USER GLOBAL
const userData = computed(() => ({
  nombre: auth.user?.nombre || '',
  email: auth.user?.correo || '',
  roles: auth.user?.roles || [],
  avatar: 'https://i.pravatar.cc/100?img=2',
}))

provide('userData', userData)
</script>