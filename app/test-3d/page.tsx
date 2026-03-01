'use client';

/**
 * Test page for Scene3D component
 * This page demonstrates the 3D scene with different configurations
 */

import dynamic from 'next/dynamic';

// Dynamically import Scene3D with no SSR to avoid Three.js errors during build
const Scene3D = dynamic(() => import('@/components/Scene3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-800">
      <p className="text-white">Loading 3D Scene...</p>
    </div>
  ),
});

export default function Test3DPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          3D Scene Component Test
        </h1>
        
        {/* Full screen 3D scene */}
        <div className="w-full h-[600px] rounded-lg overflow-hidden border-4 border-purple-500">
          <Scene3D particleCount={1000} />
        </div>

        <div className="mt-8 text-white text-center">
          <h2 className="text-2xl font-semibold mb-4">Features Demonstrated:</h2>
          <ul className="space-y-2 text-lg">
            <li>✓ Rotating icosahedron with metallic material</li>
            <li>✓ 1000 animated particles in a sphere formation</li>
            <li>✓ Multi-point lighting configuration</li>
            <li>✓ Optimized rendering with useMemo</li>
            <li>✓ Continuous rotation animation using useFrame</li>
          </ul>
        </div>

        {/* Smaller scene with fewer particles for mobile */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-white mb-4 text-center">
            Mobile Optimized (500 particles)
          </h2>
          <div className="w-full h-[400px] rounded-lg overflow-hidden border-4 border-indigo-500">
            <Scene3D particleCount={500} />
          </div>
        </div>
      </div>
    </div>
  );
}
