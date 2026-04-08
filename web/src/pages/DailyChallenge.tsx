import { useState, useCallback, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { QuestionCard } from '../components/questions/QuestionCard'
import { useProgress } from '../hooks/useProgress'
import { useStreak } from '../hooks/useStreak'
import { useDailyChallenge } from '../hooks/useDailyChallenge'
import {
  getQuestionsForRound,
  checkAnswer,
  getTopicDisplayName,
} from '../utils/questionEngine'
import { calculateXP } from '../utils/xp'
import type { Question, RoundAnswer } from '../types'

type Phase = 'intro' | 'active-round' | 'round-complete'

export default function DailyChallenge() {
  const navigate = useNavigate()
  const { questionHistory, currentLevel, xpToNextLevel, recordAnswer } = useProgress()
  const { completePractice } = useStreak()
  const { challenge, isCompleted, completeChallenge } = useDailyChallenge()

  const [phase, setPhase] = useState<Phase>('intro')
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<RoundAnswer[]>([])
  const [totalXP, setTotalXP] = useState(0)

  const [showResult, setShowResult] = useState(false)
  const [userAnswer, setUserAnswer] = useState<string | null>(null)
  const [xpPopup, setXpPopup] = useState<{ amount: number; key: number } | null>(null)
  const popupCounter = useRef(0)
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current)
    }
  }, [])

  const handleStart = useCallback(() => {
    const roundQuestions = getQuestionsForRound(
      { topic: challenge.topic, question_count: 5 },
      questionHistory,
    )
    if (roundQuestions.length === 0) return

    setQuestions(roundQuestions)
    setCurrentIndex(0)
    setAnswers([])
    setTotalXP(0)
    setShowResult(false)
    setUserAnswer(null)
    setPhase('active-round')
  }, [challenge.topic, questionHistory])

  const handleAnswer = useCallback(
    (answer: string) => {
      if (showResult) return

      const question = questions[currentIndex]

      let isCorrect: boolean
      if (question.type === 'conceptual') {
        isCorrect = answer === 'correct'
      } else {
        isCorrect = checkAnswer(question, answer)
      }

      // Record base answer (this gives normal XP via the progress system)
      const baseXP = recordAnswer(question.id, question.topic, question.difficulty, isCorrect)

      // Calculate the bonus XP (the extra 1x on top of what recordAnswer already gave)
      const bonusXP = isCorrect
        ? calculateXP(question.difficulty, true)
        : 0

      const displayXP = baseXP + bonusXP

      const roundAnswer: RoundAnswer = {
        question_id: question.id,
        user_answer: answer,
        is_correct: isCorrect,
        xp_earned: displayXP,
      }

      setAnswers(prev => [...prev, roundAnswer])
      setTotalXP(prev => prev + displayXP)
      setUserAnswer(answer)
      setShowResult(true)

      if (displayXP > 0) {
        popupCounter.current += 1
        setXpPopup({ amount: displayXP, key: popupCounter.current })
      }

      advanceTimer.current = setTimeout(() => {
        if (currentIndex < questions.length - 1) {
          setCurrentIndex(prev => prev + 1)
          setShowResult(false)
          setUserAnswer(null)
          setXpPopup(null)
        } else {
          completePractice()
          completeChallenge()
          setPhase('round-complete')
        }
      }, 1500)
    },
    [showResult, questions, currentIndex, recordAnswer, completePractice, completeChallenge],
  )

  const formattedDate = new Date(challenge.date + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  // ─── Already Completed ───────────────────────────────────────────────
  if (isCompleted && phase === 'intro') {
    return (
      <div className="min-h-svh bg-navy pb-24">
        <div className="px-5 pt-8 pb-6 max-w-lg">
          <Link
            to="/"
            className="text-cream-dark/60 hover:text-cream transition-colors text-sm mb-6 inline-block"
          >
            &larr;
          </Link>

          <h1 className="font-serif text-3xl text-cream tracking-tight">Daily Challenge</h1>
          <p className="text-cream-dark/50 text-sm mt-1">{formattedDate}</p>
        </div>

        <div className="px-5 max-w-lg">
          <div className="border border-gold/20 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <svg
                className="w-6 h-6 text-correct"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
              <span className="font-serif text-xl text-cream">Completed</span>
            </div>
            <p className="text-cream-dark/60 text-sm leading-relaxed">
              You've finished today's challenge. Come back tomorrow for a new one.
            </p>

            <div className="divider mt-6 mb-4" />

            <div className="text-cream-dark/40 text-xs">
              {challenge.title}
            </div>
          </div>

          <button
            onClick={() => navigate('/')}
            className="mt-8 text-cream-dark/60 text-sm border-b border-cream-dark/15 transition-colors duration-200 hover:text-cream hover:border-cream-dark/30 cursor-pointer bg-transparent"
          >
            Home
          </button>
        </div>
      </div>
    )
  }

  // ─── Intro ───────────────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div className="min-h-svh bg-navy pb-24">
        <div className="px-5 pt-8 pb-6 max-w-lg">
          <Link
            to="/"
            className="text-cream-dark/60 hover:text-cream transition-colors text-sm mb-6 inline-block"
          >
            &larr;
          </Link>

          <h1 className="font-serif text-3xl text-cream tracking-tight">Daily Challenge</h1>
          <p className="text-cream-dark/50 text-sm mt-1">{formattedDate}</p>
        </div>

        <div className="px-5 max-w-lg">
          <div className="border border-gold/20 rounded-lg p-6">
            <h2
              className="font-serif text-2xl text-cream font-medium mb-1"
              style={{ letterSpacing: '-0.02em' }}
            >
              {challenge.title}
            </h2>

            <div className="flex items-center gap-3 mt-3 mb-6">
              <span className="text-cream-dark/50 text-sm">
                {challenge.questionCount} questions
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-gold/15 text-gold border border-gold/25">
                2x XP
              </span>
            </div>

            <div className="divider mb-6" />

            <div className="flex items-center gap-3 mb-6">
              <div className="flex flex-col">
                <span className="text-cream-dark/40 text-xs uppercase tracking-wider">Topic</span>
                <span className="text-cream text-sm mt-0.5">
                  {getTopicDisplayName(challenge.topic)}
                </span>
              </div>
              <div className="w-px h-8 bg-gold/10 mx-3" />
              <div className="flex flex-col">
                <span className="text-cream-dark/40 text-xs uppercase tracking-wider">Difficulty</span>
                <span className="text-cream text-sm mt-0.5">{challenge.difficulty}</span>
              </div>
            </div>

            <button
              onClick={handleStart}
              className="w-full py-3.5 bg-gold text-navy font-semibold text-sm tracking-wide transition-all duration-200 hover:brightness-110 active:scale-[0.98] cursor-pointer rounded-lg"
            >
              Begin Challenge
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ─── Active Round ────────────────────────────────────────────────────
  if (phase === 'active-round' && questions.length > 0) {
    const question = questions[currentIndex]
    const progress = ((currentIndex + (showResult ? 1 : 0)) / questions.length) * 100

    return (
      <div className="min-h-svh bg-navy pb-24">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-navy/95 backdrop-blur-sm px-5 pt-5 pb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-cream-dark/50 uppercase tracking-wider">
              {currentIndex + 1} of {questions.length}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-gold/15 text-gold border border-gold/25">
              2x XP
            </span>
          </div>
          <div className="w-full h-1 bg-navy-mid rounded-full overflow-hidden">
            <div
              className="h-full bg-gold rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="px-5 pt-4 relative max-w-lg">
          {xpPopup && (
            <div
              key={xpPopup.key}
              className="absolute top-2 right-6 z-20 font-serif text-gold-light text-lg animate-xp-float pointer-events-none"
            >
              +{xpPopup.amount} XP
            </div>
          )}

          <QuestionCard
            question={question}
            onAnswer={handleAnswer}
            showResult={showResult}
            userAnswer={userAnswer}
          />

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

  // ─── Round Complete ──────────────────────────────────────────────────
  if (phase === 'round-complete') {
    const score = answers.filter(a => a.is_correct).length
    const percentage = Math.round((score / questions.length) * 100)

    const resultMessage =
      percentage === 100
        ? 'Perfect Round'
        : percentage >= 80
          ? 'Well Done'
          : percentage >= 60
            ? 'Solid Effort'
            : 'Keep Practicing'

    return (
      <div className="min-h-svh bg-navy">
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
              <span className="text-2xl font-serif text-cream">{score}/{questions.length}</span>
              <span className="text-xs text-cream-dark/50 mt-0.5">{percentage}%</span>
            </div>
          </div>

          <h2 className="font-serif text-2xl text-cream self-center mb-2">{resultMessage}</h2>

          {/* XP earned — gold emphasis for daily challenge */}
          <div className="self-center mb-2">
            <span className="text-gold font-serif text-xl">+{totalXP} XP</span>
          </div>
          <div className="self-center mb-10">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-gold/15 text-gold border border-gold/25">
              2x Daily Bonus
            </span>
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
                style={{ width: `${Math.min(xpToNextLevel.progress * 100, 100)}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-cream-dark/40 text-xs tabular-nums">
                {xpToNextLevel.current} / {xpToNextLevel.required} XP
              </span>
              <span className="text-cream-dark/40 text-xs tabular-nums">
                {Math.round(xpToNextLevel.progress * 100)}%
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="w-full space-y-3">
            <button
              onClick={() => navigate('/')}
              className="w-full py-3.5 bg-gold text-navy font-medium text-sm tracking-wide transition-all duration-200 hover:brightness-110 active:scale-[0.98] cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => navigate('/practice')}
              className="w-full py-3.5 text-cream-dark/60 text-sm border-b border-cream-dark/15 transition-colors duration-200 hover:text-cream hover:border-cream-dark/30 cursor-pointer bg-transparent"
            >
              Continue Practicing
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}
