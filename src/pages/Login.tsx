import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Flower2, Mail, Lock, Eye, EyeOff, ArrowRight, Heart } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn, signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isLogin) {
        const { error } = await signIn(email, password)
        if (error) throw error
      } else {
        const { error } = await signUp(email, password)
        if (error) throw error
      }
    } catch (err: any) {
      setError(err.message || 'Errore durante l\'autenticazione')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-ivory">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        {/* Subtle floral background pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232D2D2D' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md relative z-10"
        >
          <div className="bg-white rounded-3xl shadow-medium p-10">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-sage/10 mb-4">
                <Flower2 className="w-7 h-7 text-sage" />
              </div>
              <h1 className="font-display text-2xl text-charcoal tracking-tight">
                Wedding Organizer
              </h1>
              <p className="text-sm text-charcoal/50 mt-1">
                Gestisci il tuo giorno speciale
              </p>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={isLogin ? 'login' : 'signup'}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="font-display text-xl text-charcoal mb-6">
                  {isLogin ? 'Bentornato' : 'Crea il tuo account'}
                </h2>

                {error && (
                  <div className="bg-decline/10 text-decline text-sm p-3 rounded-lg mb-4">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-charcoal/70 mb-1.5">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/30" />
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        className="w-full pl-10 pr-4 py-3 bg-ivory border border-borderlight rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blush/50 focus:border-blush transition-colors"
                        placeholder="la-tua@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-charcoal/70 mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/30" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        minLength={6}
                        className="w-full pl-10 pr-11 py-3 bg-ivory border border-borderlight rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blush/50 focus:border-blush transition-colors"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-charcoal/30 hover:text-charcoal/50 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-sage hover:bg-sage-dark text-white rounded-full font-medium text-sm transition-all duration-300 hover:shadow-elevated active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        {isLogin ? 'Accedi' : 'Registrati'}
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            </AnimatePresence>

            <div className="mt-6 text-center">
              <button
                onClick={() => { setIsLogin(!isLogin); setError('') }}
                className="text-sm text-gold hover:text-sage-dark transition-colors font-medium"
              >
                {isLogin ? 'Non hai un account? Registrati' : 'Hai già un account? Accedi'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right side - Decorative */}
      <div className="hidden lg:flex flex-1 bg-sage/5 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="floral" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <circle cx="50" cy="50" r="30" fill="none" stroke="#8A9A8C" strokeWidth="0.5" opacity="0.3" />
                <circle cx="50" cy="50" r="15" fill="none" stroke="#8A9A8C" strokeWidth="0.5" opacity="0.2" />
                <path d="M50 20 Q65 35 50 50 Q35 35 50 20" fill="none" stroke="#8A9A8C" strokeWidth="0.5" opacity="0.2" />
                <path d="M50 80 Q65 65 50 50 Q35 65 50 80" fill="none" stroke="#8A9A8C" strokeWidth="0.5" opacity="0.2" />
                <path d="M20 50 Q35 35 50 50 Q35 65 20 50" fill="none" stroke="#8A9A8C" strokeWidth="0.5" opacity="0.2" />
                <path d="M80 50 Q65 35 50 50 Q65 65 80 50" fill="none" stroke="#8A9A8C" strokeWidth="0.5" opacity="0.2" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#floral)" />
          </svg>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-center relative z-10"
        >
          <Heart className="w-16 h-16 text-blush mx-auto mb-4" fill="currentColor" />
          <h2 className="font-display text-3xl text-charcoal mb-2">
            Il tuo giorno speciale
          </h2>
          <p className="text-charcoal/60 max-w-xs mx-auto">
            Organizza ospiti, tavoli e ogni dettaglio del tuo matrimonio in un unico posto elegante.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
