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
      <p className="text-gray-200 text-lg leading-relaxed">
        {question.question_text}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        <input
          type="number"
          step="any"
          value={showResult ? (userAnswer ?? '') : inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={showResult}
          placeholder="Enter your answer"
          className="w-full min-h-[48px] px-4 py-3 rounded-lg bg-navy-light text-white text-xl text-center border-2 border-transparent focus:border-interactive focus:outline-none transition-all duration-200 placeholder:text-gray-500 disabled:opacity-70 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />

        {!showResult && (
          <button
            type="submit"
            disabled={inputValue.trim() === ''}
            className="w-full min-h-[48px] px-4 py-3 rounded-lg bg-interactive text-white font-semibold transition-all duration-200 hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Submit Answer
          </button>
        )}
      </form>

      {showResult && (
        <div
          className={`rounded-lg px-4 py-3 text-sm ${
            isCorrect
              ? 'bg-correct/10 border border-correct text-correct'
              : 'bg-incorrect/10 border border-incorrect text-incorrect'
          }`}
        >
          <p className="font-semibold">
            {isCorrect ? 'Correct!' : 'Incorrect'}
          </p>
          {!isCorrect && (
            <p className="mt-1 text-gray-300">
              Your answer: {userAnswer} | Correct answer:{' '}
              {question.correct_answer}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
