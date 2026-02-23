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
  Tooltip
} from "recharts";

/* ===================== Constants ===================== */
const COLORS = [
  "#6366f1", // indigo
  "#22c55e", // green
  "#f59e0b", // amber
  "#ef4444", // red
  "#06b6d4", // cyan
  "#a855f7"  // purple
];


const normalizeKeyValue = (data: any) => {
  if (!data || typeof data !== "object") return [];
  return Object.entries(data).map(([k, v]) => ({
    name: k && k.trim() !== "" ? k : "Unknown",
    value: Number(v) || 0
  }));
};

/* ===================== Component ===================== */
const WidgetRenderer = ({ widget }: any) => {
  if (!widget?.success) return null;

  const { widgetName, chartType, data } = widget;

  /* =====================================================
     KPI
  ===================================================== */
  if (chartType === "KPI") {
    const value =
      typeof data === "number"
        ? data
        : Array.isArray(data)
        ? data.length
        : 0;

    return (
      <div className="h-full rounded-2xl bg-gradient-to-br from-white to-slate-50 border shadow-md p-5 flex flex-col">
        <p className="text-xs uppercase tracking-wide text-gray-400">
          {widgetName}
        </p>

        <p className="text-4xl font-bold text-slate-900 mt-2">
          {value}
        </p>

        <div className="mt-auto text-xs font-medium text-emerald-600">
          Live metric
        </div>
      </div>
    );
  }

  /* =====================================================
     Gauge
  ===================================================== */
  if (chartType === "Gauge") {
    const value = typeof data === "number" ? data : 0;

    return (
      <div className="h-full rounded-2xl bg-gradient-to-br from-white to-slate-50 border shadow-md p-5 flex flex-col items-center justify-center">
        <p className="text-xs uppercase tracking-wide text-gray-400">
          {widgetName}
        </p>

        <p className="text-5xl font-bold text-indigo-600 mt-2">
          {value}%
        </p>

        <p className="text-xs text-gray-400 mt-1">
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

    if (formatted.length === 0) {
      return (
        <div className="h-full rounded-2xl bg-white border shadow-md flex items-center justify-center text-gray-400 text-sm">
          No data available
        </div>
      );
    }

    return (
      <div className="h-full rounded-2xl bg-white border shadow-md p-4">
        <p className="text-sm font-semibold text-slate-700 mb-2">
          {widgetName}
        </p>

        <div className="h-[160px]">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={formatted}
                dataKey="value"
                innerRadius={chartType === "Donut" ? 45 : 0}
                outerRadius={70}
              >
                {formatted.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
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
    const formatted = Array.isArray(data)
      ? data
      : normalizeKeyValue(data);

    if (formatted.length === 0) {
      return (
        <div className="h-full rounded-2xl bg-white border shadow-md flex items-center justify-center text-gray-400 text-sm">
          No data available
        </div>
      );
    }

    return (
      <div className="h-full rounded-2xl bg-white border shadow-md p-4">
        <p className="text-sm font-semibold text-slate-700 mb-2">
          {widgetName}
        </p>

        <div className="h-[160px]">
          <ResponsiveContainer>
            <BarChart
              data={formatted}
              layout={chartType === "HorizontalBar" ? "vertical" : "horizontal"}
            >
              <XAxis
                type={chartType === "HorizontalBar" ? "number" : "category"}
                dataKey="name"
              />
              <YAxis
                type={chartType === "HorizontalBar" ? "category" : "number"}
              />
              <Bar
                dataKey="value"
                fill="#6366f1"
                radius={[6, 6, 0, 0]}
              />
              <Tooltip />
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
        <div className="h-full rounded-2xl bg-white border shadow-md flex items-center justify-center text-gray-400 text-sm">
          No data available
        </div>
      );
    }

    return (
      <div className="h-full rounded-2xl bg-white border shadow-md p-4">
        <p className="text-sm font-semibold text-slate-700 mb-2">
          {widgetName}
        </p>

        <div className="h-[160px]">
          <ResponsiveContainer>
            <LineChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Line
                dataKey="value"
                stroke="#22c55e"
                strokeWidth={3}
                dot={false}
              />
              <Tooltip />
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
    return (
      <div className="h-full rounded-2xl bg-white border shadow-md p-4 overflow-auto">
        <p className="text-sm font-semibold text-slate-700 mb-4">
          {widgetName}
        </p>

        {data.map((item: any) => (
          <div key={item.rowKey} className="flex gap-3 mb-4">
            <div className="w-2 h-2 mt-2 rounded-full bg-indigo-500" />
            <div>
              <p className="font-medium text-slate-800">
                {item.milestoneTitle}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(item.milestoneDate).toDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  /* =====================================================
     Table
  ===================================================== */
  if (chartType === "Table") {
    const rows = Array.isArray(data)
      ? data
      : normalizeKeyValue(data);

    if (rows.length === 0) {
      return (
        <div className="h-full rounded-2xl bg-white border shadow-md flex items-center justify-center text-gray-400 text-sm">
          No records found
        </div>
      );
    }

    return (
      <div className="h-full rounded-2xl bg-white border shadow-md p-4 overflow-auto">
        <p className="text-sm font-semibold text-slate-700 mb-3">
          {widgetName}
        </p>

        {rows.map((row: any, i: number) => (
          <div
            key={row.rowKey || row.contractId || i}
            className="flex justify-between py-2 border-b last:border-0 text-sm"
          >
            <span className="text-slate-600">
              {row.name || row.counterpartyName || row.title}
            </span>

            <span className="font-semibold text-slate-900">
              {row.value ?? row.contractCount ?? row.totalValue ?? ""}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export default WidgetRenderer;