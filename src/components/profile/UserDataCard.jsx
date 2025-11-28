import { useState } from "react";
import { useAuth } from "../../hooks/auth/useAuth";
import { useNavigate } from "react-router-dom";
import { usePerfil } from "../../hooks/usuario/usePerfil";
import ProfileForm from "./ProfileForm";
import ProfileAvatar from "./ProfileAvatar";

function UserDataCard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

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

  const handleToggleEdit = () => {
    setIsEditing(true);
  };

  const handleLogout = () => {
    logout(navigate);
  };

  // Wrapper para handleImageChange que activa el modo edición
  const handleImageChangeWithEdit = async (event) => {
    await handleImageChange(event);
    if (event.target.files && event.target.files[0]) {
      setIsEditing(true);
    }
  };

  // Wrapper para removeImage que activa el modo edición
  const removeImageWithEdit = () => {
    removeImage();
    setIsEditing(true);
  };

  return (
    <div className="w-full max-w-md md:max-w-4xl bg-gray/10 rounded-md p-8 shadow-xl space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Formulario - Lado izquierdo */}
        <ProfileForm
          user={user}
          isEditing={isEditing}
          onToggleEdit={handleToggleEdit}
          onCancelEdit={handleCancelEdit}
          onSubmit={handleSubmit}
          onLogout={handleLogout}
          register={register}
          validationRules={validationRules}
          errors={errors}
          isValid={isValid}
          isSubmitting={isSubmitting}
          isValidatingImage={isValidatingImage}
          avatarValidationSuccess={avatarValidationSuccess}
        />

        {/* Área de Imagen de Perfil - Lado derecho */}
        <ProfileAvatar
          selectedImage={selectedImage}
          register={register("avatar")}
          onImageChange={handleImageChangeWithEdit}
          onImageRemove={removeImageWithEdit}
          isValidatingImage={isValidatingImage}
          avatarValidationSuccess={avatarValidationSuccess}
          error={errors.avatar}
        />
      </div>
    </div>
  );
}

export default UserDataCard;
