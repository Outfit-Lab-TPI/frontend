import { useEffect, useMemo, useRef } from 'react';
import { Mesh, Color } from 'three';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Model = ({ url, position, scale, rotation, color }: { url: string; position?: [number, number, number]; scale?: [number,number, number]; rotation?: [number, number, number]; color?: string }) => {
  const proxiedUrl = useMemo(
    () => `${API_BASE_URL}/tripo/models/download?url=${encodeURIComponent(url)}`,
    [url]
  );

  const { scene } = useLoader(
    GLTFLoader,
    proxiedUrl,
    (loader) => {
      const token = sessionStorage.getItem('access_token');
      if (token) {
        loader.setRequestHeader({ Authorization: `Bearer ${token}` });
      }
      loader.setCrossOrigin('anonymous');
    }
  );

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
