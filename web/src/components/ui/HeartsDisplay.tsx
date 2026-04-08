interface HeartsDisplayProps {
  hearts: number
  maxHearts: number
  size?: 'sm' | 'lg'
}

export default function HeartsDisplay({
  hearts,
  maxHearts,
  size = 'sm',
}: HeartsDisplayProps) {
  if (size === 'sm') {
    return (
      <div className="flex items-center gap-1.5">
        <div className="w-[2px] h-3.5 bg-incorrect/60 rounded-full" />
        <span className="text-incorrect font-medium text-sm tabular-nums">
          {hearts}/{maxHearts}
        </span>
      </div>
    )
  }

  // Large: diamond row
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: maxHearts }, (_, i) => (
        <span
          key={i}
          className={`text-sm leading-none ${
            i < hearts ? 'text-incorrect' : 'text-cream-dark/30'
          }`}
        >
          {i < hearts ? '\u25C6' : '\u25C7'}
        </span>
      ))}
    </div>
  )
}
