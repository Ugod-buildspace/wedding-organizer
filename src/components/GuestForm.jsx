import { useState, useEffect } from 'react'

export default function GuestForm({ initialData, onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    plus_one: false,
    plus_one_name: '',
    invitation_status: 'pending',
    rsvp_status: 'pending',
    dietary_restrictions: '',
    notes: ''
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        full_name: initialData.full_name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        plus_one: initialData.plus_one || false,
        plus_one_name: initialData.plus_one_name || '',
        invitation_status: initialData.invitation_status || 'pending',
        rsvp_status: initialData.rsvp_status || 'pending',
        dietary_restrictions: initialData.dietary_restrictions || '',
        notes: initialData.notes || ''
      })
    }
  }, [initialData])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Prepare data to send
    const data = { ...formData }
    if (!data.plus_one) data.plus_one_name = null
    onSubmit(data)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl my-8">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">{initialData ? 'Modifica Ospite' : 'Nuovo Ospite'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome completo *</label>
              <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} required className="mt-1 w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Telefono</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2" />
            </div>
            
            <div className="flex items-center mt-6">
              <input type="checkbox" name="plus_one" id="plus_one" checked={formData.plus_one} onChange={handleChange} className="h-4 w-4 text-blue-600 rounded border-gray-300" />
              <label htmlFor="plus_one" className="ml-2 block text-sm text-gray-900">+1 (Accompagnatore)</label>
            </div>
            
            {formData.plus_one && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Nome accompagnatore</label>
                <input type="text" name="plus_one_name" value={formData.plus_one_name} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2" />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">Stato Invito</label>
              <select name="invitation_status" value={formData.invitation_status} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2 bg-white">
                <option value="pending">In attesa di invio</option>
                <option value="sent">Inviato</option>
                <option value="opened">Aperto</option>
                <option value="accepted">Accettato</option>
                <option value="declined">Declinato</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">RSVP</label>
              <select name="rsvp_status" value={formData.rsvp_status} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2 bg-white">
                <option value="pending">In attesa</option>
                <option value="confirmed">Confermato</option>
                <option value="declined">Declinato</option>
                <option value="no_response">Nessuna risposta</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Restrizioni alimentari</label>
              <textarea name="dietary_restrictions" value={formData.dietary_restrictions} onChange={handleChange} rows="2" className="mt-1 w-full border rounded px-3 py-2"></textarea>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Note</label>
              <textarea name="notes" value={formData.notes} onChange={handleChange} rows="2" className="mt-1 w-full border rounded px-3 py-2"></textarea>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50">Annulla</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Salva</button>
          </div>
        </form>
      </div>
    </div>
  )
}
