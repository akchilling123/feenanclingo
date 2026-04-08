import Foundation

struct LevelCalculator {
    static func level(for xp: Int) -> Level {
        Level.forXP(xp)
    }

    static func xpForNextLevel(_ xp: Int) -> (current: Int, required: Int, progress: Double) {
        let currentLevel = Level.forXP(xp)
        let currentThreshold = currentLevel.xpThreshold

        guard let nextLevel = Level.allCases.first(where: { $0.xpThreshold > currentThreshold }) else {
            return (xp, xp, 1.0) // Max level
        }

        let progressInLevel = xp - currentThreshold
        let requiredForLevel = nextLevel.xpThreshold - currentThreshold
        return (progressInLevel, requiredForLevel, Double(progressInLevel) / Double(requiredForLevel))
    }
}
