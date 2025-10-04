import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Stage } from '@react-three/drei';
import { Suspense } from 'react';

function Model({ url }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

function ModelViewer({ modelUrl }) {
  if (!modelUrl) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-gray-100 rounded-lg">
        <p className="text-gray-500">No hay modelo para mostrar</p>
      </div>
    );
  }

  return (
    <div className="w-full h-96 bg-gray-900 rounded-lg overflow-hidden">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.6}>
            <Model url={modelUrl} />
          </Stage>
          <OrbitControls makeDefault />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default ModelViewer;