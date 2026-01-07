import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Registration } from '../lib/supabase'
import { useGradeCounts } from '../hooks/useGradeCounts'
import { First10Badge } from './First10Badge'

export function AdminDashboard() {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const { gradeCounts } = useGradeCounts()

  useEffect(() => {
    fetchRegistrations()

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('admin-registrations')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'registrations',
        },
        () => {
          fetchRegistrations()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  async function fetchRegistrations() {
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setRegistrations(data || [])
      setLoading(false)
    } catch (error) {
      console.error('Error fetching registrations:', error)
      setLoading(false)
    }
  }

  const exportToCSV = () => {
    const headers = [
      'ID',
      'Parent Names',
      'Email',
      'Phone',
      'Grade Level',
      'Dietary Restrictions',
      'Number of Adults',
      'First 10 Status',
      'Registration Number',
      'Registration Date',
      'Confirmation Sent',
    ]

    const rows = registrations.map((reg) => [
      reg.id,
      reg.parent_names,
      reg.email,
      reg.phone,
      reg.grade_level,
      reg.dietary_restrictions || '',
      reg.num_adults.toString(),
      reg.is_first_10 ? 'Yes' : 'No',
      reg.registration_number.toString(),
      new Date(reg.created_at).toLocaleString(),
      reg.confirmation_sent ? 'Yes' : 'No',
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `registrations_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const totalRegistrations = registrations.length
  const first10Count = registrations.filter((r) => r.is_first_10).length

  const breakdownByGrade = gradeCounts.map((gc) => ({
    grade: gc.grade,
    total: gc.count,
    first10: registrations.filter((r) => r.grade_level === gc.grade && r.is_first_10).length,
  }))

  const first10ByGrade: Record<string, Registration[]> = {}
  registrations
    .filter((r) => r.is_first_10)
    .forEach((reg) => {
      if (!first10ByGrade[reg.grade_level]) {
        first10ByGrade[reg.grade_level] = []
      }
      first10ByGrade[reg.grade_level].push(reg)
    })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gold text-xl">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-gold text-center mb-8 font-deco">
          Admin Dashboard
        </h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-dark-brown border-2 border-gold rounded-lg p-6 text-center card-border hover:shadow-xl transition-all duration-300">
            <div className="text-3xl font-bold text-gold">{totalRegistrations}</div>
            <div className="text-gold mt-2">Total Registrations</div>
          </div>
          <div className="bg-dark-brown border-2 border-gold rounded-lg p-6 text-center card-border hover:shadow-xl transition-all duration-300">
            <div className="text-3xl font-bold text-gold">{first10Count}</div>
            <div className="text-gold mt-2">First 10 Registrations</div>
          </div>
          <div className="bg-dark-brown border-2 border-gold rounded-lg p-6 text-center card-border">
            <button onClick={exportToCSV} className="btn-primary w-full">
              Export to CSV
            </button>
          </div>
        </div>

        {/* Breakdown by Grade */}
        <div className="bg-dark-brown border-2 border-gold rounded-lg p-6 mb-8 card-border">
          <h2 className="text-2xl font-bold text-gold mb-4">Breakdown by Grade</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gold">
                  <th className="text-gold font-semibold py-2">Grade</th>
                  <th className="text-gold font-semibold py-2">Total</th>
                  <th className="text-gold font-semibold py-2">First 10</th>
                  <th className="text-gold font-semibold py-2">Spots Remaining</th>
                </tr>
              </thead>
              <tbody>
                {breakdownByGrade.map((item) => (
                  <tr key={item.grade} className="border-b border-gold border-opacity-30">
                    <td className="text-gold py-2">{item.grade}</td>
                    <td className="text-gold py-2">{item.total}</td>
                    <td className="text-gold py-2">{item.first10}</td>
                    <td className="text-gold py-2">
                      {Math.max(0, 10 - item.total)} / 10
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* First 10 by Grade */}
        <div className="bg-dark-brown border-2 border-gold rounded-lg p-6 mb-8 card-border">
          <h2 className="text-2xl font-bold text-gold mb-4">First 10 Registrations by Grade</h2>
          {Object.keys(first10ByGrade).length === 0 ? (
            <p className="text-gold opacity-70">No first 10 registrations yet.</p>
          ) : (
            Object.entries(first10ByGrade).map(([grade, regs]) => (
              <div key={grade} className="mb-6">
                <h3 className="text-xl font-semibold text-gold mb-2">
                  {grade} Grade ({regs.length} registrations)
                </h3>
                <div className="space-y-2">
                  {regs
                    .sort((a, b) => a.registration_number - b.registration_number)
                    .map((reg) => (
                      <div
                        key={reg.id}
                        className="bg-dark-brown border border-gold rounded p-3 flex items-center justify-between"
                      >
                        <div>
                          <span className="text-gold font-semibold">
                            #{reg.registration_number} - {reg.parent_names}
                          </span>
                          <span className="text-gold opacity-70 ml-2">({reg.email})</span>
                        </div>
                        <First10Badge />
                      </div>
                    ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Recent Registrations Feed */}
        <div className="bg-dark-brown border-2 border-gold rounded-lg p-6 card-border">
          <h2 className="text-2xl font-bold text-gold mb-4">Recent Registrations</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {registrations.slice(0, 20).map((reg) => (
              <div
                key={reg.id}
                className="bg-dark-brown border border-gold rounded p-4 flex items-center justify-between"
              >
                <div>
                  <div className="text-gold font-semibold">
                    {reg.parent_names} - {reg.grade_level} Grade
                  </div>
                  <div className="text-gold opacity-70 text-sm">
                    {reg.email} • {reg.phone} • {new Date(reg.created_at).toLocaleString()}
                  </div>
                </div>
                {reg.is_first_10 && <First10Badge />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

