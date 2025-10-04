import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import Model from '../components/Model';

function GarmentCalibrator() {
  const [garmentUrl, setGarmentUrl] = useState('/prendas/remera-spiderman.glb');
  const [scale, setScale] = useState([2, 2, 2]);
  const [position, setPosition] = useState([0, 2.65, 0]);
  const [rotation, setRotation] = useState([0, 0, 0]);

  const handleScaleChange = (axis, value) => {
    const newScale = [...scale];
    newScale[axis] = parseFloat(value);
    setScale(newScale);
  };

  const handlePositionChange = (axis, value) => {
    const newPosition = [...position];
    newPosition[axis] = parseFloat(value);
    setPosition(newPosition);
  };

  const handleRotationChange = (axis, value) => {
    const newRotation = [...rotation];
    newRotation[axis] = parseFloat(value);
    setRotation(newRotation);
  };

  const copyToClipboard = () => {
    const code = `<Model 
  url="${garmentUrl}" 
  scale={[${scale.join(', ')}]} 
  position={[${position.join(', ')}]}
  rotation={[${rotation.join(', ')}]}
/>`;
    navigator.clipboard.writeText(code);
    alert('Código copiado al portapapeles!');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl font-bold mb-8 text-center">
        🎚️ Calibrador de Prendas
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controles */}
        <div className="rounded-lg shadow-md p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">URL del Modelo</label>
            <input
              type="text"
              value={garmentUrl}
              onChange={(e) => setGarmentUrl(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          {/* Escala */}
          <div>
            <h3 className="font-semibold mb-3">📏 Escala</h3>
            {['X', 'Y', 'Z'].map((axis, i) => (
              <div key={axis} className="mb-2">
                <label className="text-sm">{axis}: {scale[i]}</label>
                <input
                  type="range"
                  min="0.5"
                  max="5"
                  step="0.1"
                  value={scale[i]}
                  onChange={(e) => handleScaleChange(i, e.target.value)}
                  className="w-full"
                />
              </div>
            ))}
          </div>

          {/* Posición */}
          <div>
            <h3 className="font-semibold mb-3">📍 Posición</h3>
            {[
              { label: 'X (Izq/Der)', i: 0, min: -2, max: 2 },
              { label: 'Y (Arriba/Abajo)', i: 1, min: 0, max: 5 },
              { label: 'Z (Adelante/Atrás)', i: 2, min: -2, max: 2 }
            ].map(({ label, i, min, max }) => (
              <div key={i} className="mb-2">
                <label className="text-sm">{label}: {position[i].toFixed(2)}</label>
                <input
                  type="range"
                  min={min}
                  max={max}
                  step="0.05"
                  value={position[i]}
                  onChange={(e) => handlePositionChange(i, e.target.value)}
                  className="w-full"
                />
              </div>
            ))}
          </div>

          {/* Rotación */}
          <div>
            <h3 className="font-semibold mb-3">🔄 Rotación</h3>
            {['X', 'Y', 'Z'].map((axis, i) => (
              <div key={axis} className="mb-2">
                <label className="text-sm">{axis}: {(rotation[i] * 180 / Math.PI).toFixed(0)}°</label>
                <input
                  type="range"
                  min={-Math.PI}
                  max={Math.PI}
                  step="0.1"
                  value={rotation[i]}
                  onChange={(e) => handleRotationChange(i, e.target.value)}
                  className="w-full"
                />
              </div>
            ))}
          </div>

          <button
            onClick={copyToClipboard}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            📋 Copiar Código
          </button>

          {/* Código generado */}
          <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-xs overflow-x-auto">
            <pre>{`<Model 
  url="${garmentUrl}" 
  scale={[${scale.join(', ')}]} 
  position={[${position.join(', ')}]}
  rotation={[${rotation.join(', ')}]}
/>`}</pre>
          </div>
        </div>

        {/* Vista 3D */}
        <div className="lg:col-span-2">
          <div className="rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Vista en Avatar</h2>
            <div className="h-[600px] bg-gradient-to-b from-gray-50 to-gray-100 rounded-lg overflow-hidden">
              <Canvas camera={{ position: [0, -1, 0] }}>
                <Environment preset="city" />
                <ambientLight intensity={0.5} />
                <OrbitControls
                  minPolarAngle={Math.PI / 2}
                  maxPolarAngle={Math.PI / 2}
                  target={[0, 2, 0]}
                  enableZoom={true}
                />

                {/* Plataforma */}
                <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <circleGeometry args={[1, 64]} />
                  <meshStandardMaterial color="#6366f1" transparent opacity={0.3} />
                </mesh>

                {/* Avatar base */}
                <Model
                  url="/avatars/defaultTorso.glb"
                  scale={[2, 2.3, 2.2]}
                  position={[-0.06, 2.55, 0]}
                />
                <Model
                  url="/avatars/human+legs+3d+model.glb"
                  scale={[1.6, 2, 1.6]}
                  position={[0, 1.05, 0]}
                />

                {/* Prenda a calibrar */}
                <Model
                  url={garmentUrl}
                  scale={scale}
                  position={position}
                  rotation={rotation}
                />
              </Canvas>
            </div>
            <p className="text-sm text-gray-500 mt-3 text-center">
              Ajusta los controles hasta que la prenda se vea bien en el avatar
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GarmentCalibrator;