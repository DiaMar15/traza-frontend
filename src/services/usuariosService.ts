const API = 'http://localhost:3333/api/v1/usuarios'

export type Usuario = {
  id: number
  nombre: string
  apellido: string | null
  correo: string
  numero_telefono: string | null
  avatar: string | null
  estado: 'ACTIVO' | 'INACTIVO'
  created_at: string
}

export default class UsuariosService {
  static async obtenerUsuarios(): Promise<Usuario[]> {
    const token = localStorage.getItem('token')

    const response = await fetch(API, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('No fue posible obtener los usuarios')
    }

    return await response.json()
  }

  static async update(id: number, data: any) {
    const token = localStorage.getItem('token')

    const response = await fetch(`${API}/${id}`, {
      method: 'PUT',
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

  static async inactivar(id: number) {
    const token = localStorage.getItem('token')

    const response = await fetch(`${API}/${id}/inactivar`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('No fue posible inactivar el usuario')
    }

    return await response.json()
  }

  static async reactivar(id: number) {
    const token = localStorage.getItem('token')

    const response = await fetch(`${API}/${id}/reactivar`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('No fue posible reactivar el usuario')
    }

    return await response.json()
  }
}
