import { useState } from 'react'
import '../styles/login.css'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { signup } from '../firebase/firestoreFunctions'
import { useNavigate } from 'react-router-dom'
import { getErrorMessage } from '../utils/error'

export default function SignupComponent() {
  const [ showPassword, setShowPassword] = useState(false)
  const [ email, setEmail] = useState('')
  const [ username, setUsername] = useState('')
  const [ password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSignup = async () => {
    setError('')
    try {
      await signup(email, password, username)
      navigate('/recommendation-list')
    } catch (e) {
      setError(getErrorMessage(e));
    }
  }

  return (
    <div className="login-box">
      <input type="text" placeholder="Email" className="login-input" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="text" placeholder="Username" className="login-input" value={username} onChange={(e) => setUsername(e.target.value)} />
      <div className="password-wrapper">
        <input type={showPassword ? 'text' : 'password'} placeholder="Password" className="login-input" value={password} onChange={(e) => setPassword(e.target.value)}/>
        <button className="password-toggle">
          {showPassword ? <AiOutlineEyeInvisible onClick={() => setShowPassword(false)} /> : <AiOutlineEye onClick={() => setShowPassword(true)} />}
        </button>
      </div>
      {error && (
        <div style={{ color: 'red', fontSize: '0.85em', marginTop: 16, textAlign: 'left' }}>
          {error}
        </div>
      )}
      <button className="login-button" onClick={handleSignup}>Signup</button>
    </div>
  )
}

