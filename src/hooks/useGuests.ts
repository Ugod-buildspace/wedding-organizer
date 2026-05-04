import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export interface Guest {
  id: string
  created_at: string
  updated_at: string
  full_name: string
  email: string | null
  phone: string | null
  plus_one: boolean
  plus_one_name: string | null
  invitation_status: 'pending' | 'sent' | 'opened' | 'accepted' | 'declined'
  rsvp_status: 'pending' | 'confirmed' | 'declined' | 'no_response'
  dietary_restrictions: string | null
  notes: string | null
  table_id: string | null
  user_id: string
  table_name?: string
}

export function useGuests() {
  const { user } = useAuth()
  const [guests, setGuests] = useState<Guest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchGuests = useCallback(async () => {
    if (!user) return
    setLoading(true)
    setError(null)
    try {
      const { data, error: supaError } = await supabase
        .from('guests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (supaError) throw supaError

      // Fetch table names
      const tableIds = (data || []).map(g => g.table_id).filter(Boolean) as string[]
      let tableMap: Record<string, string> = {}
      if (tableIds.length > 0) {
        const { data: tablesData } = await supabase
          .from('tables')
          .select('id, name')
          .in('id', tableIds)
        tableMap = (tablesData || []).reduce((acc, t) => {
          acc[t.id] = t.name
          return acc
        }, {} as Record<string, string>)
      }

      const guestsWithTables = (data || []).map(g => ({
        ...g,
        table_name: g.table_id ? tableMap[g.table_id] || null : null,
      }))

      setGuests(guestsWithTables)
    } catch (err: any) {
      setError(err.message || 'Errore nel caricamento degli ospiti')
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchGuests()
  }, [fetchGuests])

  const addGuest = async (data: Partial<Guest>) => {
    if (!user) throw new Error('Non autenticato')
    const { error: supaError } = await supabase
      .from('guests')
      .insert([{ ...data, user_id: user.id }])
    if (supaError) throw supaError
    await fetchGuests()
  }

  const updateGuest = async (id: string, data: Partial<Guest>) => {
    const { error: supaError } = await supabase
      .from('guests')
      .update(data)
      .eq('id', id)
    if (supaError) throw supaError
    await fetchGuests()
  }

  const deleteGuest = async (id: string) => {
    const { error: supaError } = await supabase
      .from('guests')
      .delete()
      .eq('id', id)
    if (supaError) throw supaError
    await fetchGuests()
  }

  return { guests, loading, error, addGuest, updateGuest, deleteGuest, refresh: fetchGuests }
}
