import Foundation

@MainActor
class SpacedRepetitionService: ObservableObject {
    // MARK: - Published State
    @Published var reviewQueue: [Question] = []
    @Published var reviewCount: Int = 0

    // MARK: - Computed
    var hasReviewItems: Bool { reviewCount > 0 }

    // MARK: - Refresh
    /// Recompute the review queue from the current question history.
    func refresh(history: [QuestionHistory]) {
        let allQuestions = QuestionService.shared.allQuestions
        let questionMap = Dictionary(uniqueKeysWithValues: allQuestions.map { ($0.id, $0) })

        let reviewEntries = history
            .filter { $0.inReviewQueue }
            .sorted { $0.reviewPriority > $1.reviewPriority }

        reviewQueue = reviewEntries.compactMap { entry in
            questionMap[entry.questionID]
        }
        reviewCount = reviewQueue.count
    }

    // MARK: - Get Review Round
    /// Returns up to `count` questions from the review queue, highest priority first.
    func getReviewRound(count: Int) -> [Question] {
        Array(reviewQueue.prefix(count))
    }

    // MARK: - Static Helpers (mirror web spacedRepetition.ts)

    /// Calculate updated review priority after an answer.
    ///
    /// Wrong answer: priority = current + 2
    /// Right answer in review: priority = current - 1 (min 0)
    /// If priority reaches 0 AND times_correct >= times_seen * 0.5: remove from review queue
    static func updateReviewPriority(entry: QuestionHistory, isCorrect: Bool) -> QuestionHistory {
        var updated = entry

        if !isCorrect {
            updated.reviewPriority += 2
            return updated
        }

        // Correct answer -- decrease priority
        let newPriority = max(0, entry.reviewPriority - 1)
        updated.reviewPriority = newPriority

        let shouldRemove = newPriority == 0
            && Double(entry.timesCorrect) >= Double(entry.timesSeen) * 0.5

        if shouldRemove {
            updated.inReviewQueue = false
        }

        return updated
    }

    /// Check if a question should enter the review queue.
    /// Enters queue if: answer was wrong AND not already in queue.
    static func shouldEnterReviewQueue(entry: QuestionHistory?, isCorrect: Bool) -> Bool {
        if isCorrect { return false }
        guard let entry = entry else { return true }
        return !entry.inReviewQueue
    }
}
