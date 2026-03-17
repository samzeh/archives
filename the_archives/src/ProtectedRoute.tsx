import { Outlet, Navigate } from "react-router-dom";
import { isLoggedIn } from "./firebase/firestoreFunctions";
import { useState, useEffect } from "react";
import loadingGif from './assets/loading.gif'

export default function ProtectedRoute() {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null)

  useEffect(() => {
    (async () =>{
      const loggedInStatus = await isLoggedIn()
      setLoggedIn(loggedInStatus)
    })()
  }, [])

  if (loggedIn == null) 
    return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#44362d', fontSize: '1.5rem', zIndex: 10,
      flexDirection: 'column',
    }}>
      <img src={loadingGif} alt="Loading..." style={{ width: 300, height: 300 }} />
      <p> loading... </p>
    </div>
  )
  return loggedIn ? <Outlet /> : <Navigate to="/" />

}

