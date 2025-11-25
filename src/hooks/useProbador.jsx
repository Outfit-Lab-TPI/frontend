import { useState, useEffect, useMemo, useCallback } from 'react';
import { probadorService } from '../services/probadorService.js';
import { favoritosService } from '../services/favoritosService.js';

export const useProbador = () => {
  // Estados simplificados
  const [prendasSuperioresOriginales, setPrendasSuperioresOriginales] = useState([]);
  const [prendasInferioresOriginales, setPrendasInferioresOriginales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [criticalError, setCriticalError] = useState(null);

  // Estados de filtros
  const [filtros, setFiltros] = useState({
    marca: '',
    color: '',
    soloFavoritas: false
  });

  // Función para cargar todas las prendas (sin filtros, solo una vez)
  const fetchPrendas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setCriticalError(null);

      // Cargar prendas y favoritas en paralelo (sin filtros)
      const [responseSuperiores, responseInferiores, responseFavoritas] = await Promise.all([
        probadorService.obtenerPrendasSuperiores(),
        probadorService.obtenerPrendasInferiores(),
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

  // Efecto para cargar datos iniciales (solo una vez)
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