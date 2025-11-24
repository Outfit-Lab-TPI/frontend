import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import Model from './Model';

function ModeloViewer({ modeloUrl, className = "" }) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
         style={{ background: "#ffffff" }}
         camera={{
          position: [0, 1.5, 4],
          fov: 45,
          near: 0.1,
          far: 1000
        }}
      >
        <Environment preset="sunset" />
        <ambientLight intensity={0.15} />
        <directionalLight position={[2, 30, 3]} intensity={0} />
        <directionalLight position={[0, 30, -5]} intensity={1}/>
        
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={1.5}
          maxDistance={10}
          maxPolarAngle={Math.PI - 0.1}
          minPolarAngle={0.1}           
          target={[0, 0, 0]}            
        />

        <Model
          url={modeloUrl}
          scale={[2.5, 2.5, 2.5]}
          position={[0, 0, 0]}
        />
      </Canvas>
    </div>
  );
}

export default ModeloViewer;