import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { TournamentsApi } from '../api'

export default function StartPage() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const user = state?.user
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleStartTournament = async () => {
    if (!user) return
    setError('')
    setLoading(true)
    try {
      const tournament = await TournamentsApi.create(user.id)
      navigate(`/tournament/${tournament.id}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="page home-page">
        <header>
          <h1>Турнир фантастики</h1>
          <p className="tagline">Выбери свой любимый фильм, аниме или сериал</p>
        </header>
        <section className="card">
          <p className="muted">Сначала введите имя</p>
          <Link to="/" className="primary" style={{ marginTop: '1rem', display: 'inline-block', textDecoration: 'none' }}>← Назад</Link>
        </section>
      </div>
    )
  }

  return (
    <div className="page home-page">
      <header>
        <h1>Турнир фантастики</h1>
        <p className="tagline">Выбери свой любимый фильм, аниме или сериал</p>
      </header>

      <section className="card start-card">
        <p className="welcome">Привет, <strong>{user.name}</strong>!</p>
        <button
          className="primary start-btn"
          onClick={handleStartTournament}
          disabled={loading}
        >
          {loading ? 'Запуск...' : 'Начать турнир'}
        </button>
        {error && <p className="error">{error}</p>}
        <Link to="/" className="secondary back-link">← Другой игрок</Link>
      </section>
    </div>
  )
}
