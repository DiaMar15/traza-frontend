<script setup lang="ts">
import { ref } from 'vue'

const nombre = ref('')
const apellido = ref('')
const correo = ref('')
const password = ref('')

const handleRegister = async () => {
  try {
    const res = await fetch('http://localhost:3333/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: nombre.value,
        apellido: apellido.value,
        correo: correo.value,
        password: password.value
      })
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message || 'Error al registrar')
    }

    alert('Usuario creado correctamente')

  } catch (error: any) {
    alert(error.message)
  }
}
</script>

<template>
  <v-card class="pa-6" style="max-width: 500px; margin:auto;">
    <h2 class="mb-4">Registro</h2>

    <v-text-field v-model="nombre" label="Nombre" />
    <v-text-field v-model="apellido" label="Apellido" />
    <v-text-field v-model="correo" label="Correo" />
    <v-text-field v-model="password" label="Contraseña" type="password" />

    <v-btn @click="handleRegister" block color="green">
      Registrarse
    </v-btn>
  </v-card>
</template>