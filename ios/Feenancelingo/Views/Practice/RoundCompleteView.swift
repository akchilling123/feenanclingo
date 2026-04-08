import SwiftUI

struct RoundCompleteView: View {
    let answers: [RoundAnswer]
    let onPracticeAgain: () -> Void
    let onHome: () -> Void

    private var totalCorrect: Int {
        answers.filter(\.isCorrect).count
    }

    private var totalXP: Int {
        answers.reduce(0) { $0 + $1.xpEarned }
    }

    private var scoreFraction: Double {
        guard !answers.isEmpty else { return 0 }
        return Double(totalCorrect) / Double(answers.count)
    }

    var body: some View {
        VStack(spacing: 0) {
            Spacer().frame(height: 48)

            // Score ring
            ZStack {
                Circle()
                    .stroke(Color.navyMid, lineWidth: 4)
                    .frame(width: 120, height: 120)

                Circle()
                    .trim(from: 0, to: scoreFraction)
                    .stroke(Color.gold, style: StrokeStyle(lineWidth: 4, lineCap: .round))
                    .frame(width: 120, height: 120)
                    .rotationEffect(.degrees(-90))
                    .animation(.easeInOut(duration: 0.8), value: scoreFraction)

                VStack(spacing: 2) {
                    Text("\(totalCorrect)/\(answers.count)")
                        .font(.serif(28, weight: .semibold))
                        .foregroundColor(.cream)
                    Text("correct")
                        .font(.sans(12))
                        .foregroundColor(.creamDark)
                }
            }
            .padding(.bottom, 32)

            // XP earned
            Text("+\(totalXP) XP")
                .font(.serif(24, weight: .medium))
                .foregroundColor(.gold)
                .padding(.bottom, 16)

            // Level progress bar (placeholder)
            VStack(alignment: .leading, spacing: 6) {
                ProgressBarView(value: Double(totalXP), max: 100, height: 3)
                Text("Level progress")
                    .font(.sans(12))
                    .foregroundColor(.creamDark)
            }
            .padding(.horizontal, 24)
            .padding(.bottom, 48)

            Rectangle().fill(Color.gold.opacity(0.15)).frame(height: 1)
                .padding(.horizontal, 24)
                .padding(.bottom, 32)

            // Buttons
            VStack(spacing: 12) {
                Button {
                    onPracticeAgain()
                } label: {
                    Text("Practice Again")
                        .font(.sans(15, weight: .medium))
                        .foregroundColor(.navy)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 14)
                        .background(Color.gold)
                }

                Button {
                    onHome()
                } label: {
                    Text("Home")
                        .font(.sans(14))
                        .foregroundColor(.goldLight)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 12)
                }
            }
            .padding(.horizontal, 24)

            Spacer()
        }
        .background(Color.navy)
    }
}

#Preview {
    RoundCompleteView(
        answers: [
            RoundAnswer(questionID: "1", userAnswer: "a", isCorrect: true, xpEarned: 10),
            RoundAnswer(questionID: "2", userAnswer: "b", isCorrect: false, xpEarned: 0),
            RoundAnswer(questionID: "3", userAnswer: "c", isCorrect: true, xpEarned: 5),
        ],
        onPracticeAgain: {},
        onHome: {}
    )
}
