import { useState } from 'react'
import type { Question } from '../../types'

interface ConceptualQuestionProps {
  question: Question
  onAnswer: (answer: string) => void
  showResult: boolean
  userAnswer: string | null
}

export function ConceptualQuestion({
  question,
  onAnswer,
  showResult,
  userAnswer,
}: ConceptualQuestionProps) {
  const [revealed, setRevealed] = useState(false)

  const showAnswer = showResult || revealed

  return (
    <div className="space-y-4">
      <p className="font-serif text-xl text-cream leading-relaxed">
        {question.question_text}
      </p>

      {!showAnswer && (
        <button
          onClick={() => setRevealed(true)}
          className="border-b border-gold/30 text-gold text-sm pb-0.5 transition-all duration-200 hover:border-gold hover:text-gold-light cursor-pointer"
        >
          Show Answer
        </button>
      )}

      {showAnswer && (
        <div className="space-y-4">
          <div className="border-t border-gold/30 pt-4">
            <p className="font-serif text-cream leading-relaxed">
              {question.correct_answer}
            </p>
            {question.explanation && (
              <p className="text-cream-dark text-sm leading-relaxed mt-3">
                {question.explanation}
              </p>
            )}
          </div>

          {!showResult && (
            <div className="space-y-2 pt-2">
              <button
                onClick={() => onAnswer('correct')}
                className="w-full min-h-[48px] px-4 py-3 rounded-lg bg-navy-mid text-cream border-l-[3px] border-gold text-left transition-all duration-200 hover:brightness-110 cursor-pointer"
              >
                Got it
              </button>
              <button
                onClick={() => onAnswer('incorrect')}
                className="w-full min-h-[48px] px-4 py-3 rounded-lg bg-navy-mid text-cream-dark border-l-[3px] border-incorrect text-left transition-all duration-200 hover:brightness-110 cursor-pointer"
              >
                Missed it
              </button>
            </div>
          )}

          {showResult && (
            <p className="text-sm text-cream-dark">
              You marked:{' '}
              <span
                className={
                  userAnswer === 'correct'
                    ? 'text-correct font-medium'
                    : 'text-incorrect font-medium'
                }
              >
                {userAnswer === 'correct' ? 'Got it' : 'Missed it'}
              </span>
            </p>
          )}
        </div>
      )}
    </div>
  )
}
