import { useState } from "react";
import { CircleUserRound, ChevronRight, Edit3, LogOut, ShoppingBag, X } from "lucide-react";
import Button from "../components/shared/Button";
import { useProfile } from "../hooks/auth/useProfile";
import { useAuth } from "../hooks/auth/useAuth";

function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const { user, logout } = useAuth();

  const onSubmitSuccess = () => {
    setIsEditing(false);
  };

  const {
    register,
    handleSubmit,
    errors,
    isValid,
    isDirty,
    isSubmitting,
    validationRules,
    cancelEdit
  } = useProfile(onSubmitSuccess);

  const handleCancelEdit = () => {
    setIsEditing(false);
    cancelEdit();
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 gap-6">
      {/* Card Principal de Profile */}
      <div className="w-full max-w-xl bg-gray/10 rounded-md p-8 shadow-xl">
        {/* Header con foto de perfil y icono de edición */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            {/* Foto de perfil clickeable */}
            <div className="relative cursor-pointer">
              <CircleUserRound size={64} className="stroke-1 stroke-gray " />
            </div>
            <h2 className="text-2xl text-white font-medium">{user?.name || 'Usuario'}</h2>
          </div>

          {/* Icono de edición/cancelar */}
          <Button
            onClick={isEditing ? handleCancelEdit : () => setIsEditing(true)}
            variant="text"
            color="gray"
            width="fit"
          >
            {isEditing ? <X size={20} /> : <Edit3 size={20} />}
          </Button>
        </div>

        {/* Campos del formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campo Nombre */}
          <div>
            <label htmlFor="name" className="block text-sm text-gray mb-2">
              Nombre
            </label>
            <input
              id="name"
              type="text"
              {...register('name', validationRules.name)}
              disabled={!isEditing}
              className="w-full px-4 py-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-transparent placeholder-gray disabled:opacity-60"
            />
            {errors.name && (
              <p className="text-error text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Campo Correo electrónico */}
          <div>
            <label htmlFor="email" className="block text-sm text-gray mb-2">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              {...register('email', validationRules.email)}
              disabled={!isEditing}
              className="w-full px-4 py-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-transparent placeholder-gray disabled:opacity-60"
            />
            {errors.email && (
              <p className="text-error text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Campo Contraseña */}
          {isEditing && (
            <>
              <div>
                <label htmlFor="password" className="block text-sm text-gray mb-2">
                  Nueva contraseña (opcional)
                </label>
                <input
                  id="password"
                  type="password"
                  {...register('password', validationRules.password)}
                  placeholder="Dejar vacío para mantener la actual"
                  className="w-full px-4 py-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-transparent placeholder-gray"
                />
                {errors.password && (
                  <p className="text-error text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm text-gray mb-2">
                  Confirmar nueva contraseña
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  {...register('confirmPassword', validationRules.confirmPassword)}
                  placeholder="Confirmar nueva contraseña"
                  className="w-full px-4 py-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-transparent placeholder-gray"
                />
                {errors.confirmPassword && (
                  <p className="text-error text-sm mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>
            </>
          )}

          {/* Mostrar errores generales */}
          {errors.submit && (
            <div className="text-error text-sm text-center">
              {errors.submit.message}
            </div>
          )}

          {/* Botón Cerrar sesión / Guardar cambios */}
          <div className="mt-8">
            {isEditing ? (
              <Button
                type="submit"
                disabled={!isValid || isSubmitting}
              >
                {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
              </Button>
            ) : (
              <Button
                variant="outline"
                color='error'
                onClick={logout}
                type="button"
              >
                <LogOut />
                Cerrar sesión
              </Button>
            )}
          </div>
        </form>
      </div>

      {/* Card Mis outfits */}
      <div className="w-full max-w-xl bg-gray/10 flex items-center justify-between rounded-sm p-6 shadow-xl cursor-pointer hover:bg-gray/20 transition-colors">
        <div className="flex items-center gap-2 text-white">
          <ShoppingBag  />
          <span className="text-lg font-medium">Mis outfits</span>
        </div>
        <ChevronRight />
      </div>
    </div>
  );
}

export default Profile;