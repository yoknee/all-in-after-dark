import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Registration } from '../lib/supabase'
import { PodiumRanking } from './PodiumRanking'
import { GradeMultiSelect } from './GradeMultiSelect'

export function AdminDashboard() {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [babysittingOnly, setBabysittingOnly] = useState(false)
  const [vipOnly, setVipOnly] = useState(false)
  const [selectedGrades, setSelectedGrades] = useState<string[]>([])

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
      'Registration ID',
      'Parent Names',
      'Email',
      'Grade Level(s)',
      'Number of Adults',
      'Vote Count',
      'VIP Status',
      'Registration Date',
      'Confirmation Sent',
      'Needs Babysitting',
      'Babysitting Notes',
    ]

    const rows = registrations.map((reg) => {
      const gradeLevels = reg.grade_levels?.join(', ') || reg.grade_level || 'N/A'
      return [
        reg.id,
        reg.registration_id?.toString() || 'N/A',
        reg.parent_names,
        reg.email,
        gradeLevels,
        reg.num_adults.toString(),
        reg.vote_count?.toString() || reg.num_adults.toString(),
        reg.is_vip ? 'Yes' : 'No',
        new Date(reg.created_at).toLocaleString(),
        reg.confirmation_sent ? 'Yes' : 'No',
        reg.needs_babysitting === true ? 'Yes' : reg.needs_babysitting === false ? 'No' : 'N/A',
        reg.babysitting_notes || '',
      ]
    })

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

  // Helper function to get grade levels for a registration (handles both old and new format)
  const getGradeLevels = (reg: Registration): string[] => {
    if (reg.grade_levels && reg.grade_levels.length > 0) {
      return reg.grade_levels
    }
    if (reg.grade_level) {
      return [reg.grade_level]
    }
    return []
  }

  // Helper function to get display text for grade levels
  const getGradeLevelsDisplay = (reg: Registration): string => {
    const grades = getGradeLevels(reg)
    return grades.join(', ') || 'N/A'
  }

  // Filter registrations based on search query, babysitting filter, VIP filter, and grade filter
  const filteredRegistrations = registrations.filter((reg) => {
    // Filter by VIP status
    if (vipOnly && !reg.is_vip) {
      return false
    }

    // Filter by babysitting needs
    if (babysittingOnly && reg.needs_babysitting !== true) {
      return false
    }

    // Filter by grade levels
    if (selectedGrades.length > 0) {
      const regGrades = getGradeLevels(reg)
      const hasMatchingGrade = selectedGrades.some((grade) => regGrades.includes(grade))
      if (!hasMatchingGrade) {
        return false
      }
    }

    // Then filter by search query
    if (!searchQuery.trim()) return true
    const query = searchQuery.toLowerCase()
    const gradeLevelsText = getGradeLevelsDisplay(reg).toLowerCase()
    return (
      reg.parent_names.toLowerCase().includes(query) ||
      reg.email.toLowerCase().includes(query) ||
      gradeLevelsText.includes(query) ||
      (reg.babysitting_notes && reg.babysitting_notes.toLowerCase().includes(query))
    )
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
            <h2 className="text-2xl font-bold text-gold">All Registrations</h2>
            <div className="flex flex-col gap-3 w-full md:flex-row md:items-center md:justify-end">
              <div className="flex items-center gap-3 flex-wrap">
                <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={vipOnly}
                    onChange={(e) => setVipOnly(e.target.checked)}
                    className="w-5 h-5 text-gold focus:ring-gold accent-gold cursor-pointer"
                  />
                  <span className="text-gold font-semibold">VIP Only</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={babysittingOnly}
                    onChange={(e) => setBabysittingOnly(e.target.checked)}
                    className="w-5 h-5 text-gold focus:ring-gold accent-gold cursor-pointer"
                  />
                  <span className="text-gold font-semibold">Babysitting Only</span>
                </label>
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 md:w-80 px-4 py-2 bg-dark-brown-2 border-2 border-gold rounded text-cream placeholder-cream placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] font-baskerville"
                />
              </div>
              <div className="w-full md:w-auto">
                <label className="block text-gold font-semibold mb-2 text-sm tracking-wider uppercase">
                  Filter by Grade(s)
                </label>
                <GradeMultiSelect
                  selectedGrades={selectedGrades}
                  onChange={setSelectedGrades}
                />
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full text-left">
                <thead className="sticky top-0 bg-dark-brown z-10">
                  <tr className="border-b border-gold">
                    <th className="text-gold font-semibold py-2 px-2 bg-dark-brown">Registration ID</th>
                    <th className="text-gold font-semibold py-2 px-2 bg-dark-brown">Parent Names</th>
                    <th className="text-gold font-semibold py-2 px-2 bg-dark-brown">Email</th>
                    <th className="text-gold font-semibold py-2 px-2 bg-dark-brown">Grade Level(s)</th>
                    <th className="text-gold font-semibold py-2 px-2 bg-dark-brown">Vote Count</th>
                    <th className="text-gold font-semibold py-2 px-2 bg-dark-brown">VIP</th>
                    <th className="text-gold font-semibold py-2 px-2 bg-dark-brown">Needs Babysitting</th>
                    <th className="text-gold font-semibold py-2 px-2 bg-dark-brown">Babysitting Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRegistrations.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-gold text-center py-8 opacity-70">
                        {searchQuery || selectedGrades.length > 0 || vipOnly || babysittingOnly
                          ? 'No registrations match your filters.'
                          : 'No registrations found.'}
                      </td>
                    </tr>
                  ) : (
                    filteredRegistrations.map((reg) => (
                      <tr key={reg.id} className="border-b border-gold border-opacity-30">
                        <td className="text-gold py-2 px-2">
                          {reg.registration_id || '-'}
                        </td>
                        <td className="text-gold py-2 px-2">{reg.parent_names}</td>
                        <td className="text-gold py-2 px-2" style={{ maxWidth: '290px', wordWrap: 'break-word' }}>{reg.email}</td>
                        <td className="text-gold py-2 px-2">{getGradeLevelsDisplay(reg)}</td>
                        <td className="text-gold py-2 px-2">{reg.vote_count || reg.num_adults}</td>
                        <td className="text-gold py-2 px-2">
                          {reg.is_vip ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gold/20 border border-gold text-gold text-xs">
                              ✕
                            </span>
                          ) : '-'}
                        </td>
                        <td className="text-gold py-2 px-2">
                          {reg.needs_babysitting === true ? 'Yes' : reg.needs_babysitting === false ? 'No' : 'N/A'}
                        </td>
                        <td className="text-gold py-2 px-2">
                          {reg.needs_babysitting === true && reg.babysitting_notes ? reg.babysitting_notes : '-'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {searchQuery && (
            <div className="mt-4 text-sm text-gold opacity-70">
              Showing {filteredRegistrations.length} of {totalRegistrations} registrations
            </div>
          )}
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
                    {reg.parent_names} - {getGradeLevelsDisplay(reg)}
                    {reg.registration_id && ` (ID: ${reg.registration_id})`}
                  </div>
                  <div className="text-gold opacity-70 text-sm">
                    {reg.email} • {new Date(reg.created_at).toLocaleString()}
                  </div>
                </div>
                {reg.is_vip && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-gold/20 border border-gold text-gold text-xs font-semibold">
                    VIP
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

