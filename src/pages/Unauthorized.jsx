import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/auth/useAuth';
import Button from '../components/shared/Button';

/**
 * Unauthorized page - Shown when user tries to access a route they don't have permission for
 */
function Unauthorized() {
  const navigate = useNavigate();
  const { isAdmin, isBrand, isUser } = useAuth();

  // Determine the correct home route based on user role
  const getHomeRoute = () => {
    if (isAdmin) return '/dashboard';
    if (isBrand) return '/brand-home';
    if (isUser) return '/home';
    return '/';
  };

  const handleGoHome = () => {
    navigate(getHomeRoute());
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-60px)] p-4">
      <div className="max-w-md w-full bg-gray/10 rounded-lg p-8 text-center space-y-6">
        <div className="text-6xl">🚫</div>

        <h1 className="text-2xl font-bold text-white">
          Acceso No Autorizado
        </h1>

        <p className="text-gray-300">
          No tienes permisos para acceder a esta página.
        </p>

        <div className="flex flex-col gap-3 pt-4">
          <Button onClick={handleGoHome}>
            Ir a inicio
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Volver atrás
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Unauthorized;
