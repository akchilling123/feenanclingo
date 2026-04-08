import { useState, useEffect, useRef, useCallback } from 'react'

export function useTimer(totalSeconds: number) {
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds)
  const [currentTotal, setCurrentTotal] = useState(totalSeconds)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const start = useCallback(() => {
    setIsRunning(true)
  }, [])

  const pause = useCallback(() => {
    setIsRunning(false)
    clearTimer()
  }, [clearTimer])

  const reset = useCallback(
    (newSeconds?: number) => {
      clearTimer()
      const secs = newSeconds ?? totalSeconds
      setSecondsLeft(secs)
      setCurrentTotal(secs)
      setIsRunning(false)
    },
    [clearTimer, totalSeconds],
  )

  const isExpired = secondsLeft <= 0

  const percentRemaining = currentTotal > 0 ? secondsLeft / currentTotal : 0

  useEffect(() => {
    if (!isRunning || isExpired) {
      clearTimer()
      return
    }

    intervalRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return clearTimer
  }, [isRunning, isExpired, clearTimer])

  // Cleanup on unmount
  useEffect(() => {
    return clearTimer
  }, [clearTimer])

  return {
    secondsLeft,
    isRunning,
    isExpired,
    start,
    pause,
    reset,
    percentRemaining,
  }
}
