import api from '../axios'

export class TournamentsApi {
  static async create(userId) {
    const { data } = await api.post('/tournaments', { user_id: userId })
    return data
  }

  static async list() {
    const { data } = await api.get('/tournaments')
    return data
  }

  static async get(id) {
    const { data } = await api.get(`/tournaments/${id}`)
    return data
  }

  static async vote(tournamentId, matchId, winnerSlug) {
    const { data } = await api.post(
      `/tournaments/${tournamentId}/matches/${matchId}/vote`,
      { winner_slug: winnerSlug }
    )
    return data
  }
}
