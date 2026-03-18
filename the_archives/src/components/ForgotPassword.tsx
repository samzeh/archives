import { useState } from 'react'
import '../styles/login.css'
import { resetPassword } from '../firebase/firestoreFunctions'
import { getErrorMessage } from '../utils/error'

interface DefaultHomeComponentsProps {
  setSelectedOption: React.Dispatch<React.SetStateAction<"login" | "signup" | "guest" | "forgot_password" | null>>
}

export default function ForgotPassword({ setSelectedOption }: DefaultHomeComponentsProps) {
  const [ email, setEmail ] = useState('')
  const [ error, setError ] = useState('')

  const handleResetPassword = async () => {
    setError('')
    try {
      await resetPassword(email)
      setSelectedOption("login")
    } catch (e) {
      setError(getErrorMessage(e))
    }
  }
  return (
    <div className="login-box">
      <input type="text" placeholder="Email" className="login-input" value={email} onChange={(e) => setEmail(e.target.value)} />
      {error && (
        <div style={{ color: 'red', fontSize: '0.85em', marginLeft: -5, marginTop: 16, textAlign: 'left' }}>
          {error}
        </div>
      )}
      <button className="login-button" onClick={handleResetPassword}>
        Reset Password
      </button>
    </div>
  )
}

