import Foundation

struct XPCalculator {
    static func calculate(difficulty: Difficulty, isCorrect: Bool) -> Int {
        isCorrect ? difficulty.xpValue : 0
    }
}
