import type { Topic } from './question'

export type Level = 'Analyst I' | 'Analyst II' | 'Analyst III' | 'Associate' | 'VP' | 'Director' | 'MD' | 'Partner'

export interface UserProgress {
  total_xp: number
  current_level: Level
  current_streak: number
  last_practice_date: string | null
  daily_questions_completed: number
}

export interface TopicProgress {
  topic: Topic
  questions_attempted: number
  questions_correct: number
}

export interface QuestionHistory {
  question_id: string
  times_seen: number
  times_correct: number
  last_seen_date: string
  in_review_queue: boolean
  review_priority: number
}
