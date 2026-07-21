import { API } from '@/config/api'

const headers = (token: string) => ({
  Authorization: `Bearer ${token}`,
})

export async function obtenerTotalRutas(token: string) {
  const res = await fetch(`${API}/rutas/count`, { headers: headers(token) })
  const data = await res.json()
  return data
}

export async function obtenerTotalKilometros(token: string) {
  const res = await fetch(`${API}/rutas/kilometros`, { headers: headers(token) })
  const data = await res.json()
  return data
}

export async function obtenerTotalConductores(token: string) {
  const res = await fetch(`${API}/conductores/count`, { headers: headers(token) })
  const data = await res.json()
  return data
}

export async function obtenerTotalViajes(token: string) {
  const res = await fetch(`${API}/viajes/count`, { headers: headers(token) })
  const data = await res.json()
  return data
}

export async function obtenerRutasPorDia(token: string) {
  const res = await fetch(`${API}/rutas/por-dia`, { headers: headers(token) })
  const data = await res.json()
  return data
}

export async function obtenerKilometrosPorZona(token: string) {
  const res = await fetch(`${API}/rutas/por-zona`, { headers: headers(token) })
  const data = await res.json()
  return data
}

export async function obtenerSemanas() {
  const response = await fetch(`${API}/dashboard/semanas`)

  if (!response.ok) {
    throw new Error('No fue posible obtener las semanas')
  }

  return await response.json()
}
