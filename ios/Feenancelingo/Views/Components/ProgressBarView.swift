import SwiftUI

struct ProgressBarView: View {
    let value: Double
    let max: Double
    var barColor: Color = .gold
    var trackColor: Color = .navyMid
    var height: CGFloat = 2

    private var fraction: Double {
        guard max > 0 else { return 0 }
        return min(value / max, 1.0)
    }

    var body: some View {
        GeometryReader { geo in
            ZStack(alignment: .leading) {
                Rectangle()
                    .fill(trackColor)
                    .frame(height: height)

                Rectangle()
                    .fill(barColor)
                    .frame(width: geo.size.width * fraction, height: height)
                    .animation(.easeInOut(duration: 0.4), value: fraction)
            }
        }
        .frame(height: height)
    }
}

#Preview {
    VStack(spacing: 20) {
        ProgressBarView(value: 60, max: 100)
        ProgressBarView(value: 30, max: 100, barColor: .correct, height: 4)
    }
    .padding()
    .background(Color.navy)
}
