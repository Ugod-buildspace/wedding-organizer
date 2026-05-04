import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export function useStats() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalGuests: 0,
    confirmedGuests: 0,
    pendingGuests: 0,
    declinedGuests: 0,
    totalTables: 0,
    totalPlusOnes: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const fetchStats = async () => {
      setLoading(true)
      try {
        const { data: guestsData } = await supabase
          .from('guests')
          .select('rsvp_status, plus_one')
          .eq('user_id', user.id)

        const { data: tablesData } = await supabase
          .from('tables')
          .select('id')
          .eq('user_id', user.id)

        const guests = guestsData || []
        const totalGuests = guests.length
        const confirmedGuests = guests.filter(g => g.rsvp_status === 'confirmed').length
        const pendingGuests = guests.filter(g => g.rsvp_status === 'pending').length
        const declinedGuests = guests.filter(g => g.rsvp_status === 'declined').length
        const totalPlusOnes = guests.filter(g => g.plus_one).length
        const totalTables = tablesData?.length || 0

        setStats({
          totalGuests,
          confirmedGuests,
          pendingGuests,
          declinedGuests,
          totalTables,
          totalPlusOnes,
        })
      } catch {
        // silent fail
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [user])

  return { ...stats, loading }
}
