import type { Topic, Difficulty, QuestionType, Question, RoundConfig, QuestionHistory } from '../types'
import { getQuestionsByTopic } from '../data'

// All 6 topics for iteration
export const ALL_TOPICS: Topic[] = [
  'accounting',
  'valuation',
  'dcf',
  'mergers-acquisitions',
  'lbo',
  'ev-equity-value',
]

/**
 * Fisher-Yates shuffle. Returns a new array; does not mutate the original.
 */
export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/**
 * Select questions for a practice round.
 *
 * - Filters by topic
 * - If history is provided, deprioritizes recently-seen questions
 *   (sorts by times_seen ascending, then shuffles within equal groups)
 * - If no history, purely random
 * - Returns up to `config.question_count` questions
 */
export function getQuestionsForRound(
  config: RoundConfig,
  history?: QuestionHistory[],
): Question[] {
  const pool = getQuestionsByTopic(config.topic)

  if (pool.length === 0) return []

  let sorted: Question[]

  if (history && history.length > 0) {
    const historyMap = new Map<string, QuestionHistory>()
    for (const h of history) {
      historyMap.set(h.question_id, h)
    }

    // Sort by times_seen ascending. Questions with no history entry are treated as 0 (never seen).
    sorted = [...pool].sort((a, b) => {
      const seenA = historyMap.get(a.id)?.times_seen ?? 0
      const seenB = historyMap.get(b.id)?.times_seen ?? 0
      if (seenA !== seenB) return seenA - seenB
      // Equal times_seen — randomize within this tier
      return Math.random() - 0.5
    })
  } else {
    sorted = shuffleArray(pool)
  }

  return sorted.slice(0, config.question_count)
}

/**
 * Check whether the user's answer is correct for a given question.
 */
export function checkAnswer(question: Question, userAnswer: string): boolean {
  switch (question.type) {
    case 'multiple_choice':
    case 'true_false':
      return userAnswer.trim().toLowerCase() === question.correct_answer.trim().toLowerCase()

    case 'numeric': {
      const userNum = parseFloat(userAnswer)
      const correctNum = parseFloat(question.correct_answer)
      if (isNaN(userNum) || isNaN(correctNum)) return false
      return Math.abs(userNum - correctNum) < 0.01
    }

    case 'conceptual':
      // Self-graded — the user decides
      return true

    default:
      return false
  }
}

const TOPIC_DISPLAY_NAMES: Record<Topic, string> = {
  'accounting': 'Accounting',
  'valuation': 'Valuation',
  'dcf': 'DCF',
  'mergers-acquisitions': 'M&A',
  'lbo': 'LBO',
  'ev-equity-value': 'EV / Equity Value',
}

/**
 * Human-readable display name for a topic.
 */
export function getTopicDisplayName(topic: Topic): string {
  return TOPIC_DISPLAY_NAMES[topic]
}

/**
 * Stats for a given topic: total count, breakdown by difficulty and question type.
 */
export function getTopicStats(topic: Topic): {
  total: number
  byDifficulty: Record<Difficulty, number>
  byType: Record<QuestionType, number>
} {
  const questions = getQuestionsByTopic(topic)

  const byDifficulty: Record<Difficulty, number> = { Easy: 0, Medium: 0, Hard: 0 }
  const byType: Record<QuestionType, number> = {
    multiple_choice: 0,
    numeric: 0,
    true_false: 0,
    conceptual: 0,
  }

  for (const q of questions) {
    byDifficulty[q.difficulty]++
    byType[q.type]++
  }

  return { total: questions.length, byDifficulty, byType }
}
