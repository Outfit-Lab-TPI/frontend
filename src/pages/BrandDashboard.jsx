import {
  useActividadPorDias,
  useColorConversion,
  useTopCombos,
  useTopPrendas,
} from "@/hooks/useDashboard";
import React, { useState, useMemo, useEffect } from "react";
import { COLOR_MAP } from "@/lib/constants";
import { useAuth } from "@/hooks/auth/useAuth";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  CartesianGrid,
} from "recharts";

function Tabs({ children }) {
  return <div>{children}</div>;
}
function TabsList({ children }) {
  return <div className="flex gap-2">{children}</div>;
}
function TabsTrigger({ value, active, onClick, disabled, children }) {
  return (
    <button
      onClick={() => !disabled && onClick(value)}
      className={`px-3 py-1 rounded-md text-sm ${
        active ? "bg-gray-700 text-white" : "bg-transparent text-gray-300"
      } ${disabled ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-800"}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
function TabsContent({ active, children }) {
  return active ? <div>{children}</div> : null;
}

const COLORS = ["#8b5cf6", "#ec4899", "#22d3ee", "#fbbf24", "#4ade80"];

export default function BrandDashboard() {
  const { user } = useAuth();
  const brandCode = user?.brand?.codigoMarca || "puma";
  const brand = brandCode.charAt(0).toUpperCase() + brandCode.slice(1);
  const [tab, setTab] = useState("free");
  const [membership] = useState("premium");
  const isPremium = membership === "premium";
  const [selectedGarment, setSelectedGarment] = useState({
    daily: [],
  });
  const { data: topPrendasData, loading: loadingPrendas } = useTopPrendas(
    10,
    brandCode
  );
  const { data: actividadData, loading: loadingActividad } =
    useActividadPorDias();
  const { data: topCombosData, loading: loadingCombos } = useTopCombos(
    10,
    brandCode
  );
  const { data: colorConvData, loading: loadingColor } =
    useColorConversion(brandCode);

  const topPruebas = useMemo(() => {
    if (!topPrendasData) return [];
    return topPrendasData
      .sort((a, b) => b.pruebas - a.pruebas)
      .slice(0, 10)
      .map((g) => ({
        ...g,
        descripcion: g.nombre,
      }));
  }, [topPrendasData]);

  useEffect(() => {
    if (topPruebas.length > 0) setSelectedGarment(topPruebas[0]);
  }, [topPruebas]);

  const coloresMap = useMemo(() => {
    if (!colorConvData) return [];
    const map = {};
    colorConvData.forEach(
      (g) => (map[g.color] = (map[g.color] || 0) + g.pruebas)
    );
    const total = Object.values(map).reduce((a, b) => a + b, 0) || 1;
    return Object.entries(map).map(([color, val]) => ({
      color,
      val,
      pct: +((val / total) * 100).toFixed(1),
    }));
  }, [colorConvData]);

  const actividadDiaria = useMemo(() => {
    if (!actividadData) return [];
    return actividadData.map((d) => ({
      dia: `${d.dia}`,
      pruebas: d.pruebas,
    }));
  }, [actividadData]);

  const combos = useMemo(() => {
    if (!topCombosData) return [];
    return topCombosData.map((c) => ({
      superior: c.superior,
      inferior: c.inferior,
      imgSup: c.imgSup,
      imgInf: c.imgInf,
      pruebas: c.pruebas,
      thumbs: c.thumbs || 0,
    }));
  }, [topCombosData]);

  function ItemList({ items }) {
    return (
      <div className="mt-3 space-y-2 max-h-84 overflow-auto">
        {items.map((it) => (
          <div
            key={it.nombre}
            className="flex items-center gap-3 bg-gray-800 px-3 py-2 rounded-md"
          >
            <img src={it.imagenUrl} className="w-10 h-10 rounded" alt="" />
            <div className="flex-1 text-sm">
              <div className="font-medium">{it.nombre}</div>
              <div className="text-xs text-gray-300">{it.descripcion}</div>
            </div>
            <div className="text-right text-sm text-gray-200">
              {it.pruebas} pruebas
            </div>
          </div>
        ))}
      </div>
    );
  }

  const tendenciaSingle = useMemo(() => {
    if (!selectedGarment || !selectedGarment.daily) return [];
    return selectedGarment.daily.map((d, i) => ({
      dia: `${i + 1}`,
      pruebas: d.pruebas,
    }));
  }, [selectedGarment]);

  if (loadingPrendas || loadingActividad || loadingCombos || loadingColor) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
        <div className="relative w-24 h-24">
          <div className="absolute top-0 left-0 w-24 h-24 border-4 border-gray-700 border-t-purple-500 rounded-full animate-spin"></div>
          <div className="absolute top-0 left-0 w-24 h-24 border-4 border-gray-700 border-t-pink-400 rounded-full animate-spin [animation-delay:0.2s]"></div>
        </div>
        <div className="text-gray-300 text-lg font-medium">
          Cargando métricas...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 text-white">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Dashboard — {brand}</h1>
          <div className="text-sm text-gray-300">
            Membresía:{" "}
            <span className="font-medium text-white">{membership}</span>
          </div>
        </header>

        <Tabs value={tab} onChange={setTab}>
          <TabsList>
            <TabsTrigger value="free" active={tab === "free"} onClick={setTab}>
              Gratuitas
            </TabsTrigger>
            <TabsTrigger
              value="premium"
              active={tab === "premium"}
              onClick={setTab}
              disabled={!isPremium}
            >
              Premium
            </TabsTrigger>
          </TabsList>

          {/* ---------- FREE CONTENT ---------- */}
          <TabsContent value="free" active={tab === "free"}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              {/* Top pruebas (Bar) with list */}
              <div className="col-span-2 bg-gray-900 p-4 rounded-lg border border-gray-800 h-[550px]">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-medium">
                    Top 10 — Prendas más probadas
                  </h2>
                  <div className="text-xs text-gray-400">
                    Top por cantidad de pruebas (últimos 30 días)
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 h-100">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={topPruebas} layout="vertical">
                        <CartesianGrid stroke="#111" />
                        <XAxis type="number" tick={{ fill: "#ddd" }} />
                        <YAxis
                          dataKey="nombre"
                          type="category"
                          width={180}
                          tick={{ fill: "#ddd" }}
                        />
                        <Tooltip />
                        <Bar dataKey="pruebas" fill={COLORS[0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div style={{ width: 320 }}>
                    <ItemList items={topPruebas} />
                  </div>
                </div>
              </div>

              {/* Estilos (Pie) */}
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 h-full">
                <div className="mb-2">
                  <h2 className="text-lg font-medium">Colores más usados</h2>
                  <div className="text-xs text-gray-400">
                    Distribución por color (últimos 30 días)
                  </div>
                </div>
                <div className="h-110 overflow-y-auto">
                  <ResponsiveContainer width="100%" height="65%">
                    <PieChart>
                      <Pie
                        data={coloresMap}
                        dataKey="val"
                        nameKey="color"
                        outerRadius={92}
                        fontSize={12}
                        fontFamily="Inter, sans-serif"
                        fontWeight={600}
                        label={(entry) => entry.color}
                      >
                        {coloresMap.map((e) => (
                          <Cell
                            key={e.color}
                            fill={COLOR_MAP[e.color.toUpperCase()] || COLORS[0]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="mt-3 text-sm">
                    {coloresMap.map((e) => (
                      <div
                        key={e.color}
                        className="flex ml-12 mb-1 items-center gap-3 text-gray-200"
                      >
                        <span
                          style={{
                            width: 12,
                            height: 12,
                            background: COLOR_MAP[e.color],
                            display: "inline-block",
                            borderRadius: 3,
                          }}
                        />
                        <div className="ml-2">
                          {e.color} — {e.pct}% ({e.val} pruebas)
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Evolución (Area) full width */}
              <div className="col-span-3 bg-gray-900 p-4 rounded-lg border border-gray-800">
                <div className="mb-2">
                  <h2 className="text-lg font-medium">
                    Actividad diaria del probador
                  </h2>
                  <div className="text-xs text-gray-400">
                    Suma de pruebas diarias (últimos 30 días)
                  </div>
                </div>
                <div style={{ height: 280 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={actividadDiaria}>
                      <CartesianGrid stroke="#111" />
                      <XAxis dataKey="dia" tick={{ fill: "#ddd" }} />
                      <YAxis tick={{ fill: "#ddd" }} />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="pruebas"
                        stroke={COLORS[1]}
                        fill={COLORS[1]}
                        fillOpacity={0.12}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ---------- PREMIUM CONTENT ---------- */}
          <TabsContent value="premium" active={tab === "premium"}>
            {isPremium ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                {/* Combos populares (bar horizontal + list with images) */}
                <div className="col-span-2 bg-gray-900 p-4 rounded-lg border border-gray-800 h-[550px]">
                  <div className="mb-8 flex items-center justify-between">
                    <h2 className="text-lg font-medium">
                      Combinaciones más populares
                    </h2>
                    <div className="text-xs text-gray-400">
                      Top outfits (superior + inferior) por pruebas
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-1 h-100">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={combos} layout="vertical">
                          <CartesianGrid stroke="#111" />
                          <XAxis type="number" tick={{ fill: "#ddd" }} />
                          <YAxis
                            dataKey={(d) => `${d.superior} → ${d.inferior}`}
                            type="category"
                            width={230}
                            tick={{ fill: "#ddd" }}
                          />
                          <Tooltip />
                          <Bar dataKey="pruebas" fill={COLORS[2]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div style={{ width: 320 }}>
                      <div className="space-y-2 max-h-100 overflow-auto">
                        {combos.map((c) => (
                          <div
                            key={`${c.superior}_${c.inferior}`}
                            className="flex items-center gap-3 bg-gray-800 px-3 py-2 rounded-md"
                          >
                            <img
                              src={c.imgSup}
                              className="w-10 h-10 rounded"
                              alt=""
                            />
                            <img
                              src={c.imgInf}
                              className="w-10 h-10 rounded"
                              alt=""
                            />
                            <div className="flex-1 text-sm">
                              <div className="font-medium">
                                {c.superior} + {c.inferior}
                              </div>
                              <div className="text-xs text-gray-300">
                                {c.pruebas} pruebas • {c.thumbs} favoritos
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tendencia por prenda: multiple lines */}
                <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
                  <div className="mb-5">
                    <h2 className="text-lg font-medium">
                      Tendencia por prenda
                    </h2>
                    <div className="text-xs text-gray-400">
                      Pruebas diarias — detectar moda / caída
                    </div>
                  </div>
                  <select
                    className="bg-gray-800 text-white p-1 rounded mt-2 mb-8"
                    value={selectedGarment?.id}
                    onChange={(e) => {
                      setSelectedGarment(
                        topPruebas.find((g) => g.id == e.target.value)
                      );
                    }}
                  >
                    {topPruebas.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.nombre}
                      </option>
                    ))}
                  </select>
                  <div style={{ height: 360 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={tendenciaSingle || []}>
                        <CartesianGrid stroke="#111" />
                        <XAxis dataKey="dia" tick={{ fill: "#ddd" }} />
                        <YAxis tick={{ fill: "#ddd" }} />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="pruebas"
                          stroke={COLORS[1]}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-8 text-center text-gray-300">
                Actualiza a Premium para ver estas métricas.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
