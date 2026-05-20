const API =

  'http://localhost:3333/api/v1'

export default class GoogleSheetsService {

  async sincronizarRutas() {

    const response = await fetch(

      `${API}/sync-rutas`,

      {
        method: 'GET',
      }
    )

    const data =
      await response.json()

    if (!response.ok) {

      throw new Error(

        data.message ||

        'Error sincronizando rutas'
      )
    }

    return data
  }
}