import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Flower2, Save } from 'lucide-react'
import type { Guest } from '../hooks/useGuests'

interface GuestFormProps {
  initialData: Guest | null
  onSubmit: (data: Partial<Guest>) => Promise<void>
  onClose: () => void
  isSubmitting: boolean
}

const RSVP_OPTIONS = [
  { value: 'pending', label: 'In attesa' },
  { value: 'confirmed', label: 'Confermato' },
  { value: 'declined', label: 'Rifiutato' },
  { value: 'no_response', label: 'Nessuna risposta' },
]

const INVITATION_OPTIONS = [
  { value: 'pending', label: 'Da inviare' },
  { value: 'sent', label: 'Inviata' },
  { value: 'opened', label: 'Aperta' },
  { value: 'accepted', label: 'Accettata' },
  { value: 'declined', label: 'Rifiutata' },
]

export default function GuestForm({ initialData, onSubmit, onClose, isSubmitting }: GuestFormProps) {
  const [formData, setFormData] = useState<Partial<Guest>>({
    full_name: '',
    email: '',
    phone: '',
    plus_one: false,
    plus_one_name: '',
    invitation_status: 'pending',
    rsvp_status: 'pending',
    dietary_restrictions: '',
    notes: '',
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        full_name: initialData.full_name,
        email: initialData.email || '',
        phone: initialData.phone || '',
        plus_one: initialData.plus_one,
        plus_one_name: initialData.plus_one_name || '',
        invitation_status: initialData.invitation_status,
        rsvp_status: initialData.rsvp_status,
        dietary_restrictions: initialData.dietary_restrictions || '',
        notes: initialData.notes || '',
      })
    }
  }, [initialData])

  const handleChange = (field: keyof Guest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-charcoal/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white rounded-3xl shadow-elevated w-full max-w-lg max-h-[90vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white rounded-t-3xl px-8 pt-8 pb-4 z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Flower2 className="w-6 h-6 text-sage" />
                <h2 className="font-display text-2xl text-charcoal">
                  {initialData ? 'Modifica ospite' : 'Nuovo ospite'}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-ivory hover:bg-sage/10 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-charcoal/60" />
              </button>
            </div>
            <div className="mt-4 h-px bg-borderlight" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-charcoal/70 mb-1.5">
                  Nome completo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={e => handleChange('full_name', e.target.value)}
                  className="w-full px-4 py-3 bg-ivory border border-borderlight rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blush/50 focus:border-blush transition-colors"
                  placeholder="Mario Rossi"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal/70 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={e => handleChange('email', e.target.value)}
                  className="w-full px-4 py-3 bg-ivory border border-borderlight rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blush/50 focus:border-blush transition-colors"
                  placeholder="email@esempio.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal/70 mb-1.5">
                  Telefono
                </label>
                <input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={e => handleChange('phone', e.target.value)}
                  className="w-full px-4 py-3 bg-ivory border border-borderlight rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blush/50 focus:border-blush transition-colors"
                  placeholder="+39 123 456 7890"
                />
              </div>
            </div>

            {/* Plus one */}
            <div className="bg-ivory rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <input
                  type="checkbox"
                  id="plus_one"
                  checked={formData.plus_one}
                  onChange={e => handleChange('plus_one', e.target.checked)}
                  className="w-4 h-4 rounded border-borderlight text-sage focus:ring-sage/20"
                />
                <label htmlFor="plus_one" className="text-sm font-medium text-charcoal">
                  Accompagnatore (+1)
                </label>
              </div>
              <AnimatePresence>
                {formData.plus_one && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <input
                      type="text"
                      value={formData.plus_one_name || ''}
                      onChange={e => handleChange('plus_one_name', e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-borderlight rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blush/50 focus:border-blush transition-colors"
                      placeholder="Nome accompagnatore"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-charcoal/70 mb-1.5">
                  Stato invito
                </label>
                <select
                  value={formData.invitation_status}
                  onChange={e => handleChange('invitation_status', e.target.value)}
                  className="w-full px-4 py-3 bg-ivory border border-borderlight rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blush/50 focus:border-blush transition-colors"
                >
                  {INVITATION_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal/70 mb-1.5">
                  Stato RSVP
                </label>
                <select
                  value={formData.rsvp_status}
                  onChange={e => handleChange('rsvp_status', e.target.value)}
                  className="w-full px-4 py-3 bg-ivory border border-borderlight rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blush/50 focus:border-blush transition-colors"
                >
                  {RSVP_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal/70 mb-1.5">
                Restrizioni alimentari
              </label>
              <input
                type="text"
                value={formData.dietary_restrictions || ''}
                onChange={e => handleChange('dietary_restrictions', e.target.value)}
                className="w-full px-4 py-3 bg-ivory border border-borderlight rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blush/50 focus:border-blush transition-colors"
                placeholder="Allergie, vegetariani, celiaci..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal/70 mb-1.5">
                Note
              </label>
              <textarea
                value={formData.notes || ''}
                onChange={e => handleChange('notes', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-ivory border border-borderlight rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blush/50 focus:border-blush transition-colors resize-none"
                placeholder="Note aggiuntive..."
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
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
                    <Save className="w-4 h-4" />
                    Salva
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
