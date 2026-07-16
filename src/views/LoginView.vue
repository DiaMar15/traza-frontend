<template>
  <v-card class="pa-6 pa-md-8" rounded="xl" elevation="10">
    <div class="text-center mb-6">
      <v-icon size="48" color="primary" class="mb-2"> mdi-account-circle </v-icon>

      <h2 class="text-h4 font-weight-bold">Iniciar sesión</h2>

      <div class="text-medium-emphasis mt-2">Ingresa tus credenciales para acceder al sistema.</div>
    </div>

    <v-form @submit.prevent="login">
      <v-text-field
        v-model="correo"
        label="Correo"
        type="email"
        prepend-inner-icon="mdi-email-outline"
        variant="outlined"
        density="comfortable"
        class="mb-3"
        required
      />

      <v-text-field
        v-model="password"
        label="Contraseña"
        type="password"
        prepend-inner-icon="mdi-lock-outline"
        variant="outlined"
        density="comfortable"
        class="mb-4"
        required
      />

      <v-btn type="submit" color="primary" block size="large" rounded="lg"> Iniciar sesión </v-btn>
    </v-form>

    <div class="text-center mt-5">
      <a
        class="text-decoration-none"
        style="cursor: pointer"
        @click="router.push('/auth/forgot-password')"
      >
        ¿Olvidaste tu contraseña?
      </a>
    </div>

    <div class="text-center mt-3">
      <a
        class="text-decoration-none"
        style="cursor: pointer"
        @click="router.push('/auth/register')"
      >
        ¿No tienes cuenta? Regístrate
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

<script setup lang="ts">
import { ref } from 'vue'
import { authSetStore } from '@/stores/AuthStore'
import { useRouter } from 'vue-router'

const correo = ref('')
const password = ref('')
const dialogo = ref(false)

const dialogoTitulo = ref('')

const dialogoMensaje = ref('')

const dialogoColor = ref<'success' | 'error'>('error')

const dialogoIcono = ref('')

const auth = authSetStore()
const router = useRouter()

const login = async () => {
  try {
    await auth.login({
      correo: correo.value,
      password: password.value,
    })
  } catch (error: any) {
    dialogoTitulo.value = 'Error al iniciar sesión'

    dialogoMensaje.value = error?.message || 'Credenciales inválidas.'

    dialogoColor.value = 'error'

    dialogoIcono.value = 'mdi-alert-circle'

    dialogo.value = true
  }
}
</script>
