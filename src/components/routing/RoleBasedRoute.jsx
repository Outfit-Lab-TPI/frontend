import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/auth/useAuth';
import { ProtectedRoute } from './ProtectedRoute';

// Componente para envolver rutas protegidas
export function RoleBasedRoute({ allowedRoles, children }) {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      {allowedRoles.includes(user?.role) ? (
        children
      ) : (
        <Navigate to="/unauthorized" replace />
      )}
    </ProtectedRoute>
  );
}
