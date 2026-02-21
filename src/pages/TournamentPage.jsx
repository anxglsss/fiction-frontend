import confetti from 'canvas-confetti'
import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FictionsApi, TournamentsApi } from '../api'

function BackgroundMusic() {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = 0.2
    audio.loop = true
    audio.play().then(() => setPlaying(true)).catch(() => {})
  }, [])

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !muted
      setMuted(!muted)
    }
  }

  const play = () => {
    audioRef.current?.play().then(() => setPlaying(true))
  }

  return (
    <>
      <audio ref={audioRef} src="/audio/background.mp3" />
      {!playing && (
        <button type="button" className="music-btn music-btn--play" onClick={play} title="Включить музыку">
          ♪ Включить музыку
        </button>
      )}
      {playing && (
        <button type="button" className="music-btn" onClick={toggleMute} title={muted ? 'Включить звук' : 'Выключить звук'}>
          {muted ? '♪' : '♫'}
        </button>
      )}
    </>
  )
}

function getCurrentMatch(matches) {
  return matches.find((m) => {
    const c1 = m.contestant1_slug ?? m.contestant1Slug
    const c2 = m.contestant2_slug ?? m.contestant2Slug
    const w = m.winner_slug ?? m.winnerSlug
    return c1 && c2 && !w
  }) || null
}

const TYPE_RU = { anime: 'аниме', movie: 'фильм', series: 'сериал' }

const NAME_RU = {
  naruto: 'Наруто', 'attack-on-titan': 'Атака титанов', 'my-hero-academia': 'Моя геройская академия',
  'death-note': 'Тетрадь смерти', 'demon-slayer': 'Истребитель демонов', bleach: 'Блич',
  'hunter-x-hunter': 'Хантер × Хантер', 'fate-stay-night-unlimited-blade-works': 'Фейт/Остаться ночью: Безграничные клинки',
  'jujutsu-kaisen': 'Магическая битва', 'vinland-saga': 'Сага о Винланде', titanic: 'Титаник',
  'i-am-a-legend': 'Я легенда', 'the-matrix': 'Матрица', interstellar: 'Интерстеллар', avatar: 'Аватар',
  'guardians-of-the-galaxy': 'Стражи Галактики', whiplash: 'Уиплэш', 'iron-man': 'Железный человек',
  'spider-man': 'Человек-паук', 'avengers-infinity-war': 'Мстители: Война бесконечности',
  'avengers-endgame': 'Мстители: Финал', 'guardians-of-the-galaxy-vol-2': 'Стражи Галактики 2',
  'money-heist': 'Бумажный дом', 'breaking-bad': 'Во все тяжкие', 'stranger-things': 'Очень странные дела',
  'the-sopranos': 'Клан Сопрано', 'peaky-blinders': 'Острые козырьки', 'prison-break': 'Побег',
  'the-office': 'Офис', sherlock: 'Шерлок', dexter: 'Декстер', 'the-boys': 'Пацаны',
}


function fictionBySlug(fictions, slug) {
  const s = String(slug || '')
  const f = fictions.find((x) => x.slug === s)
  const name = NAME_RU[s] || (f && (f.name || f.Name)) || s
  const type = (f && (f.type || f.Type)) || ''
  return { name, slug: s, type, typeRu: TYPE_RU[type] || type }
}

export default function TournamentPage() {
  const { id } = useParams()
  const [tournament, setTournament] = useState(null)
  const [matches, setMatches] = useState([])
  const [fictions, setFictions] = useState([])
  const [loading, setLoading] = useState(true)
  const [voting, setVoting] = useState(false)
  const [error, setError] = useState('')
  const championFired = useRef(false)

  const loadTournament = async () => {
    try {
      const data = await TournamentsApi.get(id)
      setTournament(data.tournament)
      setMatches(data.matches)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTournament()
    FictionsApi.list().then(setFictions)
  }, [id])

  const currentMatch = getCurrentMatch(matches)
  const isCompleted = tournament?.status === 'completed'
  const finalMatch = matches.find((m) => m.round === 5)
  const winnerSlug = isCompleted && finalMatch ? (finalMatch.winner_slug ?? finalMatch.winnerSlug) : null

  useEffect(() => {
    if (isCompleted && winnerSlug && !championFired.current) {
      championFired.current = true
      const duration = 2500
      const end = Date.now() + duration
      const fire = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#c9a227', '#fff', '#ff6b6b']
        })
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#c9a227', '#fff', '#4ecdc4']
        })
        if (Date.now() < end) setTimeout(fire, 200)
      }
      fire()
    }
  }, [isCompleted, winnerSlug])

  const handleVote = async (winnerSlug) => {
    if (!currentMatch || voting) return
    setVoting(true)
    setError('')
    try {
      const data = await TournamentsApi.vote(id, currentMatch.id, winnerSlug)
      setTournament(data.tournament)
      setMatches(data.matches)
    } catch (err) {
      setError(err.message)
    } finally {
      setVoting(false)
    }
  }

  if (loading) return <div className="page loading">Загрузка...</div>
  if (error && !tournament) return <div className="page error-page">{error}</div>

  return (
    <div className="page tournament-page">
      <BackgroundMusic />
      <header className="tournament-header">
        <h1>Турнир фантастики</h1>
        <p className="user-name">{tournament?.user?.name}</p>
        <Link to="/" className="secondary back-link">← Новый турнир</Link>
      </header>

      {error && <p className="error">{error}</p>}

      {isCompleted && winnerSlug ? (
        <section className="result-card">
          <h2>Победитель</h2>
          <p className="champion-text">Твоя любимая фантастика — это</p>
          <div className="champion">
            <FictionCard
              fiction={fictionBySlug(fictions, winnerSlug)}
              onClick={() => {}}
              disabled
            />
          </div>
        </section>
      ) : currentMatch ? (
        <section className="match-card">
          <p className="round-label">Раунд {currentMatch.round}</p>
          <p className="vs">vs</p>
          <div className="match-contestants">
            <FictionCard
              fiction={fictionBySlug(fictions, currentMatch.contestant1_slug ?? currentMatch.contestant1Slug)}
              onClick={() => handleVote(currentMatch.contestant1_slug ?? currentMatch.contestant1Slug)}
              disabled={voting}
              side="left"
            />
            <FictionCard
              fiction={fictionBySlug(fictions, currentMatch.contestant2_slug ?? currentMatch.contestant2Slug)}
              onClick={() => handleVote(currentMatch.contestant2_slug ?? currentMatch.contestant2Slug)}
              disabled={voting}
              side="right"
            />
          </div>
          <p className="pick-hint">Нажми на любимый, чтобы продолжить</p>
        </section>
      ) : (
        <section className="card">
          <p className="muted">Нет активного матча.</p>
        </section>
      )}
    </div>
  )
}

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.webp']

function FictionCard({ fiction, onClick, disabled, side }) {
  const [extIndex, setExtIndex] = useState(0)
  const [failed, setFailed] = useState(false)
  const imageUrl = `/images/${fiction.slug}${IMAGE_EXTENSIONS[extIndex]}`

  useEffect(() => {
    setExtIndex(0)
    setFailed(false)
  }, [fiction.slug])

  const handleImageError = () => {
    if (extIndex < IMAGE_EXTENSIONS.length - 1) {
      setExtIndex((i) => i + 1)
    } else {
      setFailed(true)
    }
  }
  return (
    <button
      className={`fiction-card fiction-card--${side || 'center'}`}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      <div className="fiction-card__image">
        {!failed && (
          <img key={imageUrl} src={imageUrl} alt={fiction.name} onError={handleImageError} />
        )}
      </div>
      <p className="fiction-card__name">{fiction.name}</p>
      {fiction.typeRu && <span className="fiction-card__type">{fiction.typeRu}</span>}
    </button>
  )
}
