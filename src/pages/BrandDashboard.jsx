import React, { useState, useMemo } from "react";
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
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  CartesianGrid,
  Legend,
} from "recharts";

function Tabs({ value, onChange, children }) {
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
function TabsContent({ value, active, children }) {
  return active ? <div>{children}</div> : null;
}

// ---------------- MOCK DATA (realista - por marca) ----------------
const STYLES = ["deportivo", "casual", "oversize", "urbano", "elegante"];

// generate 15 garments mock
const GARMENTS = [
  "Tech Hoodie",
  "Air Max Tee",
  "Club Jogger",
  "Dri-FIT Elite",
  "Therma Hoodie",
  "Pro Compression",
  "Court Shorts",
  "Windrunner",
  "ACG Fleece",
  "Air Pants",
  "Court Jacket",
  "Runner Tee",
  "Training Vest",
  "Cargo Pants",
  "Light Wind Tee",
].map((name, i) => {
  const estilo = STYLES[i % STYLES.length];
  const pruebas = Math.floor(40 + Math.random() * 220);
  const favoritos = Math.floor(pruebas * (0.08 + Math.random() * 0.35));
  // daily series last 30 days
  const daily = Array.from({ length: 30 }, (_, d) => ({
    dia: d + 1,
    pruebas: Math.max(
      0,
      Math.round(
        (pruebas / 30) *
          (0.6 + Math.random() * 1.4) *
          (1 + Math.sin((d + i) / 6) * 0.2)
      )
    ),
  }));
  return {
    id: `g_${i}`,
    nombre: `${name}`,
    estilo,
    color: ["negro", "blanco", "gris", "azul", "rojo"][i % 5],
    pruebas,
    favoritos,
    daily,
    imagenUrl: `https://via.placeholder.com/64?text=${encodeURIComponent(
      name.split(" ")[0]
    )}`,
    descripcion: `${name} — estilo ${estilo}`,
  };
});

const COLORS = ["#8b5cf6", "#ec4899", "#22d3ee", "#fbbf24", "#4ade80"];

export default function BrandDashboard() {
  const [tab, setTab] = useState("free");
  const [membership] = useState("premium");
  const isPremium = membership === "premium";

  // ------------- FREE METRICS DATA -------------
  // 1) Prendas más probadas (top 10)
  const topPruebas = useMemo(() => {
    return [...GARMENTS].sort((a, b) => b.pruebas - a.pruebas).slice(0, 10);
  }, []);

  const [selectedGarment, setSelectedGarment] = useState(topPruebas[0]);
  // 2) Estilos más usados (porcentaje)
  const estilosMap = useMemo(() => {
    const m = {};
    GARMENTS.forEach((g) => (m[g.estilo] = (m[g.estilo] || 0) + g.pruebas));
    const total = Object.values(m).reduce((a, b) => a + b, 0) || 1;
    return Object.entries(m).map(([estilo, val], i) => ({
      estilo,
      val,
      pct: +((val / total) * 100).toFixed(1),
      color: COLORS[i % COLORS.length],
    }));
  }, []);

  // 3) Evolución: combinaciones probadas por día (sum across garments daily)
  const evolucion30 = useMemo(() => {
    const arr = Array.from({ length: 30 }, (_, d) => ({
      dia: `${d + 1}`,
      pruebas: 0,
    }));
    GARMENTS.forEach((g) =>
      g.daily.forEach((dd, idx) => (arr[idx].pruebas += dd.pruebas))
    );
    return arr.map((x) => ({ ...x }));
  }, []);

  // 4) Combinaciones más populares (mock many combos)
  const combos = useMemo(() => {
    const tops = GARMENTS.filter(
      (g) =>
        g.nombre.toLowerCase().includes("tee") ||
        g.nombre.toLowerCase().includes("hoodie") ||
        g.nombre.toLowerCase().includes("jacket") ||
        g.nombre.toLowerCase().includes("vest")
    ).slice(0, 8);
    const bottoms = GARMENTS.filter(
      (g) =>
        g.nombre.toLowerCase().includes("jogger") ||
        g.nombre.toLowerCase().includes("pants") ||
        g.nombre.toLowerCase().includes("shorts")
    ).slice(0, 8);

    const list = [];
    tops.forEach((t) =>
      bottoms.forEach((b) => {
        const score = Math.floor(
          20 + Math.random() * Math.min(t.pruebas, b.pruebas)
        );
        list.push({
          superior: t.nombre,
          inferior: b.nombre,
          pruebas: score,
          thumbs: Math.floor(score * (0.05 + Math.random() * 0.4)),
          imgSup: t.imagenUrl,
          imgInf: b.imagenUrl,
        });
      })
    );
    return list.sort((a, b) => b.pruebas - a.pruebas).slice(0, 12);
  }, []);

  // 5) Tendencia por prenda (daily series provided in GARMENTS)
  const tendenciaTop = useMemo(() => {
    return topPruebas
      .slice(0, 5)
      .map((g) => ({ nombre: g.nombre, data: g.daily }));
  }, [topPruebas]);

  // 6) Pruebas vs Favoritos (compare)
  const vsData = useMemo(() => {
    return topPruebas.map((g) => ({
      nombre: g.nombre,
      pruebas: g.pruebas,
      favoritos: g.favoritos,
    }));
  }, [topPruebas]);

  // 7) Estilos con mayor tasa de conversión a favoritos
  const estiloConversion = useMemo(() => {
    const m = {};
    GARMENTS.forEach((g) => {
      if (!m[g.estilo]) m[g.estilo] = { pruebas: 0, favoritos: 0 };
      m[g.estilo].pruebas += g.pruebas;
      m[g.estilo].favoritos += g.favoritos;
    });
    return Object.entries(m)
      .map(([estilo, vals], i) => ({
        estilo,
        conversion: +(
          (vals.favoritos / Math.max(vals.pruebas, 1)) *
          100
        ).toFixed(1),
        pruebas: vals.pruebas,
        favoritos: vals.favoritos,
        color: COLORS[i % COLORS.length],
      }))
      .sort((a, b) => b.conversion - a.conversion);
  }, []);

  function ItemList({ items, onSelect }) {
    return (
      <div className="mt-3 space-y-2 max-h-72 overflow-auto">
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
    if (!selectedGarment) return [];
    return selectedGarment.daily.map((d, i) => ({
      dia: `${i + 1}`,
      pruebas: d.pruebas,
    }));
  }, [selectedGarment]);

  return (
    <div className="min-h-screen p-6 text-white">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Brand Dashboard — Nike</h1>
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
              <div className="col-span-2 bg-gray-900 p-4 rounded-lg border border-gray-800">
                <div className="mb-2 flex items-center justify-between">
                  <h2 className="text-lg font-medium">
                    Top 10 — Prendas más probadas
                  </h2>
                  <div className="text-xs text-gray-400">
                    Top por cantidad de pruebas (últimos 30 días)
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 h-72">
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
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
                <div className="mb-2">
                  <h2 className="text-lg font-medium">Estilos más usados</h2>
                  <div className="text-xs text-gray-400">
                    Distribución por estilo (últimos 30 días)
                  </div>
                </div>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="65%">
                    <PieChart>
                      <Pie
                        data={estilosMap}
                        dataKey="val"
                        nameKey="estilo"
                        outerRadius={80}
                        label={(entry) => `${entry.estilo} (${entry.pct}%)`}
                      >
                        {estilosMap.map((e, i) => (
                          <Cell key={i} fill={e.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="mt-3 text-sm">
                    {estilosMap.map((e) => (
                      <div
                        key={e.estilo}
                        className="flex items-center gap-3 text-gray-200"
                      >
                        <span
                          style={{
                            width: 12,
                            height: 12,
                            background: e.color,
                            display: "inline-block",
                            borderRadius: 3,
                          }}
                        />
                        <div className="ml-2">
                          {e.estilo} — {e.pct}% ({e.val} pruebas)
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
                    <AreaChart data={evolucion30}>
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
                <div className="col-span-2 bg-gray-900 p-4 rounded-lg border border-gray-800">
                  <div className="mb-2 flex items-center justify-between">
                    <h2 className="text-lg font-medium">
                      Combinaciones más populares
                    </h2>
                    <div className="text-xs text-gray-400">
                      Top outfits (superior + inferior) por pruebas
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-1 h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={combos} layout="vertical">
                          <CartesianGrid stroke="#111" />
                          <XAxis type="number" tick={{ fill: "#ddd" }} />
                          <YAxis
                            dataKey={(d) => `${d.superior} → ${d.inferior}`}
                            type="category"
                            width={240}
                            tick={{ fill: "#ddd" }}
                          />
                          <Tooltip />
                          <Bar dataKey="pruebas" fill={COLORS[2]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div style={{ width: 320 }}>
                      <div className="space-y-2 max-h-72 overflow-auto">
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
                  <div className="mb-2">
                    <h2 className="text-lg font-medium">
                      Tendencia por prenda (top 5)
                    </h2>
                    <div className="text-xs text-gray-400">
                      Pruebas diarias — detectar moda / caída
                    </div>
                  </div>
                  <select
                    className="bg-gray-800 text-white p-1 rounded mb-2"
                    value={selectedGarment?.id}
                    onChange={(e) =>
                      setSelectedGarment(
                        topPruebas.find((g) => g.id === e.target.value)
                      )
                    }
                  >
                    {topPruebas.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.nombre}
                      </option>
                    ))}
                  </select>
                  <div style={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={tendenciaSingle}>
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

                {/* Pruebas vs Favoritos */}
                <div className="col-span-3 bg-gray-900 p-4 rounded-lg border border-gray-800">
                  <div className="mb-2">
                    <h2 className="text-lg font-medium">
                      Pruebas vs Favoritos
                    </h2>
                    <div className="text-xs text-gray-400">
                      Comparativa para detectar productos que atraen pero no se
                      guardan
                    </div>
                  </div>
                  <div style={{ height: 320 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={vsData}>
                        <CartesianGrid stroke="#111" />
                        <XAxis dataKey="nombre" tick={{ fill: "#ddd" }} />
                        <YAxis tick={{ fill: "#ddd" }} />
                        <Tooltip />
                        <Legend />
                        <Bar
                          dataKey="pruebas"
                          name="Pruebas"
                          fill={COLORS[0]}
                        />
                        <Bar
                          dataKey="favoritos"
                          name="Favoritos"
                          fill={COLORS[4]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Estilos conversión (premium extra) */}
                <div className="col-span-3 bg-gray-900 p-4 rounded-lg border border-gray-800">
                  <div className="mb-2">
                    <h2 className="text-lg font-medium">
                      Estilos — tasa de conversión a favoritos
                    </h2>
                    <div className="text-xs text-gray-400">
                      Qué estilos convierten más (favoritos / pruebas)
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {estiloConversion.map((e, i) => (
                      <div key={e.estilo} className="bg-gray-800 p-3 rounded">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium">{e.estilo}</div>
                          <div className="text-xs text-gray-300">
                            {e.conversion}%
                          </div>
                        </div>
                        <div className="mt-2 h-24">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={[
                                  { name: "favoritos", value: e.favoritos },
                                  {
                                    name: "resto",
                                    value: e.pruebas - e.favoritos,
                                  },
                                ]}
                                dataKey="value"
                                nameKey="name"
                                innerRadius={20}
                                outerRadius={40}
                              >
                                <Cell fill={e.color} />
                                <Cell fill="#222" />
                              </Pie>
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="mt-2 text-xs text-gray-300">
                          {e.favoritos} favoritos · {e.pruebas} pruebas
                        </div>
                      </div>
                    ))}
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

  // render multiple Line components for tendenciaTop
  function tendenzaLines(list) {
    // reconstruct combined x-axis: day 1..30
    const merged = Array.from({ length: 30 }, (_, i) => ({ dia: i + 1 }));
    const datasets = list.map((g, idx) => ({
      key: g.nombre,
      color: COLORS[idx % COLORS.length],
      values: g.data,
    }));

    // convert to format Recharts expects: array of points with each key
    const combined = merged.map((p, i) => {
      const obj = { dia: p.dia };
      datasets.forEach((ds) => (obj[ds.key] = ds.values[i].pruebas));
      return obj;
    });

    return datasets.map((ds) => (
      <Line
        key={ds.key}
        type="monotone"
        dataKey={ds.key}
        stroke={ds.color}
        dot={false}
      />
    ));
  }

  function mergeTendencia(list) {
    const merged = Array.from({ length: 30 }, (_, i) => ({ dia: `${i + 1}` }));
    list.forEach((g) => {
      g.data.forEach((d, idx) => {
        merged[idx][g.nombre] = d.pruebas;
      });
    });
    return merged;
  }
}
