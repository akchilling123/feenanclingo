import SwiftUI

struct PracticeView: View {
    enum Phase {
        case topicSelect
        case roundConfig(Topic)
        case activeRound(RoundConfig, [Question], Bool)
        case roundComplete([RoundAnswer])
        case outOfHearts
    }

    @State private var phase: Phase = .topicSelect
    @State private var hearts: Int = HeartsState.maxHearts

    var body: some View {
        NavigationStack {
            Group {
                switch phase {
                case .topicSelect:
                    ScrollView {
                        TopicSelectView { topic in
                            phase = .roundConfig(topic)
                        }
                        .padding(.horizontal, 24)
                        .padding(.top, 32)
                    }

                case .roundConfig(let topic):
                    ScrollView {
                        RoundConfigView(topic: topic) { config, timed in
                            let questions = QuestionEngine.questionsForRound(
                                topic: config.topic,
                                count: config.questionCount
                            )
                            if questions.isEmpty {
                                // No questions available — stay on config
                                return
                            }
                            phase = .activeRound(config, questions, timed)
                        }
                        .padding(.horizontal, 24)
                        .padding(.top, 32)
                    }

                case .activeRound(let config, let questions, let timed):
                    ActiveRoundView(
                        config: config,
                        questions: questions,
                        timedMode: timed,
                        hearts: hearts,
                        onComplete: { answers in
                            phase = .roundComplete(answers)
                        },
                        onOutOfHearts: {
                            phase = .outOfHearts
                        }
                    )

                case .roundComplete(let answers):
                    RoundCompleteView(
                        answers: answers,
                        onPracticeAgain: {
                            phase = .topicSelect
                        },
                        onHome: {
                            phase = .topicSelect
                        }
                    )

                case .outOfHearts:
                    outOfHeartsView
                }
            }
            .background(Color.navy)
        }
    }

    private var outOfHeartsView: some View {
        VStack(spacing: 0) {
            Spacer()

            HeartsDisplayView(hearts: 0)
                .padding(.bottom, 24)

            Text("Out of Hearts")
                .font(.serif(28, weight: .semibold))
                .foregroundColor(.cream)
                .padding(.bottom, 8)

            Text("Hearts regenerate every 4 hours.")
                .font(.sans(14))
                .foregroundColor(.creamDark)
                .padding(.bottom, 32)

            Button {
                hearts = HeartsState.maxHearts
                phase = .topicSelect
            } label: {
                Text("Back to Topics")
                    .font(.sans(15, weight: .medium))
                    .foregroundColor(.navy)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 14)
                    .background(Color.gold)
            }
            .padding(.horizontal, 24)

            Spacer()
        }
        .background(Color.navy)
    }
}

#Preview {
    PracticeView()
}
