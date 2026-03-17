import { useState, useEffect } from 'react'
import Force3DGraph from '../components/Force3DGraph.tsx'
import HomeComponent from '../components/HomeComponent.tsx'
import { useNavigate } from 'react-router-dom'
import { isLoggedIn } from '../firebase/firestoreFunctions.ts'
import '../styles/login.css'
import loadingGif from '../assets/loading.gif'

const Home = () => {
  const navigate = useNavigate()
  const [graphLoaded, setGraphLoaded] = useState(false)
  const [ checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    isLoggedIn()
      .then((loggedIn) => {
        if (loggedIn) {
          navigate('/recommendation-list')
        } else {
          setCheckingAuth(false)
        }
      })
  }, [navigate])

  if (checkingAuth) 
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

  
  return (
    <div>
      <Force3DGraph
        cardVisible={false}
        onNodeClick={() => {}}
        onDismiss={() => {}}
        liked_book_id={1}
        onGraphDataReady={() => {}}
        onLoaded={() => setGraphLoaded(true)}
      />
      {graphLoaded && 
        <HomeComponent />
      }
      
    </div>
  )
}

export default Home
