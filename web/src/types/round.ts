import type { Topic, Question } from './question'

export type RoundSize = 5 | 10

export interface RoundConfig {
  topic: Topic
  question_count: RoundSize
}

export interface RoundAnswer {
  question_id: string
  user_answer: string
  is_correct: boolean
  xp_earned: number
}

export interface RoundState {
  config: RoundConfig
  questions: Question[]
  current_index: number
  answers: RoundAnswer[]
  score: number
  xp_earned: number
  started_at: string
  completed_at: string | null
}
