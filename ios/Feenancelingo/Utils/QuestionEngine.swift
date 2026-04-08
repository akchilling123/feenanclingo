import Foundation

struct QuestionEngine {
    static func shuffled<T>(_ array: [T]) -> [T] {
        var result = array
        for i in stride(from: result.count - 1, through: 1, by: -1) {
            let j = Int.random(in: 0...i)
            result.swapAt(i, j)
        }
        return result
    }

    static func questionsForRound(
        topic: Topic,
        count: Int,
        history: [QuestionHistory] = [],
        service: QuestionService = .shared
    ) -> [Question] {
        let pool = service.questions(for: topic)
        guard !pool.isEmpty else { return [] }

        let historyMap = Dictionary(uniqueKeysWithValues: history.map { ($0.questionID, $0) })

        let sorted: [Question]
        if !history.isEmpty {
            sorted = pool.sorted { a, b in
                let seenA = historyMap[a.id]?.timesSeen ?? 0
                let seenB = historyMap[b.id]?.timesSeen ?? 0
                if seenA != seenB { return seenA < seenB }
                return Bool.random()
            }
        } else {
            sorted = shuffled(pool)
        }

        return Array(sorted.prefix(count))
    }

    static func checkAnswer(question: Question, userAnswer: String) -> Bool {
        switch question.type {
        case .multipleChoice, .trueFalse:
            return userAnswer.trimmingCharacters(in: .whitespaces).lowercased() ==
                   question.correctAnswer.trimmingCharacters(in: .whitespaces).lowercased()
        case .numeric:
            guard let user = Double(userAnswer),
                  let correct = Double(question.correctAnswer) else { return false }
            return abs(user - correct) < 0.01
        case .conceptual:
            return true // Self-graded
        }
    }
}
