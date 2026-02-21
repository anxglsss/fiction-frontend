import api from '../axios'

export class UsersApi {
  static async create(name) {
    const { data } = await api.post('/users', { name })
    return data
  }

  static async list() {
    const { data } = await api.get('/users')
    return data
  }
}
