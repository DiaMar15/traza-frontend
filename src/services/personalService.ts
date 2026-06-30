const API = 'http://localhost:3333/api/v1/dashboard/personal'

/* ==========================================
   PERSONAL SEMANAL
========================================== */

export async function obtenerPersonalSemanal(semana?: number) {
  const url = semana ? `${API}/semanal?semana=${semana}` : `${API}/semanal`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('No fue posible obtener el personal semanal')
  }

  return await response.json()
}

/* ==========================================
   PERSONAL DIARIO
========================================== */

export async function obtenerPersonalDiario(fecha: string) {
  const response = await fetch(`${API}/diario?fecha=${encodeURIComponent(fecha)}`)

  if (!response.ok) {
    throw new Error('No fue posible obtener el personal diario')
  }

  return await response.json()
}

/* ==========================================
   PERSONAL MENSUAL
========================================== */

export async function obtenerPersonalMensual(mes: string) {
  const response = await fetch(`${API}/mensual?mes=${encodeURIComponent(mes.toUpperCase())}`)

  if (!response.ok) {
    throw new Error('No fue posible obtener el personal mensual')
  }

  return await response.json()
}
