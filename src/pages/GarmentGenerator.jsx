import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import Model from "../components/Model";
import { tripoAPI } from "../services/tripoAPI";
import { Loader2, Upload, X, Camera } from "lucide-react";
import axios from 'axios';

function GarmentGenerator() {
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [taskId, setTaskId] = useState("");
  const [status, setStatus] = useState("");
  const [garmentUrl, setGarmentUrl] = useState("");
  const [logs, setLogs] = useState([]);
  const [showInstructions, setShowInstructions] = useState(true);

  const positions = ["Atrás *", "Frente *", "Izquierda *", "Derecha *"];

  const addLog = message => {
    setLogs(prev => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] ${message}`,
    ]);
  };

  const handleImageUpload = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const newFiles = [...imageFiles];
    newFiles[index] = file;
    setImageFiles(newFiles);

    const reader = new FileReader();
    reader.onloadend = () => {
      const newPreviews = [...imagePreviews];
      newPreviews[index] = reader.result;
      setImagePreviews(newPreviews);
    };
    reader.readAsDataURL(file);

    addLog(`✅ Imagen ${positions[index]} cargada`);
  };

  const removeImage = index => {
    const newFiles = [...imageFiles];
    newFiles[index] = null;
    setImageFiles(newFiles);

    const newPreviews = [...imagePreviews];
    newPreviews[index] = null;
    setImagePreviews(newPreviews);

    addLog(`🗑️ Imagen ${positions[index]} eliminada`);
  };

  const validFiles = imageFiles.filter(f => f !== null && f !== undefined);
  const canGenerate = validFiles.length === 4;

const handleGenerate = async () => {
  if (!canGenerate) return;

  try {
    setLoading(true);
    setLogs([]);
    setGarmentUrl('');
    setTaskId('');
    setStatus('');

    addLog('🚀 Iniciando generación de modelo 3D...');
    addLog(`📸 Total de imágenes: ${validFiles.length}`);

    const createResponse = await tripoAPI.generateFromFiles(validFiles);

    if (createResponse.code !== 0) {
      throw new Error('Error al crear la tarea en Tripo');
    }

    const newTaskId = createResponse.data.task_id;
    setTaskId(newTaskId);
    addLog(`✅ Tarea creada: ${newTaskId}`);
    setStatus('running');
    addLog('⏳ Generando modelo 3D (30-60 segundos)...');
    addLog('🔄 Consultando estado automáticamente cada 5 segundos...');

    setLoading(false);

    // Iniciar polling automático
    startPolling(newTaskId);

  } catch (err) {
    addLog(`❌ ERROR: ${err.message}`);
    setStatus('failed');
    setLoading(false);
  }
};

const startPolling = (taskId) => {
  const pollInterval = setInterval(async () => {
    try {
      const result = await tripoAPI.getTaskStatus(taskId);
      const newStatus = result.data.status;
      
      console.log(`Polling... Status: ${newStatus}`);
      addLog(`🔄 Estado: ${newStatus}`);
      setStatus(newStatus);

      if (newStatus === 'success') {
        clearInterval(pollInterval);
        addLog('🎉 ¡Modelo generado exitosamente!');
        
        const modelUrl = result.data.output.pbr_model || result.data.output.model;
        
        if (modelUrl) {
          // Auto-descargar y guardar
          addLog('💾 Descargando y guardando modelo...');
          try {
            const saveResponse = await axios.post(
              `http://localhost:8080/api/tripo/download-and-save/${taskId}`
            );
            
            if (saveResponse.data.localPath) {
              addLog(`✅ Modelo guardado en: ${saveResponse.data.localPath}`);
              setGarmentUrl(saveResponse.data.localPath);
            }
          } catch (err) {
            addLog(`⚠️ No se pudo guardar: ${err.message}`);
            setGarmentUrl(modelUrl); // Usar URL remota como fallback
          }
        }

      } else if (newStatus === 'failed') {
        clearInterval(pollInterval);
        addLog('❌ La generación falló');
      }
      
    } catch (err) {
      console.error('Error en polling:', err);
      addLog(`⚠️ Error al consultar: ${err.message}`);
    }
  }, 5000); // 5 segundos

  // Timeout de seguridad (3 minutos máximo)
  setTimeout(() => {
    clearInterval(pollInterval);
    if (status !== 'success') {
      addLog('⏱️ Tiempo máximo alcanzado. Puedes consultar manualmente.');
    }
  }, 180000); // 3 minutos
};

  const handleDownload = async () => {
    if (!garmentUrl) return;
    try {
      addLog("📥 Descargando modelo...");
      const blob = await tripoAPI.downloadModel(garmentUrl);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `prenda-${taskId}.glb`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      addLog("✅ Modelo descargado exitosamente");
    } catch (err) {
      addLog(`❌ Error al descargar: ${err.message}`);
    }
  };

  const handleSaveToProject = async () => {
    if (!garmentUrl) return;

    try {
      addLog("💾 Guardando en proyecto...");
      // TODO: Implementar guardado en base de datos
      // Por ahora solo descarga el archivo
      await handleDownload();
      addLog("💡 Guarda el archivo .glb en /frontend/public/prendas/");
    } catch (err) {
      addLog(`❌ Error: ${err.message}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl font-bold mb-2 text-center">
        🎨 Generador de Prendas 3D
      </h1>
      <p className="text-gray-600 text-center mb-8">
        Convierte fotos de prendas reales en modelos 3D para tu avatar
      </p>

      {showInstructions && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <Camera size={20} />
                📸 Guía para mejores resultados:
              </h3>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>
                  <strong>✅ Mínimo requerido:</strong> Foto de FRENTE + ATRÁS
                </li>
                <li>
                  <strong>💡 Tips importantes:</strong>
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>• Prenda bien estirada sobre superficie plana</li>
                    <li>• Fondo liso (blanco o gris)</li>
                    <li>• Buena iluminación sin sombras</li>
                    <li>• Misma distancia en todas las fotos</li>
                    <li>• Captura estampados y detalles claramente</li>
                  </ul>
                </li>
                <li>
                  <strong>⏱️ Tiempo estimado:</strong> 30-60 segundos
                </li>
                <li>
                  <strong>💰 Costo:</strong> 1 crédito de Tripo por generación
                </li>
              </ul>
            </div>
            <button
              onClick={() => setShowInstructions(false)}
              className="text-blue-600 hover:text-blue-800"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Panel Izquierdo: Upload */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">📤 1. Subir Fotos</h2>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {positions.map((label, index) => {
                const hasImage = imagePreviews[index];

                return (
                  <div key={index}>
                    <label className="block text-sm font-medium mb-2 text-gray-600">
                      {label}
                    </label>
                    <div
                      className={`border-2 border-dashed rounded-lg p-4 text-center min-h-[140px] flex items-center justify-center ${
                        hasImage
                          ? "border-green-400 bg-green-50"
                          : "border-gray-300"
                      }`}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => handleImageUpload(index, e)}
                        className="hidden"
                        id={`upload-${index}`}
                      />
                      {hasImage ? (
                        <div className="relative w-full">
                          <img
                            src={imagePreviews[index]}
                            alt={label}
                            className="max-h-32 mx-auto rounded object-cover"
                          />
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <label
                          htmlFor={`upload-${index}`}
                          className="cursor-pointer w-full"
                        >
                          <Upload
                            className="mx-auto text-gray-400 mb-2"
                            size={32}
                          />
                          <p className="text-xs text-gray-600">Requerido</p>
                        </label>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-700">
                <strong>Imágenes cargadas:</strong> {validFiles.length}/4
              </p>
              {!canGenerate && (
                <p className="text-sm text-red-600 mt-2 text-center">
                  * Debes subir exactamente 4 fotos (atrás, frente, izquierda,
                  derecha)
                </p>
              )}
            </div>

            <button
              onClick={handleGenerate}
              disabled={!canGenerate || loading}
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Generando...
                </>
              ) : (
                <>✨ Generar Modelo 3D</>
              )}
            </button>

            {taskId && (
              <div className="mt-4 space-y-3">
                <div className="bg-gray-100 rounded p-3">
                  <p className="text-xs text-gray-600">Task ID:</p>
                  <p className="text-sm font-mono break-all">{taskId}</p>
                </div>

                <div
                  className={`px-4 py-3 rounded font-medium ${
                    status === "success"
                      ? "bg-green-100 text-green-800"
                      : status === "failed"
                      ? "bg-red-100 text-red-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  Estado: {status}
                </div>

                {garmentUrl && (
                  <div className="space-y-2">
                    <button
                      onClick={handleDownload}
                      className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
                    >
                      📥 Descargar .glb
                    </button>
                    <button
                      onClick={handleSaveToProject}
                      className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600"
                    >
                      💾 Usar en Avatar
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Logs */}
          <div className="bg-gray-900 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-3">
              📋 Registro de Actividad
            </h3>
            <div className="font-mono text-xs text-green-400 space-y-1 max-h-64 overflow-y-auto">
              {logs.length === 0 ? (
                <p className="text-gray-500">Esperando acción...</p>
              ) : (
                logs.map((log, i) => <div key={i}>{log}</div>)
              )}
            </div>
          </div>
        </div>

        {/* Panel Derecho: Visualización */}
        <div className="space-y-6">
          {/* Modelo Generado */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">👕 2. Modelo 3D</h2>
            <div className="h-96 bg-gradient-to-b from-gray-50 to-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
              {garmentUrl ? (
                <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                  <Environment preset="city" />
                  <ambientLight intensity={0.5} />
                  <directionalLight position={[10, 10, 5]} intensity={1} />
                  <OrbitControls enableZoom={true} />
                  <Model url={garmentUrl} scale={[1, 1, 1]} />
                </Canvas>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <Upload size={64} className="opacity-20 mb-4" />
                  <p className="text-center px-4">
                    El modelo 3D aparecerá aquí
                    <br />
                    una vez completada la generación
                  </p>
                </div>
              )}
            </div>
            {garmentUrl && (
              <p className="text-sm text-gray-500 mt-3 text-center">
                ↻ Arrastra para rotar • Scroll para zoom
              </p>
            )}
          </div>

          {/* Preview Avatar */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              🧍 3. Vista en Avatar
            </h2>
            <div className="h-96 bg-gradient-to-b from-indigo-50 to-indigo-100 rounded-lg overflow-hidden border-2 border-indigo-200">
              <Canvas camera={{ position: [0, -1, 0] }}>
                <Environment preset="city" />
                <ambientLight intensity={0.5} />
                <OrbitControls
                  minPolarAngle={Math.PI / 2}
                  maxPolarAngle={Math.PI / 2}
                  target={[0, 2, 0]}
                  enableZoom={false}
                />

                {/* Plataforma */}
                <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <circleGeometry args={[1, 64]} />
                  <meshStandardMaterial
                    color="#6366f1"
                    transparent
                    opacity={0.3}
                  />
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

                {/* Prenda generada */}
                {garmentUrl && (
                  <Model
                    url={garmentUrl}
                    scale={[2, 2, 2]}
                    position={[0, 2.65, 0]}
                  />
                )}
              </Canvas>
            </div>
            <p className="text-sm text-gray-500 mt-3 text-center">
              {garmentUrl
                ? "✅ Prenda aplicada al avatar"
                : "⏳ Esperando modelo generado..."}
            </p>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
        <h3 className="font-semibold text-purple-900 mb-3">
          💡 Próximos Pasos
        </h3>
        <ol className="text-sm text-purple-800 space-y-2 list-decimal list-inside">
          <li>Descarga el archivo .glb generado</li>
          <li>
            Guárdalo en{" "}
            <code className="bg-purple-100 px-2 py-1 rounded">
              /frontend/public/prendas/tu-prenda.glb
            </code>
          </li>
          <li>Ajusta la escala y posición en el código si es necesario</li>
          <li>Agrega la prenda a la lista del Home para usarla</li>
        </ol>
      </div>
    </div>
  );
}

export default GarmentGenerator;
