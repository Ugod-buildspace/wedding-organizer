export default function GuestTable({ guests, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto bg-white shadow rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invito</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RSVP</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Azioni</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {guests.map(guest => (
            <tr key={guest.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="font-medium text-gray-900">{guest.full_name}</div>
                {guest.plus_one && <div className="text-sm text-gray-500">+1: {guest.plus_one_name || 'Sconosciuto'}</div>}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{guest.email || '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${guest.invitation_status === 'accepted' ? 'bg-green-100 text-green-800' : 
                    guest.invitation_status === 'declined' ? 'bg-red-100 text-red-800' : 
                    'bg-yellow-100 text-yellow-800'}`}>
                  {guest.invitation_status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${guest.rsvp_status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                    guest.rsvp_status === 'declined' ? 'bg-red-100 text-red-800' : 
                    'bg-gray-100 text-gray-800'}`}>
                  {guest.rsvp_status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button onClick={() => onEdit(guest)} className="text-blue-600 hover:text-blue-900 mr-4">Modifica</button>
                <button onClick={() => onDelete(guest.id)} className="text-red-600 hover:text-red-900">Elimina</button>
              </td>
            </tr>
          ))}
          {guests.length === 0 && (
            <tr>
              <td colSpan="5" className="px-6 py-4 text-center text-gray-500">Nessun invitato presente.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
