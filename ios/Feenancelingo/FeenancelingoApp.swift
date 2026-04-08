import SwiftUI

@main
struct FeenancelingoApp: App {
    @StateObject private var authService = AuthService.shared
    @StateObject private var syncService = SyncService.shared

    var body: some Scene {
        WindowGroup {
            Group {
                if authService.isLoading {
                    ZStack {
                        Color.navy.ignoresSafeArea()
                        ProgressView()
                            .tint(.gold)
                    }
                } else if authService.isAuthenticated {
                    ContentView()
                        .environmentObject(authService)
                        .environmentObject(syncService)
                } else {
                    AuthView()
                        .environmentObject(authService)
                }
            }
            .preferredColorScheme(.dark)
            .task {
                await authService.initialize()
            }
        }
    }
}
