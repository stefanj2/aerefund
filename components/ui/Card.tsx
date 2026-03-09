import { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'highlight'
}

export default function Card({ variant = 'default', children, className = '', ...props }: CardProps) {
  const base = 'card'
  const highlight = variant === 'highlight' ? 'border-[var(--orange)] bg-[rgba(255,107,43,0.05)]' : ''
  return (
    <div className={`${base} ${highlight} ${className}`} {...props}>
      {children}
    </div>
  )
}
