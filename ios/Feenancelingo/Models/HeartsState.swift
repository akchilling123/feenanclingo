import Foundation

struct HeartsState: Codable {
    var current: Int = 5
    var lastLostAt: Date? = nil
    var regenTimestamps: [Date] = []

    static let maxHearts = 5
    static let regenInterval: TimeInterval = 4 * 60 * 60 // 4 hours
}
