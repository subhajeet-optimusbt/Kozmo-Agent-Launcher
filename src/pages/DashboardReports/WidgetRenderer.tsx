/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LineChart,
  Line,
  Tooltip,
  LabelList,
  CartesianGrid,
  Legend,
} from "recharts";

/* ===================== Palette — matches KOZMO light theme ===================== */
const COLORS = [
  "#0d9488", // teal-600
  "#6366f1", // indigo-500
  "#f59e0b", // amber-500
  "#ef4444", // red-500
  "#06b6d4", // cyan-500
  "#a855f7", // purple-500
  "#f97316", // orange-500
  "#ec4899", // pink-500
];

const GRADIENTS = [
  ["#0d9488", "#2dd4bf"],
  ["#6366f1", "#a5b4fc"],
  ["#f59e0b", "#fcd34d"],
  ["#ef4444", "#fca5a5"],
  ["#06b6d4", "#67e8f9"],
  ["#a855f7", "#d8b4fe"],
  ["#f97316", "#fdba74"],
  ["#ec4899", "#f9a8d4"],
];

const normalizeKeyValue = (data: any) => {
  if (!data || typeof data !== "object") return [];
  return Object.entries(data).map(([k, v]) => ({
    name: k && k.trim() !== "" ? k : "Unknown",
    value: Number(v) || 0,
  }));
};

/* ======= Shared card wrapper style ======= */
const card: React.CSSProperties = {
  background: "#ffffff",
  borderRadius: "16px",
  border: "1px solid #e2e8f0",
  boxShadow: "0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
  fontFamily: "'Inter', 'DM Sans', sans-serif",
  overflow: "hidden",
  height: "100%",
  display: "flex",
  flexDirection: "column",
};

const cardTitle: React.CSSProperties = {
  fontSize: "10px",
  fontWeight: 700,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "#64748b",
  marginBottom: "12px",
};

/* ===================== Custom Tooltip ===================== */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
          padding: "10px 16px",
          boxShadow:
            "0 8px 32px rgba(13,148,136,0.15), 0 2px 8px rgba(0,0,0,0.08)",
          fontSize: "13px",
          fontFamily: "'Inter', sans-serif",
          minWidth: "120px",
        }}
      >
        {label && (
          <p
            style={{
              color: "#94a3b8",
              fontSize: "11px",
              marginBottom: "4px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {label}
          </p>
        )}
        {payload.map((entry: any, i: number) => (
          <p
            key={i}
            style={{ color: "#0f172a", fontWeight: 700, fontSize: "15px" }}
          >
            {entry.name && entry.name !== "value" ? (
              <span
                style={{ color: "#64748b", fontWeight: 500, fontSize: "12px" }}
              >
                {entry.name}:{" "}
              </span>
            ) : null}
            <span style={{ color: entry.color || "#0d9488" }}>
              {typeof entry.value === "number"
                ? entry.value.toLocaleString()
                : entry.value}
            </span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

/* ===================== Pie Tooltip ===================== */
const PieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0];
    const total = item.payload?.total || 1;
    const pct = ((item.value / total) * 100).toFixed(1);
    return (
      <div
        style={{
          background: "#ffffff",
          border: `2px solid ${item.payload.fill}`,
          borderRadius: "12px",
          padding: "10px 16px",
          boxShadow: `0 8px 24px ${item.payload.fill}33, 0 2px 8px rgba(0,0,0,0.08)`,
          fontSize: "13px",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <p
          style={{
            color: item.payload.fill,
            fontWeight: 700,
            fontSize: "13px",
            marginBottom: "2px",
          }}
        >
          {item.name}
        </p>
        <p
          style={{
            color: "#0f172a",
            fontSize: "20px",
            fontWeight: 800,
            lineHeight: 1,
          }}
        >
          {item.value.toLocaleString()}
        </p>
        <p style={{ color: "#94a3b8", fontSize: "11px", marginTop: "2px" }}>
          {pct}% of total
        </p>
      </div>
    );
  }
  return null;
};

/* ===================== Pie Label ===================== */
const renderPieLabel = ({
  cx,
  cy,
  midAngle,
  outerRadius,
  name,
  percent,
}: any) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 26;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  if (percent < 0.04) return null;
  return (
    <text
      x={x}
      y={y}
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fill="#475569"
      fontSize={11}
      fontWeight={600}
      fontFamily="'Inter', sans-serif"
    >
      {name}{" "}
      <tspan fontWeight={700} fill="#0d9488">
        ({(percent * 100).toFixed(0)}%)
      </tspan>
    </text>
  );
};

/* ===================== Bar Label (above bar) ===================== */
const BarTopLabel = (props: any) => {
  const { x, y, width, value } = props;
  if (!value && value !== 0) return null;
  return (
    <text
      x={x + width / 2}
      y={y - 6}
      textAnchor="middle"
      fill="#64748b"
      fontSize={11}
      fontWeight={700}
      fontFamily="'Inter', sans-serif"
    >
      {typeof value === "number" ? value.toLocaleString() : value}
    </text>
  );
};

/* ===================== HBar Label (right of bar) ===================== */
const HBarRightLabel = (props: any) => {
  const { x, y, width, height, value } = props;
  if (!value && value !== 0) return null;
  return (
    <text
      x={x + width + 6}
      y={y + height / 2}
      dominantBaseline="central"
      fill="#64748b"
      fontSize={11}
      fontWeight={700}
      fontFamily="'Inter', sans-serif"
    >
      {typeof value === "number" ? value.toLocaleString() : value}
    </text>
  );
};

/* ===================== Main Component ===================== */
const WidgetRenderer = ({ widget }: any) => {
  if (!widget?.success) {
    return (
      <div
        style={{
          ...card,
          background: "#fef2f2",
          border: "1px solid #fecaca",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        <p style={{ color: "#dc2626", fontSize: "13px", fontWeight: 600 }}>
          Widget failed to load
        </p>
      </div>
    );
  }

  const { widgetName, chartType, data, errorMessage } = widget;

  if (errorMessage) {
    return (
      <div
        style={{
          ...card,
          background: "#fffbeb",
          border: "1px solid #fde68a",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        <p style={{ color: "#d97706", fontSize: "13px", fontWeight: 600 }}>
          {errorMessage}
        </p>
      </div>
    );
  }

  /* =====================================================
     KPI
  ===================================================== */
  if (chartType === "KPI") {
    // Handle multiple KPI data shapes:
    // 1. Plain number: data = 17
    // 2. New rich shape: data = { totalContracts: 17, statusWiseBreakdown: { Active: 3, ... } }
    // 3. Array of items: data = [...] → count
    // 4. Plain object without totalContracts: fallback to key count
    let mainValue: number = 0;
    let breakdown: { label: string; value: number }[] | null = null;

    if (typeof data === "number") {
      mainValue = data;
    } else if (
      typeof data === "object" &&
      data !== null &&
      !Array.isArray(data)
    ) {
      // Rich shape with totalContracts key
      if ("totalContracts" in data) {
        mainValue = data.totalContracts;
        if (
          data.statusWiseBreakdown &&
          typeof data.statusWiseBreakdown === "object"
        ) {
          breakdown = Object.entries(data.statusWiseBreakdown).map(
            ([label, value]) => ({
              label,
              value: Number(value),
            }),
          );
        }
      } else {
        // e.g. {count: 5} — take first numeric value
        const firstNum = Object.values(data).find((v) => typeof v === "number");
        mainValue =
          typeof firstNum === "number" ? firstNum : Object.keys(data).length;
      }
    } else if (Array.isArray(data)) {
      mainValue = data.length;
    }

    const statusColors: Record<
      string,
      { dot: string; bg: string; text: string }
    > = {
      Active: { dot: "#0d9488", bg: "#f0fdfa", text: "#0d9488" },
      Signed: { dot: "#6366f1", bg: "#eef2ff", text: "#6366f1" },
      Expired: { dot: "#f59e0b", bg: "#fffbeb", text: "#d97706" },
      Pending: { dot: "#f97316", bg: "#fff7ed", text: "#ea580c" },
    };

    return (
      <div
        style={{
          ...card,
          padding: "20px 24px",
          justifyContent: "space-between",
          minHeight: "320px",
          background: "linear-gradient(135deg, #ffffff 60%, #f0fdfa 100%)",
          borderLeft: "4px solid #0d9488",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative soft teal orb */}
        <div
          style={{
            position: "absolute",
            top: "-20px",
            right: "-20px",
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, #ccfbf166 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <p style={cardTitle}>{widgetName}</p>

        <p
          style={{
            fontSize: "36px",
            fontWeight: 800,
            color: "#0f172a",
            lineHeight: 1,
            letterSpacing: "-0.02em",
          }}
        >
          {mainValue.toLocaleString()}
        </p>

        {/* Status breakdown pills */}
        {breakdown && breakdown.length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "5px",
              marginTop: "10px",
            }}
          >
            {breakdown.map(({ label, value: bVal }) => {
              const sc = statusColors[label] || {
                dot: "#64748b",
                bg: "#f1f5f9",
                text: "#64748b",
              };
              return (
                <span
                  key={label}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "2px 9px",
                    borderRadius: "20px",
                    fontSize: "10px",
                    fontWeight: 700,
                    background: sc.bg,
                    color: sc.text,
                    border: `1px solid ${sc.dot}33`,
                  }}
                >
                  <span
                    style={{
                      width: "5px",
                      height: "5px",
                      borderRadius: "50%",
                      background: sc.dot,
                      display: "inline-block",
                    }}
                  />
                  {label} {bVal}
                </span>
              );
            })}
          </div>
        )}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            marginTop: breakdown ? "8px" : "8px",
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#0d9488",
              display: "inline-block",
              boxShadow: "0 0 0 3px #ccfbf1",
            }}
          />
          <span style={{ fontSize: "11px", color: "#0d9488", fontWeight: 600 }}>
            Live
          </span>
        </div>
      </div>
    );
  }

  /* =====================================================
     Gauge
  ===================================================== */
  if (chartType === "Gauge") {
    const value = typeof data === "number" ? data : 0;
    const percentage = Math.min(Math.max(value, 0), 100);
    const gaugeColor =
      percentage >= 75 ? "#0d9488" : percentage >= 50 ? "#f59e0b" : "#ef4444";
    const gaugeBg =
      percentage >= 75 ? "#f0fdfa" : percentage >= 50 ? "#fffbeb" : "#fef2f2";
    const circumference = 2 * Math.PI * 38;
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <div
        style={{
          ...card,
          padding: "20px",
          alignItems: "center",
          justifyContent: "space-between",
          minHeight: "120px",
          background: `linear-gradient(135deg, #ffffff 60%, ${gaugeBg} 100%)`,
          borderLeft: `4px solid ${gaugeColor}`,
        }}
      >
        <p style={{ ...cardTitle, textAlign: "center" }}>{widgetName}</p>

        <div style={{ position: "relative", width: "100px", height: "100px" }}>
          <svg width="100" height="100" viewBox="0 0 100 100">
            {/* Track */}
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="9"
            />
            {/* Progress */}
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="none"
              stroke={gaugeColor}
              strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              transform="rotate(-90 50 50)"
              style={{
                transition: "stroke-dashoffset 1s ease",
                filter: `drop-shadow(0 0 4px ${gaugeColor}55)`,
              }}
            />
          </svg>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <p
              style={{
                fontSize: "20px",
                fontWeight: 800,
                color: gaugeColor,
                lineHeight: 1,
              }}
            >
              {percentage}%
            </p>
          </div>
        </div>

        <p
          style={{
            fontSize: "11px",
            color: "#94a3b8",
            fontWeight: 600,
            marginTop: "4px",
          }}
        >
          Health Score
        </p>
      </div>
    );
  }

  /* =====================================================
     Pie / Donut
  ===================================================== */
  if (chartType === "Pie" || chartType === "Donut") {
    const formatted = normalizeKeyValue(data);
    const total = formatted.reduce((acc, d) => acc + d.value, 0);
    const formattedWithTotal = formatted.map((d) => ({ ...d, total }));

    if (formatted.length === 0 || total === 0) {
      return (
        <div
          style={{
            ...card,
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            minHeight: "260px",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                color: "#cbd5e1",
                fontSize: "32px",
                marginBottom: "8px",
              }}
            >
              ○
            </p>
            <p style={{ color: "#94a3b8", fontSize: "13px" }}>
              No data available
            </p>
          </div>
        </div>
      );
    }

    const isDonut = chartType === "Donut";
    return (
      <div style={{ ...card, padding: "20px", minHeight: "300px" }}>
        <p style={cardTitle}>{widgetName}</p>

        {/* Chart */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "200px",
          }}
        >
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <defs>
                {GRADIENTS.map((grad, i) => (
                  <radialGradient
                    key={i}
                    id={`pieGrad${i}`}
                    cx="50%"
                    cy="50%"
                    r="50%"
                  >
                    <stop offset="0%" stopColor={grad[1]} stopOpacity={0.95} />
                    <stop offset="100%" stopColor={grad[0]} stopOpacity={1} />
                  </radialGradient>
                ))}
              </defs>
              <Pie
                data={formattedWithTotal}
                dataKey="value"
                innerRadius={isDonut ? 52 : 0}
                outerRadius={74}
                paddingAngle={isDonut ? 4 : 2}
                labelLine={false}
                label={renderPieLabel}
                isAnimationActive={true}
                animationBegin={0}
                animationDuration={900}
              >
                {formattedWithTotal.map((_, i) => (
                  <Cell
                    key={i}
                    fill={`url(#pieGrad${i})`}
                    stroke="#ffffff"
                    strokeWidth={3}
                    style={{
                      cursor: "pointer",
                      filter: "drop-shadow(0px 2px 6px rgba(0,0,0,0.1))",
                      transition: "all 0.2s ease",
                    }}
                  />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />

              {/* Donut center total */}
              {isDonut && (
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="central"
                >
                  <tspan
                    x="50%"
                    dy="-10"
                    fontSize="24"
                    fontWeight="800"
                    fill="#0f172a"
                    fontFamily="'Inter',sans-serif"
                  >
                    {total.toLocaleString()}
                  </tspan>
                  <tspan
                    x="50%"
                    dy="18"
                    fontSize="10"
                    fill="#94a3b8"
                    fontFamily="'Inter',sans-serif"
                    fontWeight="600"
                    letterSpacing="0.08em"
                  >
                    TOTAL
                  </tspan>
                </text>
              )}
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Value legend pills */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "6px",
            justifyContent: "center",
            marginTop: "4px",
          }}
        >
          {formatted.map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: `${COLORS[i % COLORS.length]}10`,
                border: `1px solid ${COLORS[i % COLORS.length]}30`,
                borderRadius: "20px",
                padding: "4px 12px",
                transition: "all 0.15s ease",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.background =
                  `${COLORS[i % COLORS.length]}1a`;
                (e.currentTarget as HTMLDivElement).style.boxShadow =
                  `0 2px 8px ${COLORS[i % COLORS.length]}33`;
                (e.currentTarget as HTMLDivElement).style.transform =
                  "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.background =
                  `${COLORS[i % COLORS.length]}10`;
                (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                (e.currentTarget as HTMLDivElement).style.transform =
                  "translateY(0)";
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: COLORS[i % COLORS.length],
                  flexShrink: 0,
                }}
              />
              <span
                style={{ fontSize: "11px", color: "#475569", fontWeight: 500 }}
              >
                {item.name}
              </span>
              <span
                style={{
                  fontSize: "12px",
                  color: COLORS[i % COLORS.length],
                  fontWeight: 800,
                }}
              >
                {item.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* =====================================================
     Bar / HorizontalBar / StackedBar
  ===================================================== */
  if (
    chartType === "Bar" ||
    chartType === "HorizontalBar" ||
    chartType === "StackedBar"
  ) {
    const isHorizontal = chartType === "HorizontalBar";
    const isStacked = chartType === "StackedBar";

    let formatted: any[] = [];
    let stackedKeys: string[] = [];

    if (
      chartType === "Bar" &&
      data &&
      typeof data === "object" &&
      !Array.isArray(data)
    ) {
      formatted = Object.entries(data)
        .filter(([k, v]) => k && Number(v) > 0) // remove empty labels & zero
        .map(([k, v]) => ({
          name: k,
          value: Number(v),
        }));
    }
    if (isStacked && Array.isArray(data)) {
      formatted = data.map((d: any) => {
        const obj: any = { name: d.escalationLevel || d.businessArea || "—" };
        if (d.issues) {
          d.issues.forEach((issue: any) => {
            const key = issue.severity || issue.issueType || "Issue";
            obj[key] = (obj[key] || 0) + 1;
          });
        } else {
          obj["Count"] = d.issueCount || 1;
        }
        return obj;
      });
      const keys = new Set<string>();
      formatted.forEach((d) =>
        Object.keys(d)
          .filter((k) => k !== "name")
          .forEach((k) => keys.add(k)),
      );
      stackedKeys = Array.from(keys);
    } else if (
      !Array.isArray(data) &&
      typeof data === "object" &&
      data !== null
    ) {
      // Check if values are nested objects e.g. { Active: { count: 3, totalValue: 24345 } }
      const firstVal = Object.values(data)[0];
      if (
        firstVal !== null &&
        typeof firstVal === "object" &&
        !Array.isArray(firstVal)
      ) {
        // Nested objects — flatten into multi-series bar rows
        formatted = Object.entries(data).map(([k, v]: any) => ({
          name: k && k.trim() !== "" ? k : "Unknown",
          ...Object.fromEntries(
            Object.entries(v as object).map(([subKey, subVal]) => [
              subKey,
              Number(subVal) || 0,
            ]),
          ),
        }));
        const keys = new Set<string>();
        formatted.forEach((d: any) =>
          Object.keys(d)
            .filter((k) => k !== "name")
            .forEach((k) => keys.add(k)),
        );
        stackedKeys = Array.from(keys); // re-use stackedKeys to drive multi-bar rendering
      } else {
        formatted = normalizeKeyValue(data);
      }
    } else {
      formatted = Array.isArray(data) ? data : normalizeKeyValue(data);
    }

    if (formatted.length === 0) {
      return (
        <div
          style={{
            ...card,
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            minHeight: "240px",
          }}
        >
          <p style={{ color: "#94a3b8", fontSize: "13px" }}>
            No data available
          </p>
        </div>
      );
    }

    return (
      <div style={{ ...card, padding: "20px", minHeight: "280px" }}>
        <p style={cardTitle}>{widgetName}</p>

        <div style={{ flex: 1, minHeight: "200px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={formatted}
              layout={isHorizontal ? "vertical" : "horizontal"}
              margin={
                isHorizontal
                  ? { left: 90, right: 56, top: 8, bottom: 8 }
                  : { top: 28, right: 20, left: 0, bottom: 30 }
              }
            >
              <defs>
                {GRADIENTS.map((grad, i) => (
                  <linearGradient
                    key={i}
                    id={`barG${i}`}
                    x1={isHorizontal ? "0" : "0"}
                    y1={isHorizontal ? "0" : "0"}
                    x2={isHorizontal ? "1" : "0"}
                    y2={isHorizontal ? "0" : "1"}
                  >
                    <stop offset="0%" stopColor={grad[1]} stopOpacity={0.9} />
                    <stop offset="100%" stopColor={grad[0]} stopOpacity={1} />
                  </linearGradient>
                ))}
              </defs>

              <CartesianGrid
                strokeDasharray="4 4"
                stroke="#f1f5f9"
                vertical={isHorizontal}
                horizontal={!isHorizontal}
              />

              {isHorizontal ? (
                <>
                  <XAxis
                    type="number"
                    tick={{ fontSize: 10, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "#64748b", fontWeight: 500 }}
                    width={85}
                    axisLine={false}
                    tickLine={false}
                  />
                </>
              ) : (
                <>
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "#64748b", fontWeight: 500 }}
                    angle={formatted.length > 4 ? -18 : 0}
                    textAnchor={formatted.length > 4 ? "end" : "middle"}
                    interval={0}
                    axisLine={false}
                    tickLine={false}
                    height={40}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "#94a3b8" }}
                    width={35}
                    axisLine={false}
                    tickLine={false}
                  />
                </>
              )}

              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "rgba(13,148,136,0.05)", radius: 6 }}
              />

              {/* STACKED bars */}
              {isStacked && stackedKeys.length > 0 ? (
                <>
                  {stackedKeys.map((key, i) => (
                    <Bar
                      key={key}
                      dataKey={key}
                      stackId="a"
                      fill={`url(#barG${i})`}
                      radius={
                        i === stackedKeys.length - 1
                          ? [6, 6, 0, 0]
                          : [0, 0, 0, 0]
                      }
                    >
                      {i === stackedKeys.length - 1 && (
                        <LabelList
                          dataKey={key}
                          position="top"
                          content={<BarTopLabel />}
                        />
                      )}
                    </Bar>
                  ))}
                  <Legend
                    iconType="circle"
                    wrapperStyle={{
                      fontSize: "11px",
                      color: "#64748b",
                      paddingTop: "8px",
                    }}
                  />
                </>
              ) : !isStacked && stackedKeys.length > 0 ? (
                /* GROUPED bars — nested object e.g. {Active:{count,totalValue}} */
                <>
                  {stackedKeys.map((key, i) => (
                    <Bar
                      key={key}
                      dataKey={key}
                      fill={`url(#barG${i})`}
                      radius={[6, 6, 0, 0]}
                      maxBarSize={44}
                    >
                      <LabelList
                        dataKey={key}
                        position="top"
                        content={<BarTopLabel />}
                      />
                    </Bar>
                  ))}
                  <Legend
                    iconType="circle"
                    wrapperStyle={{
                      fontSize: "11px",
                      color: "#64748b",
                      paddingTop: "8px",
                    }}
                  />
                </>
              ) : (
                /* SIMPLE single-series bars */
                <Bar
                  dataKey="value"
                  radius={isHorizontal ? [0, 8, 8, 0] : [8, 8, 0, 0]}
                  maxBarSize={52}
                >
                  {formatted.map((_: any, i: number) => (
                    <Cell
                      key={i}
                      fill={`url(#barG${i % GRADIENTS.length})`}
                      style={{
                        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.08))",
                        transition: "filter 0.2s",
                      }}
                    />
                  ))}
                  {isHorizontal ? (
                    <LabelList
                      dataKey="value"
                      position="right"
                      content={<HBarRightLabel />}
                    />
                  ) : (
                    <LabelList
                      dataKey="value"
                      position="top"
                      content={<BarTopLabel />}
                    />
                  )}
                </Bar>
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  /* =====================================================
     Line
  ===================================================== */
  if (chartType === "Line") {
    if (!Array.isArray(data) || data.length === 0) {
      return (
        <div
          style={{
            ...card,
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            minHeight: "200px",
          }}
        >
          <p style={{ color: "#94a3b8", fontSize: "13px" }}>
            No data available
          </p>
        </div>
      );
    }

    return (
      <div style={{ ...card, padding: "20px", minHeight: "240px" }}>
        <p style={cardTitle}>{widgetName}</p>

        <div style={{ flex: 1, minHeight: "160px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 10, right: 20, left: -10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#94a3b8" }}
                width={35}
                axisLine={false}
                tickLine={false}
              />
              <Line
                dataKey="value"
                stroke="#0d9488"
                strokeWidth={2.5}
                dot={{
                  fill: "#0d9488",
                  strokeWidth: 2,
                  r: 4,
                  stroke: "#ffffff",
                }}
                activeDot={{
                  r: 7,
                  fill: "#0d9488",
                  stroke: "#ffffff",
                  strokeWidth: 2,
                }}
                isAnimationActive={true}
                animationDuration={900}
              />
              <Tooltip content={<CustomTooltip />} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  /* =====================================================
     Timeline
  ===================================================== */
  if (chartType === "Timeline" && Array.isArray(data)) {
    if (data.length === 0) {
      return (
        <div
          style={{
            ...card,
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <p style={{ color: "#94a3b8", fontSize: "13px" }}>No timeline data</p>
        </div>
      );
    }

    const priorityStyle: Record<string, any> = {
      High: {
        bg: "#fef2f2",
        border: "#fecaca",
        color: "#dc2626",
        dot: "#ef4444",
        badge: "#fee2e2",
      },
      Medium: {
        bg: "#fffbeb",
        border: "#fde68a",
        color: "#d97706",
        dot: "#f59e0b",
        badge: "#fef3c7",
      },
      Low: {
        bg: "#f0fdfa",
        border: "#99f6e4",
        color: "#0d9488",
        dot: "#0d9488",
        badge: "#ccfbf1",
      },
    };

    return (
      <div style={{ ...card, padding: "20px", overflowY: "auto" }}>
        <p style={cardTitle}>{widgetName}</p>

        <div style={{ position: "relative", paddingLeft: "22px" }}>
          {/* Vertical connector line */}
          <div
            style={{
              position: "absolute",
              left: "7px",
              top: "8px",
              bottom: "8px",
              width: "2px",
              background: "linear-gradient(to bottom, #0d9488, #e2e8f0)",
              borderRadius: "1px",
            }}
          />

          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {data.map((item: any, idx: number) => {
              const p = item.priority || "Low";
              const s = priorityStyle[p] || priorityStyle.Low;
              return (
                <div key={item.rowKey || idx} style={{ position: "relative" }}>
                  {/* Dot */}
                  <div
                    style={{
                      position: "absolute",
                      left: "-19px",
                      top: "12px",
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      background: s.dot,
                      border: "2px solid #ffffff",
                      boxShadow: `0 0 0 3px ${s.dot}33`,
                    }}
                  />

                  <div
                    style={{
                      background: s.bg,
                      border: `1px solid ${s.border}`,
                      borderRadius: "12px",
                      padding: "12px 16px",
                      transition: "box-shadow 0.2s ease, transform 0.2s ease",
                      cursor: "default",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.boxShadow =
                        `0 4px 16px ${s.dot}33`;
                      (e.currentTarget as HTMLDivElement).style.transform =
                        "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.boxShadow =
                        "none";
                      (e.currentTarget as HTMLDivElement).style.transform =
                        "translateY(0)";
                    }}
                  >
                    <p
                      style={{
                        fontWeight: 700,
                        fontSize: "13px",
                        color: "#0f172a",
                      }}
                    >
                      {item.milestoneTitle || "Milestone"}
                    </p>
                    <p
                      style={{
                        fontSize: "11px",
                        color: "#94a3b8",
                        marginTop: "2px",
                      }}
                    >
                      {new Date(item.milestoneDate).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        },
                      )}
                    </p>
                    {item.priority && (
                      <span
                        style={{
                          display: "inline-block",
                          marginTop: "6px",
                          padding: "2px 10px",
                          borderRadius: "20px",
                          fontSize: "10px",
                          fontWeight: 700,
                          background: s.badge,
                          color: s.color,
                          letterSpacing: "0.04em",
                        }}
                      >
                        {item.priority}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  /* =====================================================
     Table
  ===================================================== */

  if (chartType === "Table" && data && typeof data === "object") {
    const rows = Object.entries(data).map(([k, v]: any) => ({
      label: k,
      count: v.count,
      value: v.totalValue,
    }));

    return (
      <div style={{ ...card, padding: "20px" }}>
        <p style={cardTitle}>{widgetName}</p>

        {rows.map((r) => (
          <div
            key={r.label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 0",
              borderBottom: "1px solid #e2e8f0",
            }}
          >
            <strong>{r.label}</strong>
            <span>{r.count} contracts</span>
            <span>₹ {r.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export default WidgetRenderer;
