<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const password = ref('')
const token = route.query.token as string

const handleReset = async () => {
  try {
    const res = await fetch('http://localhost:3333/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token,
        password: password.value
      })
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message || 'Error')
    }

    alert('Contraseña actualizada')

    // 🔥 FIX
    router.push('/auth/login')

  } catch (error: any) {
    alert(error.message)
  }
}
</script>

<template>
  <v-card class="pa-6" style="max-width: 400px; margin:auto;">
    <h2 class="mb-4">Nueva contraseña</h2>

    <v-text-field
      v-model="password"
      label="Nueva contraseña"
      type="password"
    />

    <v-btn @click="handleReset" block color="purple">
      Cambiar contraseña
    </v-btn>

    <!-- 🔐 IR A LOGIN -->
    <div class="text-center mt-4">
      <a @click="router.push('/auth/login')" style="cursor:pointer;">
        ¿Recordaste tu contraseña? Inicia sesión
      </a>
    </div>

  </v-card>
</template>