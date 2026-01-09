import { usePodiumRankings } from '../hooks/usePodiumRankings'

export function GradeRanking() {
  const { podiumRankings, loading } = usePodiumRankings()

  if (loading) {
    return (
      <div className="text-gold opacity-70 animate-pulse text-center py-8">
        Loading rankings...
      </div>
    )
  }

  // Check if we have any rankings
  const hasRankings = podiumRankings.some((p) => p.grade !== null)

  if (!hasRankings) {
    return (
      <div className="text-gold opacity-70 text-center py-8">
        No registrations yet. Be the first!
      </div>
    )
  }

  // Podium array: [2nd (left), 1st (center), 3rd (right)]
  const podiumData = podiumRankings

  const podiumColors = [
    { // Silver for 2nd
      main: 'linear-gradient(135deg, #c0c0c0 0%, #a8a8a8 50%, #909090 100%)',
      border: '#a8a8a8',
      text: '#c0c0c0',
      darkText: '#1a1a1a'
    },
    { // Gold for 1st
      main: 'linear-gradient(135deg, #d4af37 0%, #b8860b 50%, #9a7209 100%)',
      border: '#b8860b',
      text: '#d4af37',
      darkText: '#1a1a1a'
    },
    { // Bronze for 3rd
      main: 'linear-gradient(135deg, #cd7f32 0%, #b87333 50%, #9d5f28 100%)',
      border: '#b87333',
      text: '#cd7f32',
      darkText: '#1a1a1a'
    }
  ]

  const podiumHeights = ['h-32', 'h-40', 'h-28'] // 2nd, 1st, 3rd
  const rankLabels = ['2nd', '1st', '3rd']

  // Find 1st place podium index (center position)
  const firstPlaceIndex = podiumData.findIndex((p) => p.position === 1 && p.grade !== null)

  return (
    <div className="relative w-full py-8" style={{ background: 'radial-gradient(circle at center, rgba(212, 175, 55, 0.05) 0%, transparent 70%)' }}>
      {/* Title */}
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gold uppercase tracking-wider mb-4 font-playfair">
          FASTEST TO 10 SIGNUPS
        </h2>
        
        {/* Decorative Art Deco Line */}
        <div className="flex items-center justify-center gap-1 mb-6">
          <div className="h-1 bg-gold w-12"></div>
          <div className="h-1 bg-gold w-3"></div>
          <div className="h-1 bg-gold w-2"></div>
          <div className="h-1 bg-gold w-1"></div>
          <div 
            className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[10px] border-l-transparent border-r-transparent border-t-gold"
            style={{ marginTop: '-5px' }}
          ></div>
          <div className="h-1 bg-gold w-1"></div>
          <div className="h-1 bg-gold w-2"></div>
          <div className="h-1 bg-gold w-3"></div>
          <div className="h-1 bg-gold w-12"></div>
        </div>
      </div>

      {/* Podium Structure */}
      <div className="relative flex items-end justify-center gap-4 max-w-4xl mx-auto px-4">
        {/* Trophy and Laurel Wreath - positioned above 1st place (center podium at index 1) */}
        {firstPlaceIndex !== -1 && (
          <div 
            className="absolute flex justify-center items-center"
            style={{
              bottom: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              marginBottom: '20px',
              height: '120px',
              width: '200px',
              pointerEvents: 'none',
              zIndex: 10
            }}
          >
            {/* Laurel Wreath */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg width="200" height="100" viewBox="0 0 200 100" className="text-gold opacity-60">
                <path
                  d="M 20 50 Q 30 20, 50 30 Q 70 40, 100 35 Q 130 40, 150 30 Q 170 20, 180 50 Q 170 80, 150 70 Q 130 60, 100 65 Q 70 60, 50 70 Q 30 80, 20 50 Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <circle cx="60" cy="40" r="3" fill="currentColor" />
                <circle cx="80" cy="35" r="3" fill="currentColor" />
                <circle cx="100" cy="32" r="3" fill="currentColor" />
                <circle cx="120" cy="35" r="3" fill="currentColor" />
                <circle cx="140" cy="40" r="3" fill="currentColor" />
                <circle cx="60" cy="60" r="3" fill="currentColor" />
                <circle cx="80" cy="65" r="3" fill="currentColor" />
                <circle cx="100" cy="68" r="3" fill="currentColor" />
                <circle cx="120" cy="65" r="3" fill="currentColor" />
                <circle cx="140" cy="60" r="3" fill="currentColor" />
              </svg>
            </div>

            {/* Trophy */}
            <div className="relative z-10">
              <svg width="60" height="80" viewBox="0 0 60 80" className="text-gold">
                {/* Trophy base */}
                <rect x="15" y="70" width="30" height="8" fill="#2d1810" rx="2" />
                {/* Trophy cup */}
                <path
                  d="M 20 20 L 20 65 L 25 70 L 35 70 L 40 65 L 40 20 Q 40 15, 35 15 L 25 15 Q 20 15, 20 20 Z"
                  fill="url(#trophyGradient)"
                  stroke="#b8860b"
                  strokeWidth="1.5"
                />
                {/* Trophy handles */}
                <path
                  d="M 20 30 Q 10 30, 10 40 Q 10 50, 20 50"
                  fill="none"
                  stroke="url(#trophyGradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path
                  d="M 40 30 Q 50 30, 50 40 Q 50 50, 40 50"
                  fill="none"
                  stroke="url(#trophyGradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="trophyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#d4af37" stopOpacity="1" />
                    <stop offset="50%" stopColor="#b8860b" stopOpacity="1" />
                    <stop offset="100%" stopColor="#9a7209" stopOpacity="1" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        )}

        {podiumData.map((ranking, index) => {
          if (!ranking.grade) {
            return (
              <div 
                key={`empty-${index}`} 
                className="flex-1"
                style={{ maxWidth: index === 1 ? '280px' : '240px' }}
              ></div>
            )
          }
          
          const colors = podiumColors[index]
          const height = podiumHeights[index]
          const rankLabel = rankLabels[index]

          return (
            <div
              key={`${ranking.grade.gradeId}-${ranking.position}`}
              className={`flex-1 flex flex-col ${height} relative podium-panel ${ranking.isLocked ? 'locked' : ''}`}
              style={{ maxWidth: index === 1 ? '280px' : '240px' }}
            >
              {/* Podium Panel */}
              <div
                className="flex-1 flex flex-col relative"
                style={{
                  background: colors.main,
                  border: `3px solid ${colors.border}`,
                  boxShadow: ranking.isLocked
                    ? `
                        0 8px 20px rgba(0, 0, 0, 0.4),
                        inset 0 2px 4px rgba(255, 255, 255, 0.3),
                        inset 0 -2px 4px rgba(0, 0, 0, 0.3),
                        0 0 20px rgba(212, 175, 55, 0.5)
                      `
                    : `
                        0 8px 20px rgba(0, 0, 0, 0.4),
                        inset 0 2px 4px rgba(255, 255, 255, 0.3),
                        inset 0 -2px 4px rgba(0, 0, 0, 0.3)
                      `
                }}
              >
                {/* Art Deco Top Border */}
                <div
                  className="h-14 flex items-center justify-center relative"
                  style={{
                    background: 'linear-gradient(135deg, rgba(13, 8, 5, 0.98) 0%, rgba(45, 24, 16, 1) 100%)',
                    borderBottom: `3px solid ${colors.border}`,
                    borderTop: `2px solid ${colors.border}`
                  }}
                >
                  {/* Art Deco corner decorations */}
                  <div 
                    className="absolute left-0 top-0 w-6 h-6 border-l-3 border-t-3" 
                    style={{ borderColor: colors.border, borderWidth: '3px' }}
                  ></div>
                  <div 
                    className="absolute right-0 top-0 w-6 h-6 border-r-3 border-t-3" 
                    style={{ borderColor: colors.border, borderWidth: '3px' }}
                  ></div>
                  
                  {/* Grade Name */}
                  <div
                    className="text-xl md:text-2xl font-bold uppercase tracking-wider font-playfair px-4 text-center"
                    style={{ color: colors.text, textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)' }}
                  >
                    {ranking.grade.gradeLabel.toUpperCase()}
                  </div>

                  {/* Locked Badge */}
                  {ranking.isLocked && (
                    <div
                      className="absolute top-1 right-1 bg-gold text-dark-brown-2 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider"
                      style={{
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                        animation: 'pulse-glow 2s ease-in-out infinite'
                      }}
                    >
                      LOCKED
                    </div>
                  )}
                </div>

                {/* Rank Number */}
                <div className="flex-1 flex items-center justify-center">
                  <div
                    className="text-5xl md:text-6xl font-black font-playfair"
                    style={{ color: colors.darkText }}
                  >
                    {rankLabel}
                  </div>
                </div>

                {/* Signup Count (optional, for debugging/display) */}
                {!ranking.isLocked && (
                  <div className="absolute bottom-2 right-2 text-xs opacity-70" style={{ color: colors.darkText }}>
                    {ranking.grade.signupCount} signups
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
