import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { signupService } from "../../services/auth/signupService";
import { Trigger } from "@radix-ui/react-dialog";
import { validationRules } from "../../lib/validations";

export const useSignup = () => {
    const navigate = useNavigate();

    const {
    register,
    handleSubmit: hookFormHandleSubmit,
    trigger,
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
                    // Registro marca
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
                    // Registro user
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

                localStorage.setItem('pendingVerificationEmail', data.email);
                
                alert(successData.message || "¡Registro exitoso! Por favor, verifica tu email.");
                
                const emailEncoded = encodeURIComponent(data.email);
                navigate(`/pending-verification?email=${emailEncoded}`); 

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