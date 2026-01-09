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

  // Podium array: [1st, 2nd, 3rd]
  const podiumData = podiumRankings

  const rankLabels = ['1st Place', '2nd Place', '3rd Place']

  return (
    <div className="relative w-full py-8">
      {/* Title */}
      <div className="text-center mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-gold tracking-wider mb-4 font-playfair">
          Most RSVPs by Grade
        </h2>
      </div>

      {/* Leaderboard Cards */}
      <div className="flex flex-col md:flex-row items-stretch justify-center gap-4 max-w-4xl mx-auto px-4">
        {podiumData.map((ranking, index) => {
          if (!ranking.grade) {
            return (
              <div 
                key={`empty-${index}`} 
                className="flex-1"
              ></div>
            )
          }
          
          const rankLabel = rankLabels[index]

          return (
            <div
              key={`${ranking.grade.gradeId}-${ranking.position}`}
              className="flex-1 flex flex-col border-2 border-gold bg-[rgba(212,175,55,0.1)] min-h-[200px]"
            >
              {/* Grade Name - Top */}
              <div className="bg-[rgba(13,8,5,0.9)] border-b-2 border-gold p-4">
                <div className="text-lg md:text-xl font-bold uppercase tracking-wider font-playfair text-center text-gold">
                  {ranking.grade.gradeLabel}
                </div>
              </div>

              {/* Place Label - Middle */}
              <div className="flex-1 flex flex-col items-center justify-center py-6">
                <div className="text-3xl md:text-4xl font-black font-playfair mb-3 text-gold">
                  {rankLabel}
                </div>
                <div className="text-base md:text-lg font-semibold text-light-gold">
                  {ranking.grade.signupCount} {ranking.grade.signupCount === 1 ? 'signup' : 'signups'}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
