import type { Level } from '../types'

export const LEVEL_THRESHOLDS: Record<Level, number> = {
  'Analyst I': 0,
  'Analyst II': 100,
  'Analyst III': 250,
  'Associate': 500,
  'VP': 1000,
  'Director': 2000,
  'MD': 4000,
  'Partner': 8000,
}

const LEVELS_SORTED = Object.entries(LEVEL_THRESHOLDS)
  .sort(([, a], [, b]) => b - a) as [Level, number][]

export function getLevelForXP(xp: number): Level {
  for (const [level, threshold] of LEVELS_SORTED) {
    if (xp >= threshold) return level
  }
  return 'Analyst I'
}

export function getXPForNextLevel(xp: number): { current: number; required: number; progress: number } {
  const currentLevel = getLevelForXP(xp)
  const currentThreshold = LEVEL_THRESHOLDS[currentLevel]
  const nextEntry = Object.entries(LEVEL_THRESHOLDS)
    .sort(([, a], [, b]) => a - b)
    .find(([, threshold]) => threshold > currentThreshold)

  if (!nextEntry) {
    return { current: xp, required: xp, progress: 1 }
  }

  const [, nextThreshold] = nextEntry
  const progressInLevel = xp - currentThreshold
  const requiredForLevel = nextThreshold - currentThreshold
  return {
    current: progressInLevel,
    required: requiredForLevel,
    progress: progressInLevel / requiredForLevel,
  }
}
