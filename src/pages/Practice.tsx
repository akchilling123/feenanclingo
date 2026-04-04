import { Link } from 'react-router-dom'

export default function Practice() {
  return (
    <div className="flex flex-col items-center justify-center min-h-svh p-8">
      <h1 className="text-3xl font-bold text-white mb-4">Practice</h1>
      <p className="text-gray-400 mb-8">Choose a topic and start a round.</p>
      <Link to="/" className="text-interactive hover:underline">← Back home</Link>
    </div>
  )
}
