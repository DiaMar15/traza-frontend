const API = 'http://localhost:3333/api/v1/user_roles'

export default class UserService {

  static async getAll({ page = 1, limit = 10, nombre = '' }) {
    const token = localStorage.getItem('token')

    const response = await fetch(
      `${API}?page=${page}&limit=${limit}&nombre=${nombre}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error('Error al cargar los usuarios')
    }

    return await response.json()
  }

  static async getById(id: number) {
    const token = localStorage.getItem('token')

    const response = await fetch(`${API}/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('Error al cargar el usuario')
    }

    return await response.json()
  }

  static async create(data: any) {
    const token = localStorage.getItem('token')

    const response = await fetch(`${API}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error('Error al crear el usuario')
    }

    return await response.json()
  }

  static async update(id: number, data: any) {
    const token = localStorage.getItem('token')

    const response = await fetch(`${API}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error('Error al actualizar el usuario')
    }

    return await response.json()
  }

  static async delete(id: number) {
    const token = localStorage.getItem('token')

    const response = await fetch(`${API}/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('Error al eliminar el usuario')
    }

    return true
  }
}