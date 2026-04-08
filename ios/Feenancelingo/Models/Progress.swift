import Foundation

enum Level: String, CaseIterable {
    case analystI = "Analyst I"
    case analystII = "Analyst II"
    case analystIII = "Analyst III"
    case associate = "Associate"
    case vp = "VP"
    case director = "Director"
    case md = "MD"
    case partner = "Partner"

    var xpThreshold: Int {
        switch self {
        case .analystI: return 0
        case .analystII: return 100
        case .analystIII: return 250
        case .associate: return 500
        case .vp: return 1000
        case .director: return 2000
        case .md: return 4000
        case .partner: return 8000
        }
    }

    static func forXP(_ xp: Int) -> Level {
        for level in Level.allCases.reversed() {
            if xp >= level.xpThreshold { return level }
        }
        return .analystI
    }
}

struct UserProgress: Codable {
    var totalXP: Int = 0
    var currentLevel: String = "Analyst I"
    var currentStreak: Int = 0
    var lastPracticeDate: String? = nil
    var dailyQuestionsCompleted: Int = 0
    var updatedAt: Date = Date()
}

struct TopicProgress: Codable, Identifiable {
    var id: String { topic }
    let topic: String
    var questionsAttempted: Int = 0
    var questionsCorrect: Int = 0
    var updatedAt: Date = Date()
}

struct QuestionHistory: Codable, Identifiable {
    var id: String { questionID }
    let questionID: String
    var timesSeen: Int = 0
    var timesCorrect: Int = 0
    var lastSeenDate: String
    var inReviewQueue: Bool = false
    var reviewPriority: Int = 0
    var updatedAt: Date = Date()

    enum CodingKeys: String, CodingKey {
        case questionID = "question_id"
        case timesSeen = "times_seen"
        case timesCorrect = "times_correct"
        case lastSeenDate = "last_seen_date"
        case inReviewQueue = "in_review_queue"
        case reviewPriority = "review_priority"
        case updatedAt = "updated_at"
    }
}
