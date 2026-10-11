import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh } from 'three'

interface GeometricShapeProps {
  type?: 'box' | 'octahedron' | 'torus' | 'icosahedron'
  position?: [number, number, number]
  scale?: number
  color?: string
  wireframe?: boolean
  speed?: number
}

export default function GeometricShape({
  type = 'box',
  position = [0, 0, 0],
  scale = 1,
  color = '#8B5CF6',
  wireframe = true,
  speed = 0.5
}: GeometricShapeProps) {
  const meshRef = useRef<Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * speed
      meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.7
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed * 2) * 0.3
    }
  })

  const geometry = () => {
    switch (type) {
      case 'octahedron':
        return <octahedronGeometry args={[1, 0]} />
      case 'torus':
        return <torusGeometry args={[0.7, 0.3, 16, 32]} />
      case 'icosahedron':
        return <icosahedronGeometry args={[1, 0]} />
      default:
        return <boxGeometry args={[1, 1, 1]} />
    }
  }

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      {geometry()}
      <meshStandardMaterial 
        color={color} 
        wireframe={wireframe}
        transparent 
        opacity={0.5}
        roughness={0.1}
        metalness={0.9}
      />
    </mesh>
  )
}
