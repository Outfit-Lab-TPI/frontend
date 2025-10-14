import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import Model from './Model';

function ModeloViewer({ modeloUrl, className = "" }) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{
          position: [0, 0, 5],
          fov: 50
        }}
      >
        <Environment preset="city" />
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={0.8}
          castShadow
        />

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={2}
          maxDistance={10}
          maxPolarAngle={Math.PI * 0.5}
          minPolarAngle={Math.PI * 0.5}
        />

        {/* Modelo 3D del outfit */}
        <Model
          url={modeloUrl}
          scale={[1, 1, 1]}
          position={[0, -1, 0]}
        />
      </Canvas>
    </div>
  );
}

export default ModeloViewer;