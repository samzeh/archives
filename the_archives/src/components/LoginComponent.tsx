import React, { useState } from 'react'
import '../styles/login.css'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { login } from '../firebase/firestoreFunctions'
import { useNavigate } from 'react-router-dom'

export default function LoginComponent() {
  const [ showPassword, setShowPassword] = useState(false)
  const [ username, setUsername] = useState('')
  const [ password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()


  const handleLogin = async () => {
    setError('')
    try {
      await login(username, password)
      navigate('/recommendation-graph')
    } catch (err) {
      setError(err.message)
    }
  }
  return (
    <div className="login-box">
      <input type="text" placeholder="Username" className="login-input" value={username} onChange={(e) => setUsername(e.target.value)} />
      <div className="password-wrapper">
        <input type={showPassword ? 'text' : 'password'} placeholder="Password" className="login-input" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="password-toggle">
          {showPassword ? <AiOutlineEyeInvisible onClick={() => setShowPassword(false)} /> : <AiOutlineEye onClick={() => setShowPassword(true)} />}
        </button>
      </div>
      {error && (
        <div style={{ color: 'red', fontSize: '0.85em', marginTop: 16, textAlign: 'left' }}>
          {error}
        </div>
      )}
      <button className="login-button"> Forgot Password</button>
      <button className="login-button" onClick={handleLogin}>
        Login
      </button>
    </div>
  )
}

