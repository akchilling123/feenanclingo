import SwiftUI

struct NumericView: View {
    let question: Question
    let onAnswer: (String) -> Void

    @State private var inputText: String = ""
    @State private var hasAnswered = false
    @State private var isCorrect = false
    @FocusState private var inputFocused: Bool

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            Text(question.questionText)
                .font(.serif(20))
                .foregroundColor(.cream)
                .padding(.bottom, 24)

            // Number input
            VStack(alignment: .leading, spacing: 8) {
                TextField("", text: $inputText)
                    .font(.sans(18))
                    .foregroundColor(.cream)
                    #if os(iOS)
                    .keyboardType(.decimalPad)
                    #endif
                    .focused($inputFocused)
                    .disabled(hasAnswered)
                    .tint(Color.gold)

                Rectangle()
                    .fill(hasAnswered
                          ? (isCorrect ? Color.correct : Color.incorrect)
                          : Color.gold.opacity(0.4))
                    .frame(height: 1)
            }
            .padding(.bottom, 20)

            if !hasAnswered {
                Button {
                    guard !inputText.isEmpty else { return }
                    isCorrect = QuestionEngine.checkAnswer(question: question, userAnswer: inputText)
                    hasAnswered = true
                    inputFocused = false
                    onAnswer(inputText)
                } label: {
                    Text("Submit")
                        .font(.sans(15, weight: .medium))
                        .foregroundColor(.navy)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 12)
                        .background(Color.gold)
                }
            }

            if hasAnswered && !isCorrect {
                Text("Correct answer: \(question.correctAnswer)")
                    .font(.sans(14))
                    .foregroundColor(.creamDark)
                    .padding(.top, 12)
            }
        }
    }
}

#Preview {
    NumericView(
        question: Question(
            id: "num1", topic: .valuation, difficulty: .hard,
            type: .numeric, questionText: "If a company has $100M revenue growing at 10% annually, what is revenue in year 2 (in $M)?",
            options: nil, correctAnswer: "121",
            explanation: "$100M * 1.1 * 1.1 = $121M",
            tags: nil
        ),
        onAnswer: { _ in }
    )
    .padding()
    .background(Color.navy)
}
