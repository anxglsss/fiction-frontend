import api from '../axios'

export class FictionsApi {
  static async list() {
    const { data } = await api.get('/fictions')
    return data
  }
}
