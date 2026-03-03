import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Graph from './pages/Graph.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Profile from './pages/Profile.tsx'
import Home from './pages/Home.tsx'

const queryClient = new QueryClient()

const router = createBrowserRouter([
  { 
    path: '/',
    element: <Home />
  },
  {
    path: '/profile',
    element: <Profile />
  },
  {
    path: '/graph',
    element: <Graph />
  }
])


createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  // </StrictMode>,
)
