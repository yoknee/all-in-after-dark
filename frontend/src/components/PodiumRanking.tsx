import { usePodiumRankings, type PodiumRanking as PodiumRankingType } from '../hooks/usePodiumRankings'

export function PodiumRanking() {
  const { podiumRankings, loading } = usePodiumRankings()

  if (loading) {
    return (
      <div className="text-gold opacity-70 animate-pulse text-center py-8">
        Loading rankings...
      </div>
    )
  }

  // Reorder for podium display: 2nd (left), 1st (center), 3rd (right)
  const secondPlace = podiumRankings.find((p) => p.position === 2)
  const firstPlace = podiumRankings.find((p) => p.position === 1)
  const thirdPlace = podiumRankings.find((p) => p.position === 3)

  // Podium heights
  const podiumHeights = {
    1: 'h-48', // Tallest for 1st place
    2: 'h-36', // Medium for 2nd place
    3: 'h-28', // Shortest for 3rd place
  }

  const PodiumStand = ({ ranking, position }: { ranking: PodiumRankingType | undefined; position: 1 | 2 | 3 }) => {
    if (!ranking || !ranking.grade) {
      return (
        <div className="flex-1 flex flex-col items-center justify-end">
          <div className={`w-full ${podiumHeights[position]} bg-[rgba(212,175,55,0.1)] border-2 border-gold border-opacity-30 rounded-t-lg flex flex-col items-center justify-center`}>
            <div className="text-gold opacity-30 text-sm font-semibold">
              {position === 1 ? '1st' : position === 2 ? '2nd' : '3rd'}
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="flex-1 flex flex-col items-center justify-end">
        <div className={`w-full ${podiumHeights[position]} bg-gradient-to-br from-[rgba(212,175,55,0.2)] to-[rgba(212,175,55,0.05)] border-2 border-gold rounded-t-lg flex flex-col items-center justify-center relative overflow-hidden`}>
          {/* Position badge */}
          <div className="absolute top-2 left-2 bg-gold text-dark-brown-2 px-2 py-1 text-xs font-bold rounded shadow-lg">
            {position === 1 ? '1st' : position === 2 ? '2nd' : '3rd'}
          </div>
          
          {/* Grade name */}
          <div className="text-center px-2">
            <div className="text-lg md:text-xl font-bold text-gold font-playfair mb-1">
              {ranking.grade.gradeLabel}
            </div>
            <div className="text-2xl md:text-3xl font-black text-gold font-playfair">
              {ranking.grade.signupCount}
            </div>
            <div className="text-xs text-light-gold mt-1">
              {ranking.grade.signupCount === 1 ? 'registration' : 'registrations'}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full py-8">
      <div className="text-center mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gold tracking-wider font-playfair">
          Most RSVPs by Grade
        </h2>
      </div>

      {/* Podium Display */}
      <div className="flex items-end justify-center gap-2 md:gap-4 max-w-4xl mx-auto px-4">
        {/* 2nd Place (Left) */}
        <PodiumStand ranking={secondPlace} position={2} />
        
        {/* 1st Place (Center) */}
        <PodiumStand ranking={firstPlace} position={1} />
        
        {/* 3rd Place (Right) */}
        <PodiumStand ranking={thirdPlace} position={3} />
      </div>
    </div>
  )
}
