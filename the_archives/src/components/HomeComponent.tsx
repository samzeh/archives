import React from 'react'
import '../styles/login.css'
import LoginComponent from './LoginComponent.tsx'

export default function HomeComponent() {
  return (
    <div className = "home-box">
      <h1 className="welcome-text"> the archives</h1>
      {/* <div className="action-links">
        <p>login</p>
        <p>sign up</p>
        <p>guest</p>
      </div>       */}
      <LoginComponent />
    </div>
  )
}
