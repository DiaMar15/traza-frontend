<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const nombre = ref('')
const correo = ref('')
const password = ref('')

const router = useRouter()
const dialogo = ref(false)

const dialogoTitulo = ref('')

const dialogoMensaje = ref('')

const dialogoColor = ref<'success' | 'error'>('success')

const dialogoIcono = ref('')

const register = async () => {
  try {
    const res = await fetch('http://localhost:3333/api/v1/auth/register', {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        nombre: nombre.value,
        correo: correo.value,
        password: password.value,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message || 'Error al registrar')
    }

    dialogoTitulo.value = 'Registro exitoso'

    dialogoMensaje.value = 'Tu cuenta fue creada correctamente.'

    dialogoColor.value = 'success'

    dialogoIcono.value = 'mdi-account-check'

    dialogo.value = true
  } catch (error: any) {
    dialogoTitulo.value = 'Error'

    dialogoMensaje.value = error.message || 'No fue posible registrar el usuario.'

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
  <v-card class="pa-6 pa-md-8" rounded="xl" elevation="10">
    <div class="text-center mb-6">
      <v-icon size="48" color="primary" class="mb-2"> mdi-account-plus </v-icon>

      <h2 class="text-h4 font-weight-bold">Crear cuenta</h2>

      <div class="text-medium-emphasis mt-2">
        Completa la información para registrarte en el sistema.
      </div>
    </div>

    <v-form @submit.prevent="register">
      <v-text-field
        v-model="nombre"
        label="Nombre"
        prepend-inner-icon="mdi-account-outline"
        variant="outlined"
        density="comfortable"
        class="mb-3"
        required
      />

      <v-text-field
        v-model="correo"
        label="Correo electrónico"
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

      <v-btn type="submit" color="primary" block size="large" rounded="lg"> Registrarse </v-btn>
    </v-form>

    <div class="text-center mt-5">
      <a class="text-decoration-none" style="cursor: pointer" @click="router.push('/auth/login')">
        ¿Ya tienes cuenta? Inicia sesión
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
          @click="cerrarDialogo"
        >
          Aceptar
        </v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
