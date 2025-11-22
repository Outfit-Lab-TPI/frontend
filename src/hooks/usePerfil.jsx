import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from './auth/useAuth';
import { validationRules, createOptionalPasswordConfirmValidation } from '../lib/validations';
import { perfilService } from '../services/perfilService';
import { validateCustomImageLogic, VALIDATION_STATUS } from '../lib/imageBodyValidation';

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
    setError: setFormError,
    watch,
    reset
  } = useForm({
    mode: 'onChange'
  });

  const password = watch('password');

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || '',
        email: user.email || '',
        password: '',
        confirmPassword: ''
      });
      setSelectedImage(user.avatarUrl || null);
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
      formData.append('lastname', data.lastname);
      formData.append('email', data.email);

      if (data.password && data.password.trim() !== '') {
        formData.append('password', data.password);
        formData.append('confirmPassword', data.confirmPassword);
      }

      if (data.avatar && data.avatar[0]) {
        formData.append('userImg', data.avatar[0]);
      }
      /* 
      
      --- VER CON CAMI EL TEMA DE QUE YO ESPERO EL "USER EMAIL" COMO VALOR DEL PATH VARIABLE,
      --- y actualmente me llega undefined (entiendo pq hacen user.id pero pq usan algo del provider
      --- tal vez no se si será lo de enviar el token o cuando se logueann, dejar en local storage el email y acá
      --- lo recuperamos para poder enviarlo en el /api/users/update/{email} )

      --- por ahora dejo uno hardcodeado que se que existe en la bdd. 
      
      */

      let userEmail = user.id ? user.id : "german@gmail.com"; //--hardocdeado
      console.log("ACUALIZANDO PERFIL DEL USUARIO CON ID: ---------------: " + user.id + "- como no tenemos id, mando el email: " + userEmail)
      const response = await perfilService.actualizarPerfil("german@gmail.com", formData);

      updateUser({
        ...user,
        name: response.data.user.name,
        email: response.data.user.email,
        avatarUrl: response.data.user.userImg,
      });

      setSelectedImage(response.data.user.userImg);

      reset({
        name: response.data.user.name,
        lastName: response.data.user.lastName,
        email: response.data.user.email,
        password: '',
        confirmPassword: ''
      });

      if (onSuccess) {
        onSuccess();
      }

      return { success: true, message: 'Perfil actualizado correctamente' };

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
      email: user?.email || '',
      password: '',
      confirmPassword: ''
    });
    setSelectedImage(user?.avatarUrl || null);
  }, [user, reset]);

  const handleImageChange = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const removeImage = useCallback(() => {
    setSelectedImage(user?.avatarUrl || null);
    const fileInput = document.getElementById('avatar');
    if (fileInput) {
      fileInput.value = '';
    }
  }, [user?.avatarUrl]);

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
