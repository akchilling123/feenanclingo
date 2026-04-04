import type { Question, QuestionHistory } from '../types'

/**
 * Get questions that are in the review queue, sorted by priority (highest first).
 * Cross-references history entries against the full question list.
 */
export function getReviewQueue(
  history: QuestionHistory[],
  questions: Question[]
): Question[] {
  const reviewEntries = history
    .filter(h => h.in_review_queue)
    .sort((a, b) => b.review_priority - a.review_priority)

  const questionMap = new Map(questions.map(q => [q.id, q]))

  return reviewEntries
    .map(entry => questionMap.get(entry.question_id))
    .filter((q): q is Question => q !== undefined)
}

/**
 * Calculate new review priority after an answer.
 *
 * Wrong answer: priority = current + 2
 * Right answer in review: priority = current - 1 (min 0)
 * If priority reaches 0 AND times_correct >= times_seen * 0.5: remove from review queue
 */
export function updateReviewPriority(
  entry: QuestionHistory,
  isCorrect: boolean
): QuestionHistory {
  if (!isCorrect) {
    return {
      ...entry,
      review_priority: entry.review_priority + 2,
    }
  }

  // Correct answer — decrease priority
  const newPriority = Math.max(0, entry.review_priority - 1)
  const shouldRemove =
    newPriority === 0 && entry.times_correct >= entry.times_seen * 0.5

  return {
    ...entry,
    review_priority: newPriority,
    in_review_queue: shouldRemove ? false : entry.in_review_queue,
  }
}

/**
 * Check if a question should enter the review queue.
 * Enters queue if: answer was wrong AND not already in queue.
 */
export function shouldEnterReviewQueue(
  entry: QuestionHistory | undefined,
  isCorrect: boolean
): boolean {
  if (isCorrect) return false
  if (!entry) return true
  return !entry.in_review_queue
}

/**
 * Get count of questions currently in the review queue.
 */
export function getReviewQueueCount(history: QuestionHistory[]): number {
  return history.filter(h => h.in_review_queue).length
}

/**
 * Get review questions for a round (up to `count` questions, highest priority first).
 */
export function getReviewRoundQuestions(
  history: QuestionHistory[],
  questions: Question[],
  count: number
): Question[] {
  return getReviewQueue(history, questions).slice(0, count)
}
