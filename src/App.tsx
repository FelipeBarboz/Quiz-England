import { Routes, Route } from 'react-router-dom'
import Register from './pages/Register'
import Quiz from './pages/Quiz'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Register />} />
      <Route path="/quiz" element={<Quiz />} />
    </Routes>
  )
}