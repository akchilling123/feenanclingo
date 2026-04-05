import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Practice from './pages/Practice'
import Review from './pages/Review'
import Progress from './pages/Progress'
import DailyChallenge from './pages/DailyChallenge'
import BottomNav from './components/navigation/BottomNav'

function App() {
  return (
    <div className="pb-16">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/review" element={<Review />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/daily" element={<DailyChallenge />} />
      </Routes>
      <BottomNav />
    </div>
  )
}

export default App
