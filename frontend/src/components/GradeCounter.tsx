import { useGradeCounts } from '../hooks/useGradeCounts'
import { First10Badge } from './First10Badge'

interface GradeCounterProps {
  selectedGrade?: string
}

export function GradeCounter({ selectedGrade }: GradeCounterProps) {
  const { gradeCounts, loading } = useGradeCounts()

  if (loading) {
    return (
      <div className="text-gold opacity-70 animate-pulse">
        Loading availability...
      </div>
    )
  }

  const selectedGradeCount = gradeCounts.find((gc) => gc.grade === selectedGrade)

  if (!selectedGrade) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">
        {gradeCounts.map((gc) => (
          <div
            key={gc.grade}
            className="bg-dark-brown-2 border-2 border-gold rounded p-4 text-center hover:border-opacity-80 transition-all duration-300"
          >
            <div className="text-2xl font-bold text-gold font-playfair">{gc.grade}</div>
            <div className="text-sm mt-2">
              {gc.spotsRemaining > 0 ? (
                <span className="text-cream">
                  {gc.spotsRemaining} spot{gc.spotsRemaining !== 1 ? 's' : ''} left
                </span>
              ) : (
                <span className="text-light-gold">Full (10/10)</span>
              )}
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!selectedGradeCount) return null

  return (
    <div className="mt-4 p-4 bg-[rgba(212,175,55,0.1)] border-2 border-gold rounded animate-fade-in">
      <div className="text-center">
        <div className="text-sm font-semibold text-gold mb-2 tracking-wider uppercase">
          {selectedGradeCount.grade} Grade Availability
        </div>
        {selectedGradeCount.spotsRemaining > 0 ? (
          <div className="text-xl font-bold text-gold font-playfair">
            {selectedGradeCount.spotsRemaining} spot{selectedGradeCount.spotsRemaining !== 1 ? 's' : ''} remaining
          </div>
        ) : (
          <div className="text-xl font-bold text-light-gold font-playfair">
            Full (10/10) - Still accepting registrations
          </div>
        )}
        {selectedGradeCount.count < 10 && (
          <div className="mt-2">
            <First10Badge />
          </div>
        )}
      </div>
    </div>
  )
}

