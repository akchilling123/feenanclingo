import Foundation

struct RoundConfig {
    let topic: Topic
    let questionCount: Int // 5 or 10
}

struct RoundAnswer: Identifiable {
    var id: String { questionID }
    let questionID: String
    let userAnswer: String
    let isCorrect: Bool
    let xpEarned: Int
}
