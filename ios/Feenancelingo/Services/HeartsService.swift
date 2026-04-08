import Foundation

@MainActor
class HeartsService: ObservableObject {
    // MARK: - Storage Key (matches web localStorage key)
    private static let storageKey = "feenancelingo_hearts"

    // MARK: - Published State
    @Published var hearts: Int = HeartsState.maxHearts
    @Published var nextRegenTime: TimeInterval? = nil

    // MARK: - Backing state
    private var heartsState: HeartsState

    // MARK: - Computed
    var maxHearts: Int { HeartsState.maxHearts }
    var isAlive: Bool { hearts > 0 }

    // MARK: - Init
    init() {
        if let data = UserDefaults.standard.data(forKey: Self.storageKey),
           let saved = try? JSONDecoder().decode(HeartsState.self, from: data) {
            heartsState = saved
        } else {
            heartsState = HeartsState()
        }
        hearts = heartsState.current
        updateNextRegenTime()
    }

    // MARK: - Lose Heart
    func loseHeart() {
        guard heartsState.current > 0 else { return }

        let now = Date()
        let regenTime = now.addingTimeInterval(HeartsState.regenInterval)

        heartsState.current -= 1
        heartsState.lastLostAt = now
        heartsState.regenTimestamps.append(regenTime)

        hearts = heartsState.current
        save()
        updateNextRegenTime()
    }

    // MARK: - Regenerate Hearts
    /// Check timestamps, restore hearts that have regenerated.
    func regenerateHearts() {
        guard heartsState.current < HeartsState.maxHearts else { return }

        let now = Date()
        var stillPending: [Date] = []
        var restored = 0

        for ts in heartsState.regenTimestamps {
            if ts <= now {
                restored += 1
            } else {
                stillPending.append(ts)
            }
        }

        guard restored > 0 else { return }

        let newCurrent = min(heartsState.current + restored, HeartsState.maxHearts)
        heartsState.current = newCurrent

        if newCurrent >= HeartsState.maxHearts {
            heartsState.lastLostAt = nil
            heartsState.regenTimestamps = []
        } else {
            heartsState.regenTimestamps = stillPending
        }

        hearts = heartsState.current
        save()
        updateNextRegenTime()
    }

    // MARK: - Reset
    func resetHearts() {
        heartsState = HeartsState()
        hearts = heartsState.current
        UserDefaults.standard.removeObject(forKey: Self.storageKey)
        updateNextRegenTime()
    }

    // MARK: - Private
    private func save() {
        if let data = try? JSONEncoder().encode(heartsState) {
            UserDefaults.standard.set(data, forKey: Self.storageKey)
        }
    }

    private func updateNextRegenTime() {
        guard heartsState.current < HeartsState.maxHearts,
              !heartsState.regenTimestamps.isEmpty else {
            nextRegenTime = nil
            return
        }

        let now = Date()
        let futureTimes = heartsState.regenTimestamps
            .filter { $0 > now }
            .map { $0.timeIntervalSince(now) }

        nextRegenTime = futureTimes.min()
    }
}
