import { useState, useEffect } from 'react';
import { Search, Users, Store } from 'lucide-react';
import { useAdmin } from '../hooks/useAdmin.jsx';
import TablaUsuarios from '../components/admin/TablaUsuarios.jsx';
import TablaMarcas from '../components/admin/TablaMarcas.jsx';

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

  const handleCambiarRol = async (usuarioEmail, rolActual, tempId) => {
    const nuevoRol = rolActual === 'administrador' ? 'usuario' : 'administrador';
    const key = `rol-${tempId}`;

    setOperacionEnCurso(key);
    const resultado = await cambiarRolUsuario(usuarioEmail, nuevoRol);
    setOperacionEnCurso(null);

    if (!resultado.success) {
      console.error('Error al cambiar rol:', resultado.error);
    }
  };

  const handleToggleUsuario = async (usuarioEmail, estadoActual, tempId) => {
    const nuevoEstado = !estadoActual;
    const key = `usuario-${tempId}`;

    setOperacionEnCurso(key);
    const resultado = await toggleUsuarioActivo(usuarioEmail, nuevoEstado);
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
          <TablaUsuarios
            usuarios={usuarios}
            loading={loadingUsuarios}
            error={errorUsuarios}
            operacionEnCurso={operacionEnCurso}
            onCambiarRol={handleCambiarRol}
            onToggleEstado={handleToggleUsuario}
          />
        </div>
      ) : (
        <div>
          <TablaMarcas
            marcas={marcas}
            loading={loadingMarcas}
            error={errorMarcas}
            operacionEnCurso={operacionEnCurso}
            onToggleEstado={handleToggleMarca}
          />
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;