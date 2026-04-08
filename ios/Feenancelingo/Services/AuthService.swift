import Foundation
import Supabase
import Auth

@MainActor
class AuthService: ObservableObject {
    static let shared = AuthService()

    let client = SupabaseClient(
        supabaseURL: URL(string: "https://ypzbwfpaelaubmouqucx.supabase.co")!,
        supabaseKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwemJ3ZnBhZWxhdWJtb3VxdWN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1NDEwNTYsImV4cCI6MjA4OTExNzA1Nn0.tuJKqM5f4ZqJDv3pbu9zOBuTFlsJeITmusUwoF4Nxqw"
    )

    @Published var isAuthenticated = false
    @Published var userId: String? = nil
    @Published var isLoading = true
    @Published var errorMessage: String? = nil

    private init() {}

    // MARK: - Initialize (check for existing session)
    func initialize() async {
        isLoading = true
        do {
            let session = try await client.auth.session
            isAuthenticated = true
            userId = session.user.id.uuidString
        } catch {
            isAuthenticated = false
            userId = nil
        }
        isLoading = false
    }

    // MARK: - Sign Up
    func signUp(email: String, password: String) async throws {
        errorMessage = nil
        let response = try await client.auth.signUp(
            email: email,
            password: password
        )
        if let session = response.session {
            isAuthenticated = true
            userId = session.user.id.uuidString
        }
    }

    // MARK: - Sign In
    func signIn(email: String, password: String) async throws {
        errorMessage = nil
        let session = try await client.auth.signIn(
            email: email,
            password: password
        )
        isAuthenticated = true
        userId = session.user.id.uuidString
    }

    // MARK: - Sign Out
    func signOut() async throws {
        try await client.auth.signOut()
        isAuthenticated = false
        userId = nil
    }
}
