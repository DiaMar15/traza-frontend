const API = 'http://localhost:3333'

export default class PasswordService {

  async forgot(correo: string) {
    const response = await fetch(`${API}/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Error al enviar correo')
    }

    return data
  }

  async reset(token: string, password: string) {
    const response = await fetch(`${API}/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Error al cambiar contraseña')
    }

    return data
  }
}