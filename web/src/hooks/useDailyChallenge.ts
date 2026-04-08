import { useCallback, useMemo } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { STORAGE_KEYS } from '../utils/storage'
import {
  getDailyChallenge,
  hasCompletedDailyChallenge,
  type DailyChallenge,
} from '../utils/dailyChallenge'

export function useDailyChallenge(): {
  challenge: DailyChallenge
  isCompleted: boolean
  completeChallenge: () => void
  completedDates: string[]
} {
  const [completedDates, setCompletedDates] = useLocalStorage<string[]>(
    STORAGE_KEYS.DAILY_CHALLENGE,
    [],
  )

  const challenge = useMemo(() => getDailyChallenge(), [])

  const isCompleted = useMemo(
    () => hasCompletedDailyChallenge(completedDates),
    [completedDates],
  )

  const completeChallenge = useCallback(() => {
    const today = new Date().toISOString().split('T')[0]
    setCompletedDates(prev => {
      if (prev.includes(today)) return prev
      return [...prev, today]
    })
  }, [setCompletedDates])

  return {
    challenge,
    isCompleted,
    completeChallenge,
    completedDates,
  }
}
