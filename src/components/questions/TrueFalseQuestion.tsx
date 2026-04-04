import type { Question } from '../../types'

interface TrueFalseQuestionProps {
  question: Question
  onAnswer: (answer: string) => void
  showResult: boolean
  userAnswer: string | null
}

export function TrueFalseQuestion({
  question,
  onAnswer,
  showResult,
  userAnswer,
}: TrueFalseQuestionProps) {
  const getButtonClasses = (value: 'True' | 'False') => {
    const base =
      'flex-1 min-h-[48px] px-4 py-4 rounded-lg text-lg font-semibold transition-all duration-200 border-2'

    if (!showResult) {
      return `${base} bg-navy-light text-white border-transparent hover:border-interactive cursor-pointer`
    }

    const isCorrectAnswer = question.correct_answer === value
    const isSelected = userAnswer === value

    if (isCorrectAnswer) {
      return `${base} bg-correct/10 text-white border-correct cursor-default`
    }

    if (isSelected && !isCorrectAnswer) {
      return `${base} bg-incorrect/10 text-white border-incorrect cursor-default`
    }

    return `${base} bg-navy-light text-gray-400 border-transparent cursor-default`
  }

  return (
    <div className="space-y-4">
      <p className="text-gray-200 text-lg leading-relaxed">
        {question.question_text}
      </p>

      <div className="flex gap-3 pt-2">
        <button
          className={getButtonClasses('True')}
          onClick={() => onAnswer('True')}
          disabled={showResult}
        >
          True
        </button>
        <button
          className={getButtonClasses('False')}
          onClick={() => onAnswer('False')}
          disabled={showResult}
        >
          False
        </button>
      </div>
    </div>
  )
}
