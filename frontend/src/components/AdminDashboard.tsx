import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Registration } from '../lib/supabase'
import { First10Badge } from './First10Badge'
import { PodiumRanking } from './PodiumRanking'

export function AdminDashboard() {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)

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
      'Grade Level',
      'Number of Adults',
      'First 10 Status',
      'Registration Number',
      'Registration Date',
      'Confirmation Sent',
      'Needs Babysitting',
      'Babysitting Notes',
    ]

    const rows = registrations.map((reg) => [
      reg.id,
      reg.parent_names,
      reg.email,
      reg.grade_level,
      reg.num_adults.toString(),
      reg.is_first_10 ? 'Yes' : 'No',
      reg.registration_number.toString(),
      new Date(reg.created_at).toLocaleString(),
      reg.confirmation_sent ? 'Yes' : 'No',
      reg.needs_babysitting === true ? 'Yes' : reg.needs_babysitting === false ? 'No' : 'N/A',
      reg.babysitting_notes || '',
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-dark-brown border-2 border-gold rounded-lg p-6 text-center card-border hover:shadow-xl transition-all duration-300">
            <div className="text-3xl font-bold text-gold">{totalRegistrations}</div>
            <div className="text-gold mt-2">Total Registrations</div>
          </div>
          <div className="bg-dark-brown border-2 border-gold rounded-lg p-6 text-center card-border">
            <button onClick={exportToCSV} className="btn-primary w-full">
              Export to CSV
            </button>
          </div>
        </div>

        {/* Podium Ranking */}
        <div className="bg-dark-brown border-2 border-gold rounded-lg p-6 mb-8 card-border">
          <PodiumRanking />
        </div>

        {/* All Registrations */}
        <div className="bg-dark-brown border-2 border-gold rounded-lg p-6 mb-8 card-border">
          <h2 className="text-2xl font-bold text-gold mb-4">All Registrations</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gold">
                  <th className="text-gold font-semibold py-2 px-2">Parent Names</th>
                  <th className="text-gold font-semibold py-2 px-2">Email</th>
                  <th className="text-gold font-semibold py-2 px-2">Grade Level</th>
                  <th className="text-gold font-semibold py-2 px-2">Needs Babysitting</th>
                  <th className="text-gold font-semibold py-2 px-2">Babysitting Notes</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((reg) => (
                  <tr key={reg.id} className="border-b border-gold border-opacity-30">
                    <td className="text-gold py-2 px-2">{reg.parent_names}</td>
                    <td className="text-gold py-2 px-2">{reg.email}</td>
                    <td className="text-gold py-2 px-2">{reg.grade_level}</td>
                    <td className="text-gold py-2 px-2">
                      {reg.needs_babysitting === true ? 'Yes' : reg.needs_babysitting === false ? 'No' : 'N/A'}
                    </td>
                    <td className="text-gold py-2 px-2">
                      {reg.needs_babysitting === true && reg.babysitting_notes ? reg.babysitting_notes : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Registrations Feed */}
        <div className="bg-dark-brown border-2 border-gold rounded-lg p-6 card-border">
          <h2 className="text-2xl font-bold text-gold mb-4">Recent Registrations</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {registrations.slice(0, 10).map((reg) => (
              <div
                key={reg.id}
                className="bg-dark-brown border border-gold rounded p-4 flex items-center justify-between"
              >
                <div>
                  <div className="text-gold font-semibold">
                    {reg.parent_names} - {reg.grade_level} Grade
                  </div>
                  <div className="text-gold opacity-70 text-sm">
                    {reg.email} • {new Date(reg.created_at).toLocaleString()}
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

