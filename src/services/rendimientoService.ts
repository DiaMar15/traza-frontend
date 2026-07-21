import { API } from '@/config/api'
/* ==========================================
   QUERY PARAMS
========================================== */

function crearQuery(params: { dia?: string; semana?: number; mes?: string; top?: number }) {
  const query = new URLSearchParams()

  if (params.dia) {
    query.append('dia', params.dia)
  }

  if (params.semana !== undefined) {
    query.append('semana', String(params.semana))
  }

  if (params.mes) {
    query.append('mes', params.mes)
  }

  if (params.top !== undefined) {
    query.append('top', String(params.top))
  }

  return query.toString()
}
export async function obtenerRendimiento(
  filtros: {
    dia?: string
    semana?: number
    mes?: string
  } = {},
) {
  const query = crearQuery(filtros)

  const response = await fetch(`${API}/dashboard/rendimiento?${query}`)
  if (!response.ok) {
    throw new Error('No fue posible obtener el rendimiento')
  }

  return await response.json()
}

/* ==========================================
   RENDIMIENTO VEHÍCULOS
========================================== */

export async function obtenerRendimientoVehiculos(
  filtros: {
    dia?: string
    semana?: number
    mes?: string
  } = {},
) {
  const query = crearQuery(filtros)

  const response = await fetch(`${API}/dashboard/rendimiento-vehiculos?${query}`)
  if (!response.ok) {
    throw new Error('No fue posible obtener el rendimiento de vehículos')
  }

  return await response.json()
}

/* ==========================================
   KM POR ZONA
========================================== */

export async function obtenerKmPorZona(
  filtros: {
    dia?: string
    semana?: number
    mes?: string
    top?: number
  } = {},
) {
  const query = crearQuery(filtros)

  const response = await fetch(`${API}/dashboard/km-por-zona?${query}`)
  if (!response.ok) {
    throw new Error('No fue posible obtener los kilómetros por zona')
  }

  return await response.json()
}
/* ==========================================
   VEHÍCULO MENOR KILOMETRAJE
========================================== */

export async function obtenerVehiculoMenorKilometraje(
  filtros: {
    dia?: string
    semana?: number
    mes?: string
  } = {},
) {
  const query = crearQuery(filtros)

  const response = await fetch(`${API}/dashboard/vehiculo-menor-kilometraje?${query}`)
  if (!response.ok) {
    throw new Error('No fue posible obtener el vehículo con menor kilometraje')
  }

  return await response.json()
}

/* ==========================================
   TIEMPO CEDI AM VEHÍCULOS
========================================== */

export async function obtenerTiempoCediAmVehiculos(
  filtros: {
    dia?: string
    semana?: number
    mes?: string
  } = {},
) {
  const query = crearQuery(filtros)

  const response = await fetch(`${API}/dashboard/tiempo-cedi-am-vehiculos?${query}`)
  if (!response.ok) {
    throw new Error('No fue posible obtener el tiempo CEDI AM de los vehículos')
  }

  return await response.json()
}

/* ==========================================
   TIEMPO CEDI PM VEHÍCULOS
========================================== */

export async function obtenerTiempoCediPmVehiculos(
  filtros: {
    dia?: string
    semana?: number
    mes?: string
  } = {},
) {
  const query = crearQuery(filtros)

  const response = await fetch(`${API}/dashboard/tiempo-cedi-am-zona?${query}`)
  if (!response.ok) {
    throw new Error('No fue posible obtener el tiempo CEDI PM de los vehículos')
  }

  return await response.json()
}

/* ==========================================
   TIEMPO CEDI AM ZONAS
========================================== */

export async function obtenerTiempoCediAmZona(
  filtros: {
    dia?: string
    semana?: number
    mes?: string
  } = {},
) {
  const query = crearQuery(filtros)

  const response = await fetch(`${API}/dashboard/tiempo-cedi-am-zona?${query}`)
  if (!response.ok) {
    throw new Error('No fue posible obtener el tiempo CEDI AM por zona')
  }

  return await response.json()
}

/* ==========================================
   TIEMPO CEDI PM ZONAS
========================================== */

export async function obtenerTiempoCediPmZona(
  filtros: {
    dia?: string
    semana?: number
    mes?: string
  } = {},
) {
  const query = crearQuery(filtros)

  const response = await fetch(`${API}/dashboard/tiempo-cedi-pm-zona?${query}`)
  if (!response.ok) {
    throw new Error('No fue posible obtener el tiempo CEDI PM por zona')
  }

  return await response.json()
}

/* ==========================================
   HORAS EXTRA POR ZONA
========================================== */

export async function obtenerHorasExtraZona(
  filtros: {
    dia?: string
    semana?: number
    mes?: string
  } = {},
) {
  const query = crearQuery(filtros)

  const response = await fetch(`${API}/dashboard/horas-extra-zona?${query}`)
  if (!response.ok) {
    throw new Error('No fue posible obtener las horas extra por zona')
  }

  return await response.json()
}
