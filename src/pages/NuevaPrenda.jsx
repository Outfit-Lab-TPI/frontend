import ImageUpload from '../components/ImageUpload'
import { useNuevaPrenda } from '../hooks/useNuevaPrenda'
import Button from '../components/shared/Button'

function NuevaPrenda() {
  const {
    register,
    handleSubmit,
    errors,
    isValid,
    isSubmitting,
    handleImagesChange,
    handleImageError,
    handleCancel
  } = useNuevaPrenda()

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="font-bold text-2xl mb-4">Nueva Prenda</h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-2"
        aria-label="nueva prenda"
      >
        {/* Campo Nombre */}
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium mb-2">
            Nombre de la prenda
          </label>
          <input
            id="nombre"
            type="text"
            {...register('nombre', {
              required: 'El nombre es requerido',
              minLength: {
                value: 1,
                message: 'Por favor ingrese el nombre de la prenda'
              }
            })}
            className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            placeholder="Ej: Remera azul"
          />
          {errors.nombre && (
            <p className="text-red-500 text-sm mt-1">{errors.nombre.message}</p>
          )}
        </div>

        {/* Campo Tipo */}
        <div>
          <label htmlFor="tipo" className="block text-sm font-medium mb-2">
            Tipo de prenda
          </label>
          <select
            id="tipo"
            {...register('tipo', {
              required: 'Debe seleccionar un tipo de prenda'
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecciona un tipo</option>
            <option value="remera">Remera</option>
            <option value="pantalon">Pantalón</option>
          </select>
          {errors.tipo && (
            <p className="text-red-500 text-sm mt-1">{errors.tipo.message}</p>
          )}
        </div>

        {/* Campo hidden para validación de imágenes */}
        <input
          type="hidden"
          {...register('imagenes', {
            required: 'Debe cargar exactamente 2 imágenes (frente y atrás)'
          })}
        />

        {/* Upload de Imágenes */}
        <div>
          <h3 className="text-lg font-medium mb-3">Imágenes de la prenda</h3>
          <ImageUpload
            onImagesChange={handleImagesChange}
            onError={handleImageError}
          />
          {errors.imagenes && (
            <p className="text-red-500 text-sm mt-1">{errors.imagenes.message}</p>
          )}
        </div>

        {/* Error de submit */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-red-700 text-sm">{errors.submit.message}</p>
          </div>
        )}

        {/* Botones */}
        <div className="flex gap-4">
          <Button
            variant="outline"
            color="white"
            type="button"
            onClick={handleCancel}
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting || !isValid}
          >
            {isSubmitting ? 'Guardando...' : 'Guardar Prenda'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default NuevaPrenda