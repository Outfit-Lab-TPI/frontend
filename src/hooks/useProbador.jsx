import { useState, useEffect, useMemo, useCallback } from 'react';
import { probadorService } from '../services/probadorService.js';
import { favoritosService } from '../services/favoritosService.js';

export const useProbador = () => {
  // Estados simplificados - solo para obtener marcas y colores disponibles
  const [prendasSuperioresOriginales, setPrendasSuperioresOriginales] = useState([]);
  const [prendasInferioresOriginales, setPrendasInferioresOriginales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [criticalError, setCriticalError] = useState(null);

  // Estados de filtros (para marcas y colores disponibles)
  const [filtros, setFiltros] = useState({
    marca: '',
    color: '',
    soloFavoritas: false
  });

  // Función para cargar todas las prendas inicialmente (solo para marcas/colores disponibles)

  // Función para cargar todas las prendas inicialmente
  const fetchPrendas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setCriticalError(null);

      const [responseSuperiores, responseInferiores, responseFavoritas] = await Promise.all([
        probadorService.obtenerPrendasSuperiores({}, 0, 100), // Obtener más para tener todas las marcas/colores
        probadorService.obtenerPrendasInferiores({}, 0, 100),
        favoritosService.obtenerPrendasFavoritas().catch(() => ({ data: { content: [] } }))
      ]);

      const prendasFavoritas = responseFavoritas.data?.content || responseFavoritas.data || [];
      const codigosFavoritas = new Set(prendasFavoritas.map(prenda => prenda.garmentCode));

      const prendasSuperioresConFavoritas = (responseSuperiores.data.content || []).map(prenda => ({
        ...prenda,
        esFavorita: codigosFavoritas.has(prenda.garmentCode)
      }));

      const prendasInferioresConFavoritas = (responseInferiores.data.content || []).map(prenda => ({
        ...prenda,
        esFavorita: codigosFavoritas.has(prenda.garmentCode)
      }));

      setPrendasSuperioresOriginales(prendasSuperioresConFavoritas);
      setPrendasInferioresOriginales(prendasInferioresConFavoritas);

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

  // Marcas y colores disponibles (de todas las prendas originales)

  const todasLasPrendasOriginales = useMemo(() => {
    return [...prendasSuperioresOriginales, ...prendasInferioresOriginales];
  }, [prendasSuperioresOriginales, prendasInferioresOriginales]);

  const marcasDisponibles = useMemo(() => {
    const marcas = [...new Set(todasLasPrendasOriginales.map(prenda => prenda.marcaNombre).filter(Boolean))];
    return marcas.sort();
  }, [todasLasPrendasOriginales]);

  const coloresDisponibles = useMemo(() => {
    const colores = [...new Set(todasLasPrendasOriginales.map(prenda => prenda.color).filter(Boolean))];
    return colores.sort();
  }, [todasLasPrendasOriginales]);

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
  };

  return {
    // Estados de carga y error
    loading,
    error,
    criticalError,

    // Filtros
    filtros,
    marcasDisponibles,
    coloresDisponibles,
    actualizarFiltros,
    limpiarFiltros,

    // Utilidades
    actualizarFavoritoLocal,
    refetch: fetchPrendas
  };
};