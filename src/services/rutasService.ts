import { API } from '@/config/api'

/* -------------------------
   OBTENER RUTAS
------------------------- */

export async function obtenerRutas(page: number, limit: number, search = '') {
  const response = await fetch(
    `${API}/rutas?page=${page}&limit=${limit}&q=${encodeURIComponent(search || '')}`,
  )

  return await response.json()
}

/* -------------------------
   OBTENER UNA RUTA
------------------------- */

export async function obtenerRuta(id: number) {
  const response = await fetch(`${API}/rutas/${id}`)
  return await response.json()
}

/* -------------------------
   CREAR
------------------------- */

export async function crearRuta(data: any) {
  const response = await fetch(`${API}/rutas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  return await response.json()
}

/* -------------------------
   ACTUALIZAR
------------------------- */

export async function actualizarRuta(id: number, data: any) {
  const response = await fetch(`${API}/rutas/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  return await response.json()
}

/* -------------------------
   ELIMINAR
------------------------- */

export async function eliminarRuta(id: number) {
  const response = await fetch(`${API}/rutas/${id}`, {
    method: 'DELETE',
  })

  return await response.json()
}
