import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, SlidersHorizontal, Flower2 } from 'lucide-react'
import { useGuests } from '../hooks/useGuests'
import GuestTable from '../components/GuestTable'
import GuestForm from '../components/GuestForm'

const RSVP_FILTER_OPTIONS = [
  { value: 'all', label: 'Tutti gli stati' },
  { value: 'confirmed', label: 'Confermati' },
  { value: 'pending', label: 'In attesa' },
  { value: 'declined', label: 'Rifiutati' },
  { value: 'no_response', label: 'Nessuna risposta' },
]

const TABLE_FILTER_OPTIONS = [
  { value: 'all', label: 'Tutti' },
  { value: 'assigned', label: 'Assegnati' },
  { value: 'unassigned', label: 'Non assegnati' },
]

export default function Guests() {
  const { guests, loading, error, addGuest, updateGuest, deleteGuest } = useGuests()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingGuest, setEditingGuest] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [search, setSearch] = useState('')
  const [rsvpFilter, setRsvpFilter] = useState('all')
  const [tableFilter, setTableFilter] = useState('all')

  const handleOpenModal = (guest: any = null) => {
    setEditingGuest(guest)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingGuest(null)
  }

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true)
    try {
      if (editingGuest) {
        await updateGuest(editingGuest.id, data)
      } else {
        await addGuest(data)
      }
      handleCloseModal()
    } catch (err: any) {
      alert('Errore durante il salvataggio: ' + err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Sei sicuro di voler eliminare questo ospite?')) {
      try {
        await deleteGuest(id)
      } catch (err: any) {
        alert('Errore durante l\'eliminazione: ' + err.message)
      }
    }
  }

  const filteredGuests = useMemo(() => {
    return guests.filter(guest => {
      const matchesSearch =
        guest.full_name.toLowerCase().includes(search.toLowerCase()) ||
        (guest.email?.toLowerCase() || '').includes(search.toLowerCase()) ||
        (guest.phone || '').includes(search)

      const matchesRsvp = rsvpFilter === 'all' || guest.rsvp_status === rsvpFilter
      const matchesTable =
        tableFilter === 'all' ||
        (tableFilter === 'assigned' && guest.table_id) ||
        (tableFilter === 'unassigned' && !guest.table_id)

      return matchesSearch && matchesRsvp && matchesTable
    })
  }, [guests, search, rsvpFilter, tableFilter])

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
          <h1 className="font-display text-3xl text-charcoal">Gestione Invitati</h1>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-sage hover:bg-sage-dark text-white rounded-full text-sm font-medium transition-all duration-300 hover:shadow-medium active:scale-[0.98] self-start"
        >
          <Plus className="w-4 h-4" />
          Nuovo ospite
        </button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-white rounded-2xl shadow-subtle p-4 mb-6 flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/30" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cerca per nome, email o telefono..."
            className="w-full pl-10 pr-4 py-2.5 bg-ivory border border-borderlight rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blush/50 focus:border-blush transition-colors"
          />
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/30" />
            <select
              value={rsvpFilter}
              onChange={e => setRsvpFilter(e.target.value)}
              className="pl-9 pr-8 py-2.5 bg-ivory border border-borderlight rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blush/50 focus:border-blush transition-colors appearance-none cursor-pointer"
            >
              {RSVP_FILTER_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <select
            value={tableFilter}
            onChange={e => setTableFilter(e.target.value)}
            className="px-4 py-2.5 bg-ivory border border-borderlight rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blush/50 focus:border-blush transition-colors appearance-none cursor-pointer"
          >
            {TABLE_FILTER_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Results count */}
      <div className="mb-4 text-sm text-charcoal/50">
        {filteredGuests.length} {filteredGuests.length === 1 ? 'ospite trovato' : 'ospiti trovati'}
        {search && ` per "${search}"`}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-decline/10 text-decline p-4 rounded-xl mb-4 text-sm">
          {error}
        </div>
      )}

      {/* Table */}
      {loading && guests.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-subtle p-16 text-center">
          <div className="w-8 h-8 border-2 border-sage/30 border-t-sage rounded-full animate-spin mx-auto" />
          <p className="text-charcoal/50 mt-4 text-sm">Caricamento ospiti...</p>
        </div>
      ) : (
        <GuestTable guests={filteredGuests} onEdit={handleOpenModal} onDelete={handleDelete} />
      )}

      {/* Modal */}
      {isModalOpen && (
        <GuestForm
          initialData={editingGuest}
          onSubmit={handleSubmit}
          onClose={handleCloseModal}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  )
}
