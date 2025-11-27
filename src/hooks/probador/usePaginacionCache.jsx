import { useState, useCallback } from 'react';
import { probadorService } from '../../services/probador/probadorService.js';
import { favoritosService } from '../../services/shared/favoritosService.js';

export const usePaginacionCache = () => {
  // Cache de páginas y favoritos
  const [cacheSuperiores, setCacheSuperiores] = useState({});
  const [cacheInferiores, setCacheInferiores] = useState({});
  const [codigosFavoritasCache, setCodigosFavoritasCache] = useState(null);
  const [loadingPagination, setLoadingPagination] = useState(false);

  // Cargar favoritos (solo una vez)
  const cargarFavoritos = useCallback(async () => {
    if (codigosFavoritasCache) return codigosFavoritasCache;

    const responseFavoritas = await favoritosService
      .obtenerPrendasFavoritas()
      .catch(() => ({ data: { content: [] } }));

    const prendasFavoritas = responseFavoritas.data?.content || responseFavoritas.data || [];
    const codigosFavoritas = new Set(prendasFavoritas.map(prenda => prenda.garmentCode));
    setCodigosFavoritasCache(codigosFavoritas);
    return codigosFavoritas;
  }, [codigosFavoritasCache]);

  // Aplicar favoritos a prendas
  const aplicarFavoritos = useCallback((prendas, codigosFavoritas) => {
    return prendas.map(prenda => ({
      ...prenda,
      esFavorita: codigosFavoritas.has(prenda.garmentCode)
    }));
  }, []);

  // Fetch prendas superiores con caché
  const fetchPrendasSuperiores = useCallback(async (page, size, setPrendas, setPaginacion) => {
    // Verificar caché
    if (cacheSuperiores[page]) {
      setPrendas(cacheSuperiores[page].prendas);
      setPaginacion(cacheSuperiores[page].paginacion);
      return;
    }

    setLoadingPagination(true);
    try {
      const codigosFavoritas = await cargarFavoritos();
      const response = await probadorService.obtenerPrendasSuperiores({}, page, size);

      const prendasConFavoritas = aplicarFavoritos(response.data.content || [], codigosFavoritas);
      const paginacionData = {
        page: response.data.page,
        size: response.data.size,
        totalPages: response.data.totalPages,
        totalElements: response.data.totalElements,
        last: response.data.last
      };

      // Guardar en caché
      setCacheSuperiores(prev => ({
        ...prev,
        [page]: { prendas: prendasConFavoritas, paginacion: paginacionData }
      }));

      setPrendas(prendasConFavoritas);
      setPaginacion(paginacionData);
    } finally {
      setLoadingPagination(false);
    }
  }, [cacheSuperiores, cargarFavoritos, aplicarFavoritos]);

  // Fetch prendas inferiores con caché
  const fetchPrendasInferiores = useCallback(async (page, size, setPrendas, setPaginacion) => {
    // Verificar caché
    if (cacheInferiores[page]) {
      setPrendas(cacheInferiores[page].prendas);
      setPaginacion(cacheInferiores[page].paginacion);
      return;
    }

    setLoadingPagination(true);
    try {
      const codigosFavoritas = await cargarFavoritos();
      const response = await probadorService.obtenerPrendasInferiores({}, page, size);

      const prendasConFavoritas = aplicarFavoritos(response.data.content || [], codigosFavoritas);
      const paginacionData = {
        page: response.data.page,
        size: response.data.size,
        totalPages: response.data.totalPages,
        totalElements: response.data.totalElements,
        last: response.data.last
      };

      // Guardar en caché
      setCacheInferiores(prev => ({
        ...prev,
        [page]: { prendas: prendasConFavoritas, paginacion: paginacionData }
      }));

      setPrendas(prendasConFavoritas);
      setPaginacion(paginacionData);
    } finally {
      setLoadingPagination(false);
    }
  }, [cacheInferiores, cargarFavoritos, aplicarFavoritos]);

  // Fetch inicial (carga página 0 de ambos tipos)
  const fetchInicial = useCallback(async () => {
    const [responseSuperiores, responseInferiores, responseFavoritas] = await Promise.all([
      probadorService.obtenerPrendasSuperiores({}, 0, 10),
      probadorService.obtenerPrendasInferiores({}, 0, 10),
      favoritosService.obtenerPrendasFavoritas().catch(() => ({ data: { content: [] } }))
    ]);

    const prendasFavoritas = responseFavoritas.data?.content || responseFavoritas.data || [];
    const codigosFavoritas = new Set(prendasFavoritas.map(prenda => prenda.garmentCode));
    setCodigosFavoritasCache(codigosFavoritas);

    const prendasSuperioresConFavoritas = aplicarFavoritos(
      responseSuperiores.data.content || [],
      codigosFavoritas
    );
    const prendasInferioresConFavoritas = aplicarFavoritos(
      responseInferiores.data.content || [],
      codigosFavoritas
    );

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

    // Cachear página 0
    setCacheSuperiores({
      0: { prendas: prendasSuperioresConFavoritas, paginacion: paginacionSuperioresData }
    });
    setCacheInferiores({
      0: { prendas: prendasInferioresConFavoritas, paginacion: paginacionInferioresData }
    });

    return {
      prendasSuperiores: prendasSuperioresConFavoritas,
      prendasInferiores: prendasInferioresConFavoritas,
      paginacionSuperiores: paginacionSuperioresData,
      paginacionInferiores: paginacionInferioresData
    };
  }, [aplicarFavoritos]);

  // Actualizar favorito en caché
  const actualizarFavoritoEnCache = useCallback((codigoPrenda, esFavorita) => {
    const actualizarPrendasCache = (cache) => {
      const newCache = { ...cache };
      Object.keys(newCache).forEach(page => {
        newCache[page] = {
          ...newCache[page],
          prendas: newCache[page].prendas.map(prenda =>
            prenda.garmentCode === codigoPrenda ? { ...prenda, esFavorita } : prenda
          )
        };
      });
      return newCache;
    };

    setCacheSuperiores(prev => actualizarPrendasCache(prev));
    setCacheInferiores(prev => actualizarPrendasCache(prev));

    if (codigosFavoritasCache) {
      const newCodigosFavoritas = new Set(codigosFavoritasCache);
      esFavorita ? newCodigosFavoritas.add(codigoPrenda) : newCodigosFavoritas.delete(codigoPrenda);
      setCodigosFavoritasCache(newCodigosFavoritas);
    }
  }, [codigosFavoritasCache]);

  return {
    loadingPagination,
    fetchPrendasSuperiores,
    fetchPrendasInferiores,
    fetchInicial,
    actualizarFavoritoEnCache
  };
};
