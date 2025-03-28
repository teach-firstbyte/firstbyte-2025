"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Float } from "@react-three/drei"

export function FallbackModel({ isRotating, setIsRotating }) {
  const meshRef = useRef()
  const smallCubesRef = useRef([])

  // Animate the fallback model
  useFrame((state) => {
    if (meshRef.current && isRotating) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.5
    }

    // Animate the small cubes
    smallCubesRef.current.forEach((cube, i) => {
      if (cube) {
        const t = state.clock.getElapsedTime() * (0.2 + i * 0.1)
        cube.position.y = Math.sin(t) * 0.2
        cube.rotation.x = t * 0.5
        cube.rotation.z = t * 0.3
      }
    })
  })

  return (
    <Float
      rotationIntensity={isRotating ? 0.4 : 0.0}
      floatIntensity={isRotating ? 0.4 : 0.1}
      speed={1.5}
      onClick={() => setIsRotating(!isRotating)}
    >
      <group>
        {/* Main cube with FirstByte logo */}
        <mesh ref={meshRef}>
          <boxGeometry args={[1.5, 1.5, 1.5]} />
          <meshStandardMaterial color="#22c55e" /> {/* Using the primary green color */}
        </mesh>

        {/* Smaller cubes representing bits */}
        <mesh position={[1, 1, 1]} scale={0.3} ref={(el) => (smallCubesRef.current[0] = el)}>
          <boxGeometry />
          <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.2} />
        </mesh>

        <mesh position={[-1, 1, 1]} scale={0.3} ref={(el) => (smallCubesRef.current[1] = el)}>
          <boxGeometry />
          <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.2} />
        </mesh>

        <mesh position={[1, -1, 1]} scale={0.3} ref={(el) => (smallCubesRef.current[2] = el)}>
          <boxGeometry />
          <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.2} />
        </mesh>

        <mesh position={[1, 1, -1]} scale={0.3} ref={(el) => (smallCubesRef.current[3] = el)}>
          <boxGeometry />
          <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.2} />
        </mesh>

        {/* Add text to indicate this is a fallback */}
        <group position={[0, -2, 0]}>
          <mesh>
            <boxGeometry args={[3, 0.4, 0.1]} />
            <meshStandardMaterial color="#ffffff" opacity={0.7} transparent />
          </mesh>
        </group>
      </group>
    </Float>
  )
}

