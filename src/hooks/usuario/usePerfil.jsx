import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../auth/useAuth';
import { validationRules, createOptionalPasswordConfirmValidation } from '../../lib/validations';
import { perfilService } from '../../services/usuario/perfilService';
import { validateCustomImageLogic, VALIDATION_STATUS } from '../../lib/imageBodyValidation';

export const usePerfil = (onSuccess) => {
  const { user, updateUser } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isValidatingImage, setIsValidatingImage] = useState(false);
  const [avatarValidationSuccess, setAvatarValidationSuccess] = useState(null);

  const { 
    register, 
    handleSubmit, 
    formState: { errors, isValid, isDirty }, 
    setError: setFormError, clearErrors, setValue, watch, reset
   } = useForm({ mode: 'onChange' });


  const password = watch('password');

  useEffect(() => {
    if (user) {
      // User data is now flattened, no need to extract user.user
      reset({
        name: user.name || '',
        lastName: user.lastName || '',
        email: user.email || '',
        password: '',
        confirmPassword: ''
      });
      setSelectedImage(user.userImg || null);
    }
  }, [user, reset]);

  const FILE_VALIDATION = {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    MESSAGES: {
      SIZE_ERROR: 'La imagen no debe superar los 5MB',
      TYPE_ERROR: 'Solo se permiten archivos JPG, PNG o WebP'
    }
  };

  const validateFile = {
    size: (files) => {
      if (!files?.[0]) return true;
      return files[0].size <= FILE_VALIDATION.MAX_SIZE || FILE_VALIDATION.MESSAGES.SIZE_ERROR;
    },

    type: (files) => {
      if (!files?.[0]) return true;
      return FILE_VALIDATION.ALLOWED_TYPES.includes(files[0].type) || FILE_VALIDATION.MESSAGES.TYPE_ERROR;
    },

    bodyValidation: async (files) => {
      if (!files?.[0]) {
        setIsValidatingImage(false);
        setAvatarValidationSuccess(null);
        return true;
      }

      setIsValidatingImage(true);
      setAvatarValidationSuccess(null);

      try {
        const validationResult = await validateCustomImageLogic(files[0]);

        if (validationResult.status === VALIDATION_STATUS.SUCCESS) {
          setAvatarValidationSuccess(validationResult.message);
          return true;
        } else {
          setAvatarValidationSuccess(null);
          return validationResult.message; 
        }
      } catch (error) {
        console.error('Error en validación de imagen:', error);
        setAvatarValidationSuccess(null);
        return 'Error procesando la imagen. Intenta nuevamente.';
      } finally {
        setIsValidatingImage(false);
      }
    }
  };

  const profileValidationRules = {
    name: validationRules.name,
    lastName: validationRules.lastName,
    email: validationRules.email,
    password: validationRules.passwordOptional,
    confirmPassword: createOptionalPasswordConfirmValidation(password),
    avatar: {
      validate: {
        fileSize: validateFile.size,
        fileType: validateFile.type,
        customBodyValidation: validateFile.bodyValidation
      }
    }
  };

  const onSubmit = useCallback(async (data) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('lastname', data.lastName);
      formData.append('email', data.email);
      if (data.password && data.password.trim() !== '') {
        formData.append('password', data.password);
        formData.append('confirmPassword', data.confirmPassword);
      }
      if (data.avatar && data.avatar[0]) {
        formData.append('userImg', data.avatar ? data.avatar[0] : '');
      }

      // Usar el email del usuario del contexto
      const userEmail = user?.email;
      if (!userEmail) {
        throw new Error('No se pudo obtener el email del usuario. Por favor, inicia sesión nuevamente.');
      }

      const response = await perfilService.actualizarPerfil(userEmail, formData);

      // Actualizar el contexto con los nuevos datos
      updateUser({
        name: response.user.name ?? user.name,
        email: response.user.email ?? user.email,
        lastName: response.user.lastName ?? user.lastName,
        userImg: response.user.userImg ?? user.userImg,
      });
      setSelectedImage(response.user.userImg);

      reset({
        name: response.user.name,
        lastName: response.user.lastName,
        email: response.user.email,
        password: '',
        confirmPassword: ''
      });

      if (onSuccess) {
        onSuccess();
      }

      return { success: true, message: response.message }; //actualizado corrrectamente

    } catch (error) {
      console.error('Error al actualizar perfil:', error);

      if (error.isCritical) {
        throw error;
      } else {
        if (error.message?.includes('email ya está en uso')) {
          setFormError('email', {
            type: 'manual',
            message: error.message
          });
        } else {
          setFormError('submit', {
            type: 'manual',
            message: error.message || 'Error al actualizar el perfil. Intenta nuevamente.'
          });
        }
      }

      return { success: false, error: error.message };
    } finally {
      setIsSubmitting(false);
    }
  }, [user, updateUser, setFormError, reset, onSuccess]);

  const cancelEdit = useCallback(() => {
    reset({
      name: user?.name || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      password: '',
      confirmPassword: ''
    });
    setSelectedImage(user?.userImg || null);
    clearErrors("avatar");
    setAvatarValidationSuccess(null);
  }, [user, reset, clearErrors]);


const handleImageChange = useCallback(async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => setSelectedImage(e.target.result);
  reader.readAsDataURL(file);

  setIsValidatingImage(true);
  setAvatarValidationSuccess(null);

  try {
      const result = await validateFile.bodyValidation([file]);

      if (result === true) {
        setAvatarValidationSuccess("Imagen válida: Persona completa detectada");
        clearErrors("avatar");
      } else {
        setAvatarValidationSuccess(null);
        setFormError("avatar", { type: "manual", message: result });
      }
    } catch (err) {
      console.error(err);
      setAvatarValidationSuccess(null);
      setFormError("avatar", { type: "manual", message: "Error procesando la imagen" });
    } finally {
      setIsValidatingImage(false);
    }
  }, [setFormError]);

  // ----- remover imagen ----------------------------------------
  const removeImage = useCallback(() => {
    setSelectedImage(null);
    setValue('avatar', null);
    const fileInput = document.getElementById('avatar');
    if (fileInput) {
      fileInput.value = '';
    }
    clearErrors("avatar");
    setAvatarValidationSuccess(null);
  }, [setValue, clearErrors]);
  // ----- fin remover imagen ----------------------------------------


  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isValid,
    isDirty,
    isSubmitting,
    isValidatingImage,
    avatarValidationSuccess,
    validationRules: profileValidationRules,
    cancelEdit,
    selectedImage,
    handleImageChange,
    removeImage
  };
};
