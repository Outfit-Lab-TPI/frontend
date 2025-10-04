import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import Model from '../components/Model';
import axios from 'axios';

function AvatarsShowroom() {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    try {
      setLoading(true);
      // Llamar al backend para obtener lista de modelos
      const response = await axios.get('http://localhost:8080/api/garments/list-models');
      setModels(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error loading models:', err);
      setError('Error al cargar los modelos');
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadModels();
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-600">Cargando modelos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
          <button 
            onClick={handleRefresh}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Avatars Showroom</h1>
        <button
          onClick={handleRefresh}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
        >
          🔄 Actualizar
        </button>
      </div>

      {models.length === 0 ? (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <p className="text-gray-600 text-lg mb-2">No hay modelos generados todavía</p>
          <p className="text-gray-500 text-sm">
            Ve a <a href="/garment-generator" className="text-blue-500 hover:underline">Generador de Prendas</a> para crear tu primer modelo 3D
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {models.map((model, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-120 bg-gradient-to-b from-gray-50 to-gray-100">
                <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
                  <Environment preset="city" />
                  <ambientLight intensity={1} />
                  <directionalLight position={[10, 10, 5]} intensity={1} />
                  <OrbitControls enableZoom={true} />
                  <Model url={model.path} scale={[3,3,3]} />
                </Canvas>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-1">{model.name}</h3>
                <p className="text-sm text-gray-500">Task ID: {model.taskId}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Creado: {new Date(model.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          💡 <strong>Tip:</strong> Los modelos se cargan automáticamente desde la carpeta tripo-models. 
          Cada vez que generes un nuevo modelo, aparecerá aquí.
        </p>
      </div>
    </div>
  );
}

export default AvatarsShowroom;