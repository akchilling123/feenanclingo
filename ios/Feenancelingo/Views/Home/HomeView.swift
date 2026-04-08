import SwiftUI

struct HomeView: View {
    // Local state — will be replaced by services later
    @State private var totalXP: Int = 145
    @State private var currentLevel: Level = .analystII
    @State private var streak: Int = 3
    @State private var hearts: Int = 4
    @State private var hasDailyChallenge: Bool = true
    @State private var dailyChallengeCompleted: Bool = false

    private var xpInLevel: Int {
        totalXP - currentLevel.xpThreshold
    }

    private var xpForNextLevel: Int {
        let allLevels = Level.allCases
        guard let idx = allLevels.firstIndex(of: currentLevel),
              idx + 1 < allLevels.count else { return 1 }
        return allLevels[idx + 1].xpThreshold - currentLevel.xpThreshold
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 0) {
                    // Title
                    Text("Feenancelingo")
                        .font(.serif(28, weight: .semibold))
                        .foregroundColor(.cream)
                        .padding(.bottom, 4)

                    // Level
                    Text(currentLevel.rawValue)
                        .font(.serif(20))
                        .foregroundColor(.gold)
                        .padding(.bottom, 12)

                    // XP progress bar
                    VStack(alignment: .leading, spacing: 6) {
                        ProgressBarView(value: Double(xpInLevel), max: Double(xpForNextLevel))
                        Text("\(xpInLevel) / \(xpForNextLevel) XP")
                            .font(.sans(12))
                            .foregroundColor(.creamDark)
                    }
                    .padding(.bottom, 24)

                    // Streak
                    HStack(spacing: 12) {
                        Rectangle()
                            .fill(Color.gold)
                            .frame(width: 3)

                        VStack(alignment: .leading, spacing: 2) {
                            Text("\(streak)-day streak")
                                .font(.sans(15, weight: .medium))
                                .foregroundColor(.cream)
                            Text("Keep it going")
                                .font(.sans(13))
                                .foregroundColor(.creamDark)
                        }
                    }
                    .frame(height: 48)
                    .padding(.bottom, 16)

                    // Hearts
                    HStack(spacing: 8) {
                        HeartsDisplayView(hearts: hearts)
                        Spacer()
                        Text("\(hearts) remaining")
                            .font(.sans(13))
                            .foregroundColor(.creamDark)
                    }
                    .padding(.bottom, 24)

                    // Divider
                    Rectangle().fill(Color.gold.opacity(0.15)).frame(height: 1)
                        .padding(.bottom, 24)

                    // Daily challenge card
                    if hasDailyChallenge && !dailyChallengeCompleted {
                        HStack(spacing: 0) {
                            Rectangle()
                                .fill(Color.gold)
                                .frame(width: 3)

                            VStack(alignment: .leading, spacing: 4) {
                                Text("Daily Challenge")
                                    .font(.serif(18, weight: .medium))
                                    .foregroundColor(.cream)
                                Text("5 questions, 2x XP")
                                    .font(.sans(13))
                                    .foregroundColor(.creamDark)
                            }
                            .padding(.leading, 16)
                            .padding(.vertical, 12)

                            Spacer()
                        }
                        .background(Color.navyLight)
                        .padding(.bottom, 24)
                    }

                    // Begin Practice button
                    NavigationLink(destination: PracticeView()) {
                        Text("Begin Practice")
                            .font(.sans(15, weight: .medium))
                            .foregroundColor(.navy)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 14)
                            .background(Color.gold)
                    }
                    .padding(.bottom, 16)

                    // Secondary links
                    VStack(alignment: .leading, spacing: 12) {
                        NavigationLink(destination: ReviewView()) {
                            Text("Review Queue")
                                .font(.sans(14))
                                .foregroundColor(.goldLight)
                        }
                        NavigationLink(destination: ProgressDashboardView()) {
                            Text("View Progress")
                                .font(.sans(14))
                                .foregroundColor(.goldLight)
                        }
                    }
                }
                .padding(.horizontal, 24)
                .padding(.top, 32)
            }
            .background(Color.navy)
        }
    }
}

#Preview {
    HomeView()
}
