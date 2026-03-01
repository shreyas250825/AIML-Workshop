# Scene3D Component

A React Three Fiber component that renders an animated 3D scene with a rotating icosahedron and particle system.

## Features

- **Rotating 3D Object**: Icosahedron with metallic material and continuous rotation animation
- **Particle System**: Configurable particle count with animated particles in a sphere formation
- **Optimized Lighting**: Multi-point lighting configuration with ambient, directional, and colored lights
- **Performance Optimizations**: Uses `useMemo` for particle generation and optimized rendering settings
- **Responsive**: Supports different particle counts for mobile vs desktop

## Requirements

Validates the following requirements:
- **1.1**: 3D animated object display
- **1.2**: Continuous rotation at configured speed
- **1.4**: Particle effects around 3D object
- **1.5**: Dark theme with appropriate lighting
- **12.1**: Fast initialization (< 2 seconds)
- **12.3**: Maintains 30+ FPS
- **12.5**: Optimized 3D assets
- **13.4**: Reduced particle count on mobile

## Usage

### Basic Usage

```tsx
import Scene3D from '@/components/Scene3D';

export default function MyPage() {
  return (
    <div className="w-full h-screen">
      <Scene3D />
    </div>
  );
}
```

### With Custom Particle Count

```tsx
// Desktop - more particles
<Scene3D particleCount={1000} />

// Mobile - fewer particles for performance
<Scene3D particleCount={500} />
```

### With Custom Styling

```tsx
<Scene3D 
  particleCount={800}
  className="rounded-lg shadow-xl"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `particleCount` | `number` | `1000` | Number of particles to render in the scene |
| `className` | `string` | `''` | Additional CSS classes for the container |

## Performance Considerations

1. **Particle Count**: Adjust based on device capabilities
   - Desktop: 1000-2000 particles
   - Tablet: 500-1000 particles
   - Mobile: 300-500 particles

2. **Rendering**: The component uses:
   - Adaptive pixel ratio (`dpr={[1, 2]}`)
   - Performance degradation settings
   - High-performance WebGL context
   - `useMemo` for particle position generation

3. **Animation**: Uses `useFrame` hook for smooth 60 FPS animations

## Technical Details

### 3D Object
- **Geometry**: Icosahedron with radius 1.5 and detail level 1
- **Material**: Standard material with:
  - Color: `#6366f1` (indigo)
  - Metalness: 0.7
  - Roughness: 0.2
  - Emissive: `#4f46e5` with intensity 0.2
- **Rotation**: 0.3 rad/s on X-axis, 0.5 rad/s on Y-axis

### Particle System
- **Distribution**: Spherical distribution with radius 5-10 units
- **Material**: Point material with:
  - Size: 0.05
  - Color: `#8b5cf6` (purple)
  - Opacity: 0.6
  - Size attenuation enabled
- **Animation**: Slow rotation (0.05 rad/s) on Y-axis

### Lighting
- **Ambient Light**: Intensity 0.3 (base illumination)
- **Point Light 1**: Position [10, 10, 10], white, intensity 1
- **Point Light 2**: Position [-10, -10, -10], purple, intensity 0.5
- **Point Light 3**: Position [0, 10, -10], indigo, intensity 0.7

## Testing

To test the component, visit the test page:

```bash
npm run dev
# Navigate to http://localhost:3000/test-3d
```

The test page demonstrates:
- Full-screen 3D scene with 1000 particles
- Mobile-optimized scene with 500 particles
- All features working together

## Dependencies

- `@react-three/fiber`: React renderer for Three.js
- `three`: 3D graphics library
- `react`: React framework

## Browser Support

Works in all modern browsers that support WebGL:
- Chrome 56+
- Firefox 51+
- Safari 11+
- Edge 79+

## Notes

- The component must be used in a client component (`'use client'` directive)
- Requires a parent container with defined width and height
- WebGL context is required for rendering
