import { Check, X } from 'lucide-react';

function TablaUsuarios({
  usuarios,
  loading,
  error,
  operacionEnCurso,
  onCambiarRol,
  onToggleEstado
}) {
  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="text-lg text-gray">Cargando usuarios...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <div className="text-lg text-error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-gray/10 rounded-lg overflow-hidden">
        <thead className="bg-gray/50">
          <tr>
            <th className="text-left font-medium p-3 text-sm">Nombre</th>
            <th className="text-left font-medium p-3 text-sm">Apellido</th>
            <th className="text-left font-medium p-3 text-sm">Email</th>
            <th className="text-center font-medium p-3 text-sm">Verificado</th>
            <th className="text-center font-medium p-3 text-sm min-w-40">Rol</th>
            <th className="text-center font-medium p-3 text-sm">Estado</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.email} className="border-b border-gray/20 hover:bg-gray/5">
              <td className="px-4 py-3 text-sm text-white">{usuario.name}</td>
              <td className="px-4 py-3 text-sm text-white">{usuario.lastName}</td>
              <td className="px-4 py-3 text-sm text-gray">{usuario.email}</td>
              <td className="px-4 py-3 text-center">
                {usuario.verified ? (
                  <Check className="w-5 h-5 text-success mx-auto" />
                ) : (
                  <X className="w-5 h-5 text-error mx-auto" />
                )}
              </td>
              <td className="px-4 py-3 text-center">
                {/* Badge clickeable para rol */}
                <button
                  onClick={() => onCambiarRol(usuario.email, usuario.role)}
                  disabled={operacionEnCurso === `rol-${usuario.email}`}
                  className={`group relative px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 disabled:opacity-50 cursor-pointer ${
                    usuario.role === 'administrador'
                      ? 'bg-tertiary/20 text-tertiary hover:bg-secondary/30 hover:text-secondary'
                      : 'bg-secondary/20 text-secondary hover:bg-tertiary/30 hover:text-tertiary'
                  }`}
                >
                  <span className="group-hover:hidden">
                    {usuario.role === 'administrador' ? 'Administrador' : 'Usuario'}
                  </span>
                  <span className="hidden group-hover:inline">
                    {usuario.role === 'administrador' ? 'Hacer Usuario' : 'Hacer Admin'}
                  </span>
                </button>
              </td>
              <td className="px-4 py-3 text-center">
                {/* Toggle switch para estado activo */}
                <button
                  onClick={() => onToggleEstado(usuario.email, usuario.status)}
                  disabled={operacionEnCurso === `usuario-${usuario.email}`}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50 ${
                    usuario.status ? 'bg-success' : 'bg-error'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      usuario.status ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                  <span className="sr-only">
                    {usuario.status ? 'Desactivar usuario' : 'Activar usuario'}
                  </span>
                </button>
                <div className="mt-1 text-xs text-gray">
                  {usuario.status ? 'Activo' : 'Bloqueado'}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TablaUsuarios;
