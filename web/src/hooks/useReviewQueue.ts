import { useMemo, useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { STORAGE_KEYS } from '../utils/storage'
import { allQuestions } from '../data'
import {
  getReviewQueue,
  getReviewQueueCount,
  getReviewRoundQuestions,
} from '../utils/spacedRepetition'
import type { Question, QuestionHistory } from '../types'

export function useReviewQueue(): {
  reviewQueue: Question[]
  reviewCount: number
  hasReviewItems: boolean
  getReviewRound: (count: number) => Question[]
} {
  const [history] = useLocalStorage<QuestionHistory[]>(
    STORAGE_KEYS.QUESTION_HISTORY,
    []
  )

  const reviewQueue = useMemo(
    () => getReviewQueue(history, allQuestions),
    [history]
  )

  const reviewCount = useMemo(
    () => getReviewQueueCount(history),
    [history]
  )

  const hasReviewItems = reviewCount > 0

  const getReviewRound = useCallback(
    (count: number) => getReviewRoundQuestions(history, allQuestions, count),
    [history]
  )

  return { reviewQueue, reviewCount, hasReviewItems, getReviewRound }
}
