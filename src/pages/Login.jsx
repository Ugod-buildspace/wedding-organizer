import { useState } from 'react'
import LoginForm from '../components/LoginForm'
import SignupForm from '../components/SignupForm'

export default function Login() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex gap-4 mb-6 border-b">
          <button
            className={`pb-2 ${isLogin ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setIsLogin(true)}
          >
            Accedi
          </button>
          <button
            className={`pb-2 ${!isLogin ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setIsLogin(false)}
          >
            Registrati
          </button>
        </div>
        {isLogin ? <LoginForm /> : <SignupForm onSuccess={() => setIsLogin(true)} />}
      </div>
    </div>
  )
}
