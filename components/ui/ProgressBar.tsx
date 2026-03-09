'use client'

interface ProgressBarProps {
  current: number
  total: number
  labels?: string[]
}

export default function ProgressBar({ current, total, labels }: ProgressBarProps) {
  const percentage = (current / total) * 100

  return (
    <div className="w-full">
      <div className="flex justify-between mb-2">
        {labels ? (
          labels.map((label, i) => (
            <span
              key={i}
              className={`text-xs font-medium transition-colors ${
                i + 1 <= current ? 'text-[var(--orange)]' : 'text-[var(--gray-400)]'
              }`}
            >
              {label}
            </span>
          ))
        ) : (
          <span className="text-xs text-[var(--gray-400)]">
            Stap {current} van {total}
          </span>
        )}
      </div>
      <div className="h-1 bg-[var(--navy-border)] rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--orange)] rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
