import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export interface GradeData {
  gradeId: string
  gradeLabel: string
  signupCount: number
  reachedTen: boolean
  reachedTenAt?: string // ISO timestamp
}

export interface PodiumRanking {
  position: 1 | 2 | 3
  grade: GradeData | null
  isLocked: boolean
}

export function usePodiumRankings() {
  const [podiumRankings, setPodiumRankings] = useState<PodiumRanking[]>([
    { position: 2, grade: null, isLocked: false },
    { position: 1, grade: null, isLocked: false },
    { position: 3, grade: null, isLocked: false },
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
        .select('grade_level, created_at')
        .order('created_at', { ascending: true })

      if (error) throw error

      const grades = ['K', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th']
      const gradeDataMap = new Map<string, GradeData>()

      // Process each grade
      grades.forEach((grade) => {
        const gradeRegistrations = data?.filter((r) => r.grade_level === grade) || []
        const count = gradeRegistrations.length
        const reachedTen = count >= 10
        const reachedTenAt = reachedTen && gradeRegistrations.length >= 10
          ? gradeRegistrations[9].created_at // 10th registration (index 9)
          : undefined

        gradeDataMap.set(grade, {
          gradeId: grade,
          gradeLabel: grade === 'K' ? 'Kindergarten' : `${grade} Grade`,
          signupCount: count,
          reachedTen,
          reachedTenAt,
        })
      })

      // Separate locked and unlocked grades
      const lockedGrades: GradeData[] = []
      const unlockedGrades: GradeData[] = []

      gradeDataMap.forEach((gradeData) => {
        if (gradeData.reachedTen) {
          lockedGrades.push(gradeData)
        } else {
          unlockedGrades.push(gradeData)
        }
      })

      // Sort locked grades by reachedTenAt (earliest first)
      lockedGrades.sort((a, b) => {
        if (!a.reachedTenAt) return 1
        if (!b.reachedTenAt) return -1
        return new Date(a.reachedTenAt).getTime() - new Date(b.reachedTenAt).getTime()
      })

      // Sort unlocked grades by signupCount (highest first)
      unlockedGrades.sort((a, b) => b.signupCount - a.signupCount)

      // Build podium rankings
      const newPodiumRankings: PodiumRanking[] = [
        { position: 2, grade: null, isLocked: false },
        { position: 1, grade: null, isLocked: false },
        { position: 3, grade: null, isLocked: false },
      ]

      // Assign locked grades first (in order: 1st, 2nd, 3rd)
      let lockedIndex = 0
      for (let i = 0; i < Math.min(lockedGrades.length, 3); i++) {
        const podiumIndex = i === 0 ? 1 : i === 1 ? 0 : 2 // Map to [2nd, 1st, 3rd] array
        newPodiumRankings[podiumIndex] = {
          position: (i + 1) as 1 | 2 | 3,
          grade: lockedGrades[i],
          isLocked: true,
        }
        lockedIndex++
      }

      // Fill remaining slots with top unlocked grades
      let unlockedIndex = 0
      for (let i = lockedIndex; i < 3; i++) {
        const podiumIndex = i === 0 ? 1 : i === 1 ? 0 : 2 // Map to [2nd, 1st, 3rd] array
        if (unlockedIndex < unlockedGrades.length && unlockedGrades[unlockedIndex].signupCount > 0) {
          newPodiumRankings[podiumIndex] = {
            position: (i + 1) as 1 | 2 | 3,
            grade: unlockedGrades[unlockedIndex],
            isLocked: false,
          }
          unlockedIndex++
        }
      }

      setPodiumRankings(newPodiumRankings)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching podium rankings:', error)
      setLoading(false)
    }
  }

  return { podiumRankings, loading }
}
