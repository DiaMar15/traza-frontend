const API =
  "http://localhost:3333/api/v1/rutas"

/* -------------------------
   OBTENER RUTAS
------------------------- */

export async function obtenerRutas(
  page: number,
  limit: number,
  search = ""
) {

  const response = await fetch(

    `${API}?page=${page}&limit=${limit}&q=${encodeURIComponent(search || "")}`

  )

  return await response.json()
}

/* -------------------------
   OBTENER UNA RUTA
------------------------- */

export async function obtenerRuta(
  id: number
) {

  const response = await fetch(

    `${API}/${id}`

  )

  return await response.json()
}

/* -------------------------
   CREAR
------------------------- */

export async function crearRuta(
  data: any
) {

  const response = await fetch(
    API,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json"
      },

      body: JSON.stringify(data)
    }
  )

  return await response.json()
}

/* -------------------------
   ACTUALIZAR
------------------------- */

export async function actualizarRuta(
  id: number,
  data: any
) {

  const response = await fetch(

    `${API}/${id}`,

    {
      method: "PUT",

      headers: {
        "Content-Type":
          "application/json"
      },

      body: JSON.stringify(data)
    }
  )

  return await response.json()
}

/* -------------------------
   ELIMINAR
------------------------- */

export async function eliminarRuta(
  id: number
) {

  const response = await fetch(

    `${API}/${id}`,

    {
      method: "DELETE"
    }
  )

  return await response.json()
}