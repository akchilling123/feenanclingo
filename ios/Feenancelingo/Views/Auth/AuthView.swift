import SwiftUI

struct AuthView: View {
    @EnvironmentObject var authService: AuthService

    @State private var isSignUp = false
    @State private var email = ""
    @State private var password = ""
    @State private var isSubmitting = false
    @State private var errorMessage: String? = nil

    var body: some View {
        ZStack {
            Color.navy.ignoresSafeArea()

            VStack(spacing: 32) {
                Spacer()

                // Logo / heading
                VStack(spacing: 8) {
                    Text("Feenancelingo")
                        .font(.serif(40, weight: .bold))
                        .foregroundColor(.cream)

                    Text("Master finance interviews")
                        .font(.sans(16))
                        .foregroundColor(.creamDark)
                }

                // Tab toggle
                HStack(spacing: 0) {
                    tabButton(title: "Sign In", selected: !isSignUp) {
                        withAnimation(.easeInOut(duration: 0.2)) { isSignUp = false }
                        errorMessage = nil
                    }
                    tabButton(title: "Sign Up", selected: isSignUp) {
                        withAnimation(.easeInOut(duration: 0.2)) { isSignUp = true }
                        errorMessage = nil
                    }
                }
                .padding(.horizontal, 40)

                // Form
                VStack(spacing: 20) {
                    // Email
                    VStack(alignment: .leading, spacing: 6) {
                        Text("Email")
                            .font(.sans(13, weight: .medium))
                            .foregroundColor(.creamDark)
                        TextField("", text: $email)
                            .textFieldStyle(.plain)
                            .font(.sans(16))
                            .foregroundColor(.cream)
                            .autocorrectionDisabled()
                            #if os(iOS)
                            .textInputAutocapitalization(.never)
                            .keyboardType(.emailAddress)
                            #endif
                            .padding(.vertical, 10)
                            .overlay(
                                Rectangle()
                                    .frame(height: 1)
                                    .foregroundColor(.navyMid),
                                alignment: .bottom
                            )
                    }

                    // Password
                    VStack(alignment: .leading, spacing: 6) {
                        Text("Password")
                            .font(.sans(13, weight: .medium))
                            .foregroundColor(.creamDark)
                        SecureField("", text: $password)
                            .textFieldStyle(.plain)
                            .font(.sans(16))
                            .foregroundColor(.cream)
                            .padding(.vertical, 10)
                            .overlay(
                                Rectangle()
                                    .frame(height: 1)
                                    .foregroundColor(.navyMid),
                                alignment: .bottom
                            )
                    }

                    // Error message
                    if let error = errorMessage {
                        Text(error)
                            .font(.sans(13))
                            .foregroundColor(.incorrect)
                            .multilineTextAlignment(.center)
                    }

                    // Submit button
                    Button {
                        submit()
                    } label: {
                        HStack {
                            if isSubmitting {
                                ProgressView()
                                    .tint(.navy)
                                    .scaleEffect(0.8)
                            }
                            Text(isSignUp ? "Create Account" : "Sign In")
                                .font(.sans(16, weight: .semibold))
                        }
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 14)
                        .background(Color.gold)
                        .foregroundColor(.navy)
                        .cornerRadius(8)
                    }
                    .disabled(isSubmitting || email.isEmpty || password.isEmpty)
                    .opacity(email.isEmpty || password.isEmpty ? 0.6 : 1.0)
                }
                .padding(.horizontal, 32)

                Spacer()
                Spacer()
            }
        }
    }

    // MARK: - Tab Button

    private func tabButton(title: String, selected: Bool, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            VStack(spacing: 6) {
                Text(title)
                    .font(.sans(15, weight: selected ? .semibold : .regular))
                    .foregroundColor(selected ? .cream : .creamDark)
                Rectangle()
                    .frame(height: 2)
                    .foregroundColor(selected ? .gold : .clear)
            }
        }
        .frame(maxWidth: .infinity)
    }

    // MARK: - Submit

    private func submit() {
        guard !email.isEmpty, !password.isEmpty else { return }
        isSubmitting = true
        errorMessage = nil

        Task {
            do {
                if isSignUp {
                    try await authService.signUp(email: email, password: password)
                } else {
                    try await authService.signIn(email: email, password: password)
                }
            } catch {
                errorMessage = error.localizedDescription
            }
            isSubmitting = false
        }
    }
}

#Preview {
    AuthView()
        .environmentObject(AuthService.shared)
}
