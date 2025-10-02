import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import Model from './Model';

interface ProbadorVirtualProps {
  prendaSeleccionada: string[];
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


          {prendaSeleccionada?.includes('remera') && <Model url="/avatars/blue+shirted+person+3d+model.glb" scale={2} position={[0, 2.5, 0]} />}
          {prendaSeleccionada?.includes('pantalon') && <Model url="/avatars/jogger+pants+3d+model.glb" scale={2} position={[0, 1, 0]} />}
          {prendaSeleccionada?.includes('buzo') && <Model url="/avatars/buzoVioleta.glb" scale={2} position={[0, 2.5, 0]} />}
          

        </Canvas>
      </div>

    </>
  );
}

export default ProbadorVirtual;