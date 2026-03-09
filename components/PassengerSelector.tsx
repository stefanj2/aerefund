'use client'

import { formatAmount } from '@/lib/compensation'

interface PassengerSelectorProps {
  value: number
  onChange: (n: number) => void
  amountPerPerson: number
}

export default function PassengerSelector({ value, onChange, amountPerPerson }: PassengerSelectorProps) {
  const options = [1, 2, 3, 4, 5]

  return (
    <div>
      <p className="font-semibold text-sm mb-0.5" style={{ fontFamily: 'var(--font-sora)' }}>
        Hoeveel passagiers reisden mee?
      </p>
      <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
        Elke passagier heeft recht op {formatAmount(amountPerPerson)}.
      </p>

      <div className="flex gap-2">
        {[...options, 6].map((n) => {
          const active = n === 6 ? value >= 6 : value === n
          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              style={{
                flex: 1,
                height: '42px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.875rem',
                border: `1.5px solid ${active ? 'var(--blue)' : 'var(--border)'}`,
                background: active ? 'var(--blue)' : 'var(--surface)',
                color: active ? '#fff' : 'var(--text-sub)',
                cursor: 'pointer',
                transition: 'all 0.15s',
                boxShadow: active ? '0 2px 12px var(--blue-glow)' : 'none',
              }}
            >
              {n === 6 ? '6+' : n}
            </button>
          )
        })}
      </div>

      {value > 1 && (
        <div
          className="mt-4 p-3 rounded-xl"
          style={{ background: 'var(--blue-light)', border: '1px solid var(--blue-border)' }}
        >
          <p className="text-sm font-semibold" style={{ color: 'var(--blue)' }}>
            {value} passagiers × {formatAmount(amountPerPerson)} ={' '}
            <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>
              {formatAmount(value * amountPerPerson)}
            </span>{' '}
            totaal
          </p>
        </div>
      )}
    </div>
  )
}
