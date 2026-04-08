import SwiftUI

struct DailyChallengeView: View {
    enum Phase {
        case intro
        case active([Question])
        case complete([RoundAnswer])
    }

    @State private var phase: Phase = .intro
    @State private var hearts: Int = HeartsState.maxHearts

    var body: some View {
        NavigationStack {
            Group {
                switch phase {
                case .intro:
                    introView
                case .active(let questions):
                    ActiveRoundView(
                        config: RoundConfig(topic: .accounting, questionCount: 5),
                        questions: questions,
                        timedMode: true,
                        hearts: hearts,
                        onComplete: { answers in
                            phase = .complete(answers)
                        },
                        onOutOfHearts: {
                            phase = .complete([])
                        }
                    )
                case .complete(let answers):
                    completeView(answers: answers)
                }
            }
            .background(Color.navy)
        }
    }

    private var introView: some View {
        VStack(alignment: .leading, spacing: 0) {
            Spacer()

            Text("Daily Challenge")
                .font(.serif(28, weight: .semibold))
                .foregroundColor(.cream)
                .padding(.bottom, 8)

            Text("5 questions across all topics")
                .font(.sans(15))
                .foregroundColor(.creamDark)
                .padding(.bottom, 16)

            // 2x XP badge
            HStack(spacing: 8) {
                Rectangle().fill(Color.gold).frame(width: 3, height: 32)
                Text("2x XP")
                    .font(.serif(18, weight: .medium))
                    .foregroundColor(.gold)
            }
            .padding(.bottom, 32)

            Text("Timed: 30 seconds per question")
                .font(.sans(13))
                .foregroundColor(.creamDark)
                .padding(.bottom, 32)

            Button {
                // Grab 5 random questions from all topics
                let allQuestions = QuestionService.shared.allQuestions
                let shuffled = QuestionEngine.shuffled(allQuestions)
                let selected = Array(shuffled.prefix(5))
                if !selected.isEmpty {
                    phase = .active(selected)
                }
            } label: {
                Text("Start Challenge")
                    .font(.sans(15, weight: .medium))
                    .foregroundColor(.navy)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 14)
                    .background(Color.gold)
            }
            .padding(.horizontal, 24)

            Spacer()
        }
        .padding(.horizontal, 24)
    }

    @ViewBuilder
    private func completeView(answers: [RoundAnswer]) -> some View {
        let totalCorrect = answers.filter(\.isCorrect).count
        let baseXP = answers.reduce(0) { $0 + $1.xpEarned }
        let totalXP = baseXP * 2 // 2x multiplier

        VStack(spacing: 0) {
            Spacer()

            Text("Challenge Complete")
                .font(.serif(24, weight: .semibold))
                .foregroundColor(.cream)
                .padding(.bottom, 16)

            // Score ring
            ZStack {
                Circle()
                    .stroke(Color.navyMid, lineWidth: 4)
                    .frame(width: 100, height: 100)

                Circle()
                    .trim(from: 0, to: answers.isEmpty ? 0 : Double(totalCorrect) / Double(answers.count))
                    .stroke(Color.gold, style: StrokeStyle(lineWidth: 4, lineCap: .round))
                    .frame(width: 100, height: 100)
                    .rotationEffect(.degrees(-90))

                Text("\(totalCorrect)/\(answers.count)")
                    .font(.serif(22, weight: .semibold))
                    .foregroundColor(.cream)
            }
            .padding(.bottom, 24)

            // 2x XP earned
            HStack(spacing: 8) {
                Text("+\(totalXP) XP")
                    .font(.serif(20, weight: .medium))
                    .foregroundColor(.gold)
                Text("(2x)")
                    .font(.sans(13))
                    .foregroundColor(.goldLight)
            }
            .padding(.bottom, 32)

            Button {
                phase = .intro
            } label: {
                Text("Done")
                    .font(.sans(15, weight: .medium))
                    .foregroundColor(.navy)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 14)
                    .background(Color.gold)
            }
            .padding(.horizontal, 24)

            Spacer()
        }
    }
}

#Preview {
    DailyChallengeView()
}
