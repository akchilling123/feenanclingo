import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useProgress } from '../hooks/useProgress'
import { useStreak } from '../hooks/useStreak'
import { ALL_TOPICS, getTopicDisplayName, getTopicStats } from '../utils/questionEngine'
import ProgressBar from '../components/ui/ProgressBar'
import type { Topic } from '../types'

function getAccuracyColor(accuracy: number): string {
  if (accuracy > 80) return 'bg-correct'
  if (accuracy >= 50) return 'bg-gold'
  return 'bg-incorrect'
}

function getAccuracyTextColor(accuracy: number): string {
  if (accuracy > 80) return 'text-correct'
  if (accuracy >= 50) return 'text-gold'
  return 'text-incorrect'
}

function TopicRow({ topic, attempted, correct }: { topic: Topic; attempted: number; correct: number }) {
  const [expanded, setExpanded] = useState(false)
  const displayName = getTopicDisplayName(topic)
  const stats = getTopicStats(topic)
  const accuracy = attempted > 0 ? (correct / attempted) * 100 : -1
  const hasData = attempted > 0

  return (
    <button
      type="button"
      onClick={() => setExpanded(!expanded)}
      className="w-full text-left py-4 border-b border-gold/8 last:border-b-0 transition-colors"
    >
      <div className="flex items-center justify-between">
        <span className="text-cream text-sm">{displayName}</span>
        {hasData ? (
          <span className={`text-sm font-medium ${getAccuracyTextColor(accuracy)}`}>
            {Math.round(accuracy)}%
          </span>
        ) : (
          <span className="text-cream-dark/40 text-sm">&mdash;</span>
        )}
      </div>

      <div className="mt-2">
        {hasData ? (
          <ProgressBar
            value={correct}
            max={attempted}
            color={getAccuracyColor(accuracy)}
            height="h-0.5"
          />
        ) : (
          <div className="w-full h-0.5 bg-navy-mid rounded-full" />
        )}
      </div>

      <p className="text-xs text-cream-dark/40 mt-1.5">
        {attempted} / {stats.total} attempted
      </p>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-gold/8 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-cream-dark/50">Correct</span>
            <span className="text-correct font-medium">{correct}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-cream-dark/50">Incorrect</span>
            <span className="text-incorrect font-medium">{attempted - correct}</span>
          </div>
          <div className="text-xs text-cream-dark/40 pt-1">
            <p>Easy: {stats.byDifficulty.Easy} | Medium: {stats.byDifficulty.Medium} | Hard: {stats.byDifficulty.Hard}</p>
          </div>
        </div>
      )}
    </button>
  )
}

export default function Progress() {
  const { userProgress, topicProgress, currentLevel, xpToNextLevel, resetProgress } = useProgress()
  const { currentStreak, isStreakActive } = useStreak()

  const totalAttempted = topicProgress.reduce((sum, tp) => sum + tp.questions_attempted, 0)
  const totalCorrect = topicProgress.reduce((sum, tp) => sum + tp.questions_correct, 0)
  const overallAccuracy = totalAttempted > 0 ? (totalCorrect / totalAttempted) * 100 : 0

  const isMaxLevel = xpToNextLevel.progress >= 1

  const handleReset = () => {
    if (window.confirm('Reset all progress? This cannot be undone.')) {
      resetProgress()
    }
  }

  return (
    <div className="min-h-svh bg-navy pb-16">
      {/* Header */}
      <div className="px-6 pt-8 pb-2 max-w-lg mx-auto">
        <Link to="/" className="text-cream-dark/50 text-xs uppercase tracking-wider hover:text-cream-dark transition-colors">
          Home
        </Link>
        <h1 className="font-serif text-2xl text-cream mt-4">Progress</h1>
        <div className="divider mt-4" />
      </div>

      <div className="px-6 max-w-lg mx-auto">
        {/* Level Section */}
        <section className="pt-8 pb-6">
          <p className="text-3xl font-serif text-gold">{currentLevel}</p>

          {isMaxLevel ? (
            <p className="text-xs text-correct mt-3 font-medium">Max level reached</p>
          ) : (
            <div className="mt-4">
              <ProgressBar
                value={xpToNextLevel.current}
                max={xpToNextLevel.required}
                color="bg-gold"
                height="h-1"
              />
              <p className="text-xs text-cream-dark/60 mt-2">
                {xpToNextLevel.current} / {xpToNextLevel.required} XP
              </p>
            </div>
          )}

          <p className="text-xs text-cream-dark/40 mt-1">
            {userProgress.total_xp} XP total
          </p>
        </section>

        <div className="divider" />

        {/* Streak Section */}
        <section className="py-6">
          {isStreakActive ? (
            <div className="border-l-2 border-gold pl-4">
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-2xl text-cream">{currentStreak}</span>
                <span className="text-sm text-cream-dark/60">day streak</span>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-2xl text-cream">{currentStreak}</span>
                <span className="text-sm text-cream-dark/60">day streak</span>
              </div>
              <p className="text-sm text-cream-dark/50 italic mt-2">
                Practice today to continue your streak.
              </p>
            </div>
          )}
        </section>

        <div className="divider" />

        {/* Topic Mastery Section */}
        <section className="py-6">
          <p className="text-xs uppercase tracking-wider text-cream-dark/60 mb-4">Topic Mastery</p>
          <div>
            {ALL_TOPICS.map(topic => {
              const tp = topicProgress.find(t => t.topic === topic)
              return (
                <TopicRow
                  key={topic}
                  topic={topic}
                  attempted={tp?.questions_attempted ?? 0}
                  correct={tp?.questions_correct ?? 0}
                />
              )
            })}
          </div>
        </section>

        <div className="divider" />

        {/* Summary Stats */}
        <section className="py-6">
          <p className="text-xs uppercase tracking-wider text-cream-dark/60 mb-4">Summary</p>
          <div className="flex">
            <div className="flex-1">
              <p className="text-xl text-cream">{totalAttempted}</p>
              <p className="text-xs text-cream-dark/50 mt-0.5">Questions</p>
            </div>
            <div className="flex-1 border-l border-gold/15 pl-4">
              <p className={`text-xl ${totalAttempted > 0 ? getAccuracyTextColor(overallAccuracy) : 'text-cream-dark/40'}`}>
                {totalAttempted > 0 ? `${Math.round(overallAccuracy)}%` : '--'}
              </p>
              <p className="text-xs text-cream-dark/50 mt-0.5">Accuracy</p>
            </div>
            <div className="flex-1 border-l border-gold/15 pl-4">
              <p className="text-xl text-cream">{userProgress.daily_questions_completed}</p>
              <p className="text-xs text-cream-dark/50 mt-0.5">Today</p>
            </div>
          </div>
        </section>

        {/* Reset */}
        <div className="pt-8 pb-4">
          <button
            type="button"
            onClick={handleReset}
            className="text-sm text-cream-dark/30 italic hover:text-incorrect transition-colors"
          >
            Reset all progress
          </button>
        </div>
      </div>
    </div>
  )
}
