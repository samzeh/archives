import React from 'react'
import '../styles/login.css'
import { useNavigate } from 'react-router-dom'

interface DefaultHomeComponentsProps {
  setSelectedOption: React.Dispatch<React.SetStateAction<"login" | "signup" | "guest" | "forgot_password" | null>>
}

export default function DefaultHomeComponents({ setSelectedOption }: DefaultHomeComponentsProps)  {
  const navigate = useNavigate()

  const handleLoginClick = () => {
    setSelectedOption("login")
  }

  const handleSignUpClick = () => {
    setSelectedOption("signup")
  }

  const handleGuestClick = () => {
    localStorage.setItem('guest', 'true')
    navigate('/recommendation-list')
  }

  return (
    <div className="action-links">
      <p onClick={handleLoginClick}>login</p>
      <p onClick={handleSignUpClick}>sign up</p>
      <p onClick={handleGuestClick}>guest</p>
    </div>      
  )
}

