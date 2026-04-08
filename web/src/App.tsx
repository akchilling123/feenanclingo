import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { useAuth } from './hooks/useAuth'
import { useSync } from './hooks/useSync'
import Home from './pages/Home'
import Practice from './pages/Practice'
import Review from './pages/Review'
import Progress from './pages/Progress'
import DailyChallenge from './pages/DailyChallenge'
import Auth from './pages/Auth'
import BottomNav from './components/navigation/BottomNav'

function AppContent() {
  const { user, loading } = useAuth()

  // Sync when authenticated
  useSync(user?.id)

  if (loading) {
    return (
      <div className="min-h-svh bg-navy flex items-center justify-center">
        <p className="font-serif text-2xl text-cream animate-pulse">Feenancelingo</p>
      </div>
    )
  }

  if (!user) {
    return <Auth />
  }

  return (
    <div className="pb-16">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <main id="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/review" element={<Review />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/daily" element={<DailyChallenge />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
