'use client';

/**
 * Scene3D Component
 * 
 * A React Three Fiber component that renders an animated 3D scene with:
 * - BMW M4 Widebody 3D model with continuous rotation
 * - Particle system with configurable count
 * - Optimized lighting configuration
 * - Performance optimizations using useMemo
 * 
 * Requirements: 1.1, 1.2, 1.4, 1.5, 12.1, 12.3, 12.5, 13.4
 */

import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

/**
 * BMW M4 Model component
 * Loads and displays the BMW M4 Widebody model with rotation animation
 */
function BMWModel() {
  const groupRef = useRef<THREE.Group>(null);
  
  // Load the BMW M4 model (from workshop root, not public)
  const { scene } = useGLTF('/bmw-m4-widebody-wwwvecarzcom/source/bmw_m4_modified_widebody_knitro_builds.glb');

  // Continuous rotation animation
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <group ref={groupRef} position={[0, -1, 0]} scale={1.5}>
      <primitive object={scene} />
    </group>
  );
}

/**
 * Loading fallback component
 */
function Loader() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#6366f1" wireframe />
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
        camera={{ position: [5, 2, 5], fov: 50 }}
        dpr={[1, 2]} // Adaptive pixel ratio for performance
        performance={{ min: 0.5 }} // Performance degradation settings
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        }}
      >
        {/* Lighting configuration */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
        <directionalLight position={[-10, 5, -5]} intensity={0.5} color="#8b5cf6" />
        <spotLight position={[0, 10, 0]} intensity={0.8} angle={0.6} penumbra={1} />

        {/* 3D Objects */}
        <Suspense fallback={<Loader />}>
          <BMWModel />
        </Suspense>
        <ParticleSystem count={particleCount} />

        {/* OrbitControls for user interaction */}
        <OrbitControls 
          enableZoom={true} 
          enablePan={false}
          minDistance={3}
          maxDistance={15}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
}

// Preload the BMW model for better performance
useGLTF.preload('/bmw-m4-widebody-wwwvecarzcom/source/bmw_m4_modified_widebody_knitro_builds.glb');
