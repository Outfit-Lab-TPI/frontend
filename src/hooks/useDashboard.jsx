import { useState, useEffect } from "react";
import apiClient from "@/services/api.js";

export function useTopPrendas(topN = 5, brandCode = "") {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopPrendas = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiClient.get("/dashboard/top-prendas", {
          params: { topN, brandCode },
        });
        setData(res.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Error cargando top prendas"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTopPrendas();
  }, [topN, brandCode]);

  return { data, loading, error };
}

export function useActividadPorDias() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActividad = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiClient.get("/dashboard/actividad-por-dias");
        setData(res.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Error cargando actividad"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchActividad();
  }, []);

  return { data, loading, error };
}

export function useTopCombos(topN = 5, brandCode = "") {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopCombos = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiClient.get("/dashboard/top-combos", {
          params: { topN, brandCode },
        });
        setData(res.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Error cargando top combos"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTopCombos();
  }, [topN, brandCode]);

  return { data, loading, error };
}

export function useColorConversion(brandCode = "") {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchColorConversion = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiClient.get("/dashboard/color-conversion", {
          params: { brandCode },
        });
        setData(res.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Error cargando color conversion"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchColorConversion();
  }, []);

  return { data, loading, error };
}
