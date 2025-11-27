import { useState, useEffect, useCallback } from 'react';
import { adminService } from '../services/adminService.js';

export const useAdmin = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [loadingUsuarios, setLoadingUsuarios] = useState(false);
  const [loadingMarcas, setLoadingMarcas] = useState(false);
  const [errorUsuarios, setErrorUsuarios] = useState(null);
  const [errorMarcas, setErrorMarcas] = useState(null);
  const [criticalError, setCriticalError] = useState(null);

  // Estados para búsqueda
  const [busquedaUsuarios, setBusquedaUsuarios] = useState('');
  const [busquedaMarcas, setBusquedaMarcas] = useState('');

  // Cargar usuarios
  const fetchUsuarios = useCallback(async () => {
    setLoadingUsuarios(true);
    setErrorUsuarios(null);
    setCriticalError(null);
    try {
      const response = await adminService.obtenerUsuarios();
      setUsuarios(response.data.content || []);
    } catch (err) {
      if (err.isCritical) {
        setCriticalError(err);
      } else {
        setErrorUsuarios(err.message || 'Error al cargar los usuarios');
      }
    } finally {
      setLoadingUsuarios(false);
    }
  }, []);

  // Cargar marcas
  const fetchMarcas = useCallback(async () => {
    setLoadingMarcas(true);
    setErrorMarcas(null);
    setCriticalError(null);
    try {
      const response = await adminService.obtenerMarcasAdmin();
      setMarcas(response.data.content || []);
    } catch (err) {
      if (err.isCritical) {
        setCriticalError(err);
      } else {
        setErrorMarcas(err.message || 'Error al cargar las marcas');
      }
    } finally {
      setLoadingMarcas(false);
    }
  }, []);

  // Cambiar rol de usuario
  const cambiarRolUsuario = useCallback(async (userEmail, nuevoRol) => {
    try {
      await adminService.cambiarRolUsuario(userEmail, nuevoRol);
      // Actualizar el usuario en el estado local
      setUsuarios(prev => prev.map(usuario =>
        usuario.email === userEmail ? { ...usuario, role: nuevoRol } : usuario
      ));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || 'Error al cambiar rol del usuario' };
    }
  }, []);

  // Toggle estado activo usuario
  const toggleUsuarioActivo = useCallback(async (userEmail, activo) => {
    try {
      await adminService.toggleUsuarioActivo(userEmail, activo);
      // Actualizar el usuario en el estado local
      setUsuarios(prev => {
        const updated = prev.map(usuario =>
          usuario.email === userEmail ? { ...usuario, status: activo } : usuario
        );
        return updated;
      });

      return { success: true };
    } catch (err) {
      console.error('useAdmin - Error:', err);
      return { success: false, error: err.message || 'Error al cambiar estado del usuario' };
    }
  }, []);

  // Toggle estado activo marca
  const toggleMarcaActiva = useCallback(async (marcaId, activa) => {
    try {
      await adminService.toggleMarcaActiva(marcaId, activa);
      // Actualizar la marca en el estado local
      setMarcas(prev =>
        prev.map(m =>
          m.brand.codigoMarca === marcaId
            ? { ...m, status: activa, brandApproved: activa ? true : m.brandApproved }
            : m
        )
      );
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || 'Error al cambiar estado de la marca' };
    }
  }, []);

  // Filtrar usuarios según búsqueda
  const usuariosFiltrados = usuarios.filter(usuario => {
    if (!busquedaUsuarios) return true;
    const busqueda = busquedaUsuarios.toLowerCase();
    return (
      usuario.name.toLowerCase().includes(busqueda) ||
      usuario.lastName.toLowerCase().includes(busqueda) ||
      usuario.email.toLowerCase().includes(busqueda)
    );
  });

  // Filtrar marcas según búsqueda
  const marcasFiltradas = marcas.filter(marca => {
    if (!busquedaMarcas) return true;
    const busqueda = busquedaMarcas.toLowerCase();
    return (
      marca.name.toLowerCase().includes(busqueda) ||
      marca.brand.nombre.toLowerCase().includes(busqueda) ||
      marca.email.toLowerCase().includes(busqueda) ||
      marca.lastname.toLowerCase().includes(busqueda)
    );
  });

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchUsuarios();
    fetchMarcas();
  }, [fetchUsuarios, fetchMarcas]);

  return {
    // Estados de datos
    usuarios: usuariosFiltrados,
    marcas: marcasFiltradas,

    // Estados de loading
    loadingUsuarios,
    loadingMarcas,
    loading: loadingUsuarios || loadingMarcas,

    // Estados de error
    errorUsuarios,
    errorMarcas,
    criticalError,

    // Estados de búsqueda
    busquedaUsuarios,
    setBusquedaUsuarios,
    busquedaMarcas,
    setBusquedaMarcas,

    // Funciones de acción
    cambiarRolUsuario,
    toggleUsuarioActivo,
    toggleMarcaActiva,

    // Funciones de recarga
    refetchUsuarios: fetchUsuarios,
    refetchMarcas: fetchMarcas,
    refetch: () => {
      fetchUsuarios();
      fetchMarcas();
    }
  };
};