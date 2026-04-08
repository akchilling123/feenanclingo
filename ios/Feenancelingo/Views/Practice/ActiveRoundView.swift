import SwiftUI

struct ActiveRoundView: View {
    let config: RoundConfig
    let questions: [Question]
    let timedMode: Bool
    let hearts: Int
    let onComplete: ([RoundAnswer]) -> Void
    let onOutOfHearts: () -> Void

    @State private var currentIndex: Int = 0
    @State private var answers: [RoundAnswer] = []
    @State private var currentHearts: Int
    @State private var secondsRemaining: Int = 30
    @State private var timer: Timer? = nil
    @State private var waitingToAdvance = false

    init(config: RoundConfig, questions: [Question], timedMode: Bool, hearts: Int,
         onComplete: @escaping ([RoundAnswer]) -> Void,
         onOutOfHearts: @escaping () -> Void) {
        self.config = config
        self.questions = questions
        self.timedMode = timedMode
        self.hearts = hearts
        self.onComplete = onComplete
        self.onOutOfHearts = onOutOfHearts
        self._currentHearts = State(initialValue: hearts)
    }

    private var currentQuestion: Question? {
        guard currentIndex < questions.count else { return nil }
        return questions[currentIndex]
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            // Top bar: progress + hearts + timer
            HStack {
                ProgressBarView(
                    value: Double(currentIndex),
                    max: Double(questions.count),
                    height: 3
                )

                Spacer().frame(width: 16)

                Text("\(currentIndex + 1)/\(questions.count)")
                    .font(.sans(13))
                    .foregroundColor(.creamDark)

                if timedMode {
                    Spacer().frame(width: 12)
                    TimerView(secondsRemaining: secondsRemaining, totalSeconds: 30)
                }

                Spacer().frame(width: 12)
                HeartsDisplayView(hearts: currentHearts)
            }
            .padding(.bottom, 24)

            // Question card
            if let question = currentQuestion {
                QuestionCardView(question: question) { userAnswer, isCorrect in
                    handleAnswer(question: question, userAnswer: userAnswer, isCorrect: isCorrect)
                }
                .id(question.id) // Reset state on question change
            }

            Spacer()
        }
        .padding(.horizontal, 24)
        .padding(.top, 16)
        .background(Color.navy)
        .onAppear {
            if timedMode { startTimer() }
        }
        .onDisappear {
            timer?.invalidate()
        }
    }

    private func handleAnswer(question: Question, userAnswer: String, isCorrect: Bool) {
        timer?.invalidate()

        let xp = isCorrect ? question.difficulty.xpValue : 0
        let answer = RoundAnswer(
            questionID: question.id,
            userAnswer: userAnswer,
            isCorrect: isCorrect,
            xpEarned: xp
        )
        answers.append(answer)

        if !isCorrect {
            currentHearts -= 1
            if currentHearts <= 0 {
                onOutOfHearts()
                return
            }
        }

        // Auto-advance after 1.5s
        waitingToAdvance = true
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
            advanceToNext()
        }
    }

    private func advanceToNext() {
        waitingToAdvance = false
        if currentIndex + 1 >= questions.count {
            onComplete(answers)
        } else {
            currentIndex += 1
            if timedMode {
                secondsRemaining = 30
                startTimer()
            }
        }
    }

    private func startTimer() {
        secondsRemaining = 30
        timer?.invalidate()
        timer = Timer.scheduledTimer(withTimeInterval: 1, repeats: true) { _ in
            if secondsRemaining > 0 {
                secondsRemaining -= 1
            } else {
                timer?.invalidate()
                // Time ran out — treat as incorrect
                if let question = currentQuestion {
                    handleAnswer(question: question, userAnswer: "", isCorrect: false)
                }
            }
        }
    }
}

#Preview {
    ActiveRoundView(
        config: RoundConfig(topic: .accounting, questionCount: 5),
        questions: [],
        timedMode: false,
        hearts: 5,
        onComplete: { _ in },
        onOutOfHearts: {}
    )
}
