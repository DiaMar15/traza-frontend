const API = "http://localhost:3333/api/v1"

export async function obtenerTotalRutas() {

  const res = await fetch(`${API}/rutas/count`)

  if (!res.ok) {
    throw new Error("Error obteniendo rutas")
  }

  return res.json()
}

export async function obtenerTotalKilometros() {

  const res = await fetch(`${API}/rutas/kilometros`)

  if (!res.ok) {
    throw new Error("Error obteniendo kilómetros")
  }

  return res.json()
}