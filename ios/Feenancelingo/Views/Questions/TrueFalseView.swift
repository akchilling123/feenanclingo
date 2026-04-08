import SwiftUI

struct TrueFalseView: View {
    let question: Question
    let onAnswer: (String) -> Void

    @State private var selectedAnswer: String? = nil
    @State private var hasAnswered = false

    private var isCorrectAnswer: Bool {
        question.correctAnswer.lowercased() == "true"
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            Text(question.questionText)
                .font(.serif(20))
                .foregroundColor(.cream)
                .padding(.bottom, 24)

            tfButton(label: "True", value: "true")
            Rectangle().fill(Color.gold.opacity(0.08)).frame(height: 1)
            tfButton(label: "False", value: "false")
        }
    }

    @ViewBuilder
    private func tfButton(label: String, value: String) -> some View {
        Button {
            guard !hasAnswered else { return }
            selectedAnswer = value
            hasAnswered = true
            onAnswer(value)
        } label: {
            HStack(spacing: 0) {
                if hasAnswered {
                    Rectangle()
                        .fill(tfBorderColor(value: value))
                        .frame(width: 3)
                }

                Text(label)
                    .font(.sans(15, weight: .medium))
                    .foregroundColor(.cream)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(.vertical, 16)
                    .padding(.horizontal, 16)
            }
            .background(tfBackground(value: value))
        }
        .disabled(hasAnswered)
    }

    private func tfBorderColor(value: String) -> Color {
        let isCorrect = question.correctAnswer.lowercased() == value
        if isCorrect { return .correct }
        if value == selectedAnswer { return .incorrect }
        return .clear
    }

    private func tfBackground(value: String) -> Color {
        guard hasAnswered else { return Color.navyLight }
        let isCorrect = question.correctAnswer.lowercased() == value
        if isCorrect { return Color.correct.opacity(0.08) }
        if value == selectedAnswer && !isCorrect { return Color.incorrect.opacity(0.08) }
        return Color.navyLight
    }
}

#Preview {
    TrueFalseView(
        question: Question(
            id: "tf1", topic: .accounting, difficulty: .easy,
            type: .trueFalse, questionText: "Depreciation is a non-cash expense.",
            options: nil, correctAnswer: "true",
            explanation: "Depreciation reduces book value but does not involve cash outflow.",
            tags: nil
        ),
        onAnswer: { _ in }
    )
    .padding()
    .background(Color.navy)
}
