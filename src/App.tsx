import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Practice from './pages/Practice'
import Review from './pages/Review'
import Progress from './pages/Progress'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/practice" element={<Practice />} />
      <Route path="/review" element={<Review />} />
      <Route path="/progress" element={<Progress />} />
    </Routes>
  )
}

export default App
