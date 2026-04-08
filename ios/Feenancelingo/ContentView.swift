import SwiftUI

struct ContentView: View {
    var body: some View {
        TabView {
            Text("Home")
                .tabItem { Text("HOME") }
            Text("Practice")
                .tabItem { Text("PRACTICE") }
            Text("Review")
                .tabItem { Text("REVIEW") }
            Text("Progress")
                .tabItem { Text("PROGRESS") }
        }
        .tint(Color.gold)
    }
}

#Preview {
    ContentView()
}
