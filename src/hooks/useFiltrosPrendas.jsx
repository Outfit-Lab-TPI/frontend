import { useState, useMemo, useCallback } from 'react';

export const useFiltrosPrendas = (prendasSuperiores, prendasInferiores) => {
  const [filtros, setFiltros] = useState({
    marca: '',
    color: '',
    soloFavoritas: false
  });

  // Aplicar filtros a un array de prendas
  const aplicarFiltros = useCallback((prendas) => {
    return prendas.filter(prenda => {
      if (filtros.marca && prenda.marcaNombre !== filtros.marca) return false;
      if (filtros.color && prenda.color !== filtros.color) return false;
      if (filtros.genero && prenda.genero !== filtros.genero) return false;
      if (filtros.soloFavoritas && !prenda.esFavorita) return false;
      return true;
    });
  }, [filtros]);

  // Prendas filtradas
  const prendasSuperioresFiltradas = useMemo(() => {
    return aplicarFiltros(prendasSuperiores);
  }, [prendasSuperiores, aplicarFiltros]);

  const prendasInferioresFiltradas = useMemo(() => {
    return aplicarFiltros(prendasInferiores);
  }, [prendasInferiores, aplicarFiltros]);

  // Todas las prendas filtradas (aplica filtros pero mantiene tipo superior/inferior)
  const todasLasPrendas = useMemo(() => {
    return [...prendasSuperioresFiltradas, ...prendasInferioresFiltradas];
  }, [prendasSuperioresFiltradas, prendasInferioresFiltradas]);

  // Todas las prendas originales (sin filtrar, para marcas/colores disponibles)
  const todasLasPrendasOriginales = useMemo(() => {
    return [...prendasSuperiores, ...prendasInferiores];
  }, [prendasSuperiores, prendasInferiores]);

  // Marcas disponibles
  const marcasDisponibles = useMemo(() => {
    const marcas = [...new Set(todasLasPrendasOriginales.map(p => p.marcaNombre).filter(Boolean))];
    return marcas.sort();
  }, [todasLasPrendasOriginales]);

  // Colores disponibles
  const coloresDisponibles = useMemo(() => {
    const colores = [...new Set(todasLasPrendasOriginales.map(p => p.color).filter(Boolean))];
    return colores.sort();
  }, [todasLasPrendasOriginales]);

  // Estructura categorizada
  const prendasCategorizadas = useMemo(() => ({
    superiores: prendasSuperioresFiltradas,
    inferiores: prendasInferioresFiltradas
  }), [prendasSuperioresFiltradas, prendasInferioresFiltradas]);

  // Actualizar filtros
  const actualizarFiltros = useCallback((nuevosFiltros) => {
    setFiltros(prev => ({ ...prev, ...nuevosFiltros }));
  }, []);

  // Limpiar filtros
  const limpiarFiltros = useCallback(() => {
    setFiltros({
      marca: '',
      color: '',
      genero: '',
      soloFavoritas: false
    });
  }, []);

  return {
    filtros,
    todasLasPrendas,
    prendasCategorizadas,
    marcasDisponibles,
    coloresDisponibles,
    actualizarFiltros,
    limpiarFiltros
  };
};
