import { useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { Mesh, Color } from 'three';

const Model = ({ url, position, scale, rotation, color }: { url: string; position?: [number, number, number]; scale?: [number,number, number]; rotation?: [number, number, number]; color?: string }) => {
  const { scene } = useGLTF(url);
  const ref = useRef<Mesh>(null);

  useEffect(() => {
    if (color) {
      scene.traverse((child) => {
        if (child instanceof Mesh && child.material) {
          child.material.color = new Color(color);
        }
      });
    }
  }, [scene, color]);

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