import { Link } from "react-router-dom";
import { useLogin } from "../hooks/auth/useLogin";
import Button from "../components/shared/Button";

function Login() {
  const { register, handleSubmit, errors, isValid, isSubmitting } = useLogin();

  return (
    <div className="flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-gray/10 rounded-md p-8 shadow-xl">
        <h2 className="text-2xl text-white font-medium mb-8">Iniciar sesión</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campo Email */}
          <div>
            <label htmlFor="email" className="block text-sm text-gray mb-2">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              {...register("email", {
                required: "El email es requerido",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Email inválido",
                },
              })}
              className="w-full px-4 py-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-transparent placeholder-gray"
              placeholder="tu@email.com"
            />
            {errors.email && (
              <p className="text-error text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Campo Contraseña */}
          <div>
            <label htmlFor="password" className="block text-sm text-gray mb-2">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              {...register("password", {
                required: "La contraseña es requerida",
                minLength: {
                  value: 6,
                  message: "La contraseña debe tener al menos 6 caracteres",
                },
              })}
              className="w-full px-4 py-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-transparent placeholder-gray"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-error text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-4 mt-8">
            {/* Error general de submit */}
            {errors.submit && (
              <p className="text-error text-sm">{errors.submit.message}</p>
            )}
            {/* Botón Iniciar sesión */}
            <Button
              type="submit"
              disabled={isSubmitting || !isValid}
            >
              {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>

            {/* Link para Signup */}
            <div className="text-center">
              <span className="text-gray-400 text-sm">
                No tengo cuenta •{" "}
                <Link to="/signup" className="text-secondary hover:underline">
                  Registrarme
                </Link>
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
