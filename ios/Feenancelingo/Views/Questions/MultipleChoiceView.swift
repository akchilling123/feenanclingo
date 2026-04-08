import SwiftUI

struct MultipleChoiceView: View {
    let question: Question
    let onAnswer: (String) -> Void

    @State private var selectedOption: String? = nil
    @State private var hasAnswered = false

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            Text(question.questionText)
                .font(.serif(20))
                .foregroundColor(.cream)
                .padding(.bottom, 24)

            if let options = question.options {
                ForEach(options) { option in
                    Button {
                        guard !hasAnswered else { return }
                        selectedOption = option.text
                        hasAnswered = true
                        onAnswer(option.text)
                    } label: {
                        HStack(spacing: 0) {
                            // Left border accent
                            if hasAnswered {
                                Rectangle()
                                    .fill(borderColor(for: option))
                                    .frame(width: 3)
                            }

                            Text(option.text)
                                .font(.sans(15))
                                .foregroundColor(.cream)
                                .frame(maxWidth: .infinity, alignment: .leading)
                                .padding(.vertical, 14)
                                .padding(.horizontal, 16)
                        }
                        .background(optionBackground(for: option))
                    }
                    .disabled(hasAnswered)

                    Rectangle().fill(Color.gold.opacity(0.08)).frame(height: 1)
                }
            }
        }
    }

    private func borderColor(for option: MCOption) -> Color {
        if option.isCorrect {
            return .correct
        }
        if option.text == selectedOption && !option.isCorrect {
            return .incorrect
        }
        return .clear
    }

    private func optionBackground(for option: MCOption) -> Color {
        guard hasAnswered else { return Color.navyLight }
        if option.isCorrect {
            return Color.correct.opacity(0.08)
        }
        if option.text == selectedOption && !option.isCorrect {
            return Color.incorrect.opacity(0.08)
        }
        return Color.navyLight
    }
}

#Preview {
    MultipleChoiceView(
        question: Question(
            id: "mc1",
            topic: .accounting,
            difficulty: .medium,
            type: .multipleChoice,
            questionText: "What does EBITDA stand for?",
            options: [
                MCOption(text: "Earnings Before Interest, Taxes, Depreciation, and Amortization", isCorrect: true),
                MCOption(text: "Earnings Before Income Tax Deductions Applied", isCorrect: false),
                MCOption(text: "Enterprise Business Income Tax Depreciation Amount", isCorrect: false),
                MCOption(text: "Estimated Business Income Total Deducted Amount", isCorrect: false)
            ],
            correctAnswer: "Earnings Before Interest, Taxes, Depreciation, and Amortization",
            explanation: "EBITDA is a measure of core profitability.",
            tags: nil
        ),
        onAnswer: { _ in }
    )
    .padding()
    .background(Color.navy)
}
