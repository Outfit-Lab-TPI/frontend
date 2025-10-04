import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import Model from "./Model";

function TestProbadorVirtual() {
  return (
    <>
      <div className="canvas-container">
        <Canvas camera={{ position: [0, -1, 0] }}>
          <Environment preset="city" />
          <ambientLight intensity={0.5} />

          <OrbitControls
            minPolarAngle={Math.PI / 2}
            maxPolarAngle={Math.PI / 2}
            target={[0, 2, 0]}
            enableZoom={false}
          />

          {/* Plataforma circular */}
          <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[1, 64]} />
            <meshStandardMaterial
              color="var(--secondary)"
              transparent
              opacity={0.3}
            />
          </mesh>

          <Model
            url="/avatars/test-avatar+prenda.glb"
            scale={[4,4,4]}
            position={[-0.06, 2, 0]}
            color="rgba(255, 255, 255, 1)" 
          />
        </Canvas>
      </div>
    </>
  );
}

export default TestProbadorVirtual;
