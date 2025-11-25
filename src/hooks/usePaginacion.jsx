import { useState, useCallback } from 'react';

/**
 * Hook genérico para manejar paginación de cualquier recurso
 * @param {Function} fetchFunction - Función que recibe (page, size) y retorna los datos paginados
 * @param {number} initialSize - Tamaño inicial de página (default: 10)
 * @returns {Object} Estado y funciones para manejar paginación
 */
export const usePaginacion = (fetchFunction, initialSize = 10) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [paginacion, setPaginacion] = useState({
    page: 0,
    size: initialSize,
    totalPages: 0,
    totalElements: 0,
    last: false
  });

  const fetchData = useCallback(async (page = 0) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetchFunction(page, paginacion.size);

      const content = response.data?.content || [];
      const pageInfo = response.data;

      setData(content);
      setPaginacion({
        page: pageInfo.page,
        size: pageInfo.size,
        totalPages: pageInfo.totalPages,
        totalElements: pageInfo.totalElements,
        last: pageInfo.last
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar los datos');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, paginacion.size]);

  const changePage = useCallback((newPage) => {
    if (newPage >= 0 && newPage < paginacion.totalPages) {
      fetchData(newPage);
    }
  }, [fetchData, paginacion.totalPages]);

  const refresh = useCallback(() => {
    fetchData(paginacion.page);
  }, [fetchData, paginacion.page]);

  return {
    data,
    loading,
    error,
    paginacion,
    changePage,
    refresh,
    fetchData
  };
};
