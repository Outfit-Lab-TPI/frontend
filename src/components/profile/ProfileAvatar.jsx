import { useState } from "react";
import { Camera, Info } from "lucide-react";
import Button from "../shared/Button";

function ProfileAvatar({
  selectedImage,
  register,
  onImageChange,
  onImageRemove,
  isValidatingImage,
  avatarValidationSuccess,
  error,
}) {
  const [showTooltip, setShowTooltip] = useState(false);

  const recomendaciones = [
    "Toma la foto de frente",
    "Elige un lugar bien iluminado",
    "Busca un fondo liso o neutro",
    "Asegurate de que la imagen tenga buena resolución",
  ];

  const { ref: avatarRef, onChange: onAvatarChange, ...restAvatar } = register;

  return (
    <div className="h-full md:col-span-2">
      <div className="relative h-full">
        {/* Área de imagen */}
        <div className="rounded-md bg-black h-full relative">
          {/* Ícono de info posicionado sobre la imagen */}
          <div className="absolute top-3 right-3 z-10">
            <Button
              variant="text"
              width="fit"
              color="gray"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="transform hover:scale-140 hover:text-white hover:cursor-help p-4"
            >
              <Info size={18} />
            </Button>
          </div>
          <input
            id="avatar"
            type="file"
            accept="image/*"
            ref={avatarRef}
            onChange={async (e) => {
              onAvatarChange(e);
              await onImageChange(e);
            }}
            {...restAvatar}
            className="hidden"
          />

          {!showTooltip ? (
            selectedImage ? (
              /* Preview de imagen de perfil */
              <div className="relative h-full flex justify-center items-center">
                <img
                  src={selectedImage}
                  alt="Avatar"
                  className="w-full object-contain rounded-lg max-h-[380px]"
                />
                {/* Overlay con opciones */}
                <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-4">
                  <label
                    htmlFor="avatar"
                    className="cursor-pointer border border-white text-white px-4 py-2 rounded-sm transition-colors hover:bg-white/10"
                  >
                    Cambiar
                  </label>
                  <Button
                    type="button"
                    variant="error"
                    width="fit"
                    onClick={onImageRemove}
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            ) : (
              /* Área clickeable para subir avatar */
              <label
                htmlFor="avatar"
                className="cursor-pointer block p-8 text-center transition-colors rounded-lg h-full overflow-hidden"
              >
                <div className="flex flex-col items-center justify-center h-full gap-2 text-gray hover:text-white">
                  <Camera className="w-12 h-12 mt-12" />
                  <span className="font-medium text-lg">
                    Subir imagen de perfil
                  </span>
                  <p className="font-family-secondary text-xs text-gray mt-2">
                    Esta imagen podrá usarse como avatar personalizado en el
                    probador virtual
                  </p>
                </div>
              </label>
            )
          ) : (
            /* Recomendaciones para foto de perfil */
            <div className="p-8 h-full flex flex-col justify-center">
              <h4 className="font-medium mb-4 text-center text-lg">
                Recomendaciones
              </h4>
              <ul className="text-sm text-gray-300">
                {recomendaciones.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-white text-lg">•</span>
                    <span className="leading-relaxed mt-1">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {(isValidatingImage || error?.message || avatarValidationSuccess) && (
          <p
            className={`text-sm mt-1
                            ${
                              isValidatingImage
                                ? "text-yellow-500"
                                : avatarValidationSuccess
                                  ? "text-green-500"
                                  : "text-red-500"
                            }`}
          >
            {isValidatingImage
              ? "Validando imagen..."
              : avatarValidationSuccess || error?.message}
          </p>
        )}
      </div>
    </div>
  );
}

export default ProfileAvatar;
