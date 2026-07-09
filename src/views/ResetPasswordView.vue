<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const password = ref('')
const token = route.query.token as string
const dialogo = ref(false)

const dialogoTitulo = ref('')

const dialogoMensaje = ref('')

const dialogoColor = ref<'success' | 'error'>('success')

const dialogoIcono = ref('')

const handleReset = async () => {
  try {
    const res = await fetch('http://localhost:3333/reset-password', {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        token,
        password: password.value,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message || 'Error')
    }

    dialogoTitulo.value = 'Contraseña actualizada'

    dialogoMensaje.value = 'Tu contraseña fue actualizada correctamente.'

    dialogoColor.value = 'success'

    dialogoIcono.value = 'mdi-lock-check'

    dialogo.value = true
  } catch (error: any) {
    dialogoTitulo.value = 'Error'

    dialogoMensaje.value = error.message || 'No fue posible actualizar la contraseña.'

    dialogoColor.value = 'error'

    dialogoIcono.value = 'mdi-alert-circle'

    dialogo.value = true
  }
}

function cerrarDialogo() {
  dialogo.value = false

  if (dialogoColor.value === 'success') {
    router.push('/auth/login')
  }
}
</script>

<template>
  <v-card class="pa-6" style="max-width: 400px; margin: auto">
    <h2 class="mb-4">Nueva contraseña</h2>

    <v-text-field v-model="password" label="Nueva contraseña" type="password" />

    <v-btn @click="handleReset" block color="purple"> Cambiar contraseña </v-btn>

    <!-- 🔐 IR A LOGIN -->
    <div class="text-center mt-4">
      <a @click="router.push('/auth/login')" style="cursor: pointer">
        ¿Recordaste tu contraseña? Inicia sesión
      </a>
    </div>
  </v-card>
  <v-dialog v-model="dialogo" max-width="450">
    <v-card rounded="xl">
      <v-card-text class="text-center pa-8">
        <v-icon :icon="dialogoIcono" :color="dialogoColor" size="70" class="mb-4" />

        <div class="text-h5 font-weight-bold mb-2">
          {{ dialogoTitulo }}
        </div>

        <div class="text-body-1">
          {{ dialogoMensaje }}
        </div>

        <v-btn class="mt-6" :color="dialogoColor" @click="cerrarDialogo"> Aceptar </v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
