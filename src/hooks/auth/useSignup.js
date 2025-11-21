import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { signupService } from "../../services/auth/signupService"; 
import { Trigger } from "@radix-ui/react-dialog";

export const useSignup = () => {
    const navigate = useNavigate();
    
    const validationRules = {
        email: {
            required: "El correo electrónico es obligatorio.",
            pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: "Correo electrónico inválido.",
            },
        },
        name: {
            required: "El nombre es obligatorio.",
            minLength: {
                value: 2,
                message: "El nombre debe tener al menos 2 caracteres.",
            },
        },
        lastName: {
            required: "El apellido es obligatorio.",
            minLength: {
                value: 2,
                message: "El apellido debe tener al menos 2 caracteres.",
            },
        },
        password: {
            required: "La contraseña es obligatoria.",
            minLength: {
                value: 8,
                message: "La contraseña debe tener al menos 8 caracteres.",
            },
            pattern: {
                value: /^(?=.*[A-Z])(?=.*\d).*$/, 
                message: "Debe contener al menos una mayúscula y un número.",
            },
        },
        confirmPassword: {
            required: "Confirma la contraseña.",
        },
    };

    
   /* const {
        register,
        handleSubmit: hookFormHandleSubmit,
        formState: { errors, isValid, isSubmitting },
        setError,
        getValues,
    } = useForm({ mode: "onBlur" });*/

    const {
    register,
    handleSubmit: hookFormHandleSubmit,
    trigger, // <-- agregado
    formState: { errors, isValid, isSubmitting },
    setError,
    getValues,
} = useForm({ mode: "onChange" });



    const handleSubmit = (isBrand) => hookFormHandleSubmit(async (data) => {
        
        if (data.password !== data.confirmPassword) {
            setError("confirmPassword", {
                type: "manual",
                message: "Las contraseñas no coinciden.",
            });
            return;
        }

        try {

            let payload;

                if (isBrand) {
                    // ------------------------
                    // REGISTRO DE MARCA
                    // ------------------------
                    payload = new FormData();
                    payload.append("email", data.email);
                    payload.append("name", data.name);
                    payload.append("lastName", data.lastName);
                    payload.append("password", data.password);

                    payload.append("brandName", data.nombreMarca || "");
                    payload.append("urlSite", data.sitioUrl || "");

                    if (data.logoImage?.[0]) {
                        payload.append("logoBrand", data.logoImage[0]);
                    }
                    payload.append("registerAsBrand", true)

                } else {
                    // ------------------------
                    // REGISTRO NORMAL
                    // ------------------------
                    payload = {
                        email: data.email,
                        name: data.name,
                        lastName: data.lastName,
                        password: data.password,
                    };
                }

                const successData = await signupService(payload, isBrand);

                alert("¡Registro exitoso! Verifica tu email.");
                navigate("/pending-verification");


            /*const successData = await signupService({
                email: data.email,
                name: data.name,
                lastName: data.lastName,
                password: data.password,
            });

            alert("¡Registro exitoso! Por favor, verifica tu email.");
            navigate("/pending-verification");*/

        } catch (error) {
            if (error.response) {
                const errorData = error.response.data;

                if (error.response.status === 400 && typeof errorData === 'object') {
                    Object.keys(errorData).forEach(field => {
                        setError(field, { type: "server", message: errorData[field] });
                    });
                } else if (errorData.email) {
                    setError("email", { type: "server", message: errorData.email });
                } else {
                    setError("submit", { 
                        type: "server", 
                        message: "Hubo un error al crear la cuenta. Intenta de nuevo." 
                    });
                }
            } else {
                console.error("Error de conexión:", error);
                setError("submit", {
                    type: "network",
                    message: "Error de conexión con el servidor. Verifica tu conexión.",
                });
            }
        }
    });

    return {
        register,
        handleSubmit,
        errors,
        isValid,
        isSubmitting,
        validationRules,
        getValues,
        trigger
    };
};