interface TimerProps {
  seconds: number
  onTimeUp: () => void
  isRunning: boolean
  size?: 'sm' | 'lg'
  percentRemaining: number
}

export function Timer({ seconds, onTimeUp: _onTimeUp, isRunning: _isRunning, size = 'sm', percentRemaining }: TimerProps) {
  const dimensions = size === 'sm' ? 40 : 64
  const viewBox = 40
  const center = 20
  const radius = 17
  const circumference = 2 * Math.PI * radius
  const strokeDash = percentRemaining * circumference

  // Color transitions: gold > 50%, blend to red in last 25%
  const ringColor =
    percentRemaining > 0.5
      ? 'var(--color-gold)'
      : percentRemaining > 0.25
        ? 'var(--color-gold)'
        : 'var(--color-incorrect)'

  const textColor =
    percentRemaining > 0.25 ? 'text-cream' : 'text-incorrect'

  return (
    <div
      className="relative flex-shrink-0"
      style={{ width: dimensions, height: dimensions }}
    >
      <svg
        className="w-full h-full -rotate-90"
        viewBox={`0 0 ${viewBox} ${viewBox}`}
      >
        {/* Background ring */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-navy-mid"
        />
        {/* Countdown ring */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={ringColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={`${strokeDash} ${circumference}`}
          style={{ transition: 'stroke-dasharray 0.8s ease-out, stroke 0.5s ease' }}
        />
      </svg>
      {/* Center number */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className={`${textColor} tabular-nums font-medium ${
            size === 'sm' ? 'text-xs' : 'text-base'
          }`}
        >
          {seconds}
        </span>
      </div>
    </div>
  )
}
