import Foundation

@MainActor
class ProgressService: ObservableObject {
    // MARK: - Storage Keys (match web localStorage keys)
    private enum Keys {
        static let userProgress = "feenancelingo_user_progress"
        static let topicProgress = "feenancelingo_topic_progress"
        static let questionHistory = "feenancelingo_question_history"
    }

    // MARK: - Published State
    @Published var userProgress: UserProgress
    @Published var topicProgress: [TopicProgress]
    @Published var questionHistory: [QuestionHistory]

    // MARK: - Computed Properties
    var currentLevel: Level { Level.forXP(userProgress.totalXP) }
    var xpToNextLevel: (current: Int, required: Int, progress: Double) {
        LevelCalculator.xpForNextLevel(userProgress.totalXP)
    }

    // MARK: - Init
    init() {
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601

        if let data = UserDefaults.standard.data(forKey: Keys.userProgress),
           let saved = try? decoder.decode(UserProgress.self, from: data) {
            userProgress = saved
        } else {
            userProgress = UserProgress()
        }

        if let data = UserDefaults.standard.data(forKey: Keys.topicProgress),
           let saved = try? decoder.decode([TopicProgress].self, from: data) {
            topicProgress = saved
        } else {
            topicProgress = Topic.allCases.map { topic in
                TopicProgress(topic: topic.rawValue)
            }
        }

        if let data = UserDefaults.standard.data(forKey: Keys.questionHistory),
           let saved = try? decoder.decode([QuestionHistory].self, from: data) {
            questionHistory = saved
        } else {
            questionHistory = []
        }
    }

    // MARK: - Record Answer
    /// Records an answer and returns XP earned.
    @discardableResult
    func recordAnswer(questionId: String, topic: Topic, difficulty: Difficulty, isCorrect: Bool) -> Int {
        let xpEarned = XPCalculator.calculate(difficulty: difficulty, isCorrect: isCorrect)
        let today = Self.todayDateString()

        // 1. Update user progress
        let isNewDay = userProgress.lastPracticeDate != today
        userProgress.totalXP += xpEarned
        userProgress.currentLevel = Level.forXP(userProgress.totalXP).rawValue
        userProgress.dailyQuestionsCompleted = isNewDay ? 1 : userProgress.dailyQuestionsCompleted + 1
        userProgress.updatedAt = Date()

        // 2. Update topic progress
        if let idx = topicProgress.firstIndex(where: { $0.topic == topic.rawValue }) {
            topicProgress[idx].questionsAttempted += 1
            if isCorrect { topicProgress[idx].questionsCorrect += 1 }
            topicProgress[idx].updatedAt = Date()
        }

        // 3. Update question history
        if let idx = questionHistory.firstIndex(where: { $0.questionID == questionId }) {
            questionHistory[idx].timesSeen += 1
            if isCorrect { questionHistory[idx].timesCorrect += 1 }
            questionHistory[idx].lastSeenDate = today

            if isCorrect {
                questionHistory[idx].reviewPriority = max(0, questionHistory[idx].reviewPriority - 1)
            } else {
                questionHistory[idx].inReviewQueue = true
                questionHistory[idx].reviewPriority += 1
            }
            questionHistory[idx].updatedAt = Date()
        } else {
            let entry = QuestionHistory(
                questionID: questionId,
                timesSeen: 1,
                timesCorrect: isCorrect ? 1 : 0,
                lastSeenDate: today,
                inReviewQueue: !isCorrect,
                reviewPriority: isCorrect ? 0 : 1,
                updatedAt: Date()
            )
            questionHistory.append(entry)
        }

        // 4. Persist
        saveAll()

        return xpEarned
    }

    // MARK: - Reset
    func resetProgress() {
        userProgress = UserProgress()
        topicProgress = Topic.allCases.map { TopicProgress(topic: $0.rawValue) }
        questionHistory = []

        UserDefaults.standard.removeObject(forKey: Keys.userProgress)
        UserDefaults.standard.removeObject(forKey: Keys.topicProgress)
        UserDefaults.standard.removeObject(forKey: Keys.questionHistory)
    }

    // MARK: - Persistence Helpers
    private func saveAll() {
        let encoder = JSONEncoder()
        encoder.dateEncodingStrategy = .iso8601

        if let data = try? encoder.encode(userProgress) {
            UserDefaults.standard.set(data, forKey: Keys.userProgress)
        }
        if let data = try? encoder.encode(topicProgress) {
            UserDefaults.standard.set(data, forKey: Keys.topicProgress)
        }
        if let data = try? encoder.encode(questionHistory) {
            UserDefaults.standard.set(data, forKey: Keys.questionHistory)
        }
    }

    private static func todayDateString() -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd"
        formatter.timeZone = TimeZone.current
        return formatter.string(from: Date())
    }
}
