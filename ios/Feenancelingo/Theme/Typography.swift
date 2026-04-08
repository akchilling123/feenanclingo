import SwiftUI

extension Font {
    static func serif(_ size: CGFloat, weight: Font.Weight = .medium) -> Font {
        .custom("Cormorant Garamond", size: size).weight(weight)
    }

    static func sans(_ size: CGFloat, weight: Font.Weight = .regular) -> Font {
        .custom("DM Sans", size: size).weight(weight)
    }
}
