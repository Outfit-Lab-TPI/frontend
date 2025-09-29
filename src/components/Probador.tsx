import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import Model from './Model';

interface ProbadorVirtualProps {
  prendaSeleccionada: string | null;
}

function ProbadorVirtual({ prendaSeleccionada }: ProbadorVirtualProps) {

  return (
    <>
      <div className="canvas-container">
        <Canvas
          camera={{ position: [0, -1, 0] }}
        >
          <Environment preset="city" />
          <ambientLight intensity={0.5} />

          <OrbitControls
            minPolarAngle={Math.PI / 2}
            maxPolarAngle={Math.PI / 2}
            target={[0, 2, 0]}
            enableZoom={false} />

          {/* Plataforma circular */}
          <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[1, 64]} />
            <meshStandardMaterial color="var(--secondary)" transparent opacity={0.3} />
          </mesh>

          <Model url="/avatars/avatar-masculino-1.glb" scale={3} />
          {prendaSeleccionada === 'traje-1' && <Model url="/prendas/traje-1.glb" scale={3} position={[0, 0, 0]} />}
        </Canvas>
      </div>

    </>
  );
}

export default ProbadorVirtual;