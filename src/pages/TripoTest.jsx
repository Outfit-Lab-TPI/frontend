import { useState } from 'react';
import { tripoAPI } from '../services/tripoAPI';
import ModelViewer from '../components/TripoModelViewer';
import { Loader2 } from 'lucide-react';

function TripoTest() {
  const [prompt, setPrompt] = useState('a leather coat with pockets');
  const [loading, setLoading] = useState(false);
  const [taskId, setTaskId] = useState('');
  const [status, setStatus] = useState('');
  const [modelUrl, setModelUrl] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [error, setError] = useState('');
  const [logs, setLogs] = useState([]);

  const addLog = (message) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const handleGenerateModel = async () => {
    try {
      setLoading(true);
      setError('');
      setLogs([]);
      setModelUrl('');
      setPreviewImage('');
      setStatus('');
      setTaskId('');

      addLog('Iniciando generación de modelo...');

      // Crear tarea
      const createResponse = await tripoAPI.createTextToModel(prompt);
      
      if (createResponse.code !== 0) {
        throw new Error('Error al crear la tarea');
      }

      const newTaskId = createResponse.data.task_id;
      setTaskId(newTaskId);
      addLog(`Tarea creada con ID: ${newTaskId}`);
      setStatus('running');

      // Esperar a que se complete
      addLog('Esperando generación del modelo...');
      const completedTask = await tripoAPI.waitForTaskCompletion(newTaskId);

      setStatus('success');
      addLog('¡Modelo generado exitosamente!');

      // Guardar URLs
      if (completedTask.output) {
        if (completedTask.output.model) {
          setModelUrl(completedTask.output.model);
          addLog(`Modelo disponible en: ${completedTask.output.model}`);
        }
        if (completedTask.output.rendered_image) {
          setPreviewImage(completedTask.output.rendered_image);
          addLog('Preview image disponible');
        }
      }

    } catch (err) {
      setError(err.message || 'Error al generar el modelo');
      setStatus('failed');
      addLog(`ERROR: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadModel = async () => {
    if (!modelUrl) return;

    try {
      addLog('Descargando modelo...');
      const blob = await tripoAPI.downloadModel(modelUrl);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tripo-model-${taskId}.glb`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      addLog('Modelo descargado exitosamente');
    } catch (err) {
      addLog(`ERROR al descargar: ${err.message}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Prueba de Tripo3D API
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Panel de control */}
        <div className="space-y-6">
          <div className=" rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Generar Modelo 3D</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Descripción del modelo
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Ej: a red sports car, a cute robot, a medieval sword..."
                  disabled={loading}
                />
              </div>

              <button
                onClick={handleGenerateModel}
                disabled={loading || !prompt.trim()}
                className="w-full bg-blue-500 py-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Generando...
                  </>
                ) : (
                  'Generar Modelo 3D'
                )}
              </button>

              {taskId && (
                <div className="text-sm">
                  <span className="font-medium">Task ID:</span> {taskId}
                </div>
              )}

              {status && (
                <div className={`px-4 py-2 rounded ${
                  status === 'success' ? 'bg-green-100 text-green-800' :
                  status === 'failed' ? 'bg-red-100 text-red-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  Estado: {status}
                </div>
              )}

              {error && (
                <div className="bg-red-100 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              {modelUrl && (
                <button
                  onClick={handleDownloadModel}
                  className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
                >
                  Descargar Modelo (.glb)
                </button>
              )}
            </div>
          </div>

          {/* Logs */}
          <div className="bg-gray-900 rounded-lg p-4 max-h-64 overflow-y-auto">
            <h3 className="text-white font-semibold mb-2">Logs</h3>
            <div className="font-mono text-xs text-green-400 space-y-1">
              {logs.length === 0 ? (
                <p className="text-gray-500">No hay logs todavía...</p>
              ) : (
                logs.map((log, index) => (
                  <div key={index}>{log}</div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Visualización */}
        <div className="space-y-6">
          <div className="rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Vista 3D</h2>
            <ModelViewer modelUrl={modelUrl} />
            {modelUrl && (
              <p className="text-sm text-gray-500 mt-2 text-center">
                Usa el mouse para rotar y hacer zoom
              </p>
            )}
          </div>

          {previewImage && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Preview</h2>
              <img 
                src={previewImage} 
                alt="Model preview" 
                className="w-full rounded-lg"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TripoTest;