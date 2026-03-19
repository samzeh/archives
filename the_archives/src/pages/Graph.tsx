import '../styles/Home.css'
import { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import DetailCard from '../components/graph/detailCard'
import ExpandedDetailCard from '../components/graph/ExpandedDetailCard'
import Force3DGraph from '../components/graph/Force3DGraph'
import type { NodeObject } from '../components/graph/Force3DGraph'
import SearchBar from '../components/ui/SearchBar'
import ProfileButton from '../components/profile/ProfileButton'
import { useNavigate} from 'react-router-dom'
import { getCurrentUserId, logout } from '../firebase/firestoreFunctions'

function Graph() {
  const [selectedNode, setSelectedNode] = useState<NodeObject | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [likedBookId, setLikedBookId] = useState<number | undefined>(()=> {
    const stored = localStorage.getItem('likedBookId')
    return stored ? parseInt(stored) : undefined
  })
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [user] = useState<string | null>(() => getCurrentUserId())

  const [nodesById, setNodesById] = useState<Map<number, NodeObject>>(new Map())

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const profileModalRef = useRef<HTMLDivElement>(null)

  const navigate = useNavigate()
  const goToProfile = () => {
    navigate('/profile-page')
  }

  const handleSignOut = async () => {
    await logout()
    navigate('/')
  }

  useEffect(()=> {
    if (likedBookId) {
      localStorage.setItem('likedBookId', likedBookId.toString())
    }
  }, [likedBookId])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileModalRef.current && !profileModalRef.current.contains(e.target as Node)) {
        setShowProfileModal(false)
      }
    }

    if (showProfileModal) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showProfileModal])

  return (
    <>
      <Force3DGraph
        key={likedBookId}
        cardVisible={!!selectedNode}
        onNodeClick={(node) => {
          setSelectedNode(null)
          setIsExpanded(false)
          if (timerRef.current) clearTimeout(timerRef.current)
          timerRef.current = setTimeout(() => setSelectedNode(node), 1800)
        }}
        onDismiss={() => {
          if (timerRef.current) clearTimeout(timerRef.current)
          setSelectedNode(null)
          setIsExpanded(false)
        }}
        liked_book_id={likedBookId ?? 1}

        onGraphDataReady={(nodes) => {
          setNodesById(new Map(nodes.map(node => [node.id, node])))
        }}
      />

      <AnimatePresence>
        {selectedNode && (
          <motion.div
            key="card-wrapper"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="card-wrapper"
          >
            {!isExpanded ? (
              // @ts-ignore
              <DetailCard key="collapsed" onExpand={() => setIsExpanded(true)} bookInfo={nodesById.get(selectedNode.id) || null} />
            ) : (
              // @ts-ignore
              <ExpandedDetailCard key="expanded" onCollapse={() => setIsExpanded(false)} bookInfo={nodesById.get(selectedNode.id) || null}/>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="footer-bar">
        <SearchBar 
          handleSearch={(id: number) => setLikedBookId(id)}
        />
        <div ref={profileModalRef} style={{ position: 'relative', flexShrink: 0 }}>
          <ProfileButton onClick={() => setShowProfileModal((v) => !v)} />
          <AnimatePresence>
            {showProfileModal && (
              <motion.div
                className="profile-modal"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.17 }}
              >
              {user ? (
                <>
                  <p onClick={goToProfile}>profile</p>
                  <hr />
                  <p className="danger" onClick={handleSignOut}>log out</p>
                </>
              ) : (
                <p onClick={() => navigate('/')}>
                  log in
                </p>
              )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  )
}

export default Graph
