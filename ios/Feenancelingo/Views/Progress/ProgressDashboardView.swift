import SwiftUI

struct ProgressDashboardView: View {
    // Local state — will be replaced by services later
    @State private var totalXP: Int = 145
    @State private var streak: Int = 3
    @State private var totalQuestions: Int = 47
    @State private var totalCorrect: Int = 38
    @State private var showResetConfirm = false

    private var level: Level { Level.forXP(totalXP) }

    private var xpInLevel: Int {
        totalXP - level.xpThreshold
    }

    private var xpForNextLevel: Int {
        let allLevels = Level.allCases
        guard let idx = allLevels.firstIndex(of: level),
              idx + 1 < allLevels.count else { return 1 }
        return allLevels[idx + 1].xpThreshold - level.xpThreshold
    }

    private var overallAccuracy: Int {
        guard totalQuestions > 0 else { return 0 }
        return Int(Double(totalCorrect) / Double(totalQuestions) * 100)
    }

    // Placeholder topic data
    private var topicData: [(topic: Topic, attempted: Int, correct: Int)] {
        Topic.allCases.map { topic in
            (topic: topic, attempted: 8, correct: 6)
        }
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 0) {
                    // Title
                    Text("Progress")
                        .font(.serif(28, weight: .semibold))
                        .foregroundColor(.cream)
                        .padding(.bottom, 24)

                    // Level + XP
                    Text(level.rawValue)
                        .font(.serif(20))
                        .foregroundColor(.gold)
                        .padding(.bottom, 8)

                    ProgressBarView(value: Double(xpInLevel), max: Double(xpForNextLevel), height: 3)
                        .padding(.bottom, 6)

                    Text("\(xpInLevel) / \(xpForNextLevel) XP to next level")
                        .font(.sans(12))
                        .foregroundColor(.creamDark)
                        .padding(.bottom, 24)

                    // Streak
                    HStack(spacing: 12) {
                        Rectangle().fill(Color.gold).frame(width: 3, height: 36)

                        VStack(alignment: .leading, spacing: 2) {
                            Text("\(streak)-day streak")
                                .font(.sans(15, weight: .medium))
                                .foregroundColor(.cream)
                        }
                    }
                    .padding(.bottom, 24)

                    Rectangle().fill(Color.gold.opacity(0.15)).frame(height: 1)
                        .padding(.bottom, 24)

                    // Summary stats
                    Text("Summary")
                        .font(.serif(20))
                        .foregroundColor(.cream)
                        .padding(.bottom, 16)

                    HStack(spacing: 32) {
                        statColumn(value: "\(totalXP)", label: "Total XP")
                        statColumn(value: "\(totalQuestions)", label: "Questions")
                        statColumn(value: "\(overallAccuracy)%", label: "Accuracy")
                    }
                    .padding(.bottom, 24)

                    Rectangle().fill(Color.gold.opacity(0.15)).frame(height: 1)
                        .padding(.bottom, 24)

                    // Topic mastery
                    Text("Topic Mastery")
                        .font(.serif(20))
                        .foregroundColor(.cream)
                        .padding(.bottom, 16)

                    ForEach(topicData, id: \.topic) { item in
                        VStack(alignment: .leading, spacing: 8) {
                            HStack {
                                Text(item.topic.displayName)
                                    .font(.sans(15))
                                    .foregroundColor(.cream)

                                Spacer()

                                if item.attempted > 0 {
                                    let acc = Int(Double(item.correct) / Double(item.attempted) * 100)
                                    Text("\(acc)%")
                                        .font(.sans(13, weight: .medium))
                                        .foregroundColor(.gold)
                                } else {
                                    Text("--")
                                        .font(.sans(13))
                                        .foregroundColor(.creamDark)
                                }
                            }

                            if item.attempted > 0 {
                                ProgressBarView(
                                    value: Double(item.correct),
                                    max: Double(item.attempted),
                                    height: 2
                                )
                            }
                        }
                        .padding(.bottom, 16)

                        Rectangle().fill(Color.gold.opacity(0.15)).frame(height: 1)
                            .padding(.bottom, 16)
                    }

                    // Reset button
                    Spacer().frame(height: 24)

                    Button {
                        showResetConfirm = true
                    } label: {
                        Text("Reset Progress")
                            .font(.sans(13))
                            .foregroundColor(.creamDark.opacity(0.6))
                    }
                    .alert("Reset Progress", isPresented: $showResetConfirm) {
                        Button("Cancel", role: .cancel) {}
                        Button("Reset", role: .destructive) {
                            totalXP = 0
                            streak = 0
                            totalQuestions = 0
                            totalCorrect = 0
                        }
                    } message: {
                        Text("This will erase all progress. This cannot be undone.")
                    }

                    Spacer().frame(height: 32)
                }
                .padding(.horizontal, 24)
                .padding(.top, 32)
            }
            .background(Color.navy)
        }
    }

    @ViewBuilder
    private func statColumn(value: String, label: String) -> some View {
        VStack(spacing: 4) {
            Text(value)
                .font(.serif(20, weight: .semibold))
                .foregroundColor(.gold)
            Text(label)
                .font(.sans(12))
                .foregroundColor(.creamDark)
        }
    }
}

#Preview {
    ProgressDashboardView()
}
