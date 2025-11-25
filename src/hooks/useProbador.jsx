import { useState, useEffect, useMemo, useCallback } from 'react';
import { probadorService } from '../services/probadorService.js';
import { favoritosService } from '../services/favoritosService.js';

export const useProbador = () => {
  // Estados de prendas
  const [prendasSuperioresOriginales, setPrendasSuperioresOriginales] = useState([]);
  const [prendasInferioresOriginales, setPrendasInferioresOriginales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingPagination, setLoadingPagination] = useState(false);
  const [error, setError] = useState(null);
  const [criticalError, setCriticalError] = useState(null);

  // Cache de páginas y favoritos
  const [cacheSuperiores, setCacheSuperiores] = useState({});
  const [cacheInferiores, setCacheInferiores] = useState({});
  const [codigosFavoritasCache, setCodigosFavoritasCache] = useState(null);

  // Estados de paginación para superiores
  const [paginacionSuperiores, setPaginacionSuperiores] = useState({
    page: 0,
    size: 10,
    totalPages: 0,
    totalElements: 0,
    last: false
  });

  // Estados de paginación para inferiores
  const [paginacionInferiores, setPaginacionInferiores] = useState({
    page: 0,
    size: 10,
    totalPages: 0,
    totalElements: 0,
    last: false
  });

  // Estados de filtros
  const [filtros, setFiltros] = useState({
    marca: '',
    color: '',
    soloFavoritas: false
  });

  // Función para cargar prendas superiores paginadas
  const fetchPrendasSuperiores = useCallback(async (page = 0) => {
    try {
      // Verificar si la página ya está en caché
      if (cacheSuperiores[page]) {
        setPrendasSuperioresOriginales(cacheSuperiores[page].prendas);
        setPaginacionSuperiores(cacheSuperiores[page].paginacion);
        return;
      }

      setLoadingPagination(true);
      setError(null);
      setCriticalError(null);

      // Cargar favoritos solo si no están en caché
      let codigosFavoritas;
      if (codigosFavoritasCache) {
        codigosFavoritas = codigosFavoritasCache;
      } else {
        const responseFavoritas = await favoritosService.obtenerPrendasFavoritas().catch(() => ({ data: { content: [] } }));
        const prendasFavoritas = responseFavoritas.data?.content || responseFavoritas.data || [];
        codigosFavoritas = new Set(prendasFavoritas.map(prenda => prenda.garmentCode));
        setCodigosFavoritasCache(codigosFavoritas);
      }

      const responseSuperiores = await probadorService.obtenerPrendasSuperiores({}, page, paginacionSuperiores.size);

      const prendasSuperioresConFavoritas = (responseSuperiores.data.content || []).map(prenda => ({
        ...prenda,
        esFavorita: codigosFavoritas.has(prenda.garmentCode)
      }));

      const paginacionData = {
        page: responseSuperiores.data.page,
        size: responseSuperiores.data.size,
        totalPages: responseSuperiores.data.totalPages,
        totalElements: responseSuperiores.data.totalElements,
        last: responseSuperiores.data.last
      };

      // Guardar en caché
      setCacheSuperiores(prev => ({
        ...prev,
        [page]: {
          prendas: prendasSuperioresConFavoritas,
          paginacion: paginacionData
        }
      }));

      setPrendasSuperioresOriginales(prendasSuperioresConFavoritas);
      setPaginacionSuperiores(paginacionData);
    } catch (err) {
      if (err.isCritical) {
        setCriticalError(err);
      } else {
        setError(err.response?.data?.message || 'Error al cargar las prendas superiores');
      }
    } finally {
      setLoadingPagination(false);
    }
  }, [paginacionSuperiores.size, cacheSuperiores, codigosFavoritasCache]);

  // Función para cargar prendas inferiores paginadas
  const fetchPrendasInferiores = useCallback(async (page = 0) => {
    try {
      // Verificar si la página ya está en caché
      if (cacheInferiores[page]) {
        setPrendasInferioresOriginales(cacheInferiores[page].prendas);
        setPaginacionInferiores(cacheInferiores[page].paginacion);
        return;
      }

      setLoadingPagination(true);
      setError(null);
      setCriticalError(null);

      // Cargar favoritos solo si no están en caché
      let codigosFavoritas;
      if (codigosFavoritasCache) {
        codigosFavoritas = codigosFavoritasCache;
      } else {
        const responseFavoritas = await favoritosService.obtenerPrendasFavoritas().catch(() => ({ data: { content: [] } }));
        const prendasFavoritas = responseFavoritas.data?.content || responseFavoritas.data || [];
        codigosFavoritas = new Set(prendasFavoritas.map(prenda => prenda.garmentCode));
        setCodigosFavoritasCache(codigosFavoritas);
      }

      const responseInferiores = await probadorService.obtenerPrendasInferiores({}, page, paginacionInferiores.size);

      const prendasInferioresConFavoritas = (responseInferiores.data.content || []).map(prenda => ({
        ...prenda,
        esFavorita: codigosFavoritas.has(prenda.garmentCode)
      }));

      const paginacionData = {
        page: responseInferiores.data.page,
        size: responseInferiores.data.size,
        totalPages: responseInferiores.data.totalPages,
        totalElements: responseInferiores.data.totalElements,
        last: responseInferiores.data.last
      };

      // Guardar en caché
      setCacheInferiores(prev => ({
        ...prev,
        [page]: {
          prendas: prendasInferioresConFavoritas,
          paginacion: paginacionData
        }
      }));

      setPrendasInferioresOriginales(prendasInferioresConFavoritas);
      setPaginacionInferiores(paginacionData);
    } catch (err) {
      if (err.isCritical) {
        setCriticalError(err);
      } else {
        setError(err.response?.data?.message || 'Error al cargar las prendas inferiores');
      }
    } finally {
      setLoadingPagination(false);
    }
  }, [paginacionInferiores.size, cacheInferiores, codigosFavoritasCache]);

  // Función para cargar todas las prendas inicialmente
  const fetchPrendas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setCriticalError(null);

      const [responseSuperiores, responseInferiores, responseFavoritas] = await Promise.all([
        probadorService.obtenerPrendasSuperiores({}, 0, 10),
        probadorService.obtenerPrendasInferiores({}, 0, 10),
        favoritosService.obtenerPrendasFavoritas().catch(() => ({ data: { content: [] } }))
      ]);

      const prendasFavoritas = responseFavoritas.data?.content || responseFavoritas.data || [];
      const codigosFavoritas = new Set(prendasFavoritas.map(prenda => prenda.garmentCode));

      // Cachear favoritos
      setCodigosFavoritasCache(codigosFavoritas);

      const prendasSuperioresConFavoritas = (responseSuperiores.data.content || []).map(prenda => ({
        ...prenda,
        esFavorita: codigosFavoritas.has(prenda.garmentCode)
      }));

      const prendasInferioresConFavoritas = (responseInferiores.data.content || []).map(prenda => ({
        ...prenda,
        esFavorita: codigosFavoritas.has(prenda.garmentCode)
      }));

      const paginacionSuperioresData = {
        page: responseSuperiores.data.page,
        size: responseSuperiores.data.size,
        totalPages: responseSuperiores.data.totalPages,
        totalElements: responseSuperiores.data.totalElements,
        last: responseSuperiores.data.last
      };

      const paginacionInferioresData = {
        page: responseInferiores.data.page,
        size: responseInferiores.data.size,
        totalPages: responseInferiores.data.totalPages,
        totalElements: responseInferiores.data.totalElements,
        last: responseInferiores.data.last
      };

      // Cachear página 0 de ambos tipos
      setCacheSuperiores({
        0: {
          prendas: prendasSuperioresConFavoritas,
          paginacion: paginacionSuperioresData
        }
      });

      setCacheInferiores({
        0: {
          prendas: prendasInferioresConFavoritas,
          paginacion: paginacionInferioresData
        }
      });

      setPrendasSuperioresOriginales(prendasSuperioresConFavoritas);
      setPrendasInferioresOriginales(prendasInferioresConFavoritas);
      setPaginacionSuperiores(paginacionSuperioresData);
      setPaginacionInferiores(paginacionInferioresData);
    } catch (err) {
      if (err.isCritical) {
        setCriticalError(err);
      } else {
        setError(err.response?.data?.message || 'Error al cargar las prendas');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Efecto para cargar datos iniciales
  useEffect(() => {
    fetchPrendas();
  }, [fetchPrendas]);

  // Función para aplicar filtros
  const aplicarFiltros = useCallback((prendas) => {
    return prendas.filter(prenda => {
      // Filtro por marca
      if (filtros.marca && prenda.marcaNombre !== filtros.marca) {
        return false;
      }

      // Filtro por color
      if (filtros.color && prenda.color !== filtros.color) {
        return false;
      }

      // Filtro por genero
      if (filtros.genero && prenda.genero !== filtros.genero) {
        return false;
      }

      // Filtro solo favoritas
      if (filtros.soloFavoritas && !prenda.esFavorita) {
        return false;
      }

      return true;
    });
  }, [filtros]);

  // Prendas filtradas
  const prendasSuperiores = useMemo(() => {
    return aplicarFiltros(prendasSuperioresOriginales);
  }, [prendasSuperioresOriginales, aplicarFiltros]);

  const prendasInferiores = useMemo(() => {
    return aplicarFiltros(prendasInferioresOriginales);
  }, [prendasInferioresOriginales, aplicarFiltros]);

  // Marcas y colores disponibles (de todas las prendas originales, no filtradas)
  const todasLasPrendasOriginales = useMemo(() => {
    return [...prendasSuperioresOriginales, ...prendasInferioresOriginales];
  }, [prendasSuperioresOriginales, prendasInferioresOriginales]);

  // Todas las prendas filtradas
  const todasLasPrendas = useMemo(() => {
    return [...prendasSuperiores, ...prendasInferiores];
  }, [prendasSuperiores, prendasInferiores]);

  const marcasDisponibles = useMemo(() => {
    const marcas = [...new Set(todasLasPrendasOriginales.map(prenda => prenda.marcaNombre).filter(Boolean))];
    return marcas.sort();
  }, [todasLasPrendasOriginales]);

  const coloresDisponibles = useMemo(() => {
    const colores = [...new Set(todasLasPrendasOriginales.map(prenda => prenda.color).filter(Boolean))];
    return colores.sort();
  }, [todasLasPrendasOriginales]);

  // Estructura de prendas categorizadas
  const prendasCategorizadas = useMemo(() => {
    return {
      superiores: prendasSuperiores,
      inferiores: prendasInferiores
    };
  }, [prendasSuperiores, prendasInferiores]);

  // Actualizar filtros
  const actualizarFiltros = (nuevosFiltros) => {
    setFiltros(prev => ({ ...prev, ...nuevosFiltros }));
  };

  // Limpiar filtros
  const limpiarFiltros = () => {
    setFiltros({
      marca: '',
      color: '',
      genero: '',
      soloFavoritas: false
    });
  };

  // Función para actualizar favorito localmente
  const actualizarFavoritoLocal = (codigoPrenda, esFavorita) => {
    // Actualizar estado actual
    setPrendasSuperioresOriginales(prev =>
      prev.map(prenda =>
        prenda.garmentCode === codigoPrenda
          ? { ...prenda, esFavorita }
          : prenda
      )
    );
    setPrendasInferioresOriginales(prev =>
      prev.map(prenda =>
        prenda.garmentCode === codigoPrenda
          ? { ...prenda, esFavorita }
          : prenda
      )
    );

    // Actualizar caché de superiores
    setCacheSuperiores(prev => {
      const newCache = { ...prev };
      Object.keys(newCache).forEach(page => {
        newCache[page] = {
          ...newCache[page],
          prendas: newCache[page].prendas.map(prenda =>
            prenda.garmentCode === codigoPrenda
              ? { ...prenda, esFavorita }
              : prenda
          )
        };
      });
      return newCache;
    });

    // Actualizar caché de inferiores
    setCacheInferiores(prev => {
      const newCache = { ...prev };
      Object.keys(newCache).forEach(page => {
        newCache[page] = {
          ...newCache[page],
          prendas: newCache[page].prendas.map(prenda =>
            prenda.garmentCode === codigoPrenda
              ? { ...prenda, esFavorita }
              : prenda
          )
        };
      });
      return newCache;
    });

    // Actualizar caché de favoritos
    if (codigosFavoritasCache) {
      const newCodigosFavoritas = new Set(codigosFavoritasCache);
      if (esFavorita) {
        newCodigosFavoritas.add(codigoPrenda);
      } else {
        newCodigosFavoritas.delete(codigoPrenda);
      }
      setCodigosFavoritasCache(newCodigosFavoritas);
    }
  };

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