import { motion } from 'framer-motion'
import { Pencil, Trash2, UserPlus, Utensils, Mail, Phone, LayoutGrid } from 'lucide-react'
import type { Guest } from '../hooks/useGuests'

interface GuestTableProps {
  guests: Guest[]
  onEdit: (guest: Guest) => void
  onDelete: (id: string) => void
}

function StatusBadge({ status }: { status: Guest['rsvp_status'] }) {
  const styles = {
    confirmed: 'bg-blush/30 text-rose-dark',
    pending: 'bg-pending/15 text-pending',
    declined: 'bg-decline/15 text-decline',
    no_response: 'bg-pending/15 text-pending',
  }
  const labels = {
    confirmed: 'Confermato',
    pending: 'In attesa',
    declined: 'Rifiutato',
    no_response: 'Nessuna risposta',
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  )
}

export default function GuestTable({ guests, onEdit, onDelete }: GuestTableProps) {
  if (guests.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-subtle p-16 text-center">
        <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
          <Utensils className="w-8 h-8 text-gold" />
        </div>
        <h3 className="font-display text-xl text-charcoal mb-2">
          Nessun ospite ancora
        </h3>
        <p className="text-charcoal/50 text-sm max-w-xs mx-auto">
          Aggiungi il tuo primo ospite per iniziare a organizzare il tuo matrimonio
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-subtle overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-sage-light/50">
              <th className="text-left px-6 py-4 text-xs font-semibold text-sage-dark uppercase tracking-wider">
                Ospite
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-sage-dark uppercase tracking-wider">
                Contatti
              </th>
              <th className="text-center px-6 py-4 text-xs font-semibold text-sage-dark uppercase tracking-wider">
                +1
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-sage-dark uppercase tracking-wider">
                Stato RSVP
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-sage-dark uppercase tracking-wider">
                Tavolo
              </th>
              <th className="text-right px-6 py-4 text-xs font-semibold text-sage-dark uppercase tracking-wider">
                Azioni
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-borderlight/50">
            {guests.map((guest, index) => (
              <motion.tr
                key={guest.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group hover:bg-sage-light/30 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-sage/15 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-sage-dark">
                        {guest.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-charcoal">{guest.full_name}</p>
                      {guest.dietary_restrictions && (
                        <p className="text-xs text-decline mt-0.5">{guest.dietary_restrictions}</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    {guest.email && (
                      <div className="flex items-center gap-1.5 text-xs text-charcoal/60">
                        <Mail className="w-3 h-3" />
                        <span className="truncate max-w-[140px]">{guest.email}</span>
                      </div>
                    )}
                    {guest.phone && (
                      <div className="flex items-center gap-1.5 text-xs text-charcoal/60">
                        <Phone className="w-3 h-3" />
                        <span>{guest.phone}</span>
                      </div>
                    )}
                    {!guest.email && !guest.phone && (
                      <span className="text-xs text-charcoal/30">—</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  {guest.plus_one ? (
                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-blush/20 rounded-lg">
                      <UserPlus className="w-3.5 h-3.5 text-rose" />
                      <span className="text-xs text-rose-dark font-medium">
                        {guest.plus_one_name || 'Sì'}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-charcoal/30">—</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={guest.rsvp_status} />
                </td>
                <td className="px-6 py-4">
                  {guest.table_name ? (
                    <div className="flex items-center gap-1.5 text-sm text-charcoal/70">
                      <LayoutGrid className="w-3.5 h-3.5 text-gold" />
                      <span>{guest.table_name}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-charcoal/30">Non assegnato</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEdit(guest)}
                      className="w-8 h-8 rounded-lg hover:bg-gold/10 flex items-center justify-center transition-colors"
                      title="Modifica"
                    >
                      <Pencil className="w-4 h-4 text-gold" />
                    </button>
                    <button
                      onClick={() => onDelete(guest.id)}
                      className="w-8 h-8 rounded-lg hover:bg-decline/10 flex items-center justify-center transition-colors"
                      title="Elimina"
                    >
                      <Trash2 className="w-4 h-4 text-decline" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
