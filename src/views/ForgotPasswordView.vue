<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const correo = ref('')
const router = useRouter()

const handleForgot = async () => {
  try {
    const res = await fetch('http://localhost:3333/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo: correo.value })
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message || 'Error')
    }

    alert('Correo enviado')

  } catch (error: any) {
    alert(error.message)
  }
}
</script>

<template>
  <v-card class="pa-6" style="max-width: 400px; margin:auto;">
    <h2 class="mb-4">Recuperar contraseña</h2>

    <v-text-field
      v-model="correo"
      label="Correo"
    />

    <v-btn @click="handleForgot" block color="blue">
      Enviar correo
    </v-btn>

    <!-- 🔐 IR A LOGIN -->
    <div class="text-center mt-4">
      <a @click="router.push('/auth/login')" style="cursor:pointer;">
        ¿Recuerdas tu contraseña? Inicia sesión
      </a>
    </div>

  </v-card>
</template>