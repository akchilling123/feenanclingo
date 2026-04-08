import Foundation

enum Topic: String, Codable, CaseIterable {
    case accounting
    case valuation
    case dcf
    case mergersAcquisitions = "mergers-acquisitions"
    case lbo
    case evEquityValue = "ev-equity-value"

    var displayName: String {
        switch self {
        case .accounting: return "Accounting"
        case .valuation: return "Valuation"
        case .dcf: return "DCF"
        case .mergersAcquisitions: return "M&A"
        case .lbo: return "LBO"
        case .evEquityValue: return "EV / Equity Value"
        }
    }
}

enum Difficulty: String, Codable {
    case easy = "Easy"
    case medium = "Medium"
    case hard = "Hard"

    var xpValue: Int {
        switch self {
        case .easy: return 5
        case .medium: return 10
        case .hard: return 20
        }
    }
}

enum QuestionType: String, Codable {
    case multipleChoice = "multiple_choice"
    case numeric
    case trueFalse = "true_false"
    case conceptual
}

struct MCOption: Codable, Identifiable, Hashable {
    var id: String { text }
    let text: String
    let isCorrect: Bool
}

struct Question: Codable, Identifiable {
    let id: String
    let topic: Topic
    let difficulty: Difficulty
    let type: QuestionType
    let questionText: String
    let options: [MCOption]?
    let correctAnswer: String
    let explanation: String
    let tags: [String]?

    enum CodingKeys: String, CodingKey {
        case id, topic, difficulty, type
        case questionText = "question_text"
        case options
        case correctAnswer = "correct_answer"
        case explanation, tags
    }
}
