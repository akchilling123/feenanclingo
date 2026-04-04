import { Link } from 'react-router-dom'

export default function Review() {
  return (
    <div className="flex flex-col items-center justify-center min-h-svh p-8">
      <h1 className="text-3xl font-bold text-white mb-4">Review</h1>
      <p className="text-gray-400 mb-8">Revisit questions you got wrong.</p>
      <Link to="/" className="text-interactive hover:underline">← Back home</Link>
    </div>
  )
}
