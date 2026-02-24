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
} from "recharts";

/* ===================== Constants ===================== */
const COLORS = [
  "#6366f1", // indigo
  "#22c55e", // green
  "#f59e0b", // amber
  "#ef4444", // red
  "#06b6d4", // cyan
  "#a855f7", // purple
];

const normalizeKeyValue = (data: any) => {
  if (!data || typeof data !== "object") return [];
  return Object.entries(data).map(([k, v]) => ({
    name: k && k.trim() !== "" ? k : "Unknown",
    value: Number(v) || 0,
  }));
};

/* ===================== Component ===================== */
const WidgetRenderer = ({ widget }: any) => {
  if (!widget?.success) {
    return (
      <div className="h-full rounded-xl bg-red-50 border border-red-200 p-4 flex items-center justify-center">
        <p className="text-red-600 text-sm font-medium">
          Widget failed to load
        </p>
      </div>
    );
  }

  const { widgetName, chartType, data, errorMessage } = widget;

  if (errorMessage) {
    return (
      <div className="h-full rounded-xl bg-yellow-50 border border-yellow-200 p-4 flex items-center justify-center">
        <p className="text-yellow-700 text-sm font-medium">{errorMessage}</p>
      </div>
    );
  }

  /* =====================================================
     KPI
  ===================================================== */
  if (chartType === "KPI") {
    const value =
      typeof data === "number" ? data : Array.isArray(data) ? data.length : 0;

    return (
      <div className="h-full rounded-xl bg-gradient-to-br from-white to-slate-50 border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
            {widgetName}
          </p>
        </div>

        <div className="flex items-end gap-2">
          <p className="text-3xl sm:text-4xl font-bold text-slate-900">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
        </div>

        <div className="text-xs font-medium text-emerald-600 mt-2">● Live</div>
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
      percentage >= 75
        ? "text-emerald-600"
        : percentage >= 50
          ? "text-amber-600"
          : "text-red-600";

    return (
      <div className="h-full rounded-xl bg-gradient-to-br from-white to-slate-50 border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 text-center">
          {widgetName}
        </p>

        <div className="flex flex-col items-center gap-1">
          <div className="relative w-20 h-20 rounded-full border-4 border-slate-200 flex items-center justify-center">
            <div
              className={`w-16 h-16 rounded-full bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center ${gaugeColor}`}
            >
              <p className="text-xl font-bold">{percentage}%</p>
            </div>
          </div>
          <p className="text-xs text-gray-400 font-medium">Health Score</p>
        </div>
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
        <div className="h-full rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-gray-400 text-sm p-4">
          No data available
        </div>
      );
    }

    return (
      <div className="h-full rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-600 mb-3">
          {widgetName}
        </p>

        <div className="flex-1 flex items-center justify-center min-h-[140px]">
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie
                data={formatted}
                dataKey="value"
                innerRadius={chartType === "Donut" ? 35 : 0}
                outerRadius={55}
                paddingAngle={2}
              >
                {formatted.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="mt-2 flex flex-wrap gap-2 justify-center text-xs">
          {formatted.map((item: any, i: number) => (
            <div key={i} className="flex items-center gap-1">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
              />
              <span className="text-gray-600">{item.name}</span>
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
    const formatted = Array.isArray(data) ? data : normalizeKeyValue(data);

    if (formatted.length === 0) {
      return (
        <div className="h-full rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-gray-400 text-sm p-4">
          No data available
        </div>
      );
    }

    return (
      <div className="h-full rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-600 mb-3">
          {widgetName}
        </p>

        <div className="flex-1 flex items-center justify-center min-h-[140px]">
          <ResponsiveContainer width="100%" height={140}>
            <BarChart
              data={formatted}
              layout={chartType === "HorizontalBar" ? "vertical" : "horizontal"}
              margin={
                chartType === "HorizontalBar"
                  ? { left: 80, right: 10, top: 5, bottom: 5 }
                  : { top: 5, right: 10, left: 0, bottom: 20 }
              }
            >
              <XAxis
                type={chartType === "HorizontalBar" ? "number" : "category"}
                dataKey="name"
                tick={{ fontSize: 11 }}
                angle={chartType === "HorizontalBar" ? 0 : -15}
              />
              <YAxis
                type={chartType === "HorizontalBar" ? "category" : "number"}
                tick={{ fontSize: 11 }}
                width={chartType === "HorizontalBar" ? 75 : 30}
              />
              <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
              />
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
        <div className="h-full rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-gray-400 text-sm p-4">
          No data available
        </div>
      );
    }

    return (
      <div className="h-full rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-600 mb-3">
          {widgetName}
        </p>

        <div className="flex-1 flex items-center justify-center min-h-[140px]">
          <ResponsiveContainer width="100%" height={140}>
            <LineChart
              data={data}
              margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
            >
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} width={30} />
              <Line
                dataKey="value"
                stroke="#22c55e"
                strokeWidth={2.5}
                dot={false}
                isAnimationActive={true}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
              />
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
        <div className="h-full rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-gray-400 text-sm p-4">
          No timeline data available
        </div>
      );
    }

    return (
      <div className="h-full rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-4 overflow-auto flex flex-col">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-600 mb-3">
          {widgetName}
        </p>

        <div className="space-y-3">
          {data.map((item: any, idx: number) => (
            <div key={item.rowKey || idx} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 mt-1" />
                {idx !== data.length - 1 && (
                  <div className="w-0.5 h-8 bg-indigo-200 mt-1" />
                )}
              </div>
              <div className="flex-1 pb-2">
                <p className="font-semibold text-sm text-slate-800">
                  {item.milestoneTitle}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {new Date(item.milestoneDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                {item.priority && (
                  <span
                    className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium ${
                      item.priority === "High"
                        ? "bg-red-100 text-red-700"
                        : item.priority === "Medium"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-green-100 text-green-700"
                    }`}
                  >
                    {item.priority}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* =====================================================
     Table
  ===================================================== */
  if (chartType === "Table") {
    const rows = Array.isArray(data) ? data : normalizeKeyValue(data);

    if (rows.length === 0) {
      return (
        <div className="h-full rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-gray-400 text-sm p-4">
          No records found
        </div>
      );
    }

    return (
      <div className="h-full rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-4 overflow-auto flex flex-col">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-600 mb-3">
          {widgetName}
        </p>

        <div className="space-y-2 flex-1 overflow-y-auto">
          {rows.map((row: any, i: number) => (
            <div
              key={row.rowKey || row.contractId || i}
              className="flex justify-between items-center py-2 px-2 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors text-sm"
            >
              <span className="text-slate-700 font-medium truncate flex-1">
                {row.name || row.counterpartyName || row.title || "N/A"}
              </span>

              <span className="font-bold text-slate-900 ml-2 text-right flex-shrink-0">
                {row.value ??
                  row.contractCount ??
                  (row.totalValue
                    ? `$${row.totalValue.toLocaleString()}`
                    : "—")}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};

export default WidgetRenderer;
