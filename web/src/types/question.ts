export type Topic = 'accounting' | 'valuation' | 'dcf' | 'mergers-acquisitions' | 'lbo' | 'ev-equity-value'
export type Difficulty = 'Easy' | 'Medium' | 'Hard'
export type QuestionType = 'multiple_choice' | 'numeric' | 'true_false' | 'conceptual'

export interface MCOption {
  text: string
  isCorrect: boolean
}

export interface Question {
  id: string
  topic: Topic
  difficulty: Difficulty
  type: QuestionType
  question_text: string
  options?: MCOption[]
  correct_answer: string
  explanation: string
  tags?: string[]
}
