import type { Question } from '../../types'

interface MultipleChoiceQuestionProps {
  question: Question
  onAnswer: (answer: string) => void
  showResult: boolean
  userAnswer: string | null
}

export function MultipleChoiceQuestion({
  question,
  onAnswer,
  showResult,
  userAnswer,
}: MultipleChoiceQuestionProps) {
  const getOptionClasses = (option: { text: string; isCorrect: boolean }) => {
    const base =
      'w-full min-h-[48px] px-4 py-3 rounded-lg text-left transition-all duration-200 border-l-[3px]'

    if (!showResult) {
      return `${base} bg-navy-mid text-cream border-transparent hover:border-gold/40 cursor-pointer`
    }

    if (option.isCorrect) {
      return `${base} bg-navy-mid text-cream border-correct cursor-default`
    }

    if (option.text === userAnswer && !option.isCorrect) {
      return `${base} bg-navy-mid text-cream border-incorrect cursor-default`
    }

    return `${base} bg-navy-mid text-cream-dark border-transparent opacity-50 cursor-default`
  }

  return (
    <div className="space-y-3">
      <p className="font-serif text-xl text-cream leading-relaxed">
        {question.question_text}
      </p>

      <div className="space-y-2 pt-2" role="group" aria-label="Answer options">
        {question.options?.map((option, index) => (
          <button
            key={index}
            className={getOptionClasses(option)}
            onClick={() => onAnswer(option.text)}
            disabled={showResult}
            aria-label={`Option ${index + 1}: ${option.text}`}
          >
            {option.text}
          </button>
        ))}
      </div>
    </div>
  )
}
