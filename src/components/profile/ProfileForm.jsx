import { Edit3, X, LogOut } from "lucide-react";
import Button from "../shared/Button";
import FormField from "../shared/FormField";

function ProfileForm({
  user,
  isEditing,
  onToggleEdit,
  onCancelEdit,
  onSubmit,
  onLogout,
  register,
  validationRules,
  errors,
  isValid,
  isSubmitting,
}) {
  return (
    <div className="md:col-span-3">
      <form onSubmit={onSubmit} className="h-full flex flex-col justify-between">
        <div className="space-y-4">
          {/* Header con título y icono de edición */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-white font-medium">
              {user?.name || "Usuario"}
            </h2>

            {/* Icono de edición/cancelar */}
            <Button
              type="button"
              onClick={isEditing ? onCancelEdit : onToggleEdit}
              variant="text"
              color="gray"
              width="fit"
            >
              {isEditing ? <X size={20} /> : <Edit3 size={20} />}
            </Button>
          </div>

          {/* Campo Nombre */}
          <FormField
            id="name"
            label="Nombre"
            type="text"
            register={register("name", validationRules.name)}
            disabled={!isEditing}
            error={errors.name}
          />

          {/* Campo Apellido */}
          <FormField
            id="lastname"
            label="Apellido"
            type="text"
            register={register("lastName", validationRules.lastName)}
            disabled={!isEditing}
            error={errors.lastName}
          />

          {/* Campo Correo electrónico */}
          <FormField
            id="email"
            label="Correo electrónico"
            type="email"
            register={register("email", validationRules.email)}
            disabled={!isEditing}
            error={errors.email}
          />

          {/* Campos de Contraseña */}
          {isEditing && (
            <>
              <FormField
                id="password"
                label="Nueva contraseña (opcional)"
                type="password"
                register={register("password", validationRules.passwordOptional)}
                placeholder="Dejar vacío para mantener la actual"
                error={errors.password}
              />

              <FormField
                id="confirmPassword"
                label="Confirmar nueva contraseña"
                type="password"
                register={register("confirmPassword", validationRules.confirmPassword)}
                placeholder="Confirmar nueva contraseña"
                error={errors.confirmPassword}
              />
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
              onClick={onLogout}
              type="button"
            >
              <LogOut />
              Cerrar sesión
            </Button>
          </div>
        )}

        {/* Boton de guardar cambios */}
        {isEditing && (
          <Button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="mt-10"
          >
            {isSubmitting ? "Guardando..." : "Guardar cambios"}
          </Button>
        )}
      </form>
    </div>
  );
}

export default ProfileForm;
