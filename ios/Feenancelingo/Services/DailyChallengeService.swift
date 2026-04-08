import Foundation

struct DailyChallenge: Codable {
    let date: String       // YYYY-MM-DD
    let topic: Topic
    let difficulty: Difficulty
    let questionCount: Int // always 5
    let bonusXPMultiplier: Double // 2.0
    let title: String
}

@MainActor
class DailyChallengeService: ObservableObject {
    // MARK: - Storage Key (matches web localStorage key)
    private static let storageKey = "feenancelingo_daily_challenge"

    // MARK: - Published State
    @Published var challenge: DailyChallenge
    @Published var isCompleted: Bool
    @Published var completedDates: [String]

    // MARK: - Constants (must match web order exactly)
    /// Topic ordering matches web ALL_TOPICS array.
    private static let allTopics: [Topic] = [
        .accounting, .valuation, .dcf,
        .mergersAcquisitions, .lbo, .evEquityValue,
    ]
    private static let difficulties: [Difficulty] = [.easy, .medium, .hard]

    // MARK: - Persisted backing
    private struct StoredState: Codable {
        var completedDates: [String] = []
    }

    // MARK: - Init
    init() {
        let today = Self.todayDateString()
        let todayChallenge = Self.generateChallenge(for: today)

        var stored = StoredState()
        if let data = UserDefaults.standard.data(forKey: Self.storageKey),
           let saved = try? JSONDecoder().decode(StoredState.self, from: data) {
            stored = saved
        }

        challenge = todayChallenge
        completedDates = stored.completedDates
        isCompleted = stored.completedDates.contains(today)
    }

    // MARK: - Complete Challenge
    func completeChallenge() {
        let today = Self.todayDateString()
        guard !completedDates.contains(today) else { return }

        completedDates.append(today)
        isCompleted = true
        save()
    }

    // MARK: - Refresh (e.g., on app foreground)
    func refreshIfNeeded() {
        let today = Self.todayDateString()
        if challenge.date != today {
            challenge = Self.generateChallenge(for: today)
            isCompleted = completedDates.contains(today)
        }
    }

    // MARK: - Deterministic Challenge Generation (matches web hash exactly)
    /// Simple deterministic hash: sum of char codes of the date string.
    /// Must match web's `hashDateString` exactly so both platforms produce the same challenge.
    static func generateChallenge(for date: String) -> DailyChallenge {
        let hash = hashDateString(date)

        let topicIndex = hash % allTopics.count
        let difficultyIndex = (hash / allTopics.count) % difficulties.count

        let topic = allTopics[topicIndex]
        let difficulty = difficulties[difficultyIndex]

        return DailyChallenge(
            date: date,
            topic: topic,
            difficulty: difficulty,
            questionCount: 5,
            bonusXPMultiplier: 2.0,
            title: "\(difficulty.rawValue) \(topic.displayName)"
        )
    }

    /// Sums Unicode scalar values of each character. Matches web's charCodeAt behavior
    /// since date strings are ASCII-only (digits and hyphens).
    private static func hashDateString(_ dateStr: String) -> Int {
        var hash = 0
        for char in dateStr.unicodeScalars {
            hash += Int(char.value)
        }
        return hash
    }

    // MARK: - Persistence
    private func save() {
        let stored = StoredState(completedDates: completedDates)
        if let data = try? JSONEncoder().encode(stored) {
            UserDefaults.standard.set(data, forKey: Self.storageKey)
        }
    }

    private static func todayDateString() -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd"
        formatter.timeZone = TimeZone.current
        return formatter.string(from: Date())
    }
}
