const API = 'http://localhost:3333/api/v1'

export default class AuthService {

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

  async getProfile(token: string) {
    const response = await fetch(`${API}/account/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error('Error al obtener perfil')
    }

    return data
  }
}