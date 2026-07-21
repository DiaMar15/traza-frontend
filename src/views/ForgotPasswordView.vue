<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { API } from '@/config/api'

const correo = ref('')
const router = useRouter()
const dialogo = ref(false)

const dialogoTitulo = ref('')

const dialogoMensaje = ref('')

const dialogoColor = ref<'success' | 'error'>('success')

const dialogoIcono = ref('')

const handleForgot = async () => {
  try {
    const res = await fetch(`${API}/forgot-password`, {
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
  <v-card class="pa-6 pa-md-8" rounded="xl" elevation="10">
    <div class="text-center mb-6">
      <v-icon size="48" color="primary" class="mb-2"> mdi-lock-reset </v-icon>

      <h2 class="text-h4 font-weight-bold">Recuperar contraseña</h2>

      <div class="text-medium-emphasis mt-2">
        Ingresa tu correo electrónico para recibir las instrucciones de recuperación.
      </div>
    </div>

    <v-form @submit.prevent="handleForgot">
      <v-text-field
        v-model="correo"
        label="Correo electrónico"
        type="email"
        prepend-inner-icon="mdi-email-outline"
        variant="outlined"
        density="comfortable"
        autocomplete="email"
        class="mb-4"
        required
      />

      <v-btn type="submit" color="primary" block size="large" rounded="lg"> Enviar correo </v-btn>
    </v-form>

    <div class="text-center mt-5">
      <a class="text-decoration-none" style="cursor: pointer" @click="router.push('/auth/login')">
        ¿Recuerdas tu contraseña? Inicia sesión
      </a>
    </div>
  </v-card>

  <v-dialog v-model="dialogo" max-width="450" persistent>
    <v-card rounded="xl">
      <v-card-text class="text-center pa-8">
        <v-icon :icon="dialogoIcono" :color="dialogoColor" size="70" class="mb-4" />

        <div class="text-h5 font-weight-bold mb-2">
          {{ dialogoTitulo }}
        </div>

        <div class="text-body-1">
          {{ dialogoMensaje }}
        </div>

        <v-btn
          class="mt-6 text-none"
          :color="dialogoColor"
          size="large"
          rounded="lg"
          @click="dialogo = false"
        >
          Aceptar
        </v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
