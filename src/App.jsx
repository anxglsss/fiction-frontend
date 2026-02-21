import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import StartPage from './pages/StartPage'
import TournamentPage from './pages/TournamentPage'

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/start" element={<StartPage />} />
          <Route path="/tournament/:id" element={<TournamentPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
