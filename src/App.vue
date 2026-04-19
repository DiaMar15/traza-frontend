<script setup lang="ts">
import { ref } from "vue"

const drawer = ref(true)
</script>

<template>

<v-app>

  <!-- SIDEBAR -->

  <v-navigation-drawer v-model="drawer" app>

    <v-list>

      <v-list-item
        title="Dashboard"
        to="/"
        prepend-icon="mdi-view-dashboard"
      />

      <v-list-item
        title="Rutas"
        to="/rutas"
        prepend-icon="mdi-map-marker"
      />

      <v-list-item
        title="Vehículos"
        to="/vehiculos"
        prepend-icon="mdi-truck"
      />

      <v-list-item
        title="Usuarios"
        to="/usuarios"
        prepend-icon="mdi-account"
      />

    </v-list>

  </v-navigation-drawer>

  <!-- HEADER -->

  <v-app-bar app color="primary">

    <v-app-bar-nav-icon @click="drawer = !drawer" />

    <v-toolbar-title>
      Sistema de Rutas
    </v-toolbar-title>

  </v-app-bar>

  <!-- CONTENIDO -->

  <v-main>

    <v-container>

      <router-view />

    </v-container>

  </v-main>

</v-app>

</template>