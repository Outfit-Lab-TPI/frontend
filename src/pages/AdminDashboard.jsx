import { useState, useEffect } from 'react';
import { Search, Users, Store, Check, X, Shield, User } from 'lucide-react';
import { useAdmin } from '../hooks/useAdmin.jsx';

function AdminDashboard() {
  const {
    usuarios,
    marcas,
    loadingUsuarios,
    loadingMarcas,
    errorUsuarios,
    errorMarcas,
    criticalError,
    busquedaUsuarios,
    setBusquedaUsuarios,
    busquedaMarcas,
    setBusquedaMarcas,
    cambiarRolUsuario,
    toggleUsuarioActivo,
    toggleMarcaActiva
  } = useAdmin();

  const [tabActiva, setTabActiva] = useState('usuarios');
  const [operacionEnCurso, setOperacionEnCurso] = useState(null);

  // Lanzar excepción para errores críticos
  useEffect(() => {
    if (criticalError) {
      throw new Error(`Error crítico del servidor: ${criticalError.message || 'No se pudo conectar con el servidor'}`);
    }
  }, [criticalError]);

  const handleCambiarRol = async (usuarioId, rolActual) => {
    const nuevoRol = rolActual === 'administrador' ? 'usuario' : 'administrador';
    const key = `rol-${usuarioId}`;

    setOperacionEnCurso(key);
    const resultado = await cambiarRolUsuario(usuarioId, nuevoRol);
    setOperacionEnCurso(null);

    if (!resultado.success) {
      console.error('Error al cambiar rol:', resultado.error);
    }
  };

  const handleToggleUsuario = async (usuarioId, estadoActual) => {
    const nuevoEstado = !estadoActual;
    const key = `usuario-${usuarioId}`;

    setOperacionEnCurso(key);
    const resultado = await toggleUsuarioActivo(usuarioId, nuevoEstado);
    setOperacionEnCurso(null);

    if (!resultado.success) {
      console.error('Error al cambiar estado del usuario:', resultado.error);
    }
  };

  const handleToggleMarca = async (marcaId, estadoActual) => {
    const nuevoEstado = !estadoActual;
    const key = `marca-${marcaId}`;

    setOperacionEnCurso(key);
    const resultado = await toggleMarcaActiva(marcaId, nuevoEstado);
    setOperacionEnCurso(null);

    if (!resultado.success) {
      console.error('Error al cambiar estado de la marca:', resultado.error);
    }
  };

  const TablaUsuarios = () => {
    if (loadingUsuarios) {
      return (
        <div className="text-center py-10">
          <div className="text-lg text-gray">Cargando usuarios...</div>
        </div>
      );
    }

    if (errorUsuarios) {
      return (
        <div className="text-center py-10">
          <div className="text-lg text-error">Error: {errorUsuarios}</div>
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
              <th className="text-center font-medium p-3 text-sm">Rol</th>
              <th className="text-center font-medium p-3 text-sm">Estado</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id} className="border-b border-gray/20 hover:bg-gray/5">
                <td className="px-4 py-3 text-sm text-white">{usuario.nombre}</td>
                <td className="px-4 py-3 text-sm text-white">{usuario.apellido}</td>
                <td className="px-4 py-3 text-sm text-gray">{usuario.email}</td>
                <td className="px-4 py-3 text-center">
                  {usuario.verificado ? (
                    <Check className="w-5 h-5 text-success mx-auto" />
                  ) : (
                    <X className="w-5 h-5 text-error mx-auto" />
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  {/* Badge clickeable para rol */}
                  <button
                    onClick={() => handleCambiarRol(usuario.id, usuario.rol)}
                    disabled={operacionEnCurso === `rol-${usuario.id}`}
                    className={`group relative px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 disabled:opacity-50 cursor-pointer ${
                      usuario.rol === 'administrador'
                        ? 'bg-tertiary/20 text-tertiary hover:bg-secondary/30 hover:text-secondary'
                        : 'bg-secondary/20 text-secondary hover:bg-tertiary/30 hover:text-tertiary'
                    }`}
                  >
                    <span className="group-hover:hidden">
                      {usuario.rol === 'administrador' ? 'Administrador' : 'Usuario'}
                    </span>
                    <span className="hidden group-hover:inline">
                      {usuario.rol === 'administrador' ? 'Hacer Usuario' : 'Hacer Admin'}
                    </span>
                  </button>
                </td>
                <td className="px-4 py-3 text-center">
                  {/* Toggle switch para estado activo */}
                  <button
                    onClick={() => handleToggleUsuario(usuario.id, usuario.activo)}
                    disabled={operacionEnCurso === `usuario-${usuario.id}`}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50 ${
                      usuario.activo ? 'bg-success' : 'bg-error'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        usuario.activo ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                    <span className="sr-only">
                      {usuario.activo ? 'Desactivar usuario' : 'Activar usuario'}
                    </span>
                  </button>
                  <div className="mt-1 text-xs text-gray">
                    {usuario.activo ? 'Activo' : 'Bloqueado'}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const TablaMarcas = () => {
    if (loadingMarcas) {
      return (
        <div className="text-center py-10">
          <div className="text-lg text-gray">Cargando marcas...</div>
        </div>
      );
    }

    if (errorMarcas) {
      return (
        <div className="text-center py-10">
          <div className="text-lg text-error">Error: {errorMarcas}</div>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full bg-gray/10 rounded-lg overflow-hidden">
          <thead className="bg-gray/50">
            <tr>
              <th className="text-left font-medium p-3 text-sm">Nombre</th>
              <th className="text-left font-medium p-3 text-sm">Email</th>
              <th className="text-center font-medium p-3 text-sm">Verificado</th>
              <th className="text-center font-medium p-3 text-sm">Estado</th>
            </tr>
          </thead>
          <tbody>
            {marcas.map((marca) => (
              <tr key={marca.id} className="border-b border-gray/20 hover:bg-gray/5">
                <td className="px-4 py-3 text-sm text-white">{marca.nombre}</td>
                <td className="px-4 py-3 text-sm text-gray">{marca.email}</td>
                <td className="px-4 py-3 text-center">
                  {marca.verificado ? (
                    <Check className="w-5 h-5 text-success mx-auto" />
                  ) : (
                    <X className="w-5 h-5 text-error mx-auto" />
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  {/* Toggle switch para estado activo de marca */}
                  <button
                    onClick={() => handleToggleMarca(marca.id, marca.activa)}
                    disabled={operacionEnCurso === `marca-${marca.id}`}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50 ${
                      marca.activa ? 'bg-success' : 'bg-error'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        marca.activa ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                    <span className="sr-only">
                      {marca.activa ? 'Desactivar marca' : 'Activar marca'}
                    </span>
                  </button>
                  <div className="mt-1 text-xs text-gray">
                    {marca.activa ? 'Activa' : 'Inactiva'}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-4">
        <h1 className='mb-0'>Panel de Administración</h1>
        <p className="text-gray">Gestiona usuarios y marcas de la plataforma</p>

      {/* Tabs y Búsqueda */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex bg-gray/10 rounded-lg w-fit">
          <button
            onClick={() => setTabActiva('usuarios')}
            className={`flex items-center gap-2 p-2 px-6 rounded-l-full text-sm transition-colors border border-tertiary cursor-pointer ${
              tabActiva === 'usuarios'
                ? 'bg-tertiary text-black'
                : 'text-gray hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            Usuarios
          </button>
          <button
            onClick={() => setTabActiva('marcas')}
            className={`flex items-center gap-2 p-2 px-6 rounded-r-full text-sm transition-colors border border-tertiary cursor-pointer ${
              tabActiva === 'marcas'
                ? 'bg-tertiary text-black'
                : 'text-gray hover:text-white'
            }`}
          >
            <Store className="w-4 h-4" />
            Marcas
          </button>
        </div>

        {/* Búsqueda */}
        <div className="relative w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray w-5 h-5" />
          <input
            type="text"
            placeholder={tabActiva === 'usuarios' ? 'Buscar usuario...' : 'Buscar marca...'}
            value={tabActiva === 'usuarios' ? busquedaUsuarios : busquedaMarcas}
            onChange={(e) => {
              if (tabActiva === 'usuarios') {
                setBusquedaUsuarios(e.target.value);
              } else {
                setBusquedaMarcas(e.target.value);
              }
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray/30 placeholder-gray focus:ring-tertiary"
          />
        </div>
      </div>

      {/* Contenido de la tab activa */}
      {tabActiva === 'usuarios' ? (
        <div>
          <TablaUsuarios />
        </div>
      ) : (
        <div>
          <TablaMarcas />
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;