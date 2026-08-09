import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface ParticleFieldProps {
  count?: number
  color?: string
  size?: number
}

export default function ParticleField({ 
  count = 500, 
  color = '#6366F1',
  size = 0.02 
}: ParticleFieldProps) {
  const meshRef = useRef<THREE.Points>(null)
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10
      
      velocities[i * 3] = (Math.random() - 0.5) * 0.01
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.01
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01
    }
    
    return { positions, velocities }
  }, [count])

  useFrame((state) => {
    if (meshRef.current) {
      const positions = meshRef.current.geometry.attributes.position.array as Float32Array
      
      for (let i = 0; i < count; i++) {
        positions[i * 3] += particles.velocities[i * 3]
        positions[i * 3 + 1] += particles.velocities[i * 3 + 1]
        positions[i * 3 + 2] += particles.velocities[i * 3 + 2]
        
        // Boundary check
        if (Math.abs(positions[i * 3]) > 5) particles.velocities[i * 3] *= -1
        if (Math.abs(positions[i * 3 + 1]) > 5) particles.velocities[i * 3 + 1] *= -1
        if (Math.abs(positions[i * 3 + 2]) > 5) particles.velocities[i * 3 + 2] *= -1
      }
      
      meshRef.current.geometry.attributes.position.needsUpdate = true
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.05
    }
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={size} color={color} transparent opacity={0.6} />
    </points>
  )
}
