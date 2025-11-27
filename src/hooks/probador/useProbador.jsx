import { useState, useEffect, useCallback } from 'react';
import { usePaginacionCache } from './usePaginacionCache';
import { useFiltrosPrendas } from './useFiltrosPrendas.jsx';

export const useProbador = () => {
  // Estados de prendas
  const [prendasSuperioresOriginales, setPrendasSuperioresOriginales] = useState([]);
  const [prendasInferioresOriginales, setPrendasInferioresOriginales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [criticalError, setCriticalError] = useState(null);

  // Estados de paginación
  const [paginacionSuperiores, setPaginacionSuperiores] = useState({
    page: 0,
    size: 10,
    totalPages: 0,
    totalElements: 0,
    last: false
  });

  const [paginacionInferiores, setPaginacionInferiores] = useState({
    page: 0,
    size: 10,
    totalPages: 0,
    totalElements: 0,
    last: false
  });

  // Hook de caché y paginación
  const {
    loadingPagination,
    fetchPrendasSuperiores: fetchSuperioresCache,
    fetchPrendasInferiores: fetchInferioresCache,
    fetchInicial,
    actualizarFavoritoEnCache
  } = usePaginacionCache();

  // Hook de filtros
  const {
    filtros,
    todasLasPrendas,
    prendasCategorizadas,
    marcasDisponibles,
    coloresDisponibles,
    actualizarFiltros,
    limpiarFiltros
  } = useFiltrosPrendas(prendasSuperioresOriginales, prendasInferioresOriginales);

  // Función para cargar prendas superiores paginadas
  const fetchPrendasSuperiores = useCallback(async (page = 0) => {
    try {
      setError(null);
      setCriticalError(null);
      await fetchSuperioresCache(
        page,
        paginacionSuperiores.size,
        setPrendasSuperioresOriginales,
        setPaginacionSuperiores
      );
    } catch (err) {
      if (err.isCritical) {
        setCriticalError(err);
      } else {
        setError(err.response?.data?.message || 'Error al cargar las prendas superiores');
      }
    }
  }, [paginacionSuperiores.size, fetchSuperioresCache]);

  // Función para cargar prendas inferiores paginadas
  const fetchPrendasInferiores = useCallback(async (page = 0) => {
    try {
      setError(null);
      setCriticalError(null);
      await fetchInferioresCache(
        page,
        paginacionInferiores.size,
        setPrendasInferioresOriginales,
        setPaginacionInferiores
      );
    } catch (err) {
      if (err.isCritical) {
        setCriticalError(err);
      } else {
        setError(err.response?.data?.message || 'Error al cargar las prendas inferiores');
      }
    }
  }, [paginacionInferiores.size, fetchInferioresCache]);

  // Función para cargar todas las prendas inicialmente
  const fetchPrendas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setCriticalError(null);

      const datos = await fetchInicial();

      setPrendasSuperioresOriginales(datos.prendasSuperiores);
      setPrendasInferioresOriginales(datos.prendasInferiores);
      setPaginacionSuperiores(datos.paginacionSuperiores);
      setPaginacionInferiores(datos.paginacionInferiores);
    } catch (err) {
      if (err.isCritical) {
        setCriticalError(err);
      } else {
        setError(err.response?.data?.message || 'Error al cargar las prendas');
      }
    } finally {
      setLoading(false);
    }
  }, [fetchInicial]);

  // Efecto para cargar datos iniciales
  useEffect(() => {
    fetchPrendas();
  }, [fetchPrendas]);

  // Función para actualizar favorito localmente
  const actualizarFavoritoLocal = useCallback((codigoPrenda, esFavorita) => {
    // Actualizar estado actual
    setPrendasSuperioresOriginales(prev =>
      prev.map(prenda =>
        prenda.garmentCode === codigoPrenda ? { ...prenda, esFavorita } : prenda
      )
    );
    setPrendasInferioresOriginales(prev =>
      prev.map(prenda =>
        prenda.garmentCode === codigoPrenda ? { ...prenda, esFavorita } : prenda
      )
    );

    // Actualizar caché
    actualizarFavoritoEnCache(codigoPrenda, esFavorita);
  }, [actualizarFavoritoEnCache]);

  return {
    // Datos
    prendas: todasLasPrendas,
    prendasCategorizadas,

    // Estados de carga y error
    loading,
    loadingPagination,
    error,
    criticalError,

    // Filtros
    filtros,
    marcasDisponibles,
    coloresDisponibles,
    actualizarFiltros,
    limpiarFiltros,

    // Paginación
    paginacionSuperiores,
    paginacionInferiores,
    fetchPrendasSuperiores,
    fetchPrendasInferiores,

    // Utilidades
    actualizarFavoritoLocal,
    refetch: fetchPrendas
  };
};
