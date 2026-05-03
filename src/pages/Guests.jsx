import { useState } from 'react'
import { useGuests } from '../hooks/useGuests'
import GuestTable from '../components/GuestTable'
import GuestForm from '../components/GuestForm'

export default function Guests() {
  const { guests, loading, error, addGuest, updateGuest, deleteGuest } = useGuests()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingGuest, setEditingGuest] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleOpenModal = (guest = null) => {
    setEditingGuest(guest)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingGuest(null)
  }

  const handleSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      if (editingGuest) {
        await updateGuest(editingGuest.id, data)
      } else {
        await addGuest(data)
      }
      handleCloseModal()
    } catch (err) {
      alert("Errore durante il salvataggio: " + err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("Sei sicuro di voler eliminare questo ospite?")) {
      try {
        await deleteGuest(id)
      } catch (err) {
        alert("Errore durante l'eliminazione: " + err.message)
      }
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestione Invitati</h1>
        <button 
          onClick={() => handleOpenModal()} 
          className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
        >
          + Nuovo ospite
        </button>
      </div>

      {error && <div className="bg-red-50 text-red-500 p-4 rounded mb-4">{error}</div>}

      {loading && guests.length === 0 ? (
        <div className="text-center py-8 text-gray-500">Caricamento ospiti...</div>
      ) : (
        <GuestTable 
          guests={guests} 
          onEdit={handleOpenModal} 
          onDelete={handleDelete} 
        />
      )}

      {isModalOpen && (
        <GuestForm 
          initialData={editingGuest} 
          onSubmit={handleSubmit} 
          onClose={handleCloseModal} 
        />
      )}
    </div>
  )
}
