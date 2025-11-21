import { Link } from "react-router-dom";
import { useSignup } from "../hooks/auth/useSignup";
import Button from "../components/shared/Button";
import ToggleBrandApproval from "../components/shared/ToggleBrandApproval";
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";

function Signup() {
  const {
    register,
    handleSubmit,
    errors,
    isValid,
    isSubmitting,
    validationRules,
    onSubmit,
    trigger, // ⭐ AGREGADO: necesario para revalidar
  } = useSignup();

  const [isBrand, setIsBrand] = useState(false);
  const [selectedLogo, setSelectedLogo] = useState(null);

  // ⭐ AGREGADO: Revalidar cuando cambia el toggle
  useEffect(() => {
    trigger(); 
  }, [isBrand]);

  // Logo validation rules (YA ESTABA OK)
  const logoRegister = register("logoImage", {
    required: isBrand ? "Debes subir un logo" : false,
    validate: isBrand
      ? {
          size: (fileList) => {
            if (!fileList?.[0]) return "Debes subir un logo";
            return (
              fileList[0].size <= 5 * 1024 * 1024 ||
              "El logo no debe superar 5MB"
            );
          },
          type: (fileList) => {
            if (!fileList?.[0]) return "Debes subir un logo";
            return (
              ["image/png", "image/jpeg", "image/webp"].includes(
                fileList[0].type
              ) || "Formato inválido"
            );
          },
        }
      : undefined,
  });

  return (
    <div className="flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-gray/10 rounded-md p-8 shadow-xl">
        <h2 className="text-2xl text-white font-medium mb-8">Crear cuenta</h2>

        <form onSubmit={handleSubmit((data) => onSubmit(data, isBrand))} className="space-y-4">

          {/* EMAIL */}
          <div>
            <label htmlFor="email" className="block text-sm text-gray mb-2">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              {...register("email", validationRules.email)}
              className="w-full px-4 py-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-tertiary"
              placeholder="tu@email.com"
            />
            {errors.email && (
              <p className="text-error text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* NOMBRE */}
          <div>
            <label htmlFor="name" className="block text-sm text-gray mb-2">
              Nombre
            </label>
            <input
              id="name"
              type="text"
              {...register("name", validationRules.name)}
              className="w-full px-4 py-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-tertiary"
              placeholder="Tu nombre"
            />
            {errors.name && (
              <p className="text-error text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* APELLIDO */}
          <div>
            <label htmlFor="lastName" className="block text-sm text-gray mb-2">
              Apellido
            </label>
            <input
              id="lastName"
              type="text"
              {...register("lastName", validationRules.lastName)}
              className="w-full px-4 py-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-tertiary"
              placeholder="Tu apellido"
            />
            {errors.lastName && (
              <p className="text-error text-sm mt-1">{errors.lastName.message}</p>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <label htmlFor="password" className="block text-sm text-gray mb-2">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              {...register("password", validationRules.password)}
              className="w-full px-4 py-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-tertiary"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-error text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm text-gray mb-2"
            >
              Confirmar contraseña
            </label>
            <input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword", validationRules.confirmPassword)}
              className="w-full px-4 py-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-tertiary"
              placeholder="••••••••"
            />
            {errors.confirmPassword && (
              <p className="text-error text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* CAMPOS EXTRA SI ES MARCA */}
          {isBrand && (
            <>
              {/* NOMBRE MARCA */}
              <div>
                <label htmlFor="nombreMarca" className="block text-sm text-gray mb-2">
                  Nombre de la marca
                </label>
                <input
                  id="nombreMarca"
                  type="text"
                  {...register("nombreMarca", {
                    required: isBrand ? "El nombre de la marca es obligatorio" : false, // ⭐ AGREGADO
                  })}
                  className="w-full px-4 py-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-tertiary"
                  placeholder="Mi marca"
                />
                {errors.nombreMarca && (
                  <p className="text-error text-sm mt-1">{errors.nombreMarca.message}</p>
                )}
              </div>

              {/* SITIO WEB */}
              <div>
                <label htmlFor="sitioUrl" className="block text-sm text-gray mb-2">
                  Sitio web
                </label>
                <input
                  id="sitioUrl"
                  type="url"
                  {...register("sitioUrl", {
                    required: isBrand ? "El sitio web es obligatorio" : false, // ⭐ AGREGADO
                  })}
                  className="w-full px-4 py-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-tertiary"
                  placeholder="https://mi-marca.com"
                />
                {errors.sitioUrl && (
                  <p className="text-error text-sm mt-1">{errors.sitioUrl.message}</p>
                )}
              </div>

              {/* LOGO */}
              <div className="rounded-md bg-black h-[180px] mt-4">
                <input
                  id="logoImage"
                  type="file"
                  accept="image/*"
                  name={logoRegister.name}
                  ref={logoRegister.ref}
                  onBlur={logoRegister.onBlur}
                  onChange={(e) => {
                    logoRegister.onChange(e);
                    const file = e.target.files?.[0];

                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (ev) => setSelectedLogo(ev.target.result);
                      reader.readAsDataURL(file);
                    } else {
                      setSelectedLogo(null);
                    }
                  }}
                  className="hidden"
                />

                {selectedLogo ? (
                  <div className="relative h-full">
                    <img
                      src={selectedLogo}
                      alt="Logo Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />

                    <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-4">
                      <label
                        htmlFor="logoImage"
                        className="cursor-pointer border border-white text-white px-4 py-2 rounded-sm hover:bg-white/10"
                      >
                        Cambiar
                      </label>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedLogo(null);
                          const f = document.getElementById("logoImage");
                          if (f) f.value = "";
                        }}
                        className="text-red-400 hover:text-red-300"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ) : (
                  <label
                    htmlFor="logoImage"
                    className="cursor-pointer block p-8 text-center rounded-lg h-full"
                  >
                    <div className="flex flex-col items-center justify-center h-full gap-2 text-gray hover:text-white">
                      <Plus className="w-10 h-10" />
                      <span className="font-medium">Subir logo</span>
                    </div>
                  </label>
                )}
              </div>

              {errors.logoImage && (
                <p className="text-error text-sm mt-2">{errors.logoImage.message}</p>
              )}
            </>
          )}

          {/* TOGGLE REGISTRAR MARCA */}
          <div className="flex items-center gap-3 mt-6">
            <span className="text-gray text-sm">¿Registrar una marca?</span>
            <ToggleBrandApproval
              value={isBrand}
              onChange={(newVal) => setIsBrand(newVal)}
            />
          </div>

          {/* BOTÓN */}
          <div className="flex flex-col gap-4 mt-8">
            <Button type="submit" disabled={isSubmitting || !isValid}>
              {isSubmitting ? "Creando cuenta..." : "Registrarse"}
            </Button>

            <div className="text-center">
              <span className="text-gray text-sm">
                Ya tengo cuenta •{" "}
                <Link to="/login" className="text-secondary hover:underline">
                  Iniciar sesión
                </Link>
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
