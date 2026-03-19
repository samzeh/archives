import { useState } from 'react'
import LoginComponent from './LoginComponent.tsx'
import SignupComponent from './SignupComponent.tsx'
import DefaultHomeComponents from './DefaultHomeComponents.tsx'
import ForgotPassword from './ForgotPassword.tsx'
import '../styles/login.css'


export default function HomeComponent() {
  const [selectedOption, setSelectedOption] = useState<"login" | "signup" | "guest" | "forgot_password" | null>(null)

  const handleWelcomeText = () => {
    setSelectedOption(null)
  }

  return (
    <div className = "home-box">
      <h1 className="welcome-text" onClick={handleWelcomeText}>the archives</h1>

      {selectedOption === null && <DefaultHomeComponents setSelectedOption={setSelectedOption} />}
      {selectedOption === "login" && <LoginComponent setSelectedOption={setSelectedOption} />}
      {selectedOption === "signup" && <SignupComponent />}
      {selectedOption === "forgot_password" && <ForgotPassword setSelectedOption={setSelectedOption} />}
    </div>
  )
}
