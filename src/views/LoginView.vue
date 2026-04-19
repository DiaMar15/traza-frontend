<script setup lang="ts">
import { authSetStore } from '../stores/AuthStore'
import { ref } from 'vue'

const authStore = authSetStore()

const correo = ref('')
const password = ref('')

const handlerLogin = () => {
  if (!correo.value || !password.value) {
    alert('Todos los campos son necesarios.')
    return
  }

  authStore.login({
    correo: correo.value,
    password: password.value,
  })
}
</script>

<template>
  <v-card class="pa-6" style="max-width: 420px; margin:auto;">
    <h1 class="text-h5 text-center mb-6">Ingresar</h1>

    <v-form @submit.prevent="handlerLogin">
      <v-text-field v-model="correo" label="Correo" />
      <v-text-field v-model="password" label="Contraseña" type="password" />

      <v-btn type="submit" block color="purple">
        Iniciar sesión
      </v-btn>
    </v-form>
  </v-card>
</template>