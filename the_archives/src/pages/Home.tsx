import React, { useState } from 'react'
import Force3DGraph from '../components/Force3DGraph.tsx'
import HomeComponent from '../components/HomeComponent.tsx'
import '../styles/login.css'

const Home = () => {

  const [graphLoaded, setGraphLoaded] = useState(false)

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
