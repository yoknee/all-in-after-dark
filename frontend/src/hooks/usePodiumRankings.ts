import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export interface GradeData {
  gradeId: string
  gradeLabel: string
  signupCount: number
}

export interface PodiumRanking {
  position: 1 | 2 | 3
  grade: GradeData | null
}

export function usePodiumRankings() {
  const [podiumRankings, setPodiumRankings] = useState<PodiumRanking[]>([
    { position: 1, grade: null },
    { position: 2, grade: null },
    { position: 3, grade: null },
  ])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initial fetch
    fetchPodiumRankings()

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('podium-rankings')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'registrations',
        },
        () => {
          fetchPodiumRankings()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  async function fetchPodiumRankings() {
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('grade_level, grade_levels, vote_count, num_adults')

      if (error) throw error

      const grades = ['K', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th']
      const gradeDataList: GradeData[] = []

      // Calculate total votes per grade (using vote_count, fallback to num_adults)
      grades.forEach((grade) => {
        let totalVotes = 0
        
        data?.forEach((r) => {
          // Check if this registration includes this grade
          let includesGrade = false
          if (r.grade_levels && Array.isArray(r.grade_levels)) {
            includesGrade = r.grade_levels.includes(grade)
          } else if (r.grade_level === grade) {
            includesGrade = true
          }
          
          if (includesGrade) {
            // Use vote_count if available, otherwise use num_adults
            const votes = r.vote_count || r.num_adults || 1
            totalVotes += votes
          }
        })
        
        gradeDataList.push({
          gradeId: grade,
          gradeLabel: grade === 'K' ? 'Kindergarten' : `${grade} Grade`,
          signupCount: totalVotes, // Now represents total votes, not just count
        })
      })

      // Sort by vote count (descending), then by grade name A-Z for ties
      gradeDataList.sort((a, b) => {
        if (b.signupCount !== a.signupCount) {
          return b.signupCount - a.signupCount
        }
        // Tie: sort by grade name A-Z
        return a.gradeId.localeCompare(b.gradeId)
      })

      // Take top 3
      const top3 = gradeDataList.slice(0, 3)

      // Build podium rankings in order: 1st, 2nd, 3rd
      const newPodiumRankings: PodiumRanking[] = [
        { position: 1, grade: top3[0] || null },
        { position: 2, grade: top3[1] || null },
        { position: 3, grade: top3[2] || null },
      ]

      setPodiumRankings(newPodiumRankings)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching podium rankings:', error)
      setLoading(false)
    }
  }

  return { podiumRankings, loading }
}
