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
  Easy: 'bg-correct/20 text-correct border-correct/30',
  Medium: 'bg-gold/20 text-gold border-gold/30',
  Hard: 'bg-incorrect/20 text-incorrect border-incorrect/30',
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
    <div className="rounded-xl bg-navy p-5 space-y-4">
      {/* Header: difficulty badge + topic tag */}
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${difficultyConfig[question.difficulty]}`}
        >
          {question.difficulty}
        </span>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-navy-light text-gray-400 border border-gray-700">
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
        <div className="rounded-lg bg-navy-light px-4 py-3 border border-gray-700 transition-all duration-200">
          <p className="text-sm font-medium text-gold mb-1">Explanation</p>
          <p className="text-gray-300 text-sm leading-relaxed">
            {question.explanation}
          </p>
        </div>
      )}
    </div>
  )
}
