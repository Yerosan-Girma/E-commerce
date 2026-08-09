import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei'
import FloatingOrb from './FloatingOrb'
import ParticleField from './ParticleField'
import GeometricShape from './GeometricShape'

interface Scene3DProps {
  className?: string
}

export default function Scene3D({ className = '' }: Scene3DProps) {
  return (
    <div className={`absolute inset-0 ${className}`}>
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
        <Environment preset="night" />
        
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#6366F1" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#8B5CF6" />
        
        <ParticleField count={300} color="#6366F1" size={0.03} />
        <FloatingOrb position={[3, 2, 0]} scale={0.8} color="#6366F1" speed={0.8} />
        <FloatingOrb position={[-3, -1, -2]} scale={0.6} color="#8B5CF6" speed={1.2} />
        <FloatingOrb position={[0, 3, -3]} scale={0.5} color="#EC4899" speed={1} />
        
        <GeometricShape type="octahedron" position={[4, -2, 1]} scale={0.5} color="#6366F1" />
        <GeometricShape type="torus" position={[-4, 1, -1]} scale={0.4} color="#8B5CF6" />
        <GeometricShape type="icosahedron" position={[2, -3, -2]} scale={0.3} color="#EC4899" />
      </Canvas>
    </div>
  )
}
