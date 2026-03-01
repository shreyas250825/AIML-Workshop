'use client';

/**
 * Scene3D Component
 * 
 * A React Three Fiber component that renders an animated 3D scene with:
 * - Animated 3D shapes with modern design
 * - Particle system with configurable count
 * - Optimized lighting configuration
 * - Performance optimizations using useMemo
 * 
 * Requirements: 1.1, 1.2, 1.4, 1.5, 12.1, 12.3, 12.5, 13.4
 */

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Animated sphere with distortion effect
 */
function AnimatedSphere() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={[1.5, 64, 64]} />
      <MeshDistortMaterial
        color="#6366f1"
        attach="material"
        distort={0.4}
        speed={2}
        roughness={0.2}
        metalness={0.8}
      />
    </mesh>
  );
}

/**
 * Rotating torus
 */
function RotatingTorus() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5;
      meshRef.current.rotation.z += delta * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} position={[3, 1, -2]}>
      <torusGeometry args={[0.8, 0.3, 16, 100]} />
      <meshStandardMaterial
        color="#8b5cf6"
        metalness={0.7}
        roughness={0.3}
        emissive="#7c3aed"
        emissiveIntensity={0.3}
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
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        }}
      >
        {/* Lighting configuration */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
        <directionalLight position={[-10, 5, -5]} intensity={0.5} color="#8b5cf6" />
        <spotLight position={[0, 10, 0]} intensity={0.8} angle={0.6} penumbra={1} />

        {/* 3D Objects */}
        <AnimatedSphere />
        <RotatingTorus />
        <ParticleSystem count={particleCount} />

        {/* OrbitControls for user interaction */}
        <OrbitControls 
          enableZoom={true} 
          enablePan={false}
          minDistance={5}
          maxDistance={15}
          autoRotate={true}
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}
