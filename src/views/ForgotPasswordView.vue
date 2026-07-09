<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const correo = ref('')
const router = useRouter()
const dialogo = ref(false)

const dialogoTitulo = ref('')

const dialogoMensaje = ref('')

const dialogoColor = ref<'success' | 'error'>('success')

const dialogoIcono = ref('')

const handleForgot = async () => {
  try {
    const res = await fetch('http://localhost:3333/forgot-password', {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        correo: correo.value,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message || 'Error')
    }

    dialogoTitulo.value = 'Correo enviado'

    dialogoMensaje.value = 'Se envió un enlace para restablecer tu contraseña.'

    dialogoColor.value = 'success'

    dialogoIcono.value = 'mdi-email-check'

    dialogo.value = true
  } catch (error: any) {
    dialogoTitulo.value = 'Error'

    dialogoMensaje.value = error.message || 'No fue posible enviar el correo.'

    dialogoColor.value = 'error'

    dialogoIcono.value = 'mdi-alert-circle'

    dialogo.value = true
  }
}
</script>

<template>
  <v-card class="pa-6" style="max-width: 400px; margin: auto">
    <h2 class="mb-4">Recuperar contraseña</h2>

    <v-text-field v-model="correo" label="Correo" />

    <v-btn @click="handleForgot" block color="blue"> Enviar correo </v-btn>

    <!-- 🔐 IR A LOGIN -->
    <div class="text-center mt-4">
      <a @click="router.push('/auth/login')" style="cursor: pointer">
        ¿Recuerdas tu contraseña? Inicia sesión
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

        <v-btn class="mt-6" :color="dialogoColor" @click="dialogo = false"> Aceptar </v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
