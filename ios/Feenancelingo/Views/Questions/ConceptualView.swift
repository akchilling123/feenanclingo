import SwiftUI

struct ConceptualView: View {
    let question: Question
    let onAnswer: (String) -> Void

    @State private var revealed = false
    @State private var hasAnswered = false

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            Text(question.questionText)
                .font(.serif(20))
                .foregroundColor(.cream)
                .padding(.bottom, 24)

            if !revealed {
                Button {
                    withAnimation(.easeInOut(duration: 0.3)) {
                        revealed = true
                    }
                } label: {
                    Text("Show Answer")
                        .font(.sans(14))
                        .foregroundColor(.goldLight)
                }
            }

            if revealed {
                Text(question.correctAnswer)
                    .font(.serif(16))
                    .foregroundColor(.cream)
                    .padding(.vertical, 16)
                    .transition(.opacity)

                if !hasAnswered {
                    VStack(spacing: 8) {
                        Button {
                            hasAnswered = true
                            onAnswer("correct")
                        } label: {
                            HStack(spacing: 0) {
                                Rectangle()
                                    .fill(Color.gold)
                                    .frame(width: 3)
                                Text("Got it")
                                    .font(.sans(15, weight: .medium))
                                    .foregroundColor(.cream)
                                    .frame(maxWidth: .infinity, alignment: .leading)
                                    .padding(.vertical, 14)
                                    .padding(.horizontal, 16)
                            }
                            .background(Color.navyLight)
                        }

                        Button {
                            hasAnswered = true
                            onAnswer("incorrect")
                        } label: {
                            HStack(spacing: 0) {
                                Rectangle()
                                    .fill(Color.incorrect)
                                    .frame(width: 3)
                                Text("Missed it")
                                    .font(.sans(15, weight: .medium))
                                    .foregroundColor(.cream)
                                    .frame(maxWidth: .infinity, alignment: .leading)
                                    .padding(.vertical, 14)
                                    .padding(.horizontal, 16)
                            }
                            .background(Color.navyLight)
                        }
                    }
                }
            }
        }
    }
}

#Preview {
    ConceptualView(
        question: Question(
            id: "c1", topic: .valuation, difficulty: .medium,
            type: .conceptual,
            questionText: "Explain the difference between enterprise value and equity value.",
            options: nil,
            correctAnswer: "Enterprise value represents the total value of a company's operations, while equity value represents the value attributable to shareholders after accounting for debt and cash.",
            explanation: "EV = Equity Value + Net Debt",
            tags: nil
        ),
        onAnswer: { _ in }
    )
    .padding()
    .background(Color.navy)
}
