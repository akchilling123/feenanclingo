import SwiftUI

struct ReviewView: View {
    @State private var reviewQuestions: [Question] = []
    @State private var currentIndex: Int = 0
    @State private var answers: [RoundAnswer] = []
    @State private var isComplete = false

    private var hasQueue: Bool {
        !reviewQuestions.isEmpty
    }

    var body: some View {
        NavigationStack {
            VStack(alignment: .leading, spacing: 0) {
                if isComplete {
                    completedView
                } else if hasQueue {
                    activeReviewView
                } else {
                    emptyState
                }
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .background(Color.navy)
        }
    }

    private var emptyState: some View {
        VStack(spacing: 0) {
            Spacer()

            Rectangle().fill(Color.gold.opacity(0.15)).frame(height: 1)
                .padding(.horizontal, 24)
                .padding(.bottom, 24)

            Text("Nothing to review.")
                .font(.serif(20))
                .italic()
                .foregroundColor(.creamDark)
                .frame(maxWidth: .infinity, alignment: .center)
                .padding(.bottom, 8)

            Text("Complete practice rounds to build your review queue.")
                .font(.sans(14))
                .foregroundColor(.creamDark.opacity(0.7))
                .multilineTextAlignment(.center)
                .padding(.horizontal, 48)

            Spacer().frame(height: 24)

            Rectangle().fill(Color.gold.opacity(0.15)).frame(height: 1)
                .padding(.horizontal, 24)

            Spacer()
        }
    }

    private var activeReviewView: some View {
        VStack(alignment: .leading, spacing: 0) {
            // Header
            Text("Review")
                .font(.serif(28, weight: .semibold))
                .foregroundColor(.cream)
                .padding(.horizontal, 24)
                .padding(.top, 32)
                .padding(.bottom, 8)

            Text("\(reviewQuestions.count) questions in queue")
                .font(.sans(13))
                .foregroundColor(.creamDark)
                .padding(.horizontal, 24)
                .padding(.bottom, 24)

            ProgressBarView(
                value: Double(currentIndex),
                max: Double(reviewQuestions.count),
                height: 3
            )
            .padding(.horizontal, 24)
            .padding(.bottom, 24)

            if currentIndex < reviewQuestions.count {
                ScrollView {
                    QuestionCardView(question: reviewQuestions[currentIndex]) { userAnswer, isCorrect in
                        let answer = RoundAnswer(
                            questionID: reviewQuestions[currentIndex].id,
                            userAnswer: userAnswer,
                            isCorrect: isCorrect,
                            xpEarned: isCorrect ? reviewQuestions[currentIndex].difficulty.xpValue : 0
                        )
                        answers.append(answer)

                        DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
                            if currentIndex + 1 >= reviewQuestions.count {
                                isComplete = true
                            } else {
                                currentIndex += 1
                            }
                        }
                    }
                    .id(reviewQuestions[currentIndex].id)
                    .padding(.horizontal, 24)
                }
            }

            Spacer()
        }
    }

    private var completedView: some View {
        VStack(spacing: 0) {
            Spacer()

            let correct = answers.filter(\.isCorrect).count
            let xp = answers.reduce(0) { $0 + $1.xpEarned }

            Text("Review Complete")
                .font(.serif(24, weight: .semibold))
                .foregroundColor(.cream)
                .padding(.bottom, 12)

            Text("\(correct)/\(answers.count) correct, +\(xp) XP")
                .font(.sans(15))
                .foregroundColor(.gold)
                .padding(.bottom, 32)

            Button {
                reviewQuestions = []
                answers = []
                currentIndex = 0
                isComplete = false
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
    ReviewView()
}
