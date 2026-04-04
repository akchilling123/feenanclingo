import { useNavigate } from 'react-router-dom'
import type { Level } from '../../types'

interface RoundCompleteProps {
  score: number
  total: number
  xpEarned: number
  currentLevel: Level
  xpProgress: { current: number; required: number; progress: number }
  onPracticeAgain: () => void
}

export function RoundComplete({
  score,
  total,
  xpEarned,
  currentLevel,
  xpProgress,
  onPracticeAgain,
}: RoundCompleteProps) {
  const navigate = useNavigate()
  const percentage = Math.round((score / total) * 100)

  const resultMessage =
    percentage === 100
      ? 'Perfect Round'
      : percentage >= 80
        ? 'Well Done'
        : percentage >= 60
          ? 'Solid Effort'
          : 'Keep Practicing'

  return (
    <div className="flex flex-col items-start px-5 pt-10 pb-8 max-w-lg animate-fade-in">
      {/* Score circle */}
      <div className="relative w-32 h-32 mb-8 self-center">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            className="text-navy-mid"
          />
          <circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            strokeWidth="6"
            strokeLinecap="round"
            className="text-gold"
            stroke="currentColor"
            strokeDasharray={`${(percentage / 100) * 327} 327`}
            style={{ transition: 'stroke-dasharray 1s ease-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-serif text-cream">{score}/{total}</span>
          <span className="text-xs text-cream-dark/50 mt-0.5">{percentage}%</span>
        </div>
      </div>

      <h2 className="font-serif text-2xl text-cream self-center mb-2">{resultMessage}</h2>

      {/* XP earned */}
      <div className="self-center mb-10">
        <span className="text-gold font-serif text-lg">+{xpEarned} XP</span>
      </div>

      {/* Level progress */}
      <div className="w-full mb-10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-cream-dark/50 text-xs uppercase tracking-wider">Level</span>
          <span className="text-cream text-sm">{currentLevel}</span>
        </div>
        <div className="w-full h-1 bg-navy-mid rounded-full overflow-hidden">
          <div
            className="h-full bg-gold rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${Math.min(xpProgress.progress * 100, 100)}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-cream-dark/40 text-xs tabular-nums">
            {xpProgress.current} / {xpProgress.required} XP
          </span>
          <span className="text-cream-dark/40 text-xs tabular-nums">
            {Math.round(xpProgress.progress * 100)}%
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="w-full space-y-3">
        <button
          onClick={onPracticeAgain}
          className="w-full py-3.5 bg-gold text-navy font-medium text-sm tracking-wide transition-all duration-200 hover:brightness-110 active:scale-[0.98] cursor-pointer"
        >
          Practice Again
        </button>
        <button
          onClick={() => navigate('/')}
          className="w-full py-3.5 text-cream-dark/60 text-sm border-b border-cream-dark/15 transition-colors duration-200 hover:text-cream hover:border-cream-dark/30 cursor-pointer bg-transparent"
        >
          Home
        </button>
      </div>
    </div>
  )
}
