import { useCallback, useMemo } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { STORAGE_KEYS } from '../utils/storage'
import type { UserProgress } from '../types'

const DEFAULT_USER_PROGRESS: UserProgress = {
  total_xp: 0,
  current_level: 'Analyst I',
  current_streak: 0,
  last_practice_date: null,
  daily_questions_completed: 0,
}

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0]
}

function getYesterdayDate(): string {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return yesterday.toISOString().split('T')[0]
}

export function useStreak(): {
  currentStreak: number
  lastPracticeDate: string | null
  isStreakActive: boolean
  completePractice: () => void
} {
  const [userProgress, setUserProgress] = useLocalStorage<UserProgress>(
    STORAGE_KEYS.USER_PROGRESS,
    DEFAULT_USER_PROGRESS
  )

  const today = getTodayDate()

  const isStreakActive = useMemo(
    () => userProgress.last_practice_date === today,
    [userProgress.last_practice_date, today]
  )

  const completePractice = useCallback(() => {
    const currentToday = getTodayDate()
    const yesterday = getYesterdayDate()

    setUserProgress(prev => {
      if (prev.last_practice_date === currentToday) {
        // Already practiced today, no change
        return prev
      }

      const newStreak =
        prev.last_practice_date === yesterday
          ? prev.current_streak + 1 // consecutive day
          : 1 // gap or first practice ever

      return {
        ...prev,
        current_streak: newStreak,
        last_practice_date: currentToday,
      }
    })
  }, [setUserProgress])

  return {
    currentStreak: userProgress.current_streak,
    lastPracticeDate: userProgress.last_practice_date,
    isStreakActive,
    completePractice,
  }
}
