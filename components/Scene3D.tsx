'use client';

/**
 * Scene3D Component
 * 
 * A React Three Fiber component that renders an animated 3D scene with:
 * - Abstract 3D object (icosahedron) with continuous rotation
 * - Particle system with configurable count
 * - Optimized lighting configuration
 * - Performance optimizations using useMemo
 * 
 * Requirements: 1.1, 1.2, 1.4, 1.5, 12.1, 12.3, 12.5, 13.4
 */

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Rotating 3D object component (icosahedron with torus knot geometry)
 * Implements continuous rotation animation using useFrame
 */
function RotatingObject() {
  const meshRef = useRef<THREE.Mesh>(null);

  // Continuous rotation animation
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.3;
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.5, 1]} />
      <meshStandardMaterial
        color="#6366f1"
        metalness={0.7}
        roughness={0.2}
        emissive="#4f46e5"
        emissiveIntensity={0.2}
      />
    </mesh>
  );
}

/**
 * Particle system component
 * Creates a field of animated particles around the 3D object
 */
function ParticleSystem({ count = 1000 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate particle positions using useMemo for performance
  const particlePositions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Create particles in a sphere around the center
      const radius = 5 + Math.random() * 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);
    }
    
    return positions;
  }, [count]);

  // Animate particles with subtle movement
  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  // Create geometry with buffer attribute
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    return geo;
  }, [particlePositions]);

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.05}
        color="#8b5cf6"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

/**
 * Scene3D Props
 */
interface Scene3DProps {
  particleCount?: number;
  className?: string;
}

/**
 * Main Scene3D component
 * Wraps the 3D scene in a Canvas with optimized settings
 */
export default function Scene3D({ 
  particleCount = 1000,
  className = ''
}: Scene3DProps) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        dpr={[1, 2]} // Adaptive pixel ratio for performance
        performance={{ min: 0.5 }} // Performance degradation settings
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        }}
      >
        {/* Lighting configuration */}
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
        <pointLight position={[0, 10, -10]} intensity={0.7} color="#6366f1" />

        {/* 3D Objects */}
        <RotatingObject />
        <ParticleSystem count={particleCount} />

        {/* Optional: OrbitControls for debugging (can be removed) */}
        {/* <OrbitControls enableZoom={false} enablePan={false} /> */}
      </Canvas>
    </div>
  );
}
