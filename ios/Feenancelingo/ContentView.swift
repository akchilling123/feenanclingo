import SwiftUI

struct ContentView: View {
    var body: some View {
        TabView {
            HomeView()
                .tabItem { Text("HOME") }
            PracticeView()
                .tabItem { Text("PRACTICE") }
            ReviewView()
                .tabItem { Text("REVIEW") }
            ProgressDashboardView()
                .tabItem { Text("PROGRESS") }
        }
        .tint(Color.gold)
    }
}
