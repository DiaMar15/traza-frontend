<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const nombre = ref('')
const correo = ref('')
const password = ref('')

const router = useRouter()

const register = async () => {
  try {
    const res = await fetch('http://localhost:3333/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: nombre.value,
        correo: correo.value,
        password: password.value
      })
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message || 'Error al registrar')
    }

    alert('Usuario creado correctamente')
    router.push('/auth/login')

  } catch (error: any) {
    alert(error.message)
  }
}
</script>

<template>
  <v-card class="pa-6" elevation="8">

    <h2 class="text-center mb-4">Registro</h2>

    <v-form @submit.prevent="register">

      <v-text-field v-model="nombre" label="Nombre" required />
      <v-text-field v-model="correo" label="Correo" type="email" required />
      <v-text-field v-model="password" label="Contraseña" type="password" required />

      <v-btn type="submit" color="purple" block>
        Registrarse
      </v-btn>

    </v-form>

    <div class="text-center mt-4">
      <a @click="router.push('/auth/login')" style="cursor:pointer;">
        ¿Ya tienes cuenta? Inicia sesión
      </a>
    </div>

  </v-card>
</template>