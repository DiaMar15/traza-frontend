const API = "http://localhost:3333/api/v1"

/*
Subir archivo Excel
*/
export async function importarExcel(file: File) {

  const formData = new FormData()

  formData.append("excel", file)

  const res = await fetch(`${API}/importar-excel`, {
    method: "POST",
    body: formData
  })

  if (!res.ok) {
    throw new Error("Error importando Excel")
  }

  return res.json()
}