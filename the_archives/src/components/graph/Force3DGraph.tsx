import { useRef, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import ForceGraph3D from '3d-force-graph'
import LoadingOverlay from '../ui/LoadingOverlay'

interface ForceGraph3DInstance {
  _destructor?: () => void
}

export interface NodeObject {
  id: number
  label: string
  neighbors?: NodeObject[]
  links?: LinkObject[]
  x: number
  y: number
  z: number
}

interface LinkObject {
  source: number
  target: number
}


const fetchGraphData = async(book_id: number) => {
  const response = await fetch(`/recommendation-graph/${book_id}`)
  return response.json()
}

export default function Force3DGraph(props: { 
  onNodeClick?: (node: NodeObject) => void, 
  onDismiss?: () => void, 
  cardVisible?: boolean,
  liked_book_id?: number,
  onGraphDataReady?: (nodes: NodeObject[]) => void,
  onLoaded?: () => void
}) {

  const containerRef = useRef<HTMLDivElement | null>(null)
  const graphRef = useRef<ForceGraph3DInstance | null>(null)
  const cardVisibleRef = useRef(props.cardVisible)

  useEffect(() => {
    cardVisibleRef.current = props.cardVisible
  }, [props.cardVisible])

  const {data: graphDataInfo, isLoading } = useQuery({
    queryKey: ["liked_books", props.liked_book_id],
    queryFn: () => fetchGraphData(props.liked_book_id as number),
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    if (!containerRef.current) return

    const graph: ForceGraph3DInstance = new ForceGraph3D(containerRef.current)
      .backgroundColor('#FFF8EE')
      .nodeRelSize(8)
      .nodeLabel('label')
      .linkDirectionalParticleWidth(4)
      // @ts-ignore
      .nodeColor((node: NodeObject) => node.id === 0? '#D652D9' : '#5AA4FF')

    graphRef.current = graph

    const highlightNodes = new Set();
    const highlightLinks = new Set();
    let hoverNode: NodeObject | null = null;
    let selectedNode: NodeObject | null = null;

    function updateHighlight() {
      // @ts-ignore
      graph.nodeColor((node: NodeObject) => {
        if (highlightNodes.has(node)) {
          if (node === hoverNode) {
            if (node.id === 0) {
              return 'rgb(255,0,247,1)'; 
            } else {
              return 'rgb(255,0,0,1)';
            }
          } else {
            return '#FE9955'; 
          }
        } else {
          if (node.id === 0) {
            return '#D652D9';
          } else {
            return '#5AA4FF';
          }
        }
      }
      )
      graph.linkWidth((link: LinkObject) =>
        highlightLinks.has(link) ? 4 : 1
      )
      graph.linkDirectionalParticles((link: LinkObject) => 
        highlightLinks.has(link) ? 4 : 0
      )
      graph.linkColor(link => '#94836D')
    }

    function highlightNode(node: NodeObject | null) {
      highlightNodes.clear();
      highlightLinks.clear();

      if (node) {
        highlightNodes.add(node);
        node.neighbors?.forEach(neighbor => highlightNodes.add(neighbor));
        node.links?.forEach(link => highlightLinks.add(link));
      }

      hoverNode = node;
      updateHighlight();
    }

    // @ts-ignore
    graph.onNodeHover((node: NodeObject | null) => {
      if (!selectedNode) {
        highlightNode(node);
      }
    })
    // @ts-ignore
    graph.onLinkHover((link: LinkObject | null) => {
      if (!selectedNode) {
        highlightNodes.clear()
        highlightLinks.clear()
        if (link) {
          highlightLinks.add(link)
          highlightNodes.add(link.source)
          highlightNodes.add(link.target)
        }
        updateHighlight()
      }
    })
    // @ts-ignore
    graph.onNodeClick((node: NodeObject) => {
      selectedNode = node

      props.onNodeClick?.(node)

      const distance = 100
      const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z)
      const newPos = {
        x: node.x * distRatio,
        y: node.y * distRatio,
        z: node.z * distRatio
      }
      const lookAt = { x: node.x, y: node.y, z: node.z }

      // @ts-ignore
      graph.cameraPosition(newPos, lookAt, 2200)
      highlightNode(node)
    })

    // @ts-ignore
    graph.onBackgroundClick(() => {
      selectedNode = null
      highlightNode(null)
      props.onDismiss?.()
    })

    const handleWheel = () => {
      if (cardVisibleRef.current) {
        props.onDismiss?.()
      }
    }
    containerRef.current?.addEventListener('wheel', handleWheel, { passive: true })

    return () => {
      containerRef.current?.removeEventListener('wheel', handleWheel)
      graph?._destructor?.()
    }
  }, [])

  useEffect(() => {
    if (!graphRef.current) return
    if (!graphDataInfo?.nodes || !graphDataInfo?.links) return

    const nodes_list = graphDataInfo.nodes
    const links_list = graphDataInfo.links

    props.onGraphDataReady?.(graphDataInfo.nodes)
    props.onLoaded?.()
    console.log(nodes_list)

    const graphData = {
      nodes: nodes_list.map((n: NodeObject) => ({ ...n, neighbors: undefined, links: undefined })),
      links: links_list.map((l: LinkObject) => ({ ...l }))
    }

    graphData.links.forEach(link => {
      const a: NodeObject = graphData.nodes[link.source];
      const b: NodeObject = graphData.nodes[link.target];
      if (!a.neighbors) a.neighbors = []; // check to see if node object has neighbors array, if not create one
      if (!b.neighbors) b.neighbors = [];
      a.neighbors.push(b); // add neighbors
      b.neighbors.push(a);

      if (!a.links) a.links = []; // check to see if node object has linnks array, if not create them
      if (!b.links) b.links = [];
      a.links.push(link); // push the link object (ex. { "source": 0, "target": 1 }) into the links array of the node object
      b.links.push(link);
    })
    
    // @ts-ignore
    graphRef.current.graphData(graphData)

  }, [graphDataInfo, props.liked_book_id])

return (
  <div style={{ width: '100%', height: '100%', position: 'relative' }}>
    {isLoading && <LoadingOverlay />}
    <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
  </div>
)
}