import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useStats() {
  const [totalGuests, setTotalGuests] = useState(0)
  const [confirmedGuests, setConfirmedGuests] = useState(0)
  const [totalTables, setTotalTables] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
    
    // Sottoscrizione realtime per guests
    const channel = supabase
      .channel('stats-guests')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'guests' }, () => fetchStats())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tables' }, () => fetchStats())
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  async function fetchStats() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setLoading(false)
      return
    }

    // Totale invitati
    const { count: total } = await supabase
      .from('guests')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    // Confermati
    const { count: confirmed } = await supabase
      .from('guests')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('rsvp_status', 'confirmed')

    // Totale tavoli (se tabella esiste)
    let tablesCount = 0
    try {
      const { count: tCount, error } = await supabase
        .from('tables')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        
      if (!error) {
        tablesCount = tCount || 0
      }
    } catch (e) {
      // tabella potrebbe non esistere ancora
      tablesCount = 0
    }

    setTotalGuests(total || 0)
    setConfirmedGuests(confirmed || 0)
    setTotalTables(tablesCount)
    setLoading(false)
  }

  return { totalGuests, confirmedGuests, totalTables, loading }
}
