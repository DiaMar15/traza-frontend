import { API } from '@/config/api'

/* ==========================================
   PERSONAL SEMANAL
========================================== */

export async function obtenerPersonalSemanal(semana?: number) {
  const url = semana
    ? `${API}/dashboard/personal/semanal?semana=${semana}`
    : `${API}/dashboard/personal/semanal`

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
  const response = await fetch(
    `${API}/dashboard/personal/diario?fecha=${encodeURIComponent(fecha)}`,
  )

  if (!response.ok) {
    throw new Error('No fue posible obtener el personal diario')
  }

  return await response.json()
}

/* ==========================================
   PERSONAL MENSUAL
========================================== */

export async function obtenerPersonalMensual(mes: string) {
  const response = await fetch(
    `${API}/dashboard/personal/mensual?mes=${encodeURIComponent(mes.toUpperCase())}`,
  )

  if (!response.ok) {
    throw new Error('No fue posible obtener el personal mensual')
  }

  return await response.json()
}
