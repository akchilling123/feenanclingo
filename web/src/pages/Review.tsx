import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useReviewQueue } from '../hooks/useReviewQueue'
import { useProgress } from '../hooks/useProgress'
import { checkAnswer } from '../utils/questionEngine'
import { getTopicDisplayName } from '../utils/questionEngine'
import { QuestionCard } from '../components/questions/QuestionCard'
import type { Question } from '../types'

export default function Review() {
  const { reviewQueue, reviewCount, hasReviewItems, getReviewRound } = useReviewQueue()
  const { recordAnswer } = useProgress()

  // Round state
  const [roundQuestions, setRoundQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [roundScore, setRoundScore] = useState(0)
  const [roundXP, setRoundXP] = useState(0)
  const [roundComplete, setRoundComplete] = useState(false)
  const inRound = roundQuestions.length > 0

  const startRound = useCallback(() => {
    const count = Math.min(5, reviewCount)
    const questions = getReviewRound(count)
    setRoundQuestions(questions)
    setCurrentIndex(0)
    setUserAnswer(null)
    setShowResult(false)
    setRoundScore(0)
    setRoundXP(0)
    setRoundComplete(false)
  }, [reviewCount, getReviewRound])

  const handleAnswer = useCallback(
    (answer: string) => {
      if (showResult) return
      const question = roundQuestions[currentIndex]
      let isCorrect: boolean

      if (question.type === 'conceptual') {
        isCorrect = answer === 'correct'
      } else {
        isCorrect = checkAnswer(question, answer)
      }

      const xp = recordAnswer(question.id, question.topic, question.difficulty, isCorrect)

      setUserAnswer(answer)
      setShowResult(true)
      if (isCorrect) setRoundScore(prev => prev + 1)
      setRoundXP(prev => prev + xp)
    },
    [showResult, roundQuestions, currentIndex, recordAnswer]
  )

  const advance = useCallback(() => {
    if (currentIndex + 1 >= roundQuestions.length) {
      setRoundComplete(true)
    } else {
      setCurrentIndex(prev => prev + 1)
      setUserAnswer(null)
      setShowResult(false)
    }
  }, [currentIndex, roundQuestions.length])

  const exitRound = useCallback(() => {
    setRoundQuestions([])
    setRoundComplete(false)
  }, [])

  // ---------- Round Complete Screen ----------
  if (inRound && roundComplete) {
    return (
      <div className="min-h-svh bg-navy flex flex-col justify-center px-6">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h1 className="font-serif text-2xl text-cream">Review Complete</h1>
            <div className="divider mt-4" />
          </div>

          <p className="font-serif text-4xl text-gold">
            {roundScore}/{roundQuestions.length}
          </p>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-cream-dark/50">Score</span>
              <span className="text-cream">
                {roundScore} of {roundQuestions.length} correct
              </span>
            </div>
            <div className="divider" />
            <div className="flex justify-between text-sm">
              <span className="text-cream-dark/50">XP Earned</span>
              <span className="text-gold">+{roundXP}</span>
            </div>
            <div className="divider" />
            <div className="flex justify-between text-sm">
              <span className="text-cream-dark/50">Remaining</span>
              <span className="text-cream">{reviewCount}</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            {reviewCount > 0 ? (
              <button
                onClick={startRound}
                className="w-full bg-gold text-navy py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Continue Reviewing
              </button>
            ) : (
              <Link
                to="/"
                className="w-full inline-block bg-gold text-navy py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity text-center"
              >
                Back to Home
              </Link>
            )}
            <button
              onClick={exitRound}
              className="w-full text-cream-dark/60 py-3 text-sm hover:text-cream transition-colors"
            >
              Back to Queue
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ---------- Active Round ----------
  if (inRound && !roundComplete) {
    const question = roundQuestions[currentIndex]
    const progress = ((currentIndex + (showResult ? 1 : 0)) / roundQuestions.length) * 100

    return (
      <div className="min-h-svh bg-navy flex flex-col">
        {/* Top bar */}
        <div className="px-6 pt-5 pb-3 space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={exitRound}
              className="text-cream-dark/50 hover:text-cream text-sm transition-colors"
            >
              Exit
            </button>
            <span className="text-xs uppercase tracking-wider text-cream-dark/60">
              Question {currentIndex + 1} of {roundQuestions.length}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1 bg-navy-mid rounded-full overflow-hidden">
            <div
              className="h-full bg-gold rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="flex-1 px-6 py-4 max-w-2xl mx-auto w-full">
          <QuestionCard
            question={question}
            onAnswer={handleAnswer}
            showResult={showResult}
            userAnswer={userAnswer}
          />

          {/* Next button */}
          {showResult && (
            <button
              onClick={advance}
              className="mt-4 w-full bg-gold text-navy py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              {currentIndex + 1 >= roundQuestions.length ? 'See Results' : 'Continue'}
            </button>
          )}
        </div>
      </div>
    )
  }

  // ---------- Queue Overview (no active round) ----------
  return (
    <div className="min-h-svh bg-navy flex flex-col">
      {/* Header */}
      <div className="px-6 pt-8 pb-2">
        <Link to="/" className="text-cream-dark/50 text-xs uppercase tracking-wider hover:text-cream-dark transition-colors">
          Home
        </Link>

        <div className="flex items-baseline gap-3 mt-4">
          <h1 className="font-serif text-2xl text-cream">Review</h1>
          {hasReviewItems && (
            <span className="text-gold text-lg font-serif">{reviewCount}</span>
          )}
        </div>
        <div className="divider mt-4" />
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-8 max-w-2xl mx-auto w-full">
        {!hasReviewItems ? (
          /* Empty state */
          <div className="py-20">
            <div className="divider mb-6" />
            <p className="font-serif text-xl italic text-cream-dark/50">
              Nothing to review.
            </p>
            <p className="text-sm text-cream-dark/40 mt-2">
              Missed questions will appear here for reinforcement.
            </p>
            <div className="divider mt-6 mb-8" />
            <Link
              to="/practice"
              className="inline-block bg-gold text-navy px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Go to Practice
            </Link>
          </div>
        ) : (
          /* Queue list + start button */
          <div className="pt-6 space-y-6">
            <div className="border-l-2 border-gold">
              {reviewQueue.slice(0, 10).map((q, i) => (
                <div
                  key={q.id}
                  className={`pl-4 py-3 ${i < Math.min(9, reviewQueue.length - 1) ? 'border-b border-gold/8' : ''}`}
                >
                  <p className="text-cream-dark text-sm line-clamp-2">
                    {q.question_text}
                  </p>
                  <p className="text-xs text-cream-dark/40 mt-1">
                    {getTopicDisplayName(q.topic)} &middot; {q.difficulty}
                  </p>
                </div>
              ))}
            </div>

            {reviewCount > 10 && (
              <p className="text-cream-dark/40 text-xs">
                +{reviewCount - 10} more in queue
              </p>
            )}

            <button
              onClick={startRound}
              className="w-full bg-gold text-navy py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Begin Review
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
