import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  Edit3,
  LogOut,
  ShoppingBag,
  X,
  CreditCard,
  Info,
  Camera,
} from "lucide-react";
import Button from "../components/shared/Button";
import { usePerfil } from "../hooks/usePerfil";
import { useAuth } from "../hooks/auth/useAuth";

function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const onSubmitSuccess = () => {
    setIsEditing(false);
  };

  const {
    register,
    handleSubmit,
    errors,
    isValid,
    isSubmitting,
    isValidatingImage,
    avatarValidationSuccess,
    validationRules,
    cancelEdit,
    selectedImage,
    handleImageChange,
    removeImage,
  } = usePerfil(onSubmitSuccess);

  const handleCancelEdit = () => {
    setIsEditing(false);
    cancelEdit();
  };

  // Wrapper para handleImageChange que activa el modo edición
  const handleImageChangeWithEdit = event => {
    handleImageChange(event);
    if (event.target.files && event.target.files[0]) {
      setIsEditing(true);
    }
  };

  // Wrapper para removeImage que activa el modo edición
  const removeImageWithEdit = () => {
    removeImage();
    setIsEditing(true);
  };

  const recomendaciones = [
    "Toma la foto de frente",
    "Elige un lugar bien iluminado",
    "Busca un fondo liso o neutro",
    "Asegurate de que la imagen tenga buena resolución",
  ];

  const {
    ref: avatarRef,
    onChange: onAvatarChange,
    ...restAvatar
  } = register("avatar");

  return (
    <div className="flex flex-col items-center justify-center p-4 gap-6 min-h-[calc(100vh-60px)]">
      {/* Card Principal de Profile */}
      <div className="w-full max-w-md md:max-w-4xl bg-gray/10 rounded-md p-8 shadow-xl space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Formulario - Lado izquierdo */}
          <div className="md:col-span-3">
            <form
              onSubmit={handleSubmit}
              className=" h-full flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Header con título y icono de edición */}
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-white font-medium">
                    {user?.name || "Usuario"}
                  </h2>

                  {/* Icono de edición/cancelar */}
                  <Button
                    type="button"
                    onClick={
                      isEditing ? handleCancelEdit : () => setIsEditing(true)
                    }
                    variant="text"
                    color="gray"
                    width="fit"
                  >
                    {isEditing ? <X size={20} /> : <Edit3 size={20} />}
                  </Button>
                </div>
                {/* Campo Nombre */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm text-gray mb-2"
                  >
                    Nombre
                  </label>
                  <input
                    id="name"
                    type="text"
                    {...register("name", validationRules.name)}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-transparent placeholder-gray disabled:opacity-60"
                  />
                  {errors.name && (
                    <p className="text-error text-xs mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Campo Apellido */}
                <div>
                  <label
                    htmlFor="lastname"
                    className="block text-sm text-gray mb-2"
                  >
                    Apellido
                  </label>
                  <input
                    id="lastname"
                    type="text"
                    {...register("lastName", validationRules.lastName)}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-transparent placeholder-gray disabled:opacity-60"
                  />
                  {errors.lastname && (
                    <p className="text-error text-xs mt-1">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>

                {/* Campo Correo electrónico */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm text-gray mb-2"
                  >
                    Correo electrónico
                  </label>
                  <input
                    id="email"
                    type="email"
                    {...register("email", validationRules.email)}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-transparent placeholder-gray disabled:opacity-60"
                  />
                  {errors.email && (
                    <p className="text-error text-xs mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Campo Contraseña */}
                {isEditing && (
                  <>
                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm text-gray mb-2"
                      >
                        Nueva contraseña (opcional)
                      </label>
                      <input
                        id="password"
                        type="password"
                        {...register("password", validationRules.passwordOptional)}
                        placeholder="Dejar vacío para mantener la actual"
                        className="w-full px-4 py-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-transparent placeholder-gray"
                      />
                      {errors.password && (
                        <p className="text-error text-xs mt-1">
                          {errors.password.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="block text-sm text-gray mb-2"
                      >
                        Confirmar nueva contraseña
                      </label>
                      <input
                        id="confirmPassword"
                        type="password"
                        {...register(
                          "confirmPassword",
                          validationRules.confirmPassword
                        )}
                        placeholder="Confirmar nueva contraseña"
                        className="w-full px-4 py-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-transparent placeholder-gray"
                      />
                      {errors.confirmPassword && (
                        <p className="text-error text-xs mt-1">
                          {errors.confirmPassword.message}
                        </p>
                      )}
                    </div>
                  </>
                )}

                {/* Mostrar errores generales */}
                {errors.submit && (
                  <div className="text-error text-xs text-center">
                    {errors.submit.message}
                  </div>
                )}
              </div>
              {/* Botón Cerrar sesión */}
              {!isEditing && (
                <div className="mt-8">
                  <Button
                    variant="outline"
                    color="error"
                    onClick={() => logout(navigate)}
                    type="button"
                  >
                    <LogOut />
                    Cerrar sesión
                  </Button>
                </div>
              )}

              {/* Boton de guardar cambios */}
              {isEditing && (
                 <Button type="submit" disabled={!isValid || isSubmitting} className="mt-10">
                   {isSubmitting ? "Guardando..." : "Guardar cambios"}
                 </Button>
              )}

            </form>
          </div>

          {/* Área de Imagen de Perfil - Lado derecho */}
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
                    className="transform hover:scale-140 hover:text-white hover:cursor-help"
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
                    onAvatarChange(e);        // Handler original de react-hook-form
                    await handleImageChangeWithEdit(e); // Tu lógica de preview
                    setIsEditing(true);
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
                        className="w-full object-cover rounded-lg max-h-[500px]"
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
                          onClick={removeImageWithEdit}
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
                          Esta imagen podrá usarse como avatar personalizado en
                          el probador virtual
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

              {(isValidatingImage || errors.avatar?.message || avatarValidationSuccess) && (
                <p className={`text-sm mt-1
                              ${isValidatingImage ? "text-yellow-500"
                                : avatarValidationSuccess ? "text-green-500"
                                : "text-red-500"}`}>
                  {isValidatingImage
                    ? "Validando imagen..."
                    : avatarValidationSuccess || errors.avatar?.message
                  }
                </p>
              )}
            </div>
          </div>
          
        </div>
        {/* Boton de guardar cambios
        {isEditing && (
          <Button type="submit" disabled={!isValid || isSubmitting}>
            {isSubmitting ? "Guardando..." : "Guardar cambios"}
          </Button>
        )}
        */}
      </div>

      <div className="w-full max-w-md md:max-w-4xl flex not-md:flex-col gap-6">
        {/* Card Mis outfits */}
        <div
          onClick={() => navigate("/mis-combinaciones")}
          className="w-full bg-gray/10 flex items-center justify-between rounded-sm p-6 shadow-xl cursor-pointer hover:bg-gray/20 transition-colors"
        >
          <div className="flex items-center gap-2 text-white">
            <ShoppingBag />
            <span className="text-lg font-medium">Mis outfits</span>
          </div>
          <ChevronRight />
        </div>
        <div
          onClick={() => navigate("/suscripcion")}
          className="w-full bg-gray/10 flex items-center justify-between rounded-sm p-6 shadow-xl cursor-pointer hover:bg-gray/20 transition-colors"
        >
          <div className="flex items-center gap-2 text-white">
            <CreditCard />
            <span className="text-lg font-medium">Mis subscripciones</span>
          </div>
          <ChevronRight />
        </div>
      </div>
    </div>
  );
}

export default Profile;
