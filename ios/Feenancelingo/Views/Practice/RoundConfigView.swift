import SwiftUI

struct RoundConfigView: View {
    let topic: Topic
    let onStart: (RoundConfig, Bool) -> Void

    @State private var questionCount: Int = 5
    @State private var timedMode: Bool = false

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            // Topic header
            Text(topic.displayName)
                .font(.serif(28, weight: .semibold))
                .foregroundColor(.cream)
                .padding(.bottom, 8)

            let stats = QuestionService.shared.topicStats(for: topic)
            Text("\(stats.total) questions available")
                .font(.sans(13))
                .foregroundColor(.creamDark)
                .padding(.bottom, 32)

            Rectangle().fill(Color.gold.opacity(0.15)).frame(height: 1)
                .padding(.bottom, 24)

            // Question count options
            Text("Questions")
                .font(.sans(13))
                .foregroundColor(.creamDark)
                .padding(.bottom, 12)

            HStack(spacing: 12) {
                countButton(count: 5)
                countButton(count: 10)
            }
            .padding(.bottom, 24)

            // Timed mode toggle
            HStack {
                Text("Timed Mode")
                    .font(.sans(15))
                    .foregroundColor(.cream)

                Spacer()

                Toggle("", isOn: $timedMode)
                    .labelsHidden()
                    .tint(.gold)
            }
            .padding(.bottom, 12)

            if timedMode {
                Text("30 seconds per question")
                    .font(.sans(13))
                    .foregroundColor(.creamDark)
            }

            Spacer().frame(height: 32)

            // Difficulty breakdown
            Rectangle().fill(Color.gold.opacity(0.15)).frame(height: 1)
                .padding(.bottom, 16)

            let byDiff = stats.byDifficulty
            HStack(spacing: 24) {
                diffStat(label: "Easy", count: byDiff[.easy] ?? 0, color: .correct)
                diffStat(label: "Medium", count: byDiff[.medium] ?? 0, color: .gold)
                diffStat(label: "Hard", count: byDiff[.hard] ?? 0, color: .incorrect)
            }
            .padding(.bottom, 32)

            // Start button
            Button {
                let config = RoundConfig(topic: topic, questionCount: questionCount)
                onStart(config, timedMode)
            } label: {
                Text("Start Round")
                    .font(.sans(15, weight: .medium))
                    .foregroundColor(.navy)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 14)
                    .background(Color.gold)
            }
        }
    }

    @ViewBuilder
    private func countButton(count: Int) -> some View {
        Button {
            questionCount = count
        } label: {
            Text("\(count)")
                .font(.sans(15, weight: .medium))
                .foregroundColor(questionCount == count ? .navy : .cream)
                .frame(width: 56, height: 44)
                .background(questionCount == count ? Color.gold : Color.navyLight)
        }
    }

    @ViewBuilder
    private func diffStat(label: String, count: Int, color: Color) -> some View {
        VStack(spacing: 4) {
            Text("\(count)")
                .font(.sans(15, weight: .medium))
                .foregroundColor(color)
            Text(label)
                .font(.sans(12))
                .foregroundColor(.creamDark)
        }
    }
}

#Preview {
    ScrollView {
        RoundConfigView(topic: .accounting, onStart: { _, _ in })
            .padding(.horizontal, 24)
            .padding(.top, 32)
    }
    .background(Color.navy)
}
