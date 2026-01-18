import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export interface FastestTo10 {
  grade: string
  reached10At: string // ISO timestamp when 10th registration was created
  count: number // Current count (should be >= 10)
}

export function useFastestTo10() {
  const [rankings, setRankings] = useState<FastestTo10[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initial fetch
    fetchFastestTo10()

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('fastest-to-10')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'registrations',
        },
        () => {
          fetchFastestTo10()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  async function fetchFastestTo10() {
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('grade_levels, created_at')
        .order('created_at', { ascending: true })

      if (error) throw error

      const grades = ['K', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th']
      const fastestTo10: FastestTo10[] = []

      // For each grade, find when it reached 10 signups
      grades.forEach((grade) => {
        const gradeRegistrations = data?.filter((r) => 
          r.grade_levels && Array.isArray(r.grade_levels) && r.grade_levels.includes(grade)
        ) || []
        
        if (gradeRegistrations.length >= 10) {
          // The 10th registration is at index 9 (0-indexed)
          const tenthRegistration = gradeRegistrations[9]
          fastestTo10.push({
            grade,
            reached10At: tenthRegistration.created_at,
            count: gradeRegistrations.length,
          })
        }
      })

      // Sort by timestamp (earliest first = fastest to 10)
      fastestTo10.sort((a, b) => 
        new Date(a.reached10At).getTime() - new Date(b.reached10At).getTime()
      )

      // Take top 3
      setRankings(fastestTo10.slice(0, 3))
      setLoading(false)
    } catch (error) {
      console.error('Error fetching fastest to 10:', error)
      setLoading(false)
    }
  }

  return { rankings, loading }
}
