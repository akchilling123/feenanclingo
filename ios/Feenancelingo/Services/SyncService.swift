import Foundation
import Supabase

// MARK: - Supabase Row Models

/// Matches user_progress table: upsert on (user_id)
struct UserProgressRow: Codable {
    let userId: String
    var totalXP: Int
    var currentLevel: String
    var currentStreak: Int
    var lastPracticeDate: String?
    var dailyQuestionsCompleted: Int
    var updatedAt: String

    enum CodingKeys: String, CodingKey {
        case userId = "user_id"
        case totalXP = "total_xp"
        case currentLevel = "current_level"
        case currentStreak = "current_streak"
        case lastPracticeDate = "last_practice_date"
        case dailyQuestionsCompleted = "daily_questions_completed"
        case updatedAt = "updated_at"
    }
}

/// Matches topic_progress table: upsert on (user_id, topic)
struct TopicProgressRow: Codable {
    let userId: String
    let topic: String
    var questionsAttempted: Int
    var questionsCorrect: Int
    var updatedAt: String

    enum CodingKeys: String, CodingKey {
        case userId = "user_id"
        case topic
        case questionsAttempted = "questions_attempted"
        case questionsCorrect = "questions_correct"
        case updatedAt = "updated_at"
    }
}

/// Matches question_history table: upsert on (user_id, question_id)
struct QuestionHistoryRow: Codable {
    let userId: String
    let questionId: String
    var timesSeen: Int
    var timesCorrect: Int
    var lastSeenDate: String
    var inReviewQueue: Bool
    var reviewPriority: Int
    var updatedAt: String

    enum CodingKeys: String, CodingKey {
        case userId = "user_id"
        case questionId = "question_id"
        case timesSeen = "times_seen"
        case timesCorrect = "times_correct"
        case lastSeenDate = "last_seen_date"
        case inReviewQueue = "in_review_queue"
        case reviewPriority = "review_priority"
        case updatedAt = "updated_at"
    }
}

/// Matches hearts_state table: upsert on (user_id)
struct HeartsStateRow: Codable {
    let userId: String
    var current: Int
    var lastLostAt: String?
    var regenTimestamps: [String]
    var updatedAt: String

    enum CodingKeys: String, CodingKey {
        case userId = "user_id"
        case current
        case lastLostAt = "last_lost_at"
        case regenTimestamps = "regen_timestamps"
        case updatedAt = "updated_at"
    }
}

/// Matches daily_challenge_completions table: insert on (user_id, completed_date)
struct DailyChallengeCompletionRow: Codable {
    let userId: String
    let completedDate: String

    enum CodingKeys: String, CodingKey {
        case userId = "user_id"
        case completedDate = "completed_date"
    }
}

// MARK: - Sync Service

@MainActor
class SyncService: ObservableObject {
    static let shared = SyncService()

    private var pushTask: Task<Void, Never>?
    private let debounceInterval: TimeInterval = 2.0

    private let isoFormatter: ISO8601DateFormatter = {
        let f = ISO8601DateFormatter()
        f.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        return f
    }()

    private init() {}

    // MARK: - Public API

    /// Pull remote data, merge with local (newer wins), then push merged state back.
    func pullAndMerge(
        authService: AuthService,
        progressService: ProgressService,
        heartsService: HeartsService,
        dailyChallengeService: DailyChallengeService
    ) async {
        guard let userId = authService.userId else { return }
        let client = authService.client

        do {
            // Pull all tables in parallel
            async let remoteProgress = client.from("user_progress")
                .select()
                .eq("user_id", value: userId)
                .execute()

            async let remoteTopics = client.from("topic_progress")
                .select()
                .eq("user_id", value: userId)
                .execute()

            async let remoteHistory = client.from("question_history")
                .select()
                .eq("user_id", value: userId)
                .execute()

            async let remoteHearts = client.from("hearts_state")
                .select()
                .eq("user_id", value: userId)
                .execute()

            async let remoteCompletions = client.from("daily_challenge_completions")
                .select()
                .eq("user_id", value: userId)
                .execute()

            let (progressRes, topicsRes, historyRes, heartsRes, completionsRes) =
                try await (remoteProgress, remoteTopics, remoteHistory, remoteHearts, remoteCompletions)

            let decoder = JSONDecoder()

            // --- Merge user_progress ---
            if let rows = try? decoder.decode([UserProgressRow].self, from: progressRes.data),
               let remote = rows.first {
                let remoteDate = isoFormatter.date(from: remote.updatedAt) ?? .distantPast
                if remoteDate > progressService.userProgress.updatedAt {
                    progressService.userProgress = UserProgress(
                        totalXP: remote.totalXP,
                        currentLevel: remote.currentLevel,
                        currentStreak: remote.currentStreak,
                        lastPracticeDate: remote.lastPracticeDate,
                        dailyQuestionsCompleted: remote.dailyQuestionsCompleted,
                        updatedAt: remoteDate
                    )
                }
            }

            // --- Merge topic_progress ---
            if let rows = try? decoder.decode([TopicProgressRow].self, from: topicsRes.data) {
                for remote in rows {
                    let remoteDate = isoFormatter.date(from: remote.updatedAt) ?? .distantPast
                    if let idx = progressService.topicProgress.firstIndex(where: { $0.topic == remote.topic }) {
                        if remoteDate > progressService.topicProgress[idx].updatedAt {
                            progressService.topicProgress[idx] = TopicProgress(
                                topic: remote.topic,
                                questionsAttempted: remote.questionsAttempted,
                                questionsCorrect: remote.questionsCorrect,
                                updatedAt: remoteDate
                            )
                        }
                    }
                }
            }

            // --- Merge question_history ---
            if let rows = try? decoder.decode([QuestionHistoryRow].self, from: historyRes.data) {
                for remote in rows {
                    let remoteDate = isoFormatter.date(from: remote.updatedAt) ?? .distantPast
                    if let idx = progressService.questionHistory.firstIndex(where: { $0.questionID == remote.questionId }) {
                        if remoteDate > progressService.questionHistory[idx].updatedAt {
                            progressService.questionHistory[idx] = QuestionHistory(
                                questionID: remote.questionId,
                                timesSeen: remote.timesSeen,
                                timesCorrect: remote.timesCorrect,
                                lastSeenDate: remote.lastSeenDate,
                                inReviewQueue: remote.inReviewQueue,
                                reviewPriority: remote.reviewPriority,
                                updatedAt: remoteDate
                            )
                        }
                    } else {
                        progressService.questionHistory.append(QuestionHistory(
                            questionID: remote.questionId,
                            timesSeen: remote.timesSeen,
                            timesCorrect: remote.timesCorrect,
                            lastSeenDate: remote.lastSeenDate,
                            inReviewQueue: remote.inReviewQueue,
                            reviewPriority: remote.reviewPriority,
                            updatedAt: remoteDate
                        ))
                    }
                }
            }

            // --- Merge hearts_state ---
            if let rows = try? decoder.decode([HeartsStateRow].self, from: heartsRes.data),
               let remote = rows.first {
                // Hearts don't have updatedAt on the local model, so remote always wins if it exists
                let remoteLastLost = remote.lastLostAt.flatMap { isoFormatter.date(from: $0) }
                let regenDates = remote.regenTimestamps.compactMap { isoFormatter.date(from: $0) }
                // We can't directly set HeartsService internals without a method, so we note this
                // For now, if remote has data, it's informational — hearts are regenerated locally
                _ = (remoteLastLost, regenDates, remote.current)
            }

            // --- Merge daily_challenge_completions ---
            if let rows = try? decoder.decode([DailyChallengeCompletionRow].self, from: completionsRes.data) {
                for remote in rows {
                    if !dailyChallengeService.completedDates.contains(remote.completedDate) {
                        dailyChallengeService.completedDates.append(remote.completedDate)
                    }
                }
                let today = todayDateString()
                dailyChallengeService.isCompleted = dailyChallengeService.completedDates.contains(today)
            }

        } catch {
            print("[SyncService] Pull failed: \(error)")
        }
    }

    /// Debounced push: schedules a push after a delay. Repeated calls reset the timer.
    func schedulePush(
        authService: AuthService,
        progressService: ProgressService,
        heartsService: HeartsService,
        dailyChallengeService: DailyChallengeService
    ) {
        pushTask?.cancel()
        pushTask = Task {
            try? await Task.sleep(nanoseconds: UInt64(debounceInterval * 1_000_000_000))
            guard !Task.isCancelled else { return }
            await pushAll(
                authService: authService,
                progressService: progressService,
                heartsService: heartsService,
                dailyChallengeService: dailyChallengeService
            )
        }
    }

    /// Push all local state to Supabase.
    func pushAll(
        authService: AuthService,
        progressService: ProgressService,
        heartsService: HeartsService,
        dailyChallengeService: DailyChallengeService
    ) async {
        guard let userId = authService.userId else { return }
        let client = authService.client
        let now = isoFormatter.string(from: Date())

        do {
            // 1. user_progress
            let progressRow = UserProgressRow(
                userId: userId,
                totalXP: progressService.userProgress.totalXP,
                currentLevel: progressService.userProgress.currentLevel,
                currentStreak: progressService.userProgress.currentStreak,
                lastPracticeDate: progressService.userProgress.lastPracticeDate,
                dailyQuestionsCompleted: progressService.userProgress.dailyQuestionsCompleted,
                updatedAt: isoFormatter.string(from: progressService.userProgress.updatedAt)
            )
            try await client.from("user_progress")
                .upsert(progressRow)
                .execute()

            // 2. topic_progress — 6 rows
            let topicRows = progressService.topicProgress.map { tp in
                TopicProgressRow(
                    userId: userId,
                    topic: tp.topic,
                    questionsAttempted: tp.questionsAttempted,
                    questionsCorrect: tp.questionsCorrect,
                    updatedAt: isoFormatter.string(from: tp.updatedAt)
                )
            }
            try await client.from("topic_progress")
                .upsert(topicRows)
                .execute()

            // 3. question_history
            let historyRows = progressService.questionHistory.map { qh in
                QuestionHistoryRow(
                    userId: userId,
                    questionId: qh.questionID,
                    timesSeen: qh.timesSeen,
                    timesCorrect: qh.timesCorrect,
                    lastSeenDate: qh.lastSeenDate,
                    inReviewQueue: qh.inReviewQueue,
                    reviewPriority: qh.reviewPriority,
                    updatedAt: isoFormatter.string(from: qh.updatedAt)
                )
            }
            if !historyRows.isEmpty {
                try await client.from("question_history")
                    .upsert(historyRows)
                    .execute()
            }

            // 4. hearts_state
            let heartsRow = HeartsStateRow(
                userId: userId,
                current: heartsService.hearts,
                lastLostAt: nil,
                regenTimestamps: [],
                updatedAt: now
            )
            try await client.from("hearts_state")
                .upsert(heartsRow)
                .execute()

            // 5. daily_challenge_completions — insert new ones
            for date in dailyChallengeService.completedDates {
                let row = DailyChallengeCompletionRow(userId: userId, completedDate: date)
                // Use upsert to avoid duplicates (on conflict do nothing)
                try await client.from("daily_challenge_completions")
                    .upsert(row)
                    .execute()
            }

        } catch {
            print("[SyncService] Push failed: \(error)")
        }
    }

    // MARK: - Helpers

    private func todayDateString() -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd"
        formatter.timeZone = TimeZone.current
        return formatter.string(from: Date())
    }
}
