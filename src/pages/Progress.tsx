import { Link } from 'react-router-dom'

export default function Progress() {
  return (
    <div className="flex flex-col items-center justify-center min-h-svh p-8">
      <h1 className="text-3xl font-bold text-white mb-4">Progress</h1>
      <p className="text-gray-400 mb-8">Track your XP and level.</p>
      <Link to="/" className="text-interactive hover:underline">← Back home</Link>
    </div>
  )
}
