import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Flower2,
  LayoutDashboard,
  Users,
  UtensilsCrossed,
  LogOut,
  ChevronRight,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/guests', label: 'Invitati', icon: Users },
  { path: '/tables', label: 'Tavoli', icon: UtensilsCrossed },
]

export default function Layout() {
  const { user, signOut } = useAuth()
  const location = useLocation()

  return (
    <div className="flex min-h-screen bg-ivory">
      {/* Sidebar */}
      <aside className="w-64 bg-sage flex flex-col fixed h-full z-20">
        {/* Logo */}
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
              <Flower2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-display text-lg text-white leading-tight">
                Wedding
              </h1>
              <p className="text-xs text-white/70 leading-tight">Organizer</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-6 h-px bg-gold/30" />

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map(item => {
            const isActive = location.pathname === item.path ||
              (item.path !== '/' && location.pathname.startsWith(item.path))
            const Icon = item.icon
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive: navActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive || navActive
                      ? 'bg-white text-sage shadow-medium'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
                {(isActive) && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="ml-auto"
                  >
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </motion.div>
                )}
              </NavLink>
            )
          })}
        </nav>

        {/* User profile */}
        <div className="p-4">
          <div className="bg-white/10 rounded-xl p-4">
            <p className="text-xs text-white/60 mb-1">Loggato come</p>
            <p className="text-sm text-white font-medium truncate">{user?.email}</p>
            <button
              onClick={signOut}
              className="mt-3 flex items-center gap-2 text-xs text-white/70 hover:text-white transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Esci
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-64">
        <div className="p-10 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
