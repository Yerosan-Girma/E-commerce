import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface ParticleFieldProps {
  count?: number
  color?: string
  size?: number
}

const seededRandom = (seed: number) => {
  const value = Math.sin(seed) * 10000
  return value - Math.floor(value)
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
      positions[i * 3] = (seededRandom(i * 6 + 1) - 0.5) * 10
      positions[i * 3 + 1] = (seededRandom(i * 6 + 2) - 0.5) * 10
      positions[i * 3 + 2] = (seededRandom(i * 6 + 3) - 0.5) * 10
      
      velocities[i * 3] = (seededRandom(i * 6 + 4) - 0.5) * 0.01
      velocities[i * 3 + 1] = (seededRandom(i * 6 + 5) - 0.5) * 0.01
      velocities[i * 3 + 2] = (seededRandom(i * 6 + 6) - 0.5) * 0.01
    }
    
    return { positions, velocities }
  }, [count])
  const velocitiesRef = useRef(particles.velocities)

  useEffect(() => {
    velocitiesRef.current = particles.velocities
  }, [particles.velocities])

  useFrame((state) => {
    if (meshRef.current) {
      const positions = meshRef.current.geometry.attributes.position.array as Float32Array
      const velocities = velocitiesRef.current
      
      for (let i = 0; i < count; i++) {
        positions[i * 3] += velocities[i * 3]
        positions[i * 3 + 1] += velocities[i * 3 + 1]
        positions[i * 3 + 2] += velocities[i * 3 + 2]
        
        // Boundary check
        if (Math.abs(positions[i * 3]) > 5) velocities[i * 3] *= -1
        if (Math.abs(positions[i * 3 + 1]) > 5) velocities[i * 3 + 1] *= -1
        if (Math.abs(positions[i * 3 + 2]) > 5) velocities[i * 3 + 2] *= -1
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
          args={[particles.positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={size} color={color} transparent opacity={0.6} />
    </points>
  )
}
