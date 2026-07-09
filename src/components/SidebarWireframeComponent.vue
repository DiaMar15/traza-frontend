<template>
  <div v-if="isDesktop && !internalDrawer" class="hover-zone" @mouseenter="abrirDrawer" />

  <v-navigation-drawer
    v-model="internalDrawer"
    :permanent="isDesktop"
    :temporary="!isDesktop"
    :rail="isDesktop ? rail : false"
    :expand-on-hover="!props.fijado"
    app
  >
    <!-- 👤 USER -->
    <v-list>
      <v-list-item
        :prepend-avatar="
          userData?.avatar
            ? `http://localhost:3333/${userData.avatar}`
            : 'https://i.pravatar.cc/100?img=2'
        "
        :title="userData?.nombre"
        :subtitle="userData?.email"
      />
    </v-list>

    <v-list-item title="Mi Perfil" to="/app/perfil" @click="closeDrawer" />

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
      <v-list-item prepend-icon="mdi-map" title="Rutas" to="/app/rutas" @click="closeDrawer" />

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

      <!-- CONDUCTORES -->
      <v-list-item
        prepend-icon="mdi-badge-account"
        title="Trabajadores"
        to="/app/conductores"
        @click="closeDrawer"
      />

      <!-- USUARIOS -->
      <v-list-item
        prepend-icon="mdi-account-group"
        title="Usuarios"
        to="/app/usuarios"
        @click="closeDrawer"
      />

      <v-divider class="my-2" />

      <!-- LOGOUT -->
      <v-list-item prepend-icon="mdi-logout" title="Cerrar sesión" @click="logout" />
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { inject, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { authSetStore } from '@/stores/AuthStore'

const auth = authSetStore()
const userData: any = inject('userData')

// drawer
const props = defineProps<{
  drawer: boolean
  fijado: boolean
}>()
const internalDrawer = ref(props.drawer)
const rail = ref(true)

const drawerFijado = ref(false)
watch(
  () => props.drawer,
  (val) => {
    internalDrawer.value = val
  },
)

// responsive
const isDesktop = ref(window.innerWidth >= 1280)

const handleResize = () => {
  isDesktop.value = window.innerWidth >= 1280

  if (!isDesktop.value) {
    internalDrawer.value = false
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)

  internalDrawer.value = false
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})

const closeDrawer = () => {
  if (!isDesktop.value) internalDrawer.value = false
}

let timeout: number | null = null

const abrirDrawer = () => {
  if (!isDesktop.value) return

  if (timeout) {
    clearTimeout(timeout)
    timeout = null
  }

  internalDrawer.value = true
}

const cancelarCerrar = () => {
  if (timeout) {
    clearTimeout(timeout)
    timeout = null
  }
}

const cerrarDrawer = () => {
  if (!isDesktop.value) return

  timeout = window.setTimeout(() => {
    internalDrawer.value = false
  }, 250)
}

const logout = () => {
  auth.logout()
}

const toggleRail = () => {
  drawerFijado.value = !drawerFijado.value

  rail.value = !drawerFijado.value
}
</script>

<style scoped>
.v-navigation-drawer {
  border-right: 1px solid #eee;
}

.hover-zone {
  position: fixed;
  left: 0;
  top: 0;
  width: 12px;
  height: 100vh;
  z-index: 9998;
}
</style>
