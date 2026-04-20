<template>
  <v-card class="pa-6" elevation="8">

    <h2 class="text-center mb-4">Ingresar</h2>

    <v-form @submit.prevent="login">

      <v-text-field
        v-model="correo"
        label="Correo"
        type="email"
        required
      />

      <v-text-field
        v-model="password"
        label="Contraseña"
        type="password"
        required
      />

      <v-btn type="submit" color="purple" block>
        Iniciar sesión
      </v-btn>

    </v-form>

    <!-- 🔐 RECUPERAR -->
    <div class="text-center mt-4">
      <a @click="router.push('/auth/forgot-password')" style="cursor:pointer;">
        ¿Olvidaste tu contraseña?
      </a>
    </div>

    <!-- 🆕 REGISTRO -->
    <div class="text-center mt-2">
      <a @click="router.push('/auth/register')" style="cursor:pointer;">
        ¿No tienes cuenta? Regístrate
      </a>
    </div>

  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { authSetStore } from '@/stores/AuthStore'
import { useRouter } from 'vue-router'

const correo = ref('')
const password = ref('')

const auth = authSetStore()
const router = useRouter()

const login = async () => {
  await auth.login({
    correo: correo.value,
    password: password.value
  })
}
</script>