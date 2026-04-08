import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useProgress } from '../hooks/useProgress'
import { useStreak } from '../hooks/useStreak'
import { useReviewQueue } from '../hooks/useReviewQueue'
import { useHearts } from '../hooks/useHearts'
import { useDailyChallenge } from '../hooks/useDailyChallenge'
import HeartsDisplay from '../components/ui/HeartsDisplay'
import { ALL_TOPICS, getTopicDisplayName } from '../utils/questionEngine'

function formatRegenTime(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}

export default function Home() {
  const { currentLevel, xpToNextLevel, topicProgress } = useProgress()
  const { currentStreak } = useStreak()
  const { reviewCount, hasReviewItems } = useReviewQueue()
  const { hearts, maxHearts, regenerateHearts, nextRegenTime } = useHearts()
  const { challenge, isCompleted: dailyCompleted } = useDailyChallenge()

  // Regenerate hearts on mount
  useEffect(() => {
    regenerateHearts()
  }, [regenerateHearts])

  const topicAttempted = (topic: string) =>
    topicProgress.find(tp => tp.topic === topic)?.questions_attempted ?? 0

  return (
    <div className="page-enter min-h-svh px-6 pt-8 pb-6">
      {/* Header */}
      <div className="mb-8">
        <h1
          className="font-serif text-4xl text-cream font-medium"
          style={{ letterSpacing: '-0.03em' }}
        >
          Feenancelingo
        </h1>
        <p className="text-cream-dark text-sm mt-1">
          Investment Banking Technical Preparation
        </p>
        <div className="divider mt-6" />
      </div>

      {/* Status */}
      <div className="mb-10">
        <h2
          className="font-serif text-2xl text-gold font-medium mb-4"
          style={{ letterSpacing: '-0.02em' }}
        >
          {currentLevel}
        </h2>

        {/* XP bar */}
        <div className="mb-5">
          <div className="flex justify-between text-xs text-cream-dark/60 mb-1.5">
            <span>{xpToNextLevel.current} XP</span>
            <span>{xpToNextLevel.required} XP</span>
          </div>
          <div className="w-full h-[2px] bg-navy-mid rounded-full overflow-hidden">
            <div
              className="h-full bg-gold rounded-full transition-all duration-500"
              style={{ width: `${Math.min(xpToNextLevel.progress, 100)}%` }}
            />
          </div>
        </div>

        {/* Streak */}
        <div className="flex items-center gap-3">
          <div className="w-[2px] h-6 bg-gold rounded-full" />
          <span className="text-cream text-2xl font-medium leading-none">
            {currentStreak}
          </span>
          <span className="text-cream-dark text-sm">day streak</span>
        </div>

        {/* Hearts */}
        <div className="mt-4">
          <div className="flex items-center gap-3">
            <div className="w-[2px] h-6 bg-incorrect/60 rounded-full" />
            <HeartsDisplay hearts={hearts} maxHearts={maxHearts} size="lg" />
          </div>
          {hearts < maxHearts && nextRegenTime !== null && (
            <p className="text-cream-dark/40 text-xs mt-1.5 ml-[14px]">
              Next heart in {formatRegenTime(nextRegenTime)}
            </p>
          )}
        </div>
      </div>

      {/* Daily Challenge */}
      <div className="mb-10">
        {dailyCompleted ? (
          <div className="border-l-2 border-gold/30 pl-4">
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-correct"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
              <span className="text-cream-dark/50 text-sm">Daily Challenge Completed</span>
            </div>
            <p className="text-cream-dark/30 text-xs mt-1">{challenge.title}</p>
          </div>
        ) : (
          <Link to="/daily" className="block border-l-2 border-gold pl-4 group">
            <h3 className="text-cream font-medium text-[15px] group-hover:text-gold transition-colors duration-200">
              Daily Challenge
            </h3>
            <p className="text-cream-dark text-sm mt-0.5">
              {challenge.title}
            </p>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-cream-dark/50 text-xs">{challenge.questionCount} questions</span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-gold/15 text-gold border border-gold/25">
                2x XP
              </span>
            </div>
          </Link>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mb-12">
        <Link
          to="/practice"
          className="block w-full bg-gold text-navy text-center font-semibold py-4 rounded-lg hover:brightness-110 transition-all duration-200"
        >
          Begin Practice
        </Link>

        <div className="flex gap-6 mt-5">
          <Link
            to="/review"
            className="text-cream-dark text-sm border-b border-gold/20 pb-0.5 hover:text-cream transition-colors duration-200"
          >
            Review Queue{hasReviewItems ? ` \u00B7 ${reviewCount}` : ''}
          </Link>
          <Link
            to="/progress"
            className="text-cream-dark text-sm border-b border-gold/20 pb-0.5 hover:text-cream transition-colors duration-200"
          >
            View Progress
          </Link>
        </div>
      </div>

      {/* Topics */}
      <div>
        <h3 className="font-serif text-xs text-cream-dark uppercase tracking-wider mb-4">
          Topics
        </h3>
        <div className="flex gap-5 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-none">
          {ALL_TOPICS.map(topic => {
            const attempted = topicAttempted(topic) > 0
            return (
              <div
                key={topic}
                className="flex items-center gap-2 shrink-0"
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    attempted ? 'bg-gold' : 'bg-navy-mid'
                  }`}
                />
                <span className="text-cream-dark/80 text-sm whitespace-nowrap">
                  {getTopicDisplayName(topic)}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
