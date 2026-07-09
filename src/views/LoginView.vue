<template>
  <v-card class="pa-6" elevation="8">
    <h2 class="text-center mb-4">Ingresar</h2>

    <v-form @submit.prevent="login">
      <v-text-field v-model="correo" label="Correo" type="email" required />

      <v-text-field v-model="password" label="Contraseña" type="password" required />

      <v-btn type="submit" color="purple" block> Iniciar sesión </v-btn>
    </v-form>

    <div class="text-center mt-4">
      <a @click="router.push('/auth/forgot-password')" style="cursor: pointer">
        ¿Olvidaste tu contraseña?
      </a>
    </div>

    <div class="text-center mt-2">
      <a @click="router.push('/auth/register')" style="cursor: pointer">
        ¿No tienes cuenta? Regístrate
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
