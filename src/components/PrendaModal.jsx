import { useEffect, useState } from "react";
import { X, Info, Plus, Trash2 } from "lucide-react";
import { usePrendaCRUD } from "../hooks/marca/usePrendaCRUD";
import { useForm } from "react-hook-form";
import Button from "./shared/Button";
import { validarImagenDeRopa } from './../lib/clothingValidation'
// function PrendaModal({ isOpen, onClose, onGuardar, prendaParaEditar, onEliminar }) {
//   const {
//     register,
//     handleSubmit,
//     errors,
//     isSubmitting,
//     watch,
//     reset,
//     setValue,
//     crearPrenda,
//     editarPrenda,
//     eliminarPrenda,
//   } = usePrendaCRUD();

function PrendaModal({ isOpen, onClose, onGuardar, prendaParaEditar, onEliminar, marcaDetail }) {

  const form = useForm();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting }
  } = form;

  const { crearPrenda, editarPrenda, eliminarPrenda, colores, ocaciones, climas } = usePrendaCRUD(form);

  const [showTooltip, setShowTooltip] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);


  const watchedValues = watch(['nombre', 'tipo']);
  const [nombre, tipo] = watchedValues;

  const isFormValid = nombre && tipo && selectedImage;
  const isEditing = !!prendaParaEditar;

  const tipoSeleccionado = watch("tipo");

  // Obtener el registro de la imagen
  const imageRegister = register("imagen", {
    required: isEditing ? false : "Debe seleccionar una imagen",
    validate: {
      fileSize: files => {
        if (!files || !files[0]) {
          return isEditing ? true : "Debe seleccionar una imagen";
        }
        const maxSize = 10 * 1024 * 1024; // 10MB
        return (
          files[0].size <= maxSize ||
          "La imagen no debe superar los 10MB"
        );
      },
      fileType: files => {
        if (!files || !files[0]) {
          return isEditing ? true : "Debe seleccionar una imagen";
        }
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
  });

  // Efecto para cargar datos cuando se abre en modo edición
  useEffect(() => {
    if (isOpen && prendaParaEditar) {
      setValue("nombre", prendaParaEditar.nombre || "");
      setValue("tipo", prendaParaEditar.tipo || "");
      setValue("color", prendaParaEditar.color || "");
      setValue("ocacion", prendaParaEditar.ocacion || "");
      setValue("clima", prendaParaEditar.clima || "");
      setValue("genero", prendaParaEditar.genero || "");
      setSelectedImage(prendaParaEditar.imagenUrl || null);
    } else if (isOpen && !prendaParaEditar) {
      reset();
      setSelectedImage(null);
    }
  }, [isOpen, prendaParaEditar, setValue, reset]);

  const handleImageChange = async (event) => {
    imageRegister.onChange(event);

    const file = event.target.files[0];
    if (file) {

      const resultado = await validarImagenDeRopa(file);

      if (!resultado.ok) {
        alert(resultado.message || "La imagen no es de ropa.");
        return; // 🔥 frenamos todo
      }
    
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
      };
      reader.readAsDataURL(file);

    } else {
      if (!isEditing) {
        setSelectedImage(null);
      }
    }
    /*imageRegister.onChange(event);

    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      if (!isEditing) {
        setSelectedImage(null);
      }
    }*/
  };

  const removeImage = () => {
    if (isEditing) {
      setSelectedImage(prendaParaEditar?.imagenUrl || null);
    } else {
      setSelectedImage(null);
    }
    const fileInput = document.getElementById('imagen');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleFormSubmit = async (data) => {
    try {
      let resultado;
      if (isEditing) {
        resultado = await editarPrenda(prendaParaEditar?.garmentCode || prendaParaEditar?.codigo, data);
      } else {
        resultado = await crearPrenda(data);
      }

      if (resultado) {
        onGuardar();
      }
    } catch (error) {
      console.error("Error al guardar prenda:", error);
    }
  };

  const handleEliminar = async () => {
      try {
        const resultado = await eliminarPrenda(prendaParaEditar?.garmentCode || prendaParaEditar?.codigo);
        if (resultado && onEliminar) {
          onEliminar(prendaParaEditar);
        }
        handleClose();
      } catch (error) {
        console.error("Error al eliminar prenda:", error);
      }
  };

  const handleClose = () => {
    reset();
    setSelectedImage(null);
    setShowTooltip(false);
    onClose();
  };

  if (!isOpen) return null;

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl bg-black border border-gray/20 rounded-lg shadow-sm shadow-secondary max-h-[90vh] overflow-y-auto">

        {/* Contenido del modal */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 ">
            {/* Formulario - Lado izquierdo */}
          <div>
            <h2 className="text-2xl text-white font-medium mb-8">
              Nueva prenda
            </h2>
            <form
              id="prenda-modal-form"
              onSubmit={handleSubmit(handleFormSubmit)}
              className="space-y-4"
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




              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
                          <option value="">Seleccione uno</option>
                          <option value="superior">Superior</option>
                          <option value="inferior">Inferior</option>
                        </select>
                        {errors.tipo && (
                          <p className="text-error text-sm mt-1">
                            {errors.tipo.message}
                          </p>
                        )}
                      </div>

                      {/* Campo GENERO */}
                      <div>
                        <label htmlFor="genero" className="block text-sm text-gray mb-2">
                          Género
                        </label>
                        <select
                          id="genero"
                          {...register("genero", {
                            required: "Debe seleccionar un género",
                          })}
                          className="w-full px-4 py-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-transparent placeholder-gray"
                        >
                          <option value="">Seleccione uno</option>
                          <option value="hombre">Hombre</option>
                          <option value="mujer">Mujer</option>
                        </select>
                        {errors.genero && (
                          <p className="text-error text-sm mt-1">
                            {errors.genero.message}
                          </p>
                        )}
                      </div>
              </div>

              {/* Campo Color */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div>
                        <label htmlFor="color" className="block text-sm text-gray mb-2">
                          Color predominante
                        </label>
                        {/* Select de colores */}
                        <select
                          id="color"
                          {...register("color", { required: "Debe seleccionar un color" })}
                          className="w-full px-4 py-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-transparent placeholder-gray"
                        >
                          <option value="">Selecciona un color</option>
                          {colores.map((c) => (
                            <option key={c.id} value={c.nombre}>{c.nombre}</option>
                          ))}
                        </select>
                        {errors.color && (
                          <p className="text-error text-sm mt-1">
                            {errors.color.message}
                          </p>
                        )}
                      </div>

                      {/* Campo Clima */}
                      <div>
                        <label htmlFor="clima" className="block text-sm text-gray mb-2">
                          Clima predominante
                        </label>

                        {/* Select de climas */}
                        <select
                          id="clima"
                          {...register("clima", { required: "Debe seleccionar un clima" })}
                          className="w-full px-4 py-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-transparent placeholder-gray"
                        >
                          <option value="">Selecciona un clima</option>
                          {climas.map((c) => (
                            <option key={c.id} value={c.nombre}>{c.nombre}</option>
                          ))}
                        </select>
                        
                        {errors.clima && (
                          <p className="text-error text-sm mt-1">{errors.clima.message}</p>
                        )}
                      </div>
              </div>

              {/* Campo Tipo de evento */}
              <div>
                <label htmlFor="evento" className="block text-sm text-gray mb-2">
                  Ocaciones (ctrol + click para seleccionar más de una)
                </label>

                <select
                  id="ocasionesNombres"
                  multiple
                  size={5}
                  {...register("ocasionesNombres", {
                    required: "Debe seleccionar al menos una ocasión",
                  })}
                  onChange={(e) => {
                    const values = Array.from(e.target.selectedOptions, option => option.value);
                    setValue("ocacion", values);
                  }}
                  className="w-full px-4 py-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-transparent placeholder-gray"               
                  >
                  {ocaciones.map((o) => (
                    <option key={o.id} value={o.nombre}>
                      {o.nombre}
                    </option>
                  ))}
                </select>
                
                {errors.ocasionesNombres && (
                  <p className="text-error text-sm mt-1">
                    {errors.ocasionesNombres.message}
                  </p>
                )}
              </div>
              

              {/* Campo Sugerencias con picklist múltiple ----------------*/}
              <div>
                <label htmlFor="sugerencias" className="block text-sm text-gray mb-2">
                  Sugerir con otras prendas (Ctrl + click para seleccionar varias)
                </label>

                <select
                  id="sugerencias"
                  multiple
                  size={4}
                  onChange={(e) => {
                    const values = Array.from(e.target.selectedOptions, opt => opt.value);
                    setValue("sugerencias", values);
                  }}
                  className="w-full px-4 py-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-transparent placeholder-gray"
                >
                
                  {tipoSeleccionado === "superior" &&
                    marcaDetail?.garmentBottom?.content?.map((c) => (
                      <option key={c.id} value={c.garmentCode}>
                        {c.nombre}
                      </option>
                    ))}

                  {tipoSeleccionado === "inferior" &&
                    marcaDetail?.garmentTop?.content?.map((c) => (
                      <option key={c.id} value={c.garmentCode}>
                        {c.nombre}
                      </option>
                    ))}
                </select>
                  
                {errors.sugerencias && (
                  <p className="text-error text-sm mt-1">
                    {errors.sugerencias.message}
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
            <div className="flex items-center justify-center mt-6">
              <div className="relative h-full">
                <div className="flex items-center justify-between gap-2 mb-4">
                  <h4 className="text-lg font-medium text-gray">Imagen</h4>
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
                <div className="rounded-md bg-black min-w-sm border border-gray h-80">
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
                          {!isEditing && (
                            <Button
                              type="button"
                              variant="error"
                              width="fit"
                              onClick={removeImage}
                            >
                              Eliminar
                            </Button>
                          )}
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
                          <span className="font-medium">
                            {isEditing ? "Cambiar imagen" : "Agregar imagen"}
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
                            Elige un lugar iluminado para tomar la foto
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
        </div>

        {/* Footer del modal */}
        <div className="flex justify-between p-6 border-t border-gray/20">
          {/* Botón eliminar (solo en modo edición) */}
          <div>
            {isEditing && (
              <Button
                type="button"
                variant="text"
                onClick={handleEliminar}
                width="fit"
                color="error"
              >
                <Trash2 size={16} />
                Eliminar prenda
              </Button>
            )}
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              width="fit"
              color="gray"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              form="prenda-modal-form"
              disabled={isSubmitting || (!isFormValid && !isEditing)}
              width="fit"
            >
              {isSubmitting
                ? "Guardando..."
                : isEditing
                ? "Actualizar prenda"
                : "Guardar prenda"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrendaModal;