export type Usuario = {
  id: number
  nombre: string
  apellido: string | null
  correo: string
  numero_telefono: string | null
  avatar: string | null
  created_at: string
}

export default class UsuariosService {
  private readonly baseUrl = 'http://localhost:3333/api/v1/usuarios'

  async obtenerUsuarios(): Promise<Usuario[]> {
    const response = await fetch(this.baseUrl)

    if (!response.ok) {
      throw new Error('No fue posible obtener los usuarios')
    }

    return await response.json()
  }
}
