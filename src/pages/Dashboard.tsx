import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Flower2, Users, Heart, Clock, LayoutGrid, Plus, UtensilsCrossed } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useStats } from '../hooks/useStats'

function AnimatedCounter({ value, duration = 1500 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * value))
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [value, duration])

  return <span>{count}</span>
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  delay,
}: {
  label: string
  value: number
  icon: any
  color: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.3 } }}
      className="bg-white rounded-2xl shadow-subtle hover:shadow-medium p-8 transition-shadow duration-300"
    >
      <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-5`}>
        <Icon className="w-6 h-6" />
      </div>
      <p className="text-4xl font-display text-charcoal mb-1">
        <AnimatedCounter value={value} />
      </p>
      <p className="text-sm text-charcoal/60 font-medium">{label}</p>
    </motion.div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const { totalGuests, confirmedGuests, pendingGuests, totalTables, loading } = useStats()

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mb-10"
      >
        <div className="flex items-center gap-3 mb-3">
          <Flower2 className="w-6 h-6 text-sage" />
          <h1 className="font-display text-3xl text-charcoal">
            Il tuo matrimonio
          </h1>
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-charcoal/60 text-base"
        >
          Bentornato, <span className="font-medium text-charcoal">{user?.email}</span>
        </motion.p>
      </motion.div>

      {/* Stats Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-2xl shadow-subtle p-8 animate-pulse">
              <div className="w-12 h-12 rounded-xl bg-sage-light mb-5" />
              <div className="h-10 bg-sage-light/50 rounded mb-2 w-16" />
              <div className="h-4 bg-sage-light/30 rounded w-24" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            label="Totale invitati"
            value={totalGuests}
            icon={Users}
            color="bg-sage/15 text-sage-dark"
            delay={0}
          />
          <StatCard
            label="Confermati"
            value={confirmedGuests}
            icon={Heart}
            color="bg-blush/40 text-rose-dark"
            delay={0.1}
          />
          <StatCard
            label="In attesa"
            value={pendingGuests}
            icon={Clock}
            color="bg-gold/15 text-gold"
            delay={0.2}
          />
          <StatCard
            label="Tavoli"
            value={totalTables}
            icon={LayoutGrid}
            color="bg-sage-light text-sage-dark"
            delay={0.3}
          />
        </div>
      )}

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-10"
      >
        <h3 className="font-display text-xl text-charcoal mb-6">Azioni rapide</h3>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/guests"
            className="inline-flex items-center gap-2 px-6 py-3 bg-sage hover:bg-sage-dark text-white rounded-full text-sm font-medium transition-all duration-300 hover:shadow-medium active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            Aggiungi ospite
          </Link>
          <Link
            to="/tables"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-borderlight hover:border-sage/30 text-charcoal rounded-full text-sm font-medium transition-all duration-300 hover:shadow-subtle active:scale-[0.98]"
          >
            <UtensilsCrossed className="w-4 h-4" />
            Gestisci tavoli
          </Link>
        </div>
      </motion.div>

      {/* Decorative footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="mt-16 flex items-center gap-4"
      >
        <div className="h-px flex-1 bg-borderlight" />
        <Flower2 className="w-5 h-5 text-gold/40" />
        <div className="h-px flex-1 bg-borderlight" />
      </motion.div>
    </div>
  )
}
