import { useFastestTo10 } from '../hooks/useFastestTo10'

export function GradeRanking() {
  const { rankings, loading } = useFastestTo10()

  if (loading) {
    return (
      <div className="text-gold opacity-70 animate-pulse text-center py-8">
        Loading rankings...
      </div>
    )
  }

  if (rankings.length === 0) {
    return (
      <div className="text-gold opacity-70 text-center py-8">
        No grades have reached 10 signups yet. Be the first!
      </div>
    )
  }

  // Map rankings to podium positions: 1st center, 2nd left, 3rd right
  const podiumData = [
    rankings[1] || null, // 2nd place (left)
    rankings[0] || null,  // 1st place (center)
    rankings[2] || null, // 3rd place (right)
  ]

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
  const rankNumbers = [2, 1, 3]

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

      {/* Trophy and Laurel Wreath */}
      <div className="relative flex justify-center items-center mb-8" style={{ height: '120px' }}>
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

      {/* Podium Structure */}
      <div className="flex items-end justify-center gap-4 max-w-4xl mx-auto px-4">
        {podiumData.map((ranking, index) => {
          if (!ranking) return <div key={`empty-${index}`} className="flex-1"></div>
          
          const colors = podiumColors[index]
          const height = podiumHeights[index]
          const rankLabel = rankLabels[index]
          const rankNum = rankNumbers[index]

          return (
            <div
              key={ranking.grade}
              className={`flex-1 flex flex-col ${height} relative`}
              style={{ maxWidth: index === 1 ? '280px' : '240px' }}
            >
              {/* Podium Panel */}
              <div
                className="flex-1 flex flex-col relative"
                style={{
                  background: colors.main,
                  border: `3px solid ${colors.border}`,
                  boxShadow: `
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
                  {/* Art Deco corner decorations - more prominent */}
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
                    {ranking.grade} GRADE
                  </div>
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
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
