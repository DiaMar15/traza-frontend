import { API } from '@/config/api'

/*
Subir archivo Excel
*/
export async function importarExcel(file: File) {
  const formData = new FormData()

  formData.append('excel', file)

  const res = await fetch(`${API}/importar-excel`, {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    throw new Error('Error importando Excel')
  }

  return res.json()
}
