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
      'w-full min-h-[48px] px-4 py-3 rounded-lg text-left transition-all duration-200 border-2'

    if (!showResult) {
      return `${base} bg-navy-light text-white border-transparent hover:border-interactive cursor-pointer`
    }

    if (option.isCorrect) {
      return `${base} bg-correct/10 text-white border-correct cursor-default`
    }

    if (option.text === userAnswer && !option.isCorrect) {
      return `${base} bg-incorrect/10 text-white border-incorrect cursor-default`
    }

    return `${base} bg-navy-light text-gray-400 border-transparent cursor-default`
  }

  return (
    <div className="space-y-3">
      <p className="text-gray-200 text-lg leading-relaxed">
        {question.question_text}
      </p>

      <div className="space-y-2 pt-2">
        {question.options?.map((option, index) => (
          <button
            key={index}
            className={getOptionClasses(option)}
            onClick={() => onAnswer(option.text)}
            disabled={showResult}
          >
            <span className="flex items-center gap-3">
              <span className="shrink-0 w-7 h-7 rounded-full bg-navy flex items-center justify-center text-sm font-medium text-gray-400">
                {String.fromCharCode(65 + index)}
              </span>
              <span>{option.text}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
