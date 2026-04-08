import { useState, useCallback, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { QuestionCard } from '../components/questions/QuestionCard'
import { RoundComplete } from '../components/rounds/RoundComplete'
import { Timer } from '../components/ui/Timer'
import HeartsDisplay from '../components/ui/HeartsDisplay'
import { useProgress } from '../hooks/useProgress'
import { useStreak } from '../hooks/useStreak'
import { useHearts } from '../hooks/useHearts'
import { useTimer } from '../hooks/useTimer'
import {
  ALL_TOPICS,
  getQuestionsForRound,
  checkAnswer,
  getTopicDisplayName,
  getTopicStats,
} from '../utils/questionEngine'
import type { Topic, Difficulty, RoundSize, Question, RoundAnswer } from '../types'

const TIMED_SECONDS: Record<Difficulty, number> = {
  Easy: 30,
  Medium: 45,
  Hard: 60,
}

const CONCEPTUAL_SECONDS = 90
const TIMED_XP_MULTIPLIER = 1.5

function getTimerSeconds(question: Question): number {
  if (question.type === 'conceptual') return CONCEPTUAL_SECONDS
  return TIMED_SECONDS[question.difficulty]
}

type Phase = 'topic-select' | 'round-config' | 'active-round' | 'round-complete' | 'out-of-hearts'

function formatRegenTime(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}

export default function Practice() {
  const { topicProgress, questionHistory, currentLevel, xpToNextLevel, recordAnswer } = useProgress()
  const { completePractice } = useStreak()
  const { hearts, maxHearts, loseHeart, regenerateHearts, nextRegenTime } = useHearts()
  const navigate = useNavigate()

  // Regenerate hearts on mount
  useEffect(() => {
    regenerateHearts()
  }, [regenerateHearts])

  // Phase management
  const [phase, setPhase] = useState<Phase>('topic-select')
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null)

  // Round state
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<RoundAnswer[]>([])
  const [totalXP, setTotalXP] = useState(0)

  // Timed mode state
  const [timedMode, setTimedMode] = useState(false)
  const [timedBonusXP, setTimedBonusXP] = useState(0)
  const [timeUpIndicator, setTimeUpIndicator] = useState(false)
  const timer = useTimer(30) // default; reset per question

  // Question interaction state
  const [showResult, setShowResult] = useState(false)
  const [userAnswer, setUserAnswer] = useState<string | null>(null)
  const [xpPopup, setXpPopup] = useState<{ amount: number; key: number; label?: string } | null>(null)
  const popupCounter = useRef(0)
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Cleanup advance timer on unmount
  useEffect(() => {
    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current)
    }
  }, [])

  // Reset and start countdown timer when question changes (timed mode only)
  useEffect(() => {
    if (phase !== 'active-round' || !timedMode || questions.length === 0) return
    const question = questions[currentIndex]
    const secs = getTimerSeconds(question)
    timer.reset(secs)
    timer.start()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, timedMode, currentIndex])

  // Pause timer when showing result
  useEffect(() => {
    if (showResult && timedMode) {
      timer.pause()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showResult, timedMode])

  // Handle timer expiry — auto-submit as incorrect
  const handleTimeUp = useCallback(() => {
    if (showResult || !selectedTopic || phase !== 'active-round') return

    const question = questions[currentIndex]

    // Record as incorrect
    const xpEarned = recordAnswer(question.id, question.topic, question.difficulty, false)

    const roundAnswer: RoundAnswer = {
      question_id: question.id,
      user_answer: '__time_up__',
      is_correct: false,
      xp_earned: xpEarned,
    }

    setAnswers(prev => [...prev, roundAnswer])
    setTotalXP(prev => prev + xpEarned)
    setUserAnswer('__time_up__')
    setShowResult(true)
    setTimeUpIndicator(true)

    // Lose a heart
    loseHeart()

    // Auto-advance after 1.5s
    advanceTimer.current = setTimeout(() => {
      setTimeUpIndicator(false)

      if (hearts - 1 <= 0) {
        setPhase('out-of-hearts')
        return
      }

      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1)
        setShowResult(false)
        setUserAnswer(null)
        setXpPopup(null)
      } else {
        completePractice()
        setPhase('round-complete')
      }
    }, 1500)
  }, [showResult, selectedTopic, phase, questions, currentIndex, recordAnswer, loseHeart, hearts, completePractice])

  // Fire handleTimeUp when timer expires
  useEffect(() => {
    if (timer.isExpired && timedMode && phase === 'active-round' && !showResult) {
      handleTimeUp()
    }
  }, [timer.isExpired, timedMode, phase, showResult, handleTimeUp])

  const getTopicAccuracy = useCallback(
    (topic: Topic): number | null => {
      const tp = topicProgress.find(t => t.topic === topic)
      if (!tp || tp.questions_attempted === 0) return null
      return Math.round((tp.questions_correct / tp.questions_attempted) * 100)
    },
    [topicProgress],
  )

  const handleTopicSelect = useCallback((topic: Topic) => {
    setSelectedTopic(topic)
    setPhase('round-config')
  }, [])

  const handleStartRound = useCallback(
    (size: RoundSize) => {
      if (!selectedTopic) return
      const roundQuestions = getQuestionsForRound(
        { topic: selectedTopic, question_count: size },
        questionHistory,
      )
      if (roundQuestions.length === 0) return

      setQuestions(roundQuestions)
      setCurrentIndex(0)
      setAnswers([])
      setTotalXP(0)
      setTimedBonusXP(0)
      setShowResult(false)
      setUserAnswer(null)
      setTimeUpIndicator(false)
      setPhase('active-round')
    },
    [selectedTopic, questionHistory],
  )

  const handleAnswer = useCallback(
    (answer: string) => {
      if (showResult || !selectedTopic) return

      const question = questions[currentIndex]

      // For conceptual questions: "correct" -> true, "incorrect" -> false
      let isCorrect: boolean
      if (question.type === 'conceptual') {
        isCorrect = answer === 'correct'
      } else {
        isCorrect = checkAnswer(question, answer)
      }

      const baseXP = recordAnswer(question.id, question.topic, question.difficulty, isCorrect)

      // Apply timed mode bonus
      let xpEarned = baseXP
      let bonusApplied = false
      if (timedMode && isCorrect && baseXP > 0) {
        xpEarned = Math.round(baseXP * TIMED_XP_MULTIPLIER)
        const bonus = xpEarned - baseXP
        setTimedBonusXP(prev => prev + bonus)
        bonusApplied = true
      }

      const roundAnswer: RoundAnswer = {
        question_id: question.id,
        user_answer: answer,
        is_correct: isCorrect,
        xp_earned: xpEarned,
      }

      setAnswers(prev => [...prev, roundAnswer])
      setTotalXP(prev => prev + xpEarned)
      setUserAnswer(answer)
      setShowResult(true)

      // Lose a heart on wrong answer
      if (!isCorrect) {
        loseHeart()
      }

      // Show XP popup
      if (xpEarned > 0) {
        popupCounter.current += 1
        setXpPopup({
          amount: xpEarned,
          key: popupCounter.current,
          label: bonusApplied ? `+${xpEarned} XP (1.5x)` : undefined,
        })
      }

      // Auto-advance after 1.5s
      advanceTimer.current = setTimeout(() => {
        // Check hearts after losing one (current hearts minus this wrong answer)
        if (!isCorrect && hearts - 1 <= 0) {
          setPhase('out-of-hearts')
          return
        }

        if (currentIndex < questions.length - 1) {
          setCurrentIndex(prev => prev + 1)
          setShowResult(false)
          setUserAnswer(null)
          setXpPopup(null)
        } else {
          // Round complete
          completePractice()
          setPhase('round-complete')
        }
      }, 1500)
    },
    [showResult, selectedTopic, questions, currentIndex, recordAnswer, completePractice, loseHeart, hearts, timedMode],
  )

  const handlePracticeAgain = useCallback(() => {
    setPhase('topic-select')
    setSelectedTopic(null)
    setQuestions([])
    setCurrentIndex(0)
    setAnswers([])
    setTotalXP(0)
    setTimedBonusXP(0)
    setTimedMode(false)
    setShowResult(false)
    setUserAnswer(null)
    setXpPopup(null)
    setTimeUpIndicator(false)
    timer.reset()
  }, [timer])

  // ─── Phase 1: Topic Selection ───────────────────────────────────────
  if (phase === 'topic-select') {
    return (
      <div className="min-h-svh bg-navy pb-24">
        <div className="px-5 pt-8 pb-6 max-w-lg">
          <Link
            to="/"
            className="text-cream-dark/60 hover:text-cream transition-colors text-sm mb-6 inline-block"
          >
            &larr;
          </Link>
          <h1 className="font-serif text-3xl text-cream tracking-tight">Practice</h1>
          <p className="text-cream-dark/60 text-sm mt-1">Select a topic to begin</p>
        </div>

        <div className="px-5 max-w-lg">
          {ALL_TOPICS.map((topic, i) => {
            const stats = getTopicStats(topic)
            const accuracy = getTopicAccuracy(topic)
            const isLast = i === ALL_TOPICS.length - 1

            return (
              <button
                key={topic}
                onClick={() => handleTopicSelect(topic)}
                disabled={stats.total === 0}
                className={`w-full flex items-center justify-between py-4 transition-colors duration-150 hover:bg-gold-muted cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed text-left px-3 -mx-3 ${
                  !isLast ? 'border-b border-gold/8' : ''
                }`}
              >
                <div className="flex flex-col">
                  <span className="text-cream font-medium text-[15px] leading-snug">
                    {getTopicDisplayName(topic)}
                  </span>
                  <span className="text-cream-dark/50 text-xs mt-0.5">
                    {stats.total} question{stats.total !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {accuracy !== null && (
                    <span
                      className={`text-sm tabular-nums ${
                        accuracy >= 70 ? 'text-correct' : accuracy >= 40 ? 'text-gold' : 'text-incorrect'
                      }`}
                    >
                      {accuracy}%
                    </span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  // ─── Phase 2: Round Config ──────────────────────────────────────────
  if (phase === 'round-config' && selectedTopic) {
    const stats = getTopicStats(selectedTopic)
    const maxQuestions = stats.total

    return (
      <div className="min-h-svh bg-navy pb-24">
        <div className="px-5 pt-8 pb-6 max-w-lg">
          <button
            onClick={() => setPhase('topic-select')}
            className="text-cream-dark/60 hover:text-cream transition-colors text-sm mb-6 inline-block cursor-pointer"
          >
            &larr;
          </button>

          <h1 className="font-serif text-3xl text-cream tracking-tight">
            {getTopicDisplayName(selectedTopic)}
          </h1>
          <p className="text-cream-dark/50 text-sm mt-1">
            {maxQuestions} question{maxQuestions !== 1 ? 's' : ''} available
          </p>
        </div>

        <div className="px-5 max-w-lg">
          <div>
            {([5, 10] as RoundSize[]).map(size => {
              const available = size <= maxQuestions

              return (
                <button
                  key={size}
                  onClick={() => handleStartRound(size)}
                  disabled={!available}
                  className="w-full flex items-center justify-between py-4 px-3 -mx-3 border-b border-gold/10 transition-colors duration-150 hover:bg-gold-muted cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed text-left"
                >
                  <div className="flex flex-col">
                    <span className="text-cream font-medium text-[15px]">
                      {size} questions
                    </span>
                    <span className="text-cream-dark/40 text-xs mt-0.5">
                      {size === 5 ? 'Quick' : 'Full'}
                    </span>
                  </div>
                  {!available && (
                    <span className="text-cream-dark/30 text-xs">Not enough questions</span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Timed mode toggle */}
          <div className="mt-6 px-3 -mx-3">
            <div className="flex items-center justify-between">
              <span className="text-cream text-sm">Timed</span>
              <button
                type="button"
                role="switch"
                aria-checked={timedMode}
                onClick={() => setTimedMode(prev => !prev)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out ${
                  timedMode ? 'bg-gold' : 'bg-navy-mid'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-cream shadow transition-transform duration-200 ease-in-out ${
                    timedMode ? 'translate-x-[22px]' : 'translate-x-[2px]'
                  } mt-[2px]`}
                />
              </button>
            </div>
            {timedMode && (
              <p className="text-gold-light text-xs mt-1.5">1.5x XP bonus</p>
            )}
          </div>

          {/* Difficulty breakdown */}
          <div className="mt-10">
            <div className="flex items-center gap-5">
              {(['Easy', 'Medium', 'Hard'] as const).map(diff => (
                <div key={diff} className="flex items-center gap-1.5">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      diff === 'Easy' ? 'bg-correct/60' : diff === 'Medium' ? 'bg-gold/60' : 'bg-incorrect/60'
                    }`}
                  />
                  <span className="text-xs text-cream-dark/40">
                    {stats.byDifficulty[diff]} {diff}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ─── Phase 3: Active Round ──────────────────────────────────────────
  if (phase === 'active-round' && questions.length > 0) {
    const question = questions[currentIndex]
    const progress = ((currentIndex + (showResult ? 1 : 0)) / questions.length) * 100

    return (
      <div className="min-h-svh bg-navy pb-24">
        {/* Top bar: progress */}
        <div className="sticky top-0 z-10 bg-navy/95 backdrop-blur-sm px-5 pt-5 pb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="text-xs text-cream-dark/50 uppercase tracking-wider">
                {currentIndex + 1} of {questions.length}
              </span>
              {timedMode && (
                <Timer
                  seconds={timer.secondsLeft}
                  onTimeUp={handleTimeUp}
                  isRunning={timer.isRunning}
                  size="sm"
                  percentRemaining={timer.percentRemaining}
                />
              )}
            </div>
            <HeartsDisplay hearts={hearts} maxHearts={maxHearts} size="sm" />
          </div>
          <div className="w-full h-1 bg-navy-mid rounded-full overflow-hidden">
            <div
              className="h-full bg-gold rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question area with XP popup */}
        <div className="px-5 pt-4 relative max-w-lg">
          {/* XP popup animation */}
          {xpPopup && (
            <div
              key={xpPopup.key}
              className="absolute top-2 right-6 z-20 font-serif text-gold-light text-lg animate-xp-float pointer-events-none"
            >
              {xpPopup.label ?? `+${xpPopup.amount} XP`}
            </div>
          )}

          {/* Time's up indicator */}
          {timeUpIndicator && (
            <div className="mb-3 animate-fade-in">
              <span className="text-incorrect text-sm font-medium uppercase tracking-wider">
                Time's up
              </span>
            </div>
          )}

          <QuestionCard
            question={question}
            onAnswer={handleAnswer}
            showResult={showResult}
            userAnswer={userAnswer}
          />

          {/* Result indicator — thin colored line */}
          {showResult && userAnswer && (
            <div className="mt-4 animate-fade-in">
              {(() => {
                const lastAnswer = answers[answers.length - 1]
                const isCorrect = lastAnswer?.is_correct
                return (
                  <div
                    className={`h-px w-full ${isCorrect ? 'bg-correct' : 'bg-incorrect'}`}
                  />
                )
              })()}
            </div>
          )}
        </div>
      </div>
    )
  }

  // ─── Phase 4: Round Complete ────────────────────────────────────────
  if (phase === 'round-complete') {
    const score = answers.filter(a => a.is_correct).length

    return (
      <div className="min-h-svh bg-navy">
        <RoundComplete
          score={score}
          total={questions.length}
          xpEarned={totalXP}
          currentLevel={currentLevel}
          xpProgress={xpToNextLevel}
          onPracticeAgain={handlePracticeAgain}
          timedMode={timedMode}
          timedBonusXP={timedBonusXP}
        />
      </div>
    )
  }

  // ─── Phase 5: Out of Hearts ─────────────────────────────────────────
  if (phase === 'out-of-hearts') {
    return (
      <div className="min-h-svh bg-navy flex items-center justify-center">
        <div className="fixed inset-0 bg-black/70 z-40" />
        <div className="relative z-50 px-8 text-center max-w-sm">
          <div className="mb-6">
            <HeartsDisplay hearts={0} maxHearts={maxHearts} size="lg" />
          </div>
          <h2
            className="font-serif text-3xl text-cream mb-3"
            style={{ letterSpacing: '-0.02em' }}
          >
            Out of Hearts
          </h2>
          <p className="text-cream-dark/60 text-sm leading-relaxed mb-2">
            Take a moment. Review what you missed.
          </p>
          {nextRegenTime !== null && (
            <p className="text-cream-dark/40 text-xs mb-8">
              Next heart in {formatRegenTime(nextRegenTime)}
            </p>
          )}
          <button
            onClick={() => navigate('/')}
            className="w-full bg-gold/10 border border-gold/20 text-gold font-medium py-3.5 rounded-lg hover:bg-gold/15 transition-colors duration-200 cursor-pointer"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  // Fallback — shouldn't reach here
  return null
}
