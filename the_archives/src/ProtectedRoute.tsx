import { Outlet, Navigate, useLocation } from "react-router-dom";
import { isLoggedIn } from "./firebase/firestoreFunctions";
import { useState, useEffect } from "react";
import LoadingOverlay from "./components/LoadingOverlay";

export default function ProtectedRoute() {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null)
  const [isGuest] = useState(() => {
    return localStorage.getItem('guest') === 'true'
  })
  const location = useLocation();

  useEffect(() => {
    if (isGuest) return

    const checkLogin = async () => {
      const loggedInStatus = await isLoggedIn()
      setLoggedIn(loggedInStatus)
    }

    checkLogin()
  }, [isGuest])

  if (loggedIn == null && !isGuest) 
    return <LoadingOverlay />

  if (isGuest) {
    const allowed = ["/", "/recommendation-list"];
    if (!allowed.includes(location.pathname)) {
      return <Navigate to="/" replace />
    }
  }

  return (loggedIn || isGuest) ? <Outlet /> : <Navigate to="/" />
}

