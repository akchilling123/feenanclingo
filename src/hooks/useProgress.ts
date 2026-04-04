import { useCallback, useMemo } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { STORAGE_KEYS } from '../utils/storage'
import { getLevelForXP, getXPForNextLevel } from '../utils/levels'
import { calculateXP } from '../utils/xp'
import type {
  Topic,
  Difficulty,
  Level,
  UserProgress,
  TopicProgress,
  QuestionHistory,
} from '../types'

const ALL_TOPICS: Topic[] = [
  'accounting',
  'valuation',
  'dcf',
  'mergers-acquisitions',
  'lbo',
  'ev-equity-value',
]

const DEFAULT_USER_PROGRESS: UserProgress = {
  total_xp: 0,
  current_level: 'Analyst I',
  current_streak: 0,
  last_practice_date: null,
  daily_questions_completed: 0,
}

const DEFAULT_TOPIC_PROGRESS: TopicProgress[] = ALL_TOPICS.map(topic => ({
  topic,
  questions_attempted: 0,
  questions_correct: 0,
}))

const DEFAULT_QUESTION_HISTORY: QuestionHistory[] = []

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0]
}

export function useProgress(): {
  userProgress: UserProgress
  topicProgress: TopicProgress[]
  questionHistory: QuestionHistory[]
  currentLevel: Level
  xpToNextLevel: { current: number; required: number; progress: number }
  recordAnswer: (questionId: string, topic: Topic, difficulty: Difficulty, isCorrect: boolean) => number
  resetProgress: () => void
} {
  const [userProgress, setUserProgress, removeUserProgress] =
    useLocalStorage<UserProgress>(STORAGE_KEYS.USER_PROGRESS, DEFAULT_USER_PROGRESS)
  const [topicProgress, setTopicProgress, removeTopicProgress] =
    useLocalStorage<TopicProgress[]>(STORAGE_KEYS.TOPIC_PROGRESS, DEFAULT_TOPIC_PROGRESS)
  const [questionHistory, setQuestionHistory, removeQuestionHistory] =
    useLocalStorage<QuestionHistory[]>(STORAGE_KEYS.QUESTION_HISTORY, DEFAULT_QUESTION_HISTORY)

  const currentLevel = useMemo(() => getLevelForXP(userProgress.total_xp), [userProgress.total_xp])
  const xpToNextLevel = useMemo(() => getXPForNextLevel(userProgress.total_xp), [userProgress.total_xp])

  const recordAnswer = useCallback(
    (questionId: string, topic: Topic, difficulty: Difficulty, isCorrect: boolean): number => {
      const xpEarned = calculateXP(difficulty, isCorrect)
      const today = getTodayDate()

      // Update user progress
      setUserProgress(prev => {
        const newXP = prev.total_xp + xpEarned
        const isNewDay = prev.last_practice_date !== today
        return {
          total_xp: newXP,
          current_level: getLevelForXP(newXP),
          current_streak: prev.current_streak, // streak is managed by useStreak
          last_practice_date: prev.last_practice_date, // managed by useStreak
          daily_questions_completed: isNewDay ? 1 : prev.daily_questions_completed + 1,
        }
      })

      // Update topic progress
      setTopicProgress(prev =>
        prev.map(tp =>
          tp.topic === topic
            ? {
                ...tp,
                questions_attempted: tp.questions_attempted + 1,
                questions_correct: tp.questions_correct + (isCorrect ? 1 : 0),
              }
            : tp
        )
      )

      // Update question history
      setQuestionHistory(prev => {
        const existing = prev.find(qh => qh.question_id === questionId)
        if (existing) {
          return prev.map(qh =>
            qh.question_id === questionId
              ? {
                  ...qh,
                  times_seen: qh.times_seen + 1,
                  times_correct: qh.times_correct + (isCorrect ? 1 : 0),
                  last_seen_date: today,
                  in_review_queue: isCorrect ? qh.in_review_queue : true,
                  review_priority: isCorrect
                    ? Math.max(0, qh.review_priority - 1)
                    : qh.review_priority + 1,
                }
              : qh
          )
        }
        return [
          ...prev,
          {
            question_id: questionId,
            times_seen: 1,
            times_correct: isCorrect ? 1 : 0,
            last_seen_date: today,
            in_review_queue: !isCorrect,
            review_priority: isCorrect ? 0 : 1,
          },
        ]
      })

      return xpEarned
    },
    [setUserProgress, setTopicProgress, setQuestionHistory]
  )

  const resetProgress = useCallback(() => {
    removeUserProgress()
    removeTopicProgress()
    removeQuestionHistory()
  }, [removeUserProgress, removeTopicProgress, removeQuestionHistory])

  return {
    userProgress,
    topicProgress,
    questionHistory,
    currentLevel,
    xpToNextLevel,
    recordAnswer,
    resetProgress,
  }
}
