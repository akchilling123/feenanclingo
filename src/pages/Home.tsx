import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-svh p-8">
      <h1 className="text-4xl font-bold text-gold mb-4">Feenancelingo</h1>
      <p className="text-gray-400 mb-8">Master IB technicals, one question at a time.</p>
      <div className="flex gap-4">
        <Link to="/practice" className="bg-interactive text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90">
          Start Practice
        </Link>
        <Link to="/review" className="border border-gray-600 text-gray-300 px-6 py-3 rounded-lg font-semibold hover:border-gray-400">
          Review
        </Link>
        <Link to="/progress" className="border border-gray-600 text-gray-300 px-6 py-3 rounded-lg font-semibold hover:border-gray-400">
          Progress
        </Link>
      </div>
    </div>
  )
}
