import SwiftUI

struct TimerView: View {
    let secondsRemaining: Int
    let totalSeconds: Int

    private var fraction: Double {
        guard totalSeconds > 0 else { return 0 }
        return Double(secondsRemaining) / Double(totalSeconds)
    }

    private var ringColor: Color {
        if fraction <= 0.25 {
            return .incorrect
        }
        return .gold
    }

    var body: some View {
        ZStack {
            Circle()
                .stroke(Color.navyMid, lineWidth: 3)

            Circle()
                .trim(from: 0, to: fraction)
                .stroke(ringColor, style: StrokeStyle(lineWidth: 3, lineCap: .round))
                .rotationEffect(.degrees(-90))
                .animation(.linear(duration: 1), value: fraction)

            Text("\(secondsRemaining)")
                .font(.sans(14, weight: .medium))
                .foregroundColor(ringColor)
        }
        .frame(width: 44, height: 44)
    }
}

#Preview {
    HStack(spacing: 20) {
        TimerView(secondsRemaining: 25, totalSeconds: 30)
        TimerView(secondsRemaining: 7, totalSeconds: 30)
    }
    .padding()
    .background(Color.navy)
}
