import Foundation

class QuestionService: ObservableObject {
    static let shared = QuestionService()

    @Published private(set) var allQuestions: [Question] = []

    private init() {
        loadAll()
    }

    private func loadAll() {
        let files = ["accounting", "valuation", "dcf",
                     "mergers-acquisitions", "lbo", "ev-equity-value"]
        for file in files {
            if let url = Bundle.main.url(forResource: file, withExtension: "json"),
               let data = try? Data(contentsOf: url),
               let questions = try? JSONDecoder().decode([Question].self, from: data) {
                allQuestions.append(contentsOf: questions)
            }
        }
    }

    func questions(for topic: Topic) -> [Question] {
        allQuestions.filter { $0.topic == topic }
    }

    func topicStats(for topic: Topic) -> (total: Int, byDifficulty: [Difficulty: Int]) {
        let qs = questions(for: topic)
        var byDiff: [Difficulty: Int] = [.easy: 0, .medium: 0, .hard: 0]
        for q in qs { byDiff[q.difficulty, default: 0] += 1 }
        return (qs.count, byDiff)
    }
}
