import { useState } from 'react'
import type { Question } from '../../types'

interface NumericQuestionProps {
  question: Question
  onAnswer: (answer: string) => void
  showResult: boolean
  userAnswer: string | null
}

export function NumericQuestion({
  question,
  onAnswer,
  showResult,
  userAnswer,
}: NumericQuestionProps) {
  const [inputValue, setInputValue] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim() === '') return
    onAnswer(inputValue.trim())
  }

  const isCorrect =
    showResult && userAnswer === question.correct_answer

  return (
    <div className="space-y-4">
      <p className="font-serif text-xl text-cream leading-relaxed">
        {question.question_text}
      </p>

      <form onSubmit={handleSubmit} className="space-y-6 pt-2">
        <input
          type="number"
          step="any"
          inputMode="decimal"
          value={showResult ? (userAnswer ?? '') : inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={showResult}
          placeholder="Your answer"
          aria-label="Enter your numeric answer"
          className="w-full bg-transparent border-b-2 border-gold/30 focus:border-gold text-cream text-xl text-center py-3 focus:outline-none transition-all duration-200 placeholder:text-cream-dark/40 disabled:opacity-70 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />

        {!showResult && (
          <button
            type="submit"
            disabled={inputValue.trim() === ''}
            aria-label="Submit your answer"
            className="w-full min-h-[48px] px-4 py-3 rounded-lg bg-gold text-navy font-semibold transition-all duration-200 hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Submit Answer
          </button>
        )}
      </form>

      {showResult && (
        <div
          className={`border-l-[3px] px-4 py-3 text-sm ${
            isCorrect
              ? 'border-correct text-cream'
              : 'border-incorrect text-cream'
          }`}
        >
          <p className={`font-semibold ${isCorrect ? 'text-correct' : 'text-incorrect'}`}>
            {isCorrect ? 'Correct!' : 'Incorrect'}
          </p>
          {!isCorrect && (
            <p className="mt-1 text-cream-dark">
              Your answer: {userAnswer} | Correct answer:{' '}
              {question.correct_answer}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
