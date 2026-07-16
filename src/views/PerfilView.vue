<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { authSetStore } from '@/stores/AuthStore'
import AuthService from '@/services/AuthService'

const auth = authSetStore()
const authService = new AuthService()

const loading = ref(false)

const fileInput = ref<HTMLInputElement | null>(null)

const dialogo = ref(false)
const dialogoTitulo = ref('')
const dialogoMensaje = ref('')
const dialogoColor = ref<'success' | 'error'>('success')
const dialogoIcono = ref('')

const perfil = ref({
  nombre: '',
  apellido: '',
  correo: '',
  numero_telefono: '',
  avatar: '',
})

onMounted(() => {
  if (auth.user) {
    perfil.value = {
      nombre: auth.user.nombre || '',
      apellido: auth.user.apellido || '',
      correo: auth.user.correo || '',
      numero_telefono: auth.user.numero_telefono || '',
      avatar: auth.user.avatar || '',
    }
  }
})

async function guardarPerfil() {
  try {
    loading.value = true

    await authService.updateProfile(auth.token!, {
      nombre: perfil.value.nombre,
      apellido: perfil.value.apellido,
      numero_telefono: perfil.value.numero_telefono,
    })

    await auth.refreshProfile()

    perfil.value.avatar = auth.user?.avatar || ''

    dialogoTitulo.value = 'Perfil actualizado'

    dialogoMensaje.value = 'Los datos fueron actualizados correctamente.'

    dialogoColor.value = 'success'

    dialogoIcono.value = 'mdi-check-circle'

    dialogo.value = true
  } catch (error) {
    console.error(error)

    dialogoTitulo.value = 'Error'

    dialogoMensaje.value = 'No fue posible actualizar el perfil.'

    dialogoColor.value = 'error'

    dialogoIcono.value = 'mdi-alert-circle'

    dialogo.value = true
  } finally {
    loading.value = false
  }
}

/* --------------------------------
   AVATAR
-------------------------------- */

function seleccionarFoto() {
  console.log('Click en avatar')
  fileInput.value?.click()
}

async function subirFoto(event: Event) {
  const target = event.target as HTMLInputElement

  if (!target.files?.length) return

  const archivo = target.files?.[0]

  if (!archivo) {
    return
  }

  try {
    loading.value = true

    await authService.uploadAvatar(auth.token!, archivo)

    await auth.refreshProfile()

    perfil.value.avatar = auth.user?.avatar || ''

    dialogoTitulo.value = 'Fotografía actualizada'

    dialogoMensaje.value = 'La fotografía se actualizó correctamente.'

    dialogoColor.value = 'success'

    dialogoIcono.value = 'mdi-check-circle'

    dialogo.value = true
  } catch (error: any) {
    console.error(error)

    dialogoTitulo.value = 'Error'

    dialogoMensaje.value = error?.message || 'No fue posible actualizar la fotografía.'

    dialogoColor.value = 'error'

    dialogoIcono.value = 'mdi-alert-circle'

    dialogo.value = true
  } finally {
    loading.value = false

    target.value = ''
  }
}
</script>

<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card rounded="xl" elevation="8">
          <v-card-title class="bg-primary text-white d-flex align-center">
            <v-btn
              icon="mdi-arrow-left"
              variant="text"
              color="white"
              @click="$router.push('/app/dashboard')"
            />

            <span class="text-h5 ml-2"> Mi Perfil </span>
          </v-card-title>
          <v-card-text class="pa-8">
            <!-- FOTO -->
            <div class="d-flex flex-column align-center mb-8">
              <v-avatar size="150" class="cursor-pointer" @click="seleccionarFoto">
                <v-img
                  :src="
                    perfil.avatar
                      ? `http://localhost:3333/${perfil.avatar}`
                      : 'https://i.pravatar.cc/300'
                  "
                />
              </v-avatar>

              <div class="avatar-overlay">
                <v-icon color="white" size="34"> mdi-camera </v-icon>
              </div>
            </div>

            <input
              ref="fileInput"
              hidden
              type="file"
              accept="image/png,image/jpeg,image/webp"
              @change="subirFoto"
            />

            <p class="text-caption mb-4">Haz clic sobre la fotografía para cambiarla.</p>

            <!-- FORMULARIO -->
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="perfil.nombre"
                  label="Nombre"
                  prepend-inner-icon="mdi-account"
                  variant="outlined"
                />
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="perfil.apellido"
                  label="Apellido"
                  prepend-inner-icon="mdi-account"
                  variant="outlined"
                />
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="perfil.correo"
                  label="Correo"
                  prepend-inner-icon="mdi-email"
                  variant="outlined"
                  readonly
                />
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="perfil.numero_telefono"
                  label="Teléfono"
                  prepend-inner-icon="mdi-phone"
                  variant="outlined"
                />
              </v-col>
            </v-row>
          </v-card-text>

          <v-divider />

          <v-card-actions class="pa-6">
            <v-spacer />

            <v-btn
              color="primary"
              prepend-icon="mdi-content-save"
              :loading="loading"
              @click="guardarPerfil"
            >
              Guardar cambios
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- DIALOGO -->

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
  </v-container>
</template>
<style scoped>
.avatar-container {
  position: relative;
  width: 150px;
  height: 150px;
  cursor: pointer;
}

.avatar-overlay {
  position: absolute;
  inset: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  background: rgba(0, 0, 0, 0.35);

  border-radius: 50%;

  opacity: 0;

  transition: opacity 0.25s ease;

  pointer-events: none;
}

.avatar-container:hover .avatar-overlay {
  opacity: 1;
}
</style>
