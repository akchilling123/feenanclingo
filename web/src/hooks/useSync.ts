import { useEffect, useRef, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { STORAGE_KEYS, getStorageItem, setStorageItem } from '../utils/storage'
import type { UserProgress, TopicProgress, QuestionHistory } from '../types'

const DEBOUNCE_MS = 3000

interface HeartsState {
  current: number
  last_lost_at: string | null
  regen_timestamps: string[]
}

// Timestamps for conflict resolution
const SYNC_TIMESTAMPS_KEY = 'feenancelingo_sync_timestamps'

interface SyncTimestamps {
  user_progress?: string
  topic_progress?: string
  question_history?: string
  hearts_state?: string
  daily_challenge?: string
}

function getSyncTimestamps(): SyncTimestamps {
  return getStorageItem<SyncTimestamps>(SYNC_TIMESTAMPS_KEY, {})
}

function setSyncTimestamp(table: keyof SyncTimestamps) {
  const ts = getSyncTimestamps()
  ts[table] = new Date().toISOString()
  setStorageItem(SYNC_TIMESTAMPS_KEY, ts)
}

export function useSync(userId: string | undefined) {
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isSyncing = useRef(false)

  const pullFromRemote = useCallback(async () => {
    if (!userId) return
    try {
      // Pull user_progress
      const { data: remoteProgress } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (remoteProgress) {
        const localTs = getSyncTimestamps().user_progress
        const remoteTs = remoteProgress.updated_at
        if (!localTs || (remoteTs && remoteTs > localTs)) {
          setStorageItem(STORAGE_KEYS.USER_PROGRESS, {
            total_xp: remoteProgress.total_xp,
            current_level: remoteProgress.current_level,
            current_streak: remoteProgress.current_streak,
            last_practice_date: remoteProgress.last_practice_date,
            daily_questions_completed: remoteProgress.daily_questions_completed,
          } satisfies UserProgress)
          setSyncTimestamp('user_progress')
        }
      }

      // Pull topic_progress
      const { data: remoteTopics } = await supabase
        .from('topic_progress')
        .select('*')
        .eq('user_id', userId)

      if (remoteTopics && remoteTopics.length > 0) {
        const localTs = getSyncTimestamps().topic_progress
        const latestRemoteTs = remoteTopics.reduce(
          (max, t) => (t.updated_at > max ? t.updated_at : max),
          ''
        )
        if (!localTs || latestRemoteTs > localTs) {
          const mapped: TopicProgress[] = remoteTopics.map(t => ({
            topic: t.topic,
            questions_attempted: t.questions_attempted,
            questions_correct: t.questions_correct,
          }))
          setStorageItem(STORAGE_KEYS.TOPIC_PROGRESS, mapped)
          setSyncTimestamp('topic_progress')
        }
      }

      // Pull question_history
      const { data: remoteHistory } = await supabase
        .from('question_history')
        .select('*')
        .eq('user_id', userId)

      if (remoteHistory && remoteHistory.length > 0) {
        const localTs = getSyncTimestamps().question_history
        const latestRemoteTs = remoteHistory.reduce(
          (max, h) => (h.updated_at > max ? h.updated_at : max),
          ''
        )
        if (!localTs || latestRemoteTs > localTs) {
          const mapped: QuestionHistory[] = remoteHistory.map(h => ({
            question_id: h.question_id,
            times_seen: h.times_seen,
            times_correct: h.times_correct,
            last_seen_date: h.last_seen_date,
            in_review_queue: h.in_review_queue,
            review_priority: h.review_priority,
          }))
          setStorageItem(STORAGE_KEYS.QUESTION_HISTORY, mapped)
          setSyncTimestamp('question_history')
        }
      }

      // Pull hearts_state
      const { data: remoteHearts } = await supabase
        .from('hearts_state')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (remoteHearts) {
        const localTs = getSyncTimestamps().hearts_state
        const remoteTs = remoteHearts.updated_at
        if (!localTs || (remoteTs && remoteTs > localTs)) {
          setStorageItem(STORAGE_KEYS.HEARTS, {
            current: remoteHearts.current,
            last_lost_at: remoteHearts.last_lost_at,
            regen_timestamps: remoteHearts.regen_timestamps ?? [],
          } satisfies HeartsState)
          setSyncTimestamp('hearts_state')
        }
      }

      // Pull daily_challenge_completions
      const { data: remoteDailies } = await supabase
        .from('daily_challenge_completions')
        .select('completed_date')
        .eq('user_id', userId)

      if (remoteDailies && remoteDailies.length > 0) {
        const remoteDates = remoteDailies.map(d => d.completed_date)
        const localDates = getStorageItem<string[]>(STORAGE_KEYS.DAILY_CHALLENGE, [])
        const merged = Array.from(new Set([...localDates, ...remoteDates])).sort()
        setStorageItem(STORAGE_KEYS.DAILY_CHALLENGE, merged)
        setSyncTimestamp('daily_challenge')
      }
    } catch (err) {
      console.error('[sync] pull failed:', err)
    }
  }, [userId])

  const pushToRemote = useCallback(async () => {
    if (!userId || isSyncing.current) return
    isSyncing.current = true

    try {
      // Push user_progress
      const userProgress = getStorageItem<UserProgress | null>(STORAGE_KEYS.USER_PROGRESS, null)
      if (userProgress) {
        await supabase.from('user_progress').upsert({
          user_id: userId,
          total_xp: userProgress.total_xp,
          current_level: userProgress.current_level,
          current_streak: userProgress.current_streak,
          last_practice_date: userProgress.last_practice_date,
          daily_questions_completed: userProgress.daily_questions_completed,
        }, { onConflict: 'user_id' })
        setSyncTimestamp('user_progress')
      }

      // Push topic_progress
      const topicProgress = getStorageItem<TopicProgress[]>(STORAGE_KEYS.TOPIC_PROGRESS, [])
      if (topicProgress.length > 0) {
        const rows = topicProgress.map(tp => ({
          user_id: userId,
          topic: tp.topic,
          questions_attempted: tp.questions_attempted,
          questions_correct: tp.questions_correct,
        }))
        await supabase.from('topic_progress').upsert(rows, { onConflict: 'user_id,topic' })
        setSyncTimestamp('topic_progress')
      }

      // Push question_history
      const questionHistory = getStorageItem<QuestionHistory[]>(STORAGE_KEYS.QUESTION_HISTORY, [])
      if (questionHistory.length > 0) {
        // Batch in chunks of 100
        for (let i = 0; i < questionHistory.length; i += 100) {
          const chunk = questionHistory.slice(i, i + 100).map(qh => ({
            user_id: userId,
            question_id: qh.question_id,
            times_seen: qh.times_seen,
            times_correct: qh.times_correct,
            last_seen_date: qh.last_seen_date,
            in_review_queue: qh.in_review_queue,
            review_priority: qh.review_priority,
          }))
          await supabase.from('question_history').upsert(chunk, { onConflict: 'user_id,question_id' })
        }
        setSyncTimestamp('question_history')
      }

      // Push hearts_state
      const hearts = getStorageItem<HeartsState | null>(STORAGE_KEYS.HEARTS, null)
      if (hearts) {
        await supabase.from('hearts_state').upsert({
          user_id: userId,
          current: hearts.current,
          last_lost_at: hearts.last_lost_at,
          regen_timestamps: hearts.regen_timestamps,
        }, { onConflict: 'user_id' })
        setSyncTimestamp('hearts_state')
      }

      // Push daily_challenge_completions (insert only, ignore conflicts)
      const dailyDates = getStorageItem<string[]>(STORAGE_KEYS.DAILY_CHALLENGE, [])
      if (dailyDates.length > 0) {
        const rows = dailyDates.map(date => ({
          user_id: userId,
          completed_date: date,
        }))
        await supabase
          .from('daily_challenge_completions')
          .upsert(rows, { onConflict: 'user_id,completed_date', ignoreDuplicates: true })
        setSyncTimestamp('daily_challenge')
      }
    } catch (err) {
      console.error('[sync] push failed:', err)
    } finally {
      isSyncing.current = false
    }
  }, [userId])

  const debouncedPush = useCallback(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => {
      pushToRemote()
    }, DEBOUNCE_MS)
  }, [pushToRemote])

  // Pull on mount, then listen for localStorage changes
  useEffect(() => {
    if (!userId) return

    pullFromRemote()

    const handleStorage = (e: StorageEvent) => {
      if (e.key?.startsWith('feenancelingo_')) {
        debouncedPush()
      }
    }

    // Listen for storage events from other tabs
    window.addEventListener('storage', handleStorage)

    // Also set up a periodic push for same-tab changes
    // since StorageEvent doesn't fire for same-tab writes
    const intervalId = setInterval(() => {
      pushToRemote()
    }, 30000) // every 30s as a safety net

    // Do an initial push after a short delay
    const initialPush = setTimeout(() => pushToRemote(), 5000)

    return () => {
      window.removeEventListener('storage', handleStorage)
      clearInterval(intervalId)
      clearTimeout(initialPush)
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
    }
  }, [userId, pullFromRemote, debouncedPush, pushToRemote])
}
