import FunnelNav from '@/components/FunnelNav'
import LoadingScreen from '@/components/LoadingScreen'

export default function LadenPage() {
  return (
    <main className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <FunnelNav step={2} />
      <LoadingScreen />
    </main>
  )
}
