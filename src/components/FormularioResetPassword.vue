<template>
  <div>
    <v-form @submit.prevent="confirmar">
      <v-text-field
        v-model="nueva"
        label="Nueva Contraseña"
        type="password"
        required
        :error-messages="errores"
        class="text-black"
      />

      <v-btn type="submit" color="primary" block>
        Confirmar
      </v-btn>
    </v-form>

    <v-alert
      v-if="mensajeError"
      type="error"
      class="mt-4"
      dismissible
    >
      {{ mensajeError }}
    </v-alert>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{
  token: string
}>()

const nueva = ref('')
const errores = ref<string[]>([])
const mensajeError = ref('')
const router = useRouter()

const emit = defineEmits<{
  (e: 'exito', msg: string): void
}>()

const confirmar = async () => {
  errores.value = []
  mensajeError.value = ''

  if (!nueva.value || nueva.value.length < 6) {
    errores.value.push('La contraseña debe tener al menos 6 caracteres.')
    return
  }

  const res = await fetch('http://localhost:3333/reset-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      token: props.token,
      password: nueva.value
    })
  })

  const data = await res.json()

  if (res.ok) {
    emit('exito', 'Contraseña actualizada correctamente')
    setTimeout(() => router.push('/login'), 2000)
  } else {
    mensajeError.value = data.message || 'Token inválido o expirado'
  }
}
</script>