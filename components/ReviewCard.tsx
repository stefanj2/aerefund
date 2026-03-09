import { Review } from '@/data/reviews'

export default function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="card">
      <div className="flex items-start gap-3">
        <div
          style={{
            width: '36px', height: '36px',
            borderRadius: '50%',
            background: 'var(--blue-light)',
            border: '1.5px solid var(--blue-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            fontWeight: 700, fontSize: '0.875rem',
            color: 'var(--blue)',
            fontFamily: 'var(--font-sora)',
          }}
        >
          {review.author[0]}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{review.author}</span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{review.location}</span>
            <span className="text-xs ml-auto" style={{ color: 'var(--text-muted)' }}>{review.date}</span>
          </div>

          <div className="flex gap-0.5 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg key={i} width="11" height="11" viewBox="0 0 12 12" fill={i < review.rating ? '#FBBF24' : '#e2e8f0'}>
                <path d="M6 1l1.39 2.82L10.5 4.24l-2.25 2.19.53 3.09L6 7.97 3.22 9.52l.53-3.09L1.5 4.24l3.11-.42L6 1z" />
              </svg>
            ))}
          </div>

          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-sub)' }}>
            &ldquo;{review.text}&rdquo;
          </p>

          <span className="badge-green">
            <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
              <path d="M2 5l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            €{review.amount} ontvangen
          </span>
        </div>
      </div>
    </div>
  )
}
