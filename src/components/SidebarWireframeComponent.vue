<template>
  <v-navigation-drawer
    v-model="internalDrawer"
    :permanent="isDesktop"
    :temporary="!isDesktop"
    app
    color="#2e2e2e"
  >
    <!-- 👤 USER -->
    <v-list>
      <v-list-item
        :prepend-avatar="userData?.avatar"
        :title="userData?.nombre"
        :subtitle="userData?.email"
      />
    </v-list>

    <v-divider class="my-2" />

    <v-list density="compact" nav>

      <!-- DASHBOARD -->
      <v-list-item
        prepend-icon="mdi-view-dashboard"
        title="Dashboard"
        to="/app/dashboard"
        @click="closeDrawer"
      />

      <!-- SUBMENU -->
      <v-list-group prepend-icon="mdi-chart-box">
        <template #activator="{ props }">
          <v-list-item v-bind="props" title="Indicadores" />
        </template>

        <v-list-item title="Rendimiento" to="/app/dashboard/rendimiento" />
        <v-list-item title="Costos" to="/app/dashboard/costos" />
        <v-list-item title="Personal" to="/app/dashboard/personal" />
      </v-list-group>

      <!-- RUTAS -->
      <v-list-item
        prepend-icon="mdi-map"
        title="Rutas"
        to="/app/rutas"
        @click="closeDrawer"
      />

      <!-- CREAR -->
      <v-list-item
        prepend-icon="mdi-plus"
        title="Crear Ruta"
        to="/app/crearrutas"
        @click="closeDrawer"
      />

      <!-- VEHICULOS -->
      <v-list-item
        prepend-icon="mdi-truck"
        title="Vehículos"
        to="/app/vehiculos"
        @click="closeDrawer"
      />

      <!-- USUARIOS -->
      <v-list-item
        prepend-icon="mdi-account-group"
        title="Usuarios"
        to="/app/usuarios"
        @click="closeDrawer"
      />

    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { inject, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { authSetStore } from '@/stores/AuthStore'

const auth = authSetStore()
const userData: any = inject('userData')

// drawer
const props = defineProps<{ drawer: boolean }>()
const internalDrawer = ref(props.drawer)

watch(() => props.drawer, (val) => {
  internalDrawer.value = val
})

// responsive
const isDesktop = ref(window.innerWidth >= 1280)

const handleResize = () => {
  isDesktop.value = window.innerWidth >= 1280
  internalDrawer.value = isDesktop.value
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})

const closeDrawer = () => {
  if (!isDesktop.value) internalDrawer.value = false
}

const logout = () => {
  auth.logout()
}
</script>

<style scoped>
.v-navigation-drawer {
  border-right: 1px solid #eee;
}
</style>