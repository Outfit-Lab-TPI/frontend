import { useState } from 'react'
import { X } from 'lucide-react'

function ImageUpload({ onImagesChange, onError }) {
  const [images, setImages] = useState({
    frente: null,
    atras: null
  })
  const [previews, setPreviews] = useState({
    frente: null,
    atras: null
  })
  const [error, setError] = useState('')

  const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

  const validateFile = (file) => {
    if (!file) return { isValid: false, error: 'No se seleccionó archivo' }

    // Validar tipo de archivo
    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        isValid: false,
        error: 'Formato de archivo no válido. Solo se permiten: JPG, JPEG, PNG, WEBP'
      }
    }

    // Validar tamaño
    if (file.size > MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: 'Archivo muy grande. El tamaño máximo es 5MB'
      }
    }

    return { isValid: true }
  }

  const createPreview = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target.result)
      reader.readAsDataURL(file)
    })
  }

  const handleFileChange = async (event, side) => {
    const file = event.target.files[0]

    if (!file) return

    // Validar archivo
    const validation = validateFile(file)
    if (!validation.isValid) {
      setError(validation.error)
      onError?.(validation.error)
      return
    }

    try {
      // Crear preview
      const previewUrl = await createPreview(file)

      // Actualizar estado
      const newImages = { ...images, [side]: file }
      const newPreviews = { ...previews, [side]: previewUrl }

      setImages(newImages)
      setPreviews(newPreviews)

      // Notificar cambio al componente padre
      onImagesChange?.(newImages)

      setError('')
      onError?.('')
    } catch (error) {
      onError?.('Error al procesar la imagen')
    }
  }

  const handleRemoveImage = (side) => {
    const newImages = { ...images, [side]: null }
    const newPreviews = { ...previews, [side]: null }

    setImages(newImages)
    setPreviews(newPreviews)

    onImagesChange?.(newImages)
  }

  const ImageSlot = ({ side, label }) => {
    const preview = previews[side]

    return (
      <div className="space-y-2" data-testid={`imagen-${side}`}>
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
          {preview ? (
            // Preview de imagen cargada
            <div className="relative">
              <img
                src={preview}
                alt={`Preview ${side === 'atras' ? 'atrás' : side}`}
                className="w-full h-48 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(side)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                aria-label={`Eliminar ${side === 'atras' ? 'atrás' : side}`}
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            // Botón para cargar imagen
            <div>
              <label
                htmlFor={`imagen-${side}`}
                className="cursor-pointer"
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Plus className="w-6 h-6 text-gray-400" />
                  </div>
                  <button
                    type="button"
                    onClick={() => document.getElementById(`imagen-${side}`).click()}
                  >
                    Cargar imagen
                  </button>
                  <p className="text-xs text-gray-500">
                    JPEG, JPG, PNG, WEBP (máx. 5MB)
                  </p>
                </div>
              </label>

              <input
                id={`imagen-${side}`}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={(e) => handleFileChange(e, side)}
                className="hidden"
                aria-label={`Imagen ${side === 'atras' ? 'atrás' : side}`}
              />
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ImageSlot side="frente" label="Frente" />
        <ImageSlot side="atras" label="Atrás" />
      </div>

      {/* Indicador de progreso */}
      <div className="text-sm text-gray-600">
        {images.frente && images.atras ? (
          <p className="text-green-600">✅ Ambas imágenes cargadas</p>
        ) : (
          <p>
            {images.frente || images.atras
              ? `1 de 2 imágenes cargadas`
              : 'Cargar ambas imágenes (frente y atrás)'}
          </p>
        )}
      </div>

      {/* Mostrar errores */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
          {error}
        </div>
      )}
    </div>
  )
}

// Componente Plus simple (en lugar de importar lucide-react)
const Plus = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
)

export default ImageUpload