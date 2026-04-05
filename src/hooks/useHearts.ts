import { useCallback, useMemo } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { STORAGE_KEYS } from '../utils/storage'

const MAX_HEARTS = 5
const REGEN_INTERVAL_MS = 4 * 60 * 60 * 1000 // 4 hours

interface HeartsState {
  current: number
  last_lost_at: string | null
  regen_timestamps: string[]
}

const DEFAULT_HEARTS_STATE: HeartsState = {
  current: MAX_HEARTS,
  last_lost_at: null,
  regen_timestamps: [],
}

export function useHearts(): {
  hearts: number
  maxHearts: number
  isAlive: boolean
  loseHeart: () => void
  regenerateHearts: () => void
  nextRegenTime: number | null
  resetHearts: () => void
} {
  const [heartsState, setHeartsState, removeHeartsState] =
    useLocalStorage<HeartsState>(STORAGE_KEYS.HEARTS, DEFAULT_HEARTS_STATE)

  const regenerateHearts = useCallback(() => {
    setHeartsState(prev => {
      if (prev.current >= MAX_HEARTS) return prev

      const now = Date.now()
      const stillPending: string[] = []
      let restored = 0

      for (const ts of prev.regen_timestamps) {
        if (new Date(ts).getTime() <= now) {
          restored++
        } else {
          stillPending.push(ts)
        }
      }

      if (restored === 0) return prev

      const newCurrent = Math.min(prev.current + restored, MAX_HEARTS)
      return {
        current: newCurrent,
        last_lost_at: newCurrent >= MAX_HEARTS ? null : prev.last_lost_at,
        regen_timestamps: newCurrent >= MAX_HEARTS ? [] : stillPending,
      }
    })
  }, [setHeartsState])

  const loseHeart = useCallback(() => {
    setHeartsState(prev => {
      if (prev.current <= 0) return prev

      const now = new Date().toISOString()
      const regenTime = new Date(Date.now() + REGEN_INTERVAL_MS).toISOString()

      return {
        current: prev.current - 1,
        last_lost_at: now,
        regen_timestamps: [...prev.regen_timestamps, regenTime],
      }
    })
  }, [setHeartsState])

  const nextRegenTime = useMemo(() => {
    if (heartsState.current >= MAX_HEARTS) return null
    if (heartsState.regen_timestamps.length === 0) return null

    const now = Date.now()
    const futureTimes = heartsState.regen_timestamps
      .map(ts => new Date(ts).getTime())
      .filter(t => t > now)

    if (futureTimes.length === 0) return null
    return Math.min(...futureTimes) - now
  }, [heartsState.current, heartsState.regen_timestamps])

  const resetHearts = useCallback(() => {
    removeHeartsState()
  }, [removeHeartsState])

  return {
    hearts: heartsState.current,
    maxHearts: MAX_HEARTS,
    isAlive: heartsState.current > 0,
    loseHeart,
    regenerateHearts,
    nextRegenTime,
    resetHearts,
  }
}
