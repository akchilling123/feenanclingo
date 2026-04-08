import { useState, type FormEvent } from 'react'
import { useAuth } from '../hooks/useAuth'

type AuthMode = 'signin' | 'signup'

export default function Auth() {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState<AuthMode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [signUpSuccess, setSignUpSuccess] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      if (mode === 'signup') {
        await signUp(email, password)
        setSignUpSuccess(true)
      } else {
        await signIn(email, password)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  if (signUpSuccess) {
    return (
      <div className="min-h-svh bg-navy px-6 pt-12">
        <div className="max-w-sm mx-auto">
          <h1 className="font-serif text-3xl text-cream">Feenancelingo</h1>
          <p className="text-cream-dark/60 text-sm mt-2">Check your email to confirm your account.</p>
          <button
            type="button"
            onClick={() => {
              setSignUpSuccess(false)
              setMode('signin')
            }}
            className="mt-6 text-gold text-sm hover:text-gold-light transition-colors"
          >
            Back to sign in
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-svh bg-navy px-6 pt-12">
      <div className="max-w-sm mx-auto">
        {/* Brand */}
        <h1 className="font-serif text-3xl text-cream">Feenancelingo</h1>
        <p className="text-cream-dark/60 text-sm mt-2">
          Master investment banking, one question at a time.
        </p>

        <div className="divider mt-6 mb-8" />

        {/* Tab toggle */}
        <div className="flex gap-6 mb-8">
          <button
            type="button"
            onClick={() => { setMode('signin'); setError(null) }}
            className={`text-sm pb-1 transition-colors ${
              mode === 'signin'
                ? 'text-cream border-b-2 border-gold'
                : 'text-cream-dark/50 hover:text-cream-dark'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setError(null) }}
            className={`text-sm pb-1 transition-colors ${
              mode === 'signup'
                ? 'text-cream border-b-2 border-gold'
                : 'text-cream-dark/50 hover:text-cream-dark'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full bg-transparent border-b border-gold/30 focus:border-gold text-cream py-3 text-sm outline-none placeholder:text-cream-dark/30 transition-colors"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              minLength={6}
              className="w-full bg-transparent border-b border-gold/30 focus:border-gold text-cream py-3 text-sm outline-none placeholder:text-cream-dark/30 transition-colors"
            />
          </div>

          {error && (
            <p className="text-incorrect text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gold text-navy py-3 rounded-lg font-semibold text-sm hover:bg-gold-light transition-colors disabled:opacity-50"
          >
            {submitting
              ? '...'
              : mode === 'signin'
                ? 'Sign In'
                : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  )
}
