import SwiftUI

struct QuestionCardView: View {
    let question: Question
    let onAnswer: (String, Bool) -> Void

    @State private var answered = false
    @State private var showExplanation = false

    private var difficultyColor: Color {
        switch question.difficulty {
        case .easy: return .correct
        case .medium: return .gold
        case .hard: return .incorrect
        }
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            // Difficulty + Topic
            HStack(spacing: 12) {
                Text(question.difficulty.rawValue)
                    .font(.sans(12, weight: .medium))
                    .foregroundColor(difficultyColor)

                Text(question.topic.displayName)
                    .font(.sans(12))
                    .foregroundColor(.creamDark)
            }
            .padding(.bottom, 16)

            // Question type view
            questionView
                .padding(.bottom, 16)

            // Explanation (shown after answer)
            if showExplanation {
                Rectangle().fill(Color.gold.opacity(0.15)).frame(height: 1)
                    .padding(.bottom, 12)

                Text(question.explanation)
                    .font(.sans(14))
                    .foregroundColor(.creamDark)
                    .padding(.bottom, 8)
            }
        }
    }

    @ViewBuilder
    private var questionView: some View {
        switch question.type {
        case .multipleChoice:
            MultipleChoiceView(question: question) { answer in
                handleAnswer(answer)
            }
        case .trueFalse:
            TrueFalseView(question: question) { answer in
                handleAnswer(answer)
            }
        case .numeric:
            NumericView(question: question) { answer in
                handleAnswer(answer)
            }
        case .conceptual:
            ConceptualView(question: question) { answer in
                handleConceptualAnswer(answer)
            }
        }
    }

    private func handleAnswer(_ userAnswer: String) {
        let correct = QuestionEngine.checkAnswer(question: question, userAnswer: userAnswer)
        answered = true
        withAnimation(.easeInOut(duration: 0.3)) {
            showExplanation = true
        }
        onAnswer(userAnswer, correct)
    }

    private func handleConceptualAnswer(_ result: String) {
        let correct = result == "correct"
        answered = true
        withAnimation(.easeInOut(duration: 0.3)) {
            showExplanation = true
        }
        onAnswer(result, correct)
    }
}

#Preview {
    ScrollView {
        QuestionCardView(
            question: Question(
                id: "mc1", topic: .accounting, difficulty: .medium,
                type: .multipleChoice,
                questionText: "What does EBITDA stand for?",
                options: [
                    MCOption(text: "Earnings Before Interest, Taxes, Depreciation, and Amortization", isCorrect: true),
                    MCOption(text: "Something else", isCorrect: false)
                ],
                correctAnswer: "Earnings Before Interest, Taxes, Depreciation, and Amortization",
                explanation: "EBITDA measures core operating profitability.",
                tags: nil
            ),
            onAnswer: { _, _ in }
        )
        .padding(24)
    }
    .background(Color.navy)
}
