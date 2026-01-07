import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export interface GradeCount {
  grade: string
  count: number
  spotsRemaining: number
}

export function useGradeCounts() {
  const [gradeCounts, setGradeCounts] = useState<GradeCount[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initial fetch
    fetchGradeCounts()

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('registrations')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'registrations',
        },
        () => {
          fetchGradeCounts()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  async function fetchGradeCounts() {
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('grade_level')

      if (error) throw error

      const grades = ['K', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th']
      const counts: GradeCount[] = grades.map((grade) => {
        const count = data?.filter((r) => r.grade_level === grade).length || 0
        return {
          grade,
          count,
          spotsRemaining: Math.max(0, 10 - count),
        }
      })

      setGradeCounts(counts)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching grade counts:', error)
      setLoading(false)
    }
  }

  return { gradeCounts, loading }
}

