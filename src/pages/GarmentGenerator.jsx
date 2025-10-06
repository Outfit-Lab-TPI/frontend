import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import Model from "../components/Model";
import { tripoAPI } from "../services/tripoAPI";
import { Loader2, Upload, X, Camera } from "lucide-react";
import axios from "axios";

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
      setGarmentUrl("");
      setTaskId("");
      setStatus("");

      addLog("🚀 Iniciando generación de modelo 3D...");
      addLog(`📸 Total de imágenes: ${validFiles.length}`);

      // Crear objeto con posiciones identificadas
      const positionMap = ["back", "front", "left", "right"];
      const filesWithPositions = {};

      imageFiles.forEach((file, index) => {
        if (file) {
          filesWithPositions[positionMap[index]] = file;
        }
      });

      addLog(`📍 Posiciones: ${Object.keys(filesWithPositions).join(", ")}`);

      const createResponse = await tripoAPI.generateFromFiles(filesWithPositions);

      if (createResponse.code !== 0) {
        throw new Error("Error al crear la tarea en Tripo");
      }

      const newTaskId = createResponse.data.task_id;
      setTaskId(newTaskId);
      addLog(`✅ Tarea creada: ${newTaskId}`);
      setStatus("running");
      addLog("⏳ Generando modelo 3D (30-60 segundos)...");
      addLog("🔄 Consultando estado automáticamente cada 5 segundos...");

      setLoading(false);

      // Iniciar polling automático
      startPolling(newTaskId);
    } catch (err) {
      addLog(`❌ ERROR: ${err.message}`);
      setStatus("failed");
      setLoading(false);
    }
  };

  const startPolling = taskId => {
    const pollInterval = setInterval(async () => {
      try {
        const result = await tripoAPI.getTaskStatus(taskId);
        const newStatus = result.data.status;

        console.log('result', result);

        console.log(`Polling... Status: ${newStatus}`);
        addLog(`🔄 Estado: ${newStatus}`);
        setStatus(newStatus);

        if (newStatus === "success") {
          clearInterval(pollInterval);
          addLog("🎉 ¡Modelo generado exitosamente!");

          const modelUrl =
            result.data.output.pbr_model || result.data.output.model;

          if (modelUrl) {
            // Auto-descargar y guardar
            addLog("💾 Descargando y guardando modelo...");
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
        } else if (newStatus === "failed") {
          clearInterval(pollInterval);
          addLog("❌ La generación falló");
        }
      } catch (err) {
        console.error("Error en polling:", err);
        addLog(`⚠️ Error al consultar: ${err.message}`);
      }
    }, 5000); // 5 segundos

    // Timeout de seguridad (3 minutos máximo)
    setTimeout(() => {
      clearInterval(pollInterval);
      if (status !== "success") {
        addLog("⏱️ Tiempo máximo alcanzado. Puedes consultar manualmente.");
      }
    }, 360000); // 6 minutos
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Panel Izquierdo: Upload */}
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
  );
}

export default GarmentGenerator;
