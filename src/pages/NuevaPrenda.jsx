import { useNuevaPrenda } from "../hooks/useNuevaPrenda";
import Button from "../components/shared/Button";
import { useState } from "react";
import { Info, Plus } from "lucide-react";

function NuevaPrenda() {
  const { register, handleSubmit, errors, isSubmitting, watch } =
    useNuevaPrenda();

  const [showTooltip, setShowTooltip] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)

  // Observar los valores del formulario para validación personalizada
  const watchedValues = watch(['nombre', 'tipo', 'imagen'])
  const [nombre, tipo, imagen] = watchedValues

  // Validación personalizada
  const isFormValid = nombre && tipo && selectedImage

  // Obtener el registro de la imagen para combinar handlers
  const imageRegister = register("imagen", {
    required: "Debe seleccionar una imagen",
    validate: {
      fileSize: files => {
        if (!files || !files[0])
          return "Debe seleccionar una imagen";
        const maxSize = 10 * 1024 * 1024; // 10MB
        return (
          files[0].size <= maxSize ||
          "La imagen no debe superar los 10MB"
        );
      },
      fileType: files => {
        if (!files || !files[0])
          return "Debe seleccionar una imagen";
        const allowedTypes = [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/webp",
        ];
        return (
          allowedTypes.includes(files[0].type) ||
          "Solo se permiten archivos JPG, PNG o WebP"
        );
      },
    }
  })

  const handleImageChange = (event) => {
    // Llamar al handler original de react-hook-form
    imageRegister.onChange(event)

    // Manejar el preview
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target.result)
      }
      reader.readAsDataURL(file)
    } else {
      setSelectedImage(null)
    }
  }

  const removeImage = () => {
    setSelectedImage(null)
    // Reset the file input
    const fileInput = document.getElementById('imagen')
    if (fileInput) {
      fileInput.value = ''
    }
  };

  return (
    <div className="flex items-center justify-center px-4 mt-20">
      <div className="w-full max-w-2/3 bg-gray/10 rounded-md p-8 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulario - Lado izquierdo */}
          <div>
            <h2 className="text-2xl text-white font-medium mb-8">
              Nueva prenda
            </h2>
            <form
              id="nueva-prenda-form"
              onSubmit={handleSubmit}
              className="space-y-6"
              aria-label="nueva prenda"
            >
              {/* Campo Nombre */}
              <div>
                <label
                  htmlFor="nombre"
                  className="block text-sm text-gray mb-2"
                >
                  Nombre
                </label>
                <input
                  id="nombre"
                  type="text"
                  {...register("nombre", {
                    required: "El nombre es requerido",
                    minLength: {
                      value: 1,
                      message: "Por favor ingrese el nombre de la prenda",
                    },
                  })}
                  className="w-full px-4 py-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-transparent placeholder-gray"
                  placeholder=""
                />
                {errors.nombre && (
                  <p className="text-error text-sm mt-1">
                    {errors.nombre.message}
                  </p>
                )}
              </div>

              {/* Campo Tipo */}
              <div>
                <label htmlFor="tipo" className="block text-sm text-gray mb-2">
                  Tipo de prenda
                </label>
                <select
                  id="tipo"
                  {...register("tipo", {
                    required: "Debe seleccionar un tipo de prenda",
                  })}
                  className="w-full px-4 py-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-transparent placeholder-gray"
                >
                  <option value="">Selecciona un tipo</option>
                  <option value="superior">Parte superior</option>
                  <option value="inferior">Parte inferior</option>
                </select>
                {errors.tipo && (
                  <p className="text-error text-sm mt-1">
                    {errors.tipo.message}
                  </p>
                )}
              </div>

              {/* Error de submit */}
              {errors.submit && (
                <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-3">
                  <p className="text-error text-sm">{errors.submit.message}</p>
                </div>
              )}
            </form>
          </div>

          {/* Área de Imagen - Lado derecho */}
          <div>
            <div className="relative">
              <div className="flex items-center justify-between gap-2 mb-4">
                <h4 className="text-lg font-medium text-gray">Imágenes</h4>
                <Button
                  variant="text"
                  width="fit"
                  color="gray"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                >
                  <Info />
                </Button>
              </div>

              {/* Área de upload */}
              <div className=" rounded-md bg-black h-[180px]">
                <input
                  id="imagen"
                  type="file"
                  accept="image/*"
                  name={imageRegister.name}
                  ref={imageRegister.ref}
                  onBlur={imageRegister.onBlur}
                  onChange={handleImageChange}
                  className="hidden"
                />

                {!showTooltip ? (
                  selectedImage ? (
                    /* Preview de imagen */
                    <div className="relative h-full">
                      <img
                        src={selectedImage}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                      {/* Overlay con opciones */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-4">
                        <label
                          htmlFor="imagen"
                          className="cursor-pointer border border-white text-white px-4 py-2 rounded-sm transition-colors hover:bg-white/10"
                        >
                          Cambiar
                        </label>
                        <Button
                          type="button"
                          variant="error"
                          width="fit"
                          onClick={removeImage}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    /* Área clickeable para subir */
                    <label
                      htmlFor="imagen"
                      className="cursor-pointer block p-8 text-center transition-colors rounded-lg h-full"
                    >
                      <div className="flex flex-col items-center justify-center h-full gap-2 text-gray hover:text-white">
                        <Plus className="w-10 h-10" />
                        <span className=" font-medium">
                          Agregar imágenes
                        </span>
                      </div>
                    </label>
                  )
                ) : (
                  /* Recomendaciones */
                  <div className="p-8 h-full flex flex-col justify-center">
                    <h4 className="font-medium mb-4 text-center text-lg">
                      Recomendaciones
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-start gap-3">
                        <span className="text-white mt-0.5 text-lg">•</span>
                        <span className="leading-relaxed">
                          Asegúrate que la prenda se vea de frente
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-white mt-0.5 text-lg">•</span>
                        <span className="leading-relaxed">
                          Elige un lugar iluminado para tomar las fotos
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-white mt-0.5 text-lg">•</span>
                        <span className="leading-relaxed">
                          Esta es la imagen que verán tus clientes
                        </span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              {errors.imagen && (
                <p className="text-error text-sm mt-2">
                  {errors.imagen.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Botón que ocupa todo el ancho */}
        <div className="mt-8">
          <Button
            type="submit"
            form="nueva-prenda-form"
            disabled={isSubmitting || !isFormValid}
          >
            {isSubmitting ? "Guardando..." : "Guardar nueva prenda"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NuevaPrenda;
