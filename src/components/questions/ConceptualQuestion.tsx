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
      <p className="text-gray-200 text-lg leading-relaxed">
        {question.question_text}
      </p>

      {!showAnswer && (
        <button
          onClick={() => setRevealed(true)}
          className="w-full min-h-[48px] px-4 py-3 rounded-lg bg-interactive text-white font-semibold transition-all duration-200 hover:brightness-110 cursor-pointer"
        >
          Show Answer
        </button>
      )}

      {showAnswer && (
        <div className="space-y-4">
          <div className="rounded-lg bg-navy-light px-4 py-4 border border-gray-700">
            <p className="text-sm font-medium text-gold mb-2">Answer</p>
            <p className="text-gray-200 leading-relaxed">
              {question.correct_answer}
            </p>
            {question.explanation && (
              <>
                <p className="text-sm font-medium text-gold mt-4 mb-2">
                  Explanation
                </p>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {question.explanation}
                </p>
              </>
            )}
          </div>

          {!showResult && (
            <div className="flex gap-3">
              <button
                onClick={() => onAnswer('correct')}
                className="flex-1 min-h-[48px] px-4 py-3 rounded-lg bg-correct text-white font-semibold transition-all duration-200 hover:brightness-110 cursor-pointer"
              >
                I Got It Right
              </button>
              <button
                onClick={() => onAnswer('incorrect')}
                className="flex-1 min-h-[48px] px-4 py-3 rounded-lg bg-incorrect text-white font-semibold transition-all duration-200 hover:brightness-110 cursor-pointer"
              >
                I Got It Wrong
              </button>
            </div>
          )}

          {showResult && (
            <p className="text-sm text-gray-400">
              You marked:{' '}
              <span
                className={
                  userAnswer === 'correct'
                    ? 'text-correct font-medium'
                    : 'text-incorrect font-medium'
                }
              >
                {userAnswer === 'correct' ? 'Got it right' : 'Got it wrong'}
              </span>
            </p>
          )}
        </div>
      )}
    </div>
  )
}
