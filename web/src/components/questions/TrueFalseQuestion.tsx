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
      'w-full min-h-[48px] px-4 py-4 rounded-lg text-lg font-semibold transition-all duration-200 border-l-[3px]'

    if (!showResult) {
      return `${base} bg-navy-mid text-cream border-transparent hover:border-gold/40 cursor-pointer`
    }

    const isCorrectAnswer = question.correct_answer === value
    const isSelected = userAnswer === value

    if (isCorrectAnswer) {
      return `${base} bg-navy-mid text-cream border-correct cursor-default`
    }

    if (isSelected && !isCorrectAnswer) {
      return `${base} bg-navy-mid text-cream border-incorrect cursor-default`
    }

    return `${base} bg-navy-mid text-cream-dark border-transparent opacity-50 cursor-default`
  }

  return (
    <div className="space-y-4">
      <p className="font-serif text-xl text-cream leading-relaxed">
        {question.question_text}
      </p>

      <div className="space-y-2 pt-2" role="group" aria-label="Answer options">
        <button
          className={getButtonClasses('True')}
          onClick={() => onAnswer('True')}
          disabled={showResult}
          aria-label="Answer: True"
        >
          True
        </button>
        <button
          className={getButtonClasses('False')}
          onClick={() => onAnswer('False')}
          disabled={showResult}
          aria-label="Answer: False"
        >
          False
        </button>
      </div>
    </div>
  )
}
