const STORAGE_KEYS = {
  USER_PROGRESS: 'feenancelingo_user_progress',
  TOPIC_PROGRESS: 'feenancelingo_topic_progress',
  QUESTION_HISTORY: 'feenancelingo_question_history',
  ACTIVE_ROUND: 'feenancelingo_active_round',
  HEARTS: 'feenancelingo_hearts',
  DAILY_CHALLENGE: 'feenancelingo_daily_challenge',
} as const

export function getStorageItem<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key)
    return item ? (JSON.parse(item) as T) : fallback
  } catch {
    return fallback
  }
}

export function setStorageItem<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value))
}

export function removeStorageItem(key: string): void {
  localStorage.removeItem(key)
}

export function clearAllProgress(): void {
  Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key))
}

export { STORAGE_KEYS }
