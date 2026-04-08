import SwiftUI

struct HeartsDisplayView: View {
    let hearts: Int
    let maxHearts: Int

    init(hearts: Int, maxHearts: Int = HeartsState.maxHearts) {
        self.hearts = hearts
        self.maxHearts = maxHearts
    }

    var body: some View {
        HStack(spacing: 6) {
            ForEach(0..<maxHearts, id: \.self) { index in
                Text(index < hearts ? "\u{25C6}" : "\u{25C7}")
                    .font(.sans(14))
                    .foregroundColor(index < hearts ? Color.gold : Color.creamDark.opacity(0.4))
            }
        }
    }
}

#Preview {
    HeartsDisplayView(hearts: 3)
        .padding()
        .background(Color.navy)
}
