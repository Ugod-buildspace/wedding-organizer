import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, Edit2, Trash2, Flower2, Users, GripVertical, Check } from 'lucide-react'
import { useTables } from '../hooks/useTables'
import { useGuests } from '../hooks/useGuests'

interface TableFormData {
  name: string
  capacity: number
  shape: 'round' | 'rectangular' | 'head'
}

export default function Tables() {
  const { tables, assignments, loading, error, addTable, updateTable, deleteTable, assignGuest, removeGuest } = useTables()
  const { guests } = useGuests()
  const [selectedTable, setSelectedTable] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTable, setEditingTable] = useState<any>(null)
  const [formData, setFormData] = useState<TableFormData>({ name: '', capacity: 8, shape: 'round' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const unassignedGuests = guests.filter(g => !g.table_id && g.rsvp_status !== 'declined')

  const handleOpenForm = (table?: any) => {
    if (table) {
      setEditingTable(table)
      setFormData({ name: table.name, capacity: table.capacity, shape: table.shape })
    } else {
      setEditingTable(null)
      setFormData({ name: '', capacity: 8, shape: 'round' })
    }
    setIsFormOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      if (editingTable) {
        await updateTable(editingTable.id, formData)
      } else {
        await addTable({ ...formData, position_x: 0, position_y: 0 })
      }
      setIsFormOpen(false)
    } catch (err: any) {
      alert('Errore: ' + err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    const tableAssignments = assignments.filter(a => a.table_id === id)
    if (tableAssignments.length > 0) {
      if (!window.confirm('Questo tavolo ha ospiti assegnati. Eliminarlo comunque?')) return
    } else {
      if (!window.confirm('Sei sicuro di voler eliminare questo tavolo?')) return
    }
    try {
      await deleteTable(id)
      if (selectedTable === id) setSelectedTable(null)
    } catch (err: any) {
      alert('Errore: ' + err.message)
    }
  }

  const handleAssignGuest = async (guestId: string, tableId: string) => {
    try {
      await assignGuest(guestId, tableId)
    } catch (err: any) {
      alert('Errore: ' + err.message)
    }
  }

  const selectedTableData = tables.find(t => t.id === selectedTable)
  const selectedAssignments = assignments.filter(a => a.table_id === selectedTable)
  const isOverCapacity = selectedTableData && selectedAssignments.length > selectedTableData.capacity

  const getShapeStyles = (shape: string) => {
    switch (shape) {
      case 'round': return 'rounded-full aspect-square'
      case 'head': return 'rounded-lg aspect-[2/1]'
      default: return 'rounded-xl aspect-[3/2]'
    }
  }

  const getShapeColor = (shape: string) => {
    switch (shape) {
      case 'round': return 'bg-rose/30 border-rose/40'
      case 'head': return 'bg-gold/20 border-gold/30'
      default: return 'bg-sage-light/70 border-sage/30'
    }
  }

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
      >
        <div className="flex items-center gap-3">
          <Flower2 className="w-6 h-6 text-sage" />
          <h1 className="font-display text-3xl text-charcoal">Gestione Tavoli</h1>
        </div>
        <button
          onClick={() => handleOpenForm()}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-sage hover:bg-sage-dark text-white rounded-full text-sm font-medium transition-all duration-300 hover:shadow-medium active:scale-[0.98] self-start"
        >
          <Plus className="w-4 h-4" />
          Nuovo tavolo
        </button>
      </motion.div>

      {error && (
        <div className="bg-decline/10 text-decline p-4 rounded-xl mb-4 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tables List */}
        <div className="lg:col-span-1 space-y-3">
          <h2 className="text-sm font-semibold text-charcoal/60 uppercase tracking-wider mb-3">
            I tuoi tavoli
          </h2>
          {loading && tables.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-subtle p-8 text-center">
              <div className="w-6 h-6 border-2 border-sage/30 border-t-sage rounded-full animate-spin mx-auto" />
            </div>
          ) : tables.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-subtle p-8 text-center">
              <p className="text-charcoal/50 text-sm">Nessun tavolo creato</p>
            </div>
          ) : (
            tables.map((table, index) => {
              const tableAssignments = assignments.filter(a => a.table_id === table.id)
              const isSelected = selectedTable === table.id
              return (
                <motion.div
                  key={table.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedTable(isSelected ? null : table.id)}
                  className={`relative bg-white rounded-2xl p-5 cursor-pointer transition-all duration-300 ${
                    isSelected
                      ? 'shadow-medium ring-2 ring-gold/40'
                      : 'shadow-subtle hover:shadow-medium'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${getShapeStyles(table.shape)} ${getShapeColor(table.shape)} border-2 flex items-center justify-center`}>
                        <Users className="w-4 h-4 text-charcoal/60" />
                      </div>
                      <div>
                        <h3 className="font-medium text-charcoal text-sm">{table.name}</h3>
                        <p className="text-xs text-charcoal/50 mt-0.5">
                          {tableAssignments.length} / {table.capacity} ospiti
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={e => { e.stopPropagation(); handleOpenForm(table) }}
                        className="w-7 h-7 rounded-lg hover:bg-gold/10 flex items-center justify-center transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-gold" />
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); handleDelete(table.id) }}
                        className="w-7 h-7 rounded-lg hover:bg-decline/10 flex items-center justify-center transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-decline" />
                      </button>
                    </div>
                  </div>
                  {tableAssignments.length > table.capacity && (
                    <div className="mt-2 text-xs text-decline bg-decline/10 rounded-lg px-2 py-1">
                      Tavolo sovraffollato
                    </div>
                  )}
                </motion.div>
              )
            })
          )}
        </div>

        {/* Table Detail / Planner */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {selectedTableData ? (
              <motion.div
                key={selectedTable}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white rounded-2xl shadow-subtle p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 ${getShapeStyles(selectedTableData.shape)} ${getShapeColor(selectedTableData.shape)} border-2 flex items-center justify-center`}>
                      <Users className="w-5 h-5 text-charcoal/60" />
                    </div>
                    <div>
                      <h2 className="font-display text-xl text-charcoal">{selectedTableData.name}</h2>
                      <p className="text-sm text-charcoal/50">
                        Capacità: {selectedTableData.capacity} | Forma: {selectedTableData.shape === 'round' ? 'Rotondo' : selectedTableData.shape === 'head' ? 'Tavolo imperiale' : 'Rettangolare'}
                      </p>
                    </div>
                  </div>
                  {isOverCapacity && (
                    <span className="text-xs font-medium text-decline bg-decline/10 px-3 py-1.5 rounded-full">
                      Sovraffollato
                    </span>
                  )}
                </div>

                {/* Assigned guests */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-charcoal/60 uppercase tracking-wider mb-3">
                    Ospiti assegnati ({selectedAssignments.length})
                  </h3>
                  {selectedAssignments.length === 0 ? (
                    <div className="bg-ivory rounded-xl p-6 text-center">
                      <p className="text-sm text-charcoal/40">Nessun ospite assegnato a questo tavolo</p>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {selectedAssignments.map((assignment) => (
                        <div
                          key={assignment.id}
                          className="flex items-center gap-2 bg-sage-light/50 rounded-full pl-3 pr-2 py-1.5"
                        >
                          <span className="text-sm text-charcoal font-medium">{assignment.guest_name}</span>
                          <button
                            onClick={() => removeGuest(assignment.id)}
                            className="w-5 h-5 rounded-full hover:bg-decline/15 flex items-center justify-center transition-colors"
                            title="Rimuovi dal tavolo"
                          >
                            <X className="w-3 h-3 text-decline" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Available seats indicator */}
                <div className="mb-6">
                  <div className="flex items-center justify-between text-xs text-charcoal/50 mb-2">
                    <span>Posti occupati</span>
                    <span>{selectedAssignments.length} / {selectedTableData.capacity}</span>
                  </div>
                  <div className="w-full h-2 bg-ivory rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${isOverCapacity ? 'bg-decline' : 'bg-sage'}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((selectedAssignments.length / selectedTableData.capacity) * 100, 100)}%` }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                </div>

                {/* Unassigned guests to drag */}
                {unassignedGuests.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-charcoal/60 uppercase tracking-wider mb-3">
                      Ospiti da assegnare
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {unassignedGuests.map(guest => (
                        <button
                          key={guest.id}
                          onClick={() => handleAssignGuest(guest.id, selectedTable!)}
                          className="flex items-center gap-1.5 bg-ivory hover:bg-blush/20 border border-borderlight hover:border-blush/40 rounded-full pl-3 pr-2 py-1.5 transition-all duration-200 text-sm text-charcoal/70 hover:text-charcoal"
                        >
                          <GripVertical className="w-3 h-3 text-charcoal/30" />
                          <span>{guest.full_name}</span>
                          <div className="w-4 h-4 rounded-full bg-sage/20 flex items-center justify-center ml-1">
                            <Plus className="w-3 h-3 text-sage" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-2xl shadow-subtle p-16 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
                  <Flower2 className="w-8 h-8 text-gold" />
                </div>
                <h3 className="font-display text-xl text-charcoal mb-2">
                  Seleziona un tavolo
                </h3>
                <p className="text-charcoal/50 text-sm max-w-xs mx-auto">
                  Clicca su un tavolo per vedere i dettagli e assegnare gli ospiti
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Add/Edit Table Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-charcoal/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsFormOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white rounded-3xl shadow-elevated w-full max-w-md"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-2xl text-charcoal">
                    {editingTable ? 'Modifica tavolo' : 'Nuovo tavolo'}
                  </h2>
                  <button
                    onClick={() => setIsFormOpen(false)}
                    className="w-8 h-8 rounded-full bg-ivory hover:bg-sage/10 flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4 text-charcoal/60" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-charcoal/70 mb-1.5">
                      Nome tavolo
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-ivory border border-borderlight rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blush/50 focus:border-blush transition-colors"
                      placeholder="es. Tavolo degli amici"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-charcoal/70 mb-1.5">
                      Capacità
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={30}
                      value={formData.capacity}
                      onChange={e => setFormData({ ...formData, capacity: parseInt(e.target.value) || 1 })}
                      className="w-full px-4 py-3 bg-ivory border border-borderlight rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blush/50 focus:border-blush transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-charcoal/70 mb-1.5">
                      Forma
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {([
                        { value: 'round', label: 'Rotondo', icon: '○' },
                        { value: 'rectangular', label: 'Rettangolare', icon: '▭' },
                        { value: 'head', label: 'Imperiale', icon: '▬' },
                      ] as const).map(shape => (
                        <button
                          key={shape.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, shape: shape.value })}
                          className={`p-3 rounded-xl border text-center transition-all duration-200 ${
                            formData.shape === shape.value
                              ? 'border-sage bg-sage/10 text-sage-dark'
                              : 'border-borderlight bg-ivory text-charcoal/50 hover:border-sage/30'
                          }`}
                        >
                          <div className="text-lg mb-1">{shape.icon}</div>
                          <div className="text-xs">{shape.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsFormOpen(false)}
                      className="flex-1 py-3 border border-borderlight rounded-full text-sm font-medium text-charcoal/70 hover:bg-ivory transition-colors"
                    >
                      Annulla
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-3 bg-sage hover:bg-sage-dark text-white rounded-full text-sm font-medium transition-all duration-300 hover:shadow-medium active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          Salva
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
