const API = 'http://localhost:3333/api/v1'

export default class RoleService {

  static async getAll() {
    const token = localStorage.getItem('token')

    const response = await fetch(`${API}/roles`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('Error al cargar los roles')
    }

    return await response.json()
  }
}