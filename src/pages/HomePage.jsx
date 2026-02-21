import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UsersApi } from '../api'

export default function HomePage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmitName = async (e) => {
    e.preventDefault()
    setError('')
    if (!name.trim()) return
    setLoading(true)
    try {
      const created = await UsersApi.create(name.trim())
      navigate('/start', { state: { user: created } })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page home-page">
      <header>
        <h1>Турнир фантастики</h1>
        <p className="tagline">Выбери свой любимый фильм, аниме или сериал</p>
      </header>

      <section className="card">
        <form onSubmit={handleSubmitName} className="name-form">
          <label htmlFor="player-name" className="name-form__label">Ваше имя</label>
          <input
            id="player-name"
            type="text"
            placeholder="Введите ваше настоящее имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            autoFocus
          />
          <button type="submit" disabled={loading}>
            {loading ? '...' : 'Далее'}
          </button>
        </form>
        {error && <p className="error">{error}</p>}
      </section>
    </div>
  )
}
