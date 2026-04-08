// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "Feenancelingo",
    platforms: [.iOS(.v17), .macOS(.v14)],
    dependencies: [
        .package(url: "https://github.com/supabase/supabase-swift.git", from: "2.0.0"),
    ],
    targets: [
        .executableTarget(
            name: "Feenancelingo",
            dependencies: [
                .product(name: "Supabase", package: "supabase-swift"),
            ],
            path: "Feenancelingo",
            resources: [
                .process("Resources"),
            ]
        ),
    ]
)
