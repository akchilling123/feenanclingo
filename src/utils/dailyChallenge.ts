import type { Topic, Difficulty } from '../types'
import { ALL_TOPICS, getTopicDisplayName } from './questionEngine'

export interface DailyChallenge {
  date: string
  topic: Topic
  difficulty: Difficulty
  questionCount: number
  bonusXPMultiplier: number
  title: string
}

const DIFFICULTIES: Difficulty[] = ['Easy', 'Medium', 'Hard']

/**
 * Simple deterministic hash from a date string.
 * Sums the char codes and returns the result.
 */
function hashDateString(dateStr: string): number {
  let hash = 0
  for (let i = 0; i < dateStr.length; i++) {
    hash += dateStr.charCodeAt(i)
  }
  return hash
}

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0]
}

/**
 * Generate a deterministic daily challenge based on the date.
 * All users get the same challenge on the same day.
 */
export function getDailyChallenge(date?: string): DailyChallenge {
  const challengeDate = date ?? getTodayDate()
  const hash = hashDateString(challengeDate)

  const topicIndex = hash % ALL_TOPICS.length
  const difficultyIndex = Math.floor(hash / ALL_TOPICS.length) % DIFFICULTIES.length

  const topic = ALL_TOPICS[topicIndex]
  const difficulty = DIFFICULTIES[difficultyIndex]

  return {
    date: challengeDate,
    topic,
    difficulty,
    questionCount: 5,
    bonusXPMultiplier: 2,
    title: `${difficulty} ${getTopicDisplayName(topic)}`,
  }
}

/**
 * Check if user has completed today's challenge.
 */
export function hasCompletedDailyChallenge(
  completedDates: string[],
  date?: string,
): boolean {
  const challengeDate = date ?? getTodayDate()
  return completedDates.includes(challengeDate)
}
