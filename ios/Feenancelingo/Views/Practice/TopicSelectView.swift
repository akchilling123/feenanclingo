import SwiftUI

struct TopicSelectView: View {
    let onSelect: (Topic) -> Void

    // Placeholder data — will come from services
    private func questionCount(for topic: Topic) -> Int {
        QuestionService.shared.questions(for: topic).count
    }

    private func accuracy(for topic: Topic) -> Int? {
        // Placeholder — no progress service yet
        nil
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            Text("Select Topic")
                .font(.serif(28, weight: .semibold))
                .foregroundColor(.cream)
                .padding(.bottom, 24)

            ForEach(Topic.allCases, id: \.self) { topic in
                Button {
                    onSelect(topic)
                } label: {
                    HStack {
                        Text(topic.displayName)
                            .font(.sans(15, weight: .medium))
                            .foregroundColor(.cream)

                        Spacer()

                        HStack(spacing: 12) {
                            let count = questionCount(for: topic)
                            Text("\(count) questions")
                                .font(.sans(13))
                                .foregroundColor(.creamDark)

                            if let acc = accuracy(for: topic) {
                                Text("\(acc)%")
                                    .font(.sans(13, weight: .medium))
                                    .foregroundColor(.gold)
                            }
                        }
                    }
                    .padding(.vertical, 16)
                }

                Rectangle().fill(Color.gold.opacity(0.15)).frame(height: 1)
            }
        }
    }
}

#Preview {
    ScrollView {
        TopicSelectView(onSelect: { _ in })
            .padding(.horizontal, 24)
    }
    .background(Color.navy)
}
