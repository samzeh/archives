import '../styles/Home.css'
import { useState, useRef } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import DetailCard from '../components/DetailCard'
import ExpandedDetailCard from '../components/ExpandedDetailCard'
import Force3DGraph from '../components/Force3DGraph'
import type { NodeObject } from '../components/Force3DGraph'
import SearchBar from '../components/SearchBar'
import ProfileButton from '../components/ProfileButton'
import { useNavigate} from 'react-router-dom'

function Home() {
  const [selectedNode, setSelectedNode] = useState<NodeObject | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [likedBookId, setLikedBookId] = useState<number | undefined>(undefined)
  const [nodesById, setNodesById] = useState<Map<number, NodeObject>>(new Map())

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const navigate = useNavigate()
  const goToProfile = () => {
    navigate('/profile')
  }

  return (
    <>
      <Force3DGraph
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
        liked_book_id={likedBookId}

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
            style={{ position: 'fixed', left: 200, top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}
          >
            {!isExpanded ? (
              <DetailCard key="collapsed" onExpand={() => setIsExpanded(true)} bookInfo={nodesById.get(selectedNode.id) || null} />
            ) : (
              <ExpandedDetailCard key="expanded" onCollapse={() => setIsExpanded(false)} bookInfo={nodesById.get(selectedNode.id) || null}/>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="footer-bar">
        <SearchBar 
          handleSearch={(id: number) => setLikedBookId(id)}
        />
        <ProfileButton onClick={goToProfile} />
      </div>
    </>
  )
}

export default Home
