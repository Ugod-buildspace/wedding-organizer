import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export interface Table {
  id: string
  created_at: string
  updated_at: string
  name: string
  capacity: number
  shape: 'round' | 'rectangular' | 'head'
  position_x: number
  position_y: number
  user_id: string
}

export interface TableAssignment {
  id: string
  guest_id: string
  table_id: string
  seat_number: number | null
  guest_name?: string
}

export function useTables() {
  const { user } = useAuth()
  const [tables, setTables] = useState<Table[]>([])
  const [assignments, setAssignments] = useState<TableAssignment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTables = useCallback(async () => {
    if (!user) return
    setLoading(true)
    setError(null)
    try {
      const { data: tablesData, error: tablesError } = await supabase
        .from('tables')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })

      if (tablesError) throw tablesError
      setTables(tablesData || [])

      // Fetch assignments with guest names
      const { data: assignmentsData, error: assignError } = await supabase
        .from('table_assignments')
        .select('*, guest:guests(full_name)')
        .in('table_id', (tablesData || []).map(t => t.id))

      if (assignError) throw assignError

      const formattedAssignments = (assignmentsData || []).map((a: any) => ({
        id: a.id,
        guest_id: a.guest_id,
        table_id: a.table_id,
        seat_number: a.seat_number,
        guest_name: a.guest?.full_name || 'Ospite',
      }))

      setAssignments(formattedAssignments)
    } catch (err: any) {
      setError(err.message || 'Errore nel caricamento dei tavoli')
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchTables()
  }, [fetchTables])

  const addTable = async (data: Partial<Table>) => {
    if (!user) throw new Error('Non autenticato')
    const { error: supaError } = await supabase
      .from('tables')
      .insert([{ ...data, user_id: user.id }])
    if (supaError) throw supaError
    await fetchTables()
  }

  const updateTable = async (id: string, data: Partial<Table>) => {
    const { error: supaError } = await supabase
      .from('tables')
      .update(data)
      .eq('id', id)
    if (supaError) throw supaError
    await fetchTables()
  }

  const deleteTable = async (id: string) => {
    const { error: supaError } = await supabase
      .from('tables')
      .delete()
      .eq('id', id)
    if (supaError) throw supaError
    await fetchTables()
  }

  const assignGuest = async (guestId: string, tableId: string) => {
    const { error: supaError } = await supabase
      .from('table_assignments')
      .insert([{ guest_id: guestId, table_id: tableId }])
    if (supaError) throw supaError
    await fetchTables()
  }

  const removeGuest = async (assignmentId: string) => {
    const { error: supaError } = await supabase
      .from('table_assignments')
      .delete()
      .eq('id', assignmentId)
    if (supaError) throw supaError
    await fetchTables()
  }

  const moveTable = async (id: string, positionX: number, positionY: number) => {
    const { error: supaError } = await supabase
      .from('tables')
      .update({ position_x: positionX, position_y: positionY })
      .eq('id', id)
    if (supaError) throw supaError
  }

  return {
    tables,
    assignments,
    loading,
    error,
    addTable,
    updateTable,
    deleteTable,
    assignGuest,
    removeGuest,
    moveTable,
    refresh: fetchTables,
  }
}
