interface ProgressBarProps {
  value: number
  max: number
  color?: string
  height?: string
  showLabel?: boolean
}

export default function ProgressBar({
  value,
  max,
  color = 'bg-interactive',
  height = 'h-1',
  showLabel = false,
}: ProgressBarProps) {
  const clamped = Math.min(Math.max(value, 0), max)
  const percent = max > 0 ? (clamped / max) * 100 : 0

  return (
    <div className="w-full">
      <div className={`w-full ${height} bg-navy-mid rounded-full overflow-hidden`}>
        <div
          className={`${height} ${color} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percent}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-cream-dark/60 mt-1">
          {clamped} / {max} ({Math.round(percent)}%)
        </p>
      )}
    </div>
  )
}
