export default function Guests() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Gestione Invitati</h1>
      <p className="text-gray-600">(prossima sessione)</p>
      <button className="mt-4 px-4 py-2 bg-gray-300 text-gray-500 rounded cursor-not-allowed" disabled>
        Aggiungi invitato
      </button>
    </div>
  )
}
