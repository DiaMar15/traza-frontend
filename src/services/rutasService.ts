import type { Ruta } from "@/types/ruta"

const API = "http://localhost:3333/api/v1"

export interface PaginatedRutas {
  data: Ruta[]
  meta: {
    total: number
    perPage: number
    currentPage: number
    lastPage: number
  }
}

export async function obtenerRutas(
  page = 1,
  limit = 10,
  q = ""
): Promise<PaginatedRutas> {

  const res = await fetch(`${API}/rutas?page=${page}&limit=${limit}&q=${q}`)

  if (!res.ok) {
    throw new Error("Error cargando rutas")
  }

  return res.json()
}


export async function crearRuta(data: any) {

  const res = await fetch(`${API}/rutas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })

  const json = await res.json()

  console.log("CREAR:", json)

  if (!res.ok) {
    throw new Error("Error creando ruta")
  }

  return json
}


export async function actualizarRuta(id: number, data: any) {

  const res = await fetch(`${API}/rutas/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })

  const json = await res.json()

  console.log("ACTUALIZAR:", json)

  if (!res.ok) {
    throw new Error("Error actualizando ruta")
  }

  return json
}


export async function eliminarRuta(id: number) {

  const res = await fetch(`${API}/rutas/${id}`, {
    method: "DELETE"
  })

  const json = await res.json()

  console.log("ELIMINAR:", json)

  if (!res.ok) {
    throw new Error("Error eliminando ruta")
  }

  return json
}