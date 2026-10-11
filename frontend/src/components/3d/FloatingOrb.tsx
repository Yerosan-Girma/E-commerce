import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh } from 'three'

interface FloatingOrbProps {
  position?: [number, number, number]
  scale?: number
  color?: string
  speed?: number
}

export default function FloatingOrb({ 
  position = [0, 0, 0], 
  scale = 1,
  color = '#6366F1',
  speed = 1
}: FloatingOrbProps) {
  const meshRef = useRef<Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.5
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3
    }
  })

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial 
        color={color} 
        transparent 
        opacity={0.6}
        roughness={0.2}
        metalness={0.8}
      />
    </mesh>
  )
}
