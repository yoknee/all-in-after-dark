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
    <div className="relative space-y-5 py-2">
      {/* Sparkle background effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        {/* Small sparkles */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-gold rounded-full animate-pulse"
            style={{
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.3,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${Math.random() * 2 + 1.5}s`
            }}
          ></div>
        ))}
        {/* Larger confetti-like shapes */}
        {[...Array(4)].map((_, i) => (
          <div
            key={`confetti-${i}`}
            className="absolute bg-gold opacity-20"
            style={{
              width: `${Math.random() * 8 + 4}px`,
              height: `${Math.random() * 8 + 4}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 360}deg)`,
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
            }}
          ></div>
        ))}
      </div>

      {sortedGrades.map((gc, index) => (
        <div
          key={gc.grade}
          className="relative bg-dark-brown-2 border-2 border-gold rounded-lg p-5 flex items-center gap-5 hover:border-opacity-90 transition-all duration-300"
          style={{
            background: 'linear-gradient(135deg, rgba(45, 24, 16, 0.95) 0%, rgba(13, 8, 5, 0.98) 100%)',
            boxShadow: '0 4px 15px rgba(212, 175, 55, 0.2), inset 0 1px 0 rgba(212, 175, 55, 0.1)',
            zIndex: 1
          }}
        >
          {/* Medal Badge */}
          <div className="relative flex-shrink-0">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center font-playfair font-bold text-gold text-xl relative"
              style={{
                background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3) 0%, rgba(212, 175, 55, 0.9) 30%, rgba(184, 134, 11, 0.95) 100%)',
                boxShadow: `
                  0 4px 15px rgba(212, 175, 55, 0.4),
                  inset 0 2px 5px rgba(255, 255, 255, 0.3),
                  inset 0 -2px 5px rgba(0, 0, 0, 0.3)
                `,
                border: '2px solid rgba(212, 175, 55, 0.8)'
              }}
            >
              {rankLabels[index]}
              {/* Ribbon at bottom */}
              <div
                className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-3"
                style={{
                  background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.9) 0%, rgba(184, 134, 11, 0.9) 100%)',
                  clipPath: 'polygon(0 0, 100% 0, 85% 100%, 15% 100%)',
                  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)'
                }}
              ></div>
            </div>
          </div>

          {/* Grade and Signup Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div className="text-2xl font-bold text-gold font-playfair">
                {gc.grade}
              </div>
              <div className="text-base text-cream font-baskerville">
                {gc.count} {gc.count === 1 ? 'signup' : 'signups'}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
