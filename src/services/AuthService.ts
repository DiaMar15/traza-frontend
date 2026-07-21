import { API } from '@/config/api'

export default class AuthService {
  /* --------------------------
     LOGIN
  -------------------------- */
  async login(correo: string, password: string) {
    const response = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ correo, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Error al iniciar sesión')
    }

    return data
  }

  /* --------------------------
     OBTENER PERFIL
  -------------------------- */
  async getProfile(token: string) {
    const response = await fetch(`${API}/account/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('No fue posible obtener el perfil')
    }

    return await response.json()
  }

  /* --------------------------
     ACTUALIZAR PERFIL
  -------------------------- */
  async updateProfile(
    token: string,
    data: {
      nombre: string
      apellido: string
      numero_telefono: string
    },
  ) {
    const response = await fetch(`${API}/account/profile`, {
      method: 'PUT',

      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(data),
    })

    const json = await response.json()

    if (!response.ok) {
      throw new Error(json.message)
    }

    return json
  }

  /* --------------------------
     SUBIR AVATAR
  -------------------------- */
  async uploadAvatar(token: string, file: File) {
    const formData = new FormData()

    formData.append('avatar', file)

    const response = await fetch(`${API}/account/profile/avatar`, {
      method: 'POST',

      headers: {
        Authorization: `Bearer ${token}`,
      },

      body: formData,
    })

    const json = await response.json()

    if (!response.ok) {
      throw new Error(json.message)
    }

    return json
  }
}
