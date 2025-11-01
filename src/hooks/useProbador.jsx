import { useState, useEffect, useMemo } from 'react';
import { probadorService } from '../services/probadorService.js';

export const useProbador = () => {
  const [prendas, setPrendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtros, setFiltros] = useState({
    marca: '',
    color: '',
    soloFavoritas: false
  });

  const fetchPrendas = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await probadorService.obtenerPrendas();
      setPrendas(response.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrendas();
  }, []);

  const prendasFiltradas = useMemo(() => {
    return prendas.filter(prenda => {
      const cumpleMarca = !filtros.marca || prenda.marca?.toLowerCase().includes(filtros.marca.toLowerCase());
      const cumpleColor = !filtros.color || prenda.color?.toLowerCase().includes(filtros.color.toLowerCase());
      const cumpleFavorita = !filtros.soloFavoritas || prenda.esFavorita;

      return cumpleMarca && cumpleColor && cumpleFavorita;
    });
  }, [prendas, filtros]);

  const prendasCategorizadas = useMemo(() => {
    return {
      superiores: prendasFiltradas.filter(prenda => prenda.tipo === 'superior'),
      inferiores: prendasFiltradas.filter(prenda => prenda.tipo === 'inferior')
    };
  }, [prendasFiltradas]);

  const marcasDisponibles = useMemo(() => {
    const marcas = [...new Set(prendas.map(prenda => prenda.marca).filter(Boolean))];
    return marcas.sort();
  }, [prendas]);

  const coloresDisponibles = useMemo(() => {
    const colores = [...new Set(prendas.map(prenda => prenda.color).filter(Boolean))];
    return colores.sort();
  }, [prendas]);

  const actualizarFiltros = (nuevosFiltros) => {
    setFiltros(prev => ({ ...prev, ...nuevosFiltros }));
  };

  const limpiarFiltros = () => {
    setFiltros({
      marca: '',
      color: '',
      soloFavoritas: false
    });
  };

  // Función para actualizar favorito localmente sin refetch
  const actualizarFavoritoLocal = (codigoPrenda, esFavorita) => {
    setPrendas(prevPrendas =>
      prevPrendas.map(prenda =>
        prenda.codigo === codigoPrenda
          ? { ...prenda, esFavorita }
          : prenda
      )
    );
  };

  return {
    prendas: prendasFiltradas,
    prendasCategorizadas,
    loading,
    error,
    filtros,
    marcasDisponibles,
    coloresDisponibles,
    actualizarFiltros,
    limpiarFiltros,
    actualizarFavoritoLocal,
    refetch: fetchPrendas
  };
};