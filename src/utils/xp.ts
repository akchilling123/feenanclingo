import type { Difficulty } from '../types'

export const XP_VALUES: Record<Difficulty, number> = {
  Easy: 5,
  Medium: 10,
  Hard: 20,
}

export function calculateXP(difficulty: Difficulty, isCorrect: boolean): number {
  return isCorrect ? XP_VALUES[difficulty] : 0
}
