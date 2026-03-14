import { Outlet, Navigate } from "react-router-dom";
import { isLoggedIn } from "./firebase/firestoreFunctions";
import { useState, useEffect } from "react";

export default function ProtectedRoute() {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null)

  useEffect(() => {
    (async () =>{
      const loggedInStatus = await isLoggedIn()
      setLoggedIn(loggedInStatus)
    })()
  }, [])

  if (loggedIn == null) return <div>Loading...</div>
  return loggedIn ? <Outlet /> : <Navigate to="/" />

}

