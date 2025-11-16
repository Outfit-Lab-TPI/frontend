import { Link } from "react-router-dom";
import { useSignup } from "../hooks/auth/useSignup";
import Button from "../components/shared/Button";

function Signup() {
  const {
    register,
    handleSubmit,
    errors,
    isValid,
    isSubmitting,
    validationRules,
  } = useSignup();

  return (
    <div className="flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-gray/10 rounded-md p-8 shadow-xl">
        <h2 className="text-2xl text-white font-medium mb-8">Crear cuenta</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label htmlFor="email" className="block text-sm text-gray mb-2">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              {...register("email", validationRules.email)}
              className="w-full px-4 py-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-transparent placeholder-gray"
              placeholder="tu@email.com"
            />
            {errors.email && (
              <p className="text-error text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="name" className="block text-sm text-gray mb-2">
              Nombre
            </label>
            <input
              id="name"
              type="text"
              {...register("name", validationRules.name)}
              className="w-full px-4 py-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-transparent placeholder-gray"
              placeholder="Tu nombre"
            />
            {errors.name && (
              <p className="text-error text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm text-gray mb-2">
              Apellido
            </label>
            <input
              id="lastName"
              type="text"
              {...register("lastName", validationRules.lastName)}
              className="w-full px-4 py-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-transparent placeholder-gray"
              placeholder="Tu apellido"
            />
            {errors.lastName && (
              <p className="text-error text-sm mt-1">{errors.lastName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm text-gray mb-2">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              {...register("password", validationRules.password)}
              className="w-full px-4 py-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-transparent placeholder-gray"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-error text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

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
              className="w-full px-4 py-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-transparent placeholder-gray"
              placeholder="••••••••"
            />
            {errors.confirmPassword && (
              <p className="text-error text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-4 mt-8">
            {errors.submit && (
              <p className="text-error text-sm text-center">{errors.submit.message}</p>
            )}

            <Button
              type="submit"
              disabled={isSubmitting || !isValid}
            >
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