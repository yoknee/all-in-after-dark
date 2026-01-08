import { useGradeCounts } from '../hooks/useGradeCounts'

export function GradeRanking() {
  const { gradeCounts, loading } = useGradeCounts()

  if (loading) {
    return (
      <div className="text-gold opacity-70 animate-pulse">
        Loading rankings...
      </div>
    )
  }

  // Sort grades by count (descending) and take top 3
  const sortedGrades = [...gradeCounts]
    .sort((a, b) => b.count - a.count)
    .filter((gc) => gc.count > 0)
    .slice(0, 3)

  if (sortedGrades.length === 0) {
    return (
      <div className="text-gold opacity-70 text-center">
        No registrations yet. Be the first!
      </div>
    )
  }

  const rankLabels = ['1st', '2nd', '3rd']

  return (
    <div className="space-y-4">
      {sortedGrades.map((gc, index) => (
        <div
          key={gc.grade}
          className="bg-dark-brown-2 border-2 border-gold rounded p-4 text-center hover:border-opacity-80 transition-all duration-300"
        >
          <div className="flex items-center justify-center gap-3">
            <div className="text-gold font-bold text-lg tracking-wider">
              {rankLabels[index]}
            </div>
            <div className="text-2xl font-bold text-gold font-playfair">
              {gc.grade}
            </div>
            <div className="text-sm text-cream">
              {gc.count} {gc.count === 1 ? 'signup' : 'signups'}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
