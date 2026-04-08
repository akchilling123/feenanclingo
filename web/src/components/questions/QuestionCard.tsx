import type { Question } from '../../types'
import { MultipleChoiceQuestion } from './MultipleChoiceQuestion'
import { NumericQuestion } from './NumericQuestion'
import { TrueFalseQuestion } from './TrueFalseQuestion'
import { ConceptualQuestion } from './ConceptualQuestion'

interface QuestionCardProps {
  question: Question
  onAnswer: (answer: string) => void
  showResult: boolean
  userAnswer: string | null
}

const difficultyConfig = {
  Easy: 'text-correct',
  Medium: 'text-gold',
  Hard: 'text-incorrect',
} as const

const questionComponents = {
  multiple_choice: MultipleChoiceQuestion,
  numeric: NumericQuestion,
  true_false: TrueFalseQuestion,
  conceptual: ConceptualQuestion,
} as const

export function QuestionCard({
  question,
  onAnswer,
  showResult,
  userAnswer,
}: QuestionCardProps) {
  const QuestionComponent = questionComponents[question.type]

  return (
    <div
      className="py-5 space-y-4"
      role="article"
      aria-label={question.question_text}
    >
      {/* Header: difficulty + topic */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className={`text-xs font-semibold ${difficultyConfig[question.difficulty]}`}>
          {question.difficulty}
        </span>
        <span className="text-cream-dark/50 text-xs uppercase tracking-wider">
          {question.topic.replace(/-/g, ' ')}
        </span>
      </div>

      {/* Question type component */}
      <QuestionComponent
        question={question}
        onAnswer={onAnswer}
        showResult={showResult}
        userAnswer={userAnswer}
      />

      {/* Explanation shown after answering (non-conceptual types) */}
      {showResult && question.type !== 'conceptual' && question.explanation && (
        <div className="border-t border-gold/30 pt-4 transition-all duration-200">
          <p className="font-serif text-sm text-gold mb-1">Why:</p>
          <p className="text-cream text-sm leading-relaxed">
            {question.explanation}
          </p>
        </div>
      )}
    </div>
  )
}
