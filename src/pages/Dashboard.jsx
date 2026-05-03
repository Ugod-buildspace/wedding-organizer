import { useAuth } from '../contexts/AuthContext'

export default function Dashboard() {
  const { user } = useAuth()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p className="text-gray-600">Benvenuto, {user?.email}!</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Totale invitati</h2>
          <p className="text-3xl font-bold mt-2">—</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Confermati</h2>
          <p className="text-3xl font-bold mt-2">—</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Tavoli</h2>
          <p className="text-3xl font-bold mt-2">—</p>
        </div>
      </div>
    </div>
  )
}
