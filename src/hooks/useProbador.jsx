import { useState, useEffect, useMemo, useCallback } from 'react';
import { probadorService } from '../services/probadorService.js';
import { favoritosService } from '../services/favoritosService.js';

export const useProbador = () => {
  // Estados simplificados
  const [prendasSuperiores, setPrendasSuperiores] = useState([]);
  const [prendasInferiores, setPrendasInferiores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [criticalError, setCriticalError] = useState(null);

  // Estados de filtros
  const [filtros, setFiltros] = useState({
    marca: '',
    color: '',
    soloFavoritas: false
  });

  // Función para cargar todas las prendas
  const fetchPrendas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setCriticalError(null);

      // Cargar prendas y favoritas en paralelo
      const [responseSuperiores, responseInferiores, responseFavoritas] = await Promise.all([
        probadorService.obtenerPrendasSuperiores(filtros),
        probadorService.obtenerPrendasInferiores(filtros),
        favoritosService.obtenerPrendasFavoritas().catch(() => ({ data: { content: [] } })) // Si falla, continuar sin favoritas
      ]);

      const prendasFavoritas = responseFavoritas.data?.content || responseFavoritas.data || [];
      const codigosFavoritas = new Set(prendasFavoritas.map(prenda => prenda.garmentCode));

      // Marcar prendas como favoritas
      const prendasSuperioresConFavoritas = (responseSuperiores.data.content || []).map(prenda => ({
        ...prenda,
        esFavorita: codigosFavoritas.has(prenda.garmentCode)
      }));

      const prendasInferioresConFavoritas = (responseInferiores.data.content || []).map(prenda => ({
        ...prenda,
        esFavorita: codigosFavoritas.has(prenda.garmentCode)
      }));

      setPrendasSuperiores(prendasSuperioresConFavoritas);
      setPrendasInferiores(prendasInferioresConFavoritas);
    } catch (err) {
      if (err.isCritical) {
        setCriticalError(err);
      } else {
        setError(err.response?.data?.message || 'Error al cargar las prendas');
      }
    } finally {
      setLoading(false);
    }
  }, [filtros]);

  // Efecto para cargar datos iniciales y cuando cambien los filtros
  useEffect(() => {
    fetchPrendas();
  }, [fetchPrendas]);

  // Marcas y colores disponibles (combinando ambas listas)
  const todasLasPrendas = useMemo(() => {
    return [...prendasSuperiores, ...prendasInferiores];
  }, [prendasSuperiores, prendasInferiores]);

  const marcasDisponibles = useMemo(() => {
    const marcas = [...new Set(todasLasPrendas.map(prenda => prenda.marca).filter(Boolean))];
    return marcas.sort();
  }, [todasLasPrendas]);

  const coloresDisponibles = useMemo(() => {
    const colores = [...new Set(todasLasPrendas.map(prenda => prenda.color).filter(Boolean))];
    return colores.sort();
  }, [todasLasPrendas]);

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
      soloFavoritas: false
    });
  };

  // Función para actualizar favorito localmente
  const actualizarFavoritoLocal = (codigoPrenda, esFavorita) => {
    setPrendasSuperiores(prev =>
      prev.map(prenda =>
        prenda.garmentCode === codigoPrenda
          ? { ...prenda, esFavorita }
          : prenda
      )
    );
    setPrendasInferiores(prev =>
      prev.map(prenda =>
        prenda.garmentCode === codigoPrenda
          ? { ...prenda, esFavorita }
          : prenda
      )
    );
  };

  return {
    // Datos
    prendas: todasLasPrendas,
    prendasCategorizadas,

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