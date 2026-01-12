import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export type PodiumRanking = {
  position: 1 | 2 | 3
  grade: {
    gradeLabel: string
    signupCount: number
  }
}

export function usePodiumRankings() {
  const [podiumRankings, setPodiumRankings] = useState<PodiumRanking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPodium() {
      const { data, error } = await supabase
        .from('podium_rankings')   // 👈 SQL VIEW
        .select('*')
        .order('podium_position')

      if (error) {
        console.error('Error fetching podium rankings:', error)
        setPodiumRankings([])
      } else {
        const formatted: PodiumRanking[] = (data || []).map((row) => ({
          position: row.podium_position,
          grade: {
            gradeLabel: row.grade,
            signupCount: row.total_votes,
          },
        }))

        setPodiumRankings(formatted)
      }

      setLoading(false)
    }

    fetchPodium()
  }, [])

  return { podiumRankings, loading }
}
