import { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { Mesh } from 'three';

const Model = ({ url, position, scale, rotation }: { url: string; position?: [number, number, number]; scale?: number; rotation?: [number, number, number]; }) => {
  const { scene } = useGLTF(url);
  const ref = useRef<Mesh>(null);
  
  return (
    <primitive
      object={scene.clone()}
      scale={scale}
      position={position}
      rotation={rotation}
      ref={ref}
    />
  );
};

export default Model;