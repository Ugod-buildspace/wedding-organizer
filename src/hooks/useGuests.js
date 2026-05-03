import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export function useGuests() {
  const [guests, setGuests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return

    fetchGuests()

    const subscription = supabase
      .channel('guests_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'guests', filter: `user_id=eq.${user.id}` }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setGuests(prev => {
            if (prev.find(g => g.id === payload.new.id)) return prev;
            return [payload.new, ...prev];
          })
        } else if (payload.eventType === 'UPDATE') {
          setGuests(prev => prev.map(g => g.id === payload.new.id ? payload.new : g))
        } else if (payload.eventType === 'DELETE') {
          setGuests(prev => prev.filter(g => g.id !== payload.old.id))
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }, [user])

  const fetchGuests = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('guests')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) setError(error.message)
    else setGuests(data)
    
    setLoading(false)
  }

  const addGuest = async (guestData) => {
    const { data, error } = await supabase
      .from('guests')
      .insert([{ ...guestData, user_id: user.id }])
      .select()
    if (error) throw error
    return data[0]
  }

  const updateGuest = async (id, updates) => {
    const { data, error } = await supabase
      .from('guests')
      .update(updates)
      .eq('id', id)
      .select()
    if (error) throw error
    return data[0]
  }

  const deleteGuest = async (id) => {
    const { error } = await supabase
      .from('guests')
      .delete()
      .eq('id', id)
    if (error) throw error
  }

  return { guests, loading, error, fetchGuests, addGuest, updateGuest, deleteGuest }
}
