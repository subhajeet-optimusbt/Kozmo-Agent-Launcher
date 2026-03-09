/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { createPortal } from "react-dom";
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
import { LayoutGrid, List, X } from "lucide-react";

/* ===================== Palette ===================== */
const COLORS = [
  "#0d9488",
  "#6366f1",
  "#f59e0b",
  "#ef4444",
  "#06b6d4",
  "#a855f7",
  "#f97316",
  "#ec4899",
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

/** Normalize any object/array/number into [{name, value}] */
const normalizeKeyValue = (data: any): { name: string; value: number }[] => {
  if (data === null || data === undefined) return [];
  if (typeof data === "number") return [{ name: "Value", value: data }];
  if (Array.isArray(data)) {
    return data
      .filter((d) => d && typeof d === "object")
      .map((d, i) => ({
        name: d.name || d.label || d.key || String(i + 1),
        value: Number(d.value ?? d.count ?? d.total ?? 0),
      }));
  }
  if (typeof data === "object") {
    return Object.entries(data).map(([k, v]) => ({
      name: k && k.trim() !== "" ? k : "Unknown",
      value: Number(v) || 0,
    }));
  }
  return [];
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

/* ===================== Empty State ===================== */
const EmptyCard = ({
  title,
  message = "No data available",
}: {
  title?: string;
  message?: string;
}) => (
  <div
    style={{
      ...card,
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      minHeight: "200px",
    }}
  >
    {title && (
      <p style={{ ...cardTitle, marginBottom: "8px", textAlign: "center" }}>
        {title}
      </p>
    )}
    <p style={{ color: "#94a3b8", fontSize: "13px" }}>{message}</p>
  </div>
);

/* ===================== Section Header stripe ===================== */
const SectionHeader = ({ title }: { title: string }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "6px 16px",
      background: "linear-gradient(90deg,#f0fdfa 0%,#f8fafc 100%)",
      borderBottom: "1px solid #e2e8f0",
    }}
  >
    <div
      style={{
        width: "3px",
        height: "14px",
        borderRadius: "2px",
        background: "#0d9488",
      }}
    />
    <span
      style={{
        fontSize: "10px",
        fontWeight: 700,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: "#0d9488",
      }}
    >
      {title}
    </span>
  </div>
);

/* ===================== NEW: Chart Header with view toggle ===================== */
const ChartHeader = ({
  title,
  viewMode,
  onViewChange,
  onTitleClick,
  totalCount,
}: {
  title: string;
  viewMode: "graph" | "list";
  onViewChange: (mode: "graph" | "list") => void;
  onTitleClick?: () => void;
  totalCount?: number;
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "6px 12px 6px 16px",
      background: "linear-gradient(90deg,#f0fdfa 0%,#f8fafc 100%)",
      borderBottom: "1px solid #e2e8f0",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <div
        style={{
          width: "3px",
          height: "14px",
          borderRadius: "2px",
          background: "#0d9488",
        }}
      />
      <span
        onClick={onTitleClick}
        style={{
          fontSize: "10px",
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "#0d9488",
          cursor: onTitleClick ? "pointer" : "default",
        }}
      >
        {title}
      </span>
      {onTitleClick && totalCount !== undefined && (
        <span
          onClick={onTitleClick}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1px 8px",
            borderRadius: "20px",
            fontSize: "10px",
            fontWeight: 700,
            background: "#f0fdfa",
            color: "#0d9488",
            border: "1px solid #99f6e4",
            cursor: "pointer",
          }}
        >
          {totalCount} total
        </span>
      )}
    </div>
    {/* View toggle */}
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "2px",
        background: "#f1f5f9",
        borderRadius: "8px",
        padding: "2px",
      }}
    >
      <button
        onClick={() => onViewChange("graph")}
        title="Graph View"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "26px",
          height: "26px",
          borderRadius: "6px",
          border: "none",
          cursor: "pointer",
          background: viewMode === "graph" ? "#ffffff" : "transparent",
          color: viewMode === "graph" ? "#0d9488" : "#94a3b8",
          boxShadow:
            viewMode === "graph" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
          transition: "all 0.15s ease",
        }}
      >
        <LayoutGrid size={13} />
      </button>
      <button
        onClick={() => onViewChange("list")}
        title="List View"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "26px",
          height: "26px",
          borderRadius: "6px",
          border: "none",
          cursor: "pointer",
          background: viewMode === "list" ? "#ffffff" : "transparent",
          color: viewMode === "list" ? "#0d9488" : "#94a3b8",
          boxShadow: viewMode === "list" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
          transition: "all 0.15s ease",
        }}
      >
        <List size={13} />
      </button>
    </div>
  </div>
);

/* ===================== NEW: Drill-down Modal ===================== */
const DrillDownModal = ({
  title,
  segmentName,
  items,
  onClose,
}: {
  title: string;
  segmentName: string;
  items: any[];
  onClose: () => void;
}) => {
  if (!items || items.length === 0) return null;

  const skipKeys = new Set([
    "partitionKey",
    "rowKey",
    "timestamp",
    "eTag",
    "modifiedBy",
    "createdBy",
    "created",
    "modified",
  ]);

  const allKeys = Object.keys(items[0]).filter((k) => !skipKeys.has(k));

  const formatCell = (key: string, val: any): string => {
    if (val === null || val === undefined || val === "") return "—";
    if (typeof val === "boolean") return val ? "Yes" : "No";
    if (typeof val === "string" && val.match(/^\d{4}-\d{2}-\d{2}T/)) {
      return new Date(val).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
    if (typeof val === "number") {
      if (/value|amount|total/i.test(key)) {
        return `$${val.toLocaleString()}`;
      }
      return val.toLocaleString();
    }
    return String(val);
  };

  const labelify = (key: string) =>
    key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (s) => s.toUpperCase())
      .trim();

  const statusColor = (status: string) => {
    const map: Record<string, { bg: string; color: string }> = {
      Active: { bg: "#f0fdfa", color: "#0d9488" },
      Signed: { bg: "#eef2ff", color: "#6366f1" },
      Expired: { bg: "#fffbeb", color: "#d97706" },
      Pending: { bg: "#fff7ed", color: "#ea580c" },
    };
    return map[status] || { bg: "#f1f5f9", color: "#64748b" };
  };

  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(15,23,42,0.55)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        padding: "40px 24px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: "20px",
          boxShadow:
            "0 32px 80px rgba(0,0,0,0.25), 0 8px 24px rgba(13,148,136,0.12)",
          width: "100%",
          maxWidth: "1100px",
          height: "80vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          fontFamily: "'Inter', sans-serif",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            background: "linear-gradient(90deg, #f0fdfa, #f8fafc)",
            borderBottom: "1px solid #e2e8f0",
            flexShrink: 0,
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  width: "4px",
                  height: "16px",
                  borderRadius: "2px",
                  background: "#0d9488",
                }}
              />
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#0f172a",
                  letterSpacing: "0.01em",
                }}
              >
                {title}
              </span>
              {segmentName && (
                <span
                  style={{
                    padding: "2px 10px",
                    borderRadius: "20px",
                    background: "#f0fdfa",
                    color: "#0d9488",
                    fontSize: "11px",
                    fontWeight: 700,
                    border: "1px solid #99f6e4",
                  }}
                >
                  {segmentName === "All" ? "All Records" : segmentName}
                </span>
              )}
            </div>
            <p
              style={{
                fontSize: "11px",
                color: "#94a3b8",
                marginTop: "3px",
                paddingLeft: "12px",
              }}
            >
              {items.length} {items.length === 1 ? "record" : "records"}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              background: "#f8fafc",
              cursor: "pointer",
              color: "#64748b",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#fef2f2";
              e.currentTarget.style.color = "#dc2626";
              e.currentTarget.style.borderColor = "#fecaca";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#f8fafc";
              e.currentTarget.style.color = "#64748b";
              e.currentTarget.style.borderColor = "#e2e8f0";
            }}
          >
            <X size={15} />
          </button>
        </div>

        {/* Modal Table */}
        <div style={{ overflowY: "auto", flex: 1 }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "12px",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            <thead
              style={{
                position: "sticky",
                top: 0,
                zIndex: 1,
              }}
            >
              <tr
                style={{
                  background: "linear-gradient(90deg,#f0fdfa,#f8fafc)",
                }}
              >
                {allKeys.map((k) => (
                  <th
                    key={k}
                    style={{
                      padding: "10px 16px",
                      textAlign: "left",
                      fontSize: "10px",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "#0d9488",
                      borderBottom: "2px solid #e2e8f0",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {labelify(k)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((row: any, idx: number) => (
                <tr
                  key={idx}
                  style={{
                    background: idx % 2 === 0 ? "#ffffff" : "#f8fafc",
                    transition: "background 0.12s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLTableRowElement).style.background =
                      "#f0fdfa";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLTableRowElement).style.background =
                      idx % 2 === 0 ? "#ffffff" : "#f8fafc";
                  }}
                >
                  {allKeys.map((k, ci) => (
                    <td
                      key={k}
                      style={{
                        padding: "10px 16px",
                        borderBottom: "1px solid #f1f5f9",
                        color: ci === 0 ? "#0f172a" : "#475569",
                        fontWeight: ci === 0 ? 600 : 400,
                        maxWidth: "200px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {k === "status" ? (
                        <span
                          style={{
                            padding: "2px 10px",
                            borderRadius: "20px",
                            fontSize: "10px",
                            fontWeight: 700,
                            background: statusColor(row[k]).bg,
                            color: statusColor(row[k]).color,
                          }}
                        >
                          {row[k] || "—"}
                        </span>
                      ) : (
                        formatCell(k, row[k])
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>,
    document.body,
  );
};

/* ===================== NEW: List View — mirrors chart segments ===================== */
// Receives the same `formatted` array the chart uses: [{name, value}]
// plus an optional drillLookup so rows are clickable to open the modal
const ChartListView = ({
  rows,
  onRowClick,
  drillLookup,
}: {
  rows: { name: string; value: number }[];
  onRowClick?: (name: string) => void;
  drillLookup?: Record<string, any[]>;
}) => {
  if (!rows || rows.length === 0)
    return (
      <div
        style={{
          padding: "24px",
          textAlign: "center",
          color: "#94a3b8",
          fontSize: "12px",
        }}
      >
        No data
      </div>
    );

  return (
    <div style={{ overflowX: "auto", flex: 1 }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "12px",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <thead>
          <tr style={{ background: "linear-gradient(90deg,#f0fdfa,#f8fafc)" }}>
            {["Segment", "Count"].map((h) => (
              <th
                key={h}
                style={{
                  padding: "10px 16px",
                  textAlign: "left",
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#0d9488",
                  borderBottom: "2px solid #e2e8f0",
                  whiteSpace: "nowrap",
                }}
              >
                {h}
              </th>
            ))}
            {drillLookup && (
              <th
                style={{
                  padding: "10px 16px",
                  textAlign: "left",
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#0d9488",
                  borderBottom: "2px solid #e2e8f0",
                }}
              >
                Details
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => {
            const hasDrill = !!(drillLookup && drillLookup[row.name]?.length);
            return (
              <tr
                key={idx}
                style={{
                  background: idx % 2 === 0 ? "#ffffff" : "#f8fafc",
                  transition: "background 0.12s",
                  cursor: hasDrill ? "pointer" : "default",
                }}
                onClick={() => hasDrill && onRowClick && onRowClick(row.name)}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLTableRowElement).style.background =
                    "#f0fdfa";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLTableRowElement).style.background =
                    idx % 2 === 0 ? "#ffffff" : "#f8fafc";
                }}
              >
                <td
                  style={{
                    padding: "10px 16px",
                    borderBottom: "1px solid #f1f5f9",
                    fontWeight: 600,
                    color: "#0f172a",
                  }}
                >
                  {row.name || "—"}
                </td>
                <td
                  style={{
                    padding: "10px 16px",
                    borderBottom: "1px solid #f1f5f9",
                    color: "#0d9488",
                    fontWeight: 700,
                  }}
                >
                  {row.value.toLocaleString()}
                </td>
                {drillLookup && (
                  <td
                    style={{
                      padding: "10px 16px",
                      borderBottom: "1px solid #f1f5f9",
                    }}
                  >
                    {hasDrill ? (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          padding: "2px 10px",
                          borderRadius: "20px",
                          fontSize: "10px",
                          fontWeight: 700,
                          background: "#f0fdfa",
                          color: "#0d9488",
                          border: "1px solid #99f6e4",
                        }}
                      >
                        View {drillLookup[row.name].length} records →
                      </span>
                    ) : (
                      <span style={{ color: "#cbd5e1", fontSize: "11px" }}>
                        —
                      </span>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div
        style={{
          padding: "8px 16px",
          background: "#f8fafc",
          borderTop: "1px solid #f1f5f9",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "18px",
            height: "18px",
            borderRadius: "50%",
            background: "#0d948820",
            color: "#0d9488",
            fontSize: "10px",
            fontWeight: 700,
          }}
        >
          {rows.length}
        </span>
        <span style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 500 }}>
          {rows.length === 1 ? "segment" : "segments"}
        </span>
      </div>
    </div>
  );
};

/* ===================== Main Component ===================== */
const WidgetRenderer = ({ widget }: any) => {
  const [viewMode, setViewMode] = useState<"graph" | "list">("graph");
  const [drillModal, setDrillModal] = useState<{
    segmentName: string;
    items: any[];
  } | null>(null);

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
    const d = data as any;
    let mainValue: number = 0;
    let mainLabel: string = widgetName;
    let prefix = "";
    let breakdown: { label: string; value: number; isAmount?: boolean }[] = [];
    const extraFields: { label: string; raw: any }[] = [];
    let drillItems: any[] | null = null;

    if (typeof data === "number") {
      mainValue = data;
    } else if (Array.isArray(data)) {
      // WG009 shape: data is the array itself — count = length, items = data
      mainValue = data.length;
      mainLabel = widgetName;
      drillItems = data;
    } else if (typeof data === "object" && data !== null) {
      if (d.drillBreakoff?.items) drillItems = d.drillBreakoff.items;

      const allEntries = Object.entries(d).filter(
        ([k]) => k !== "drillBreakoff",
      );

      // Pick primary: prefer "total*" keys first, then any lone numeric key like "count"
      const primaryEntry =
        allEntries.find(
          ([k, v]) =>
            k.toLowerCase().startsWith("total") && typeof v === "number",
        ) ?? allEntries.find(([v]) => typeof v === "number");

      if (primaryEntry) {
        mainValue = Number(primaryEntry[1]);
        mainLabel = primaryEntry[0]
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (s) => s.toUpperCase())
          .trim();
        if (
          mainLabel.toLowerCase().includes("revenue") ||
          mainLabel.toLowerCase().includes("amount") ||
          mainLabel.toLowerCase().includes("value")
        ) {
          prefix = "$";
        }
      }

      // Everything else: objects → breakdown pills, numbers → extra stat rows
      for (const [k, v] of allEntries) {
        if (k === primaryEntry?.[0]) continue;
        if (v && typeof v === "object" && !Array.isArray(v)) {
          breakdown = Object.entries(v as object).map(([label, val]) => ({
            label,
            value: Number(val),
            isAmount: prefix === "$",
          }));
        } else if (typeof v === "number") {
          extraFields.push({ label: k, raw: v });
        }
      }
    }

    const statusColorMap: Record<
      string,
      { dot: string; bg: string; text: string; border: string }
    > = {
      Active: {
        dot: "#0d9488",
        bg: "#f0fdfa",
        text: "#0d9488",
        border: "#99f6e4",
      },
      Signed: {
        dot: "#6366f1",
        bg: "#eef2ff",
        text: "#6366f1",
        border: "#c7d2fe",
      },
      Expired: {
        dot: "#f59e0b",
        bg: "#fffbeb",
        text: "#d97706",
        border: "#fde68a",
      },
      Pending: {
        dot: "#f97316",
        bg: "#fff7ed",
        text: "#ea580c",
        border: "#fed7aa",
      },
      Partial: {
        dot: "#06b6d4",
        bg: "#ecfeff",
        text: "#0891b2",
        border: "#a5f3fc",
      },
      Paid: {
        dot: "#22c55e",
        bg: "#f0fdf4",
        text: "#16a34a",
        border: "#bbf7d0",
      },
      Sales: {
        dot: "#8b5cf6",
        bg: "#f5f3ff",
        text: "#7c3aed",
        border: "#ddd6fe",
      },
      Legal: {
        dot: "#ec4899",
        bg: "#fdf2f8",
        text: "#db2777",
        border: "#fbcfe8",
      },
      General: {
        dot: "#64748b",
        bg: "#f1f5f9",
        text: "#475569",
        border: "#cbd5e1",
      },
    };
    const getColor = (label: string) =>
      statusColorMap[label] || {
        dot: "#64748b",
        bg: "#f8fafc",
        text: "#475569",
        border: "#e2e8f0",
      };

    const fmtMain = (val: number) => {
      if (prefix === "$") {
        if (val >= 1_000_000)
          return `${prefix}${(val / 1_000_000).toFixed(1)}M`;
        if (val >= 1_000) return `${prefix}${(val / 1_000).toFixed(1)}K`;
        return `${prefix}${val.toLocaleString()}`;
      }
      return val.toLocaleString();
    };

    const fmtLabel = (k: string) =>
      k
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (s) => s.toUpperCase())
        .trim();

    const totalBreakdown = breakdown.reduce((s, b) => s + b.value, 0) || 1;

    return (
      <div
        style={{
          ...card,
          padding: 0,
          background: "#ffffff",
          position: "relative",
          overflow: "hidden",
          minHeight: "320px",
        }}
      >
        {/* Rainbow top stripe */}
        <div
          style={{
            height: "1px",
            background: "linear-gradient(90deg,#0d9488,#6366f1,#f59e0b)",
            flexShrink: 0,
          }}
        />

        {/* Decorative bg circle */}
        <div
          style={{
            position: "absolute",
            top: "-24px",
            right: "-24px",
            width: "96px",
            height: "96px",
            borderRadius: "50%",
            background: "radial-gradient(circle,#f0fdfa 0%,transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            padding: "16px 18px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: "14px",
            flex: 1,
            height: "100%",
          }}
        >
          {/* Title + Live badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#94a3b8",
              }}
            >
              {widgetName}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
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
              <span
                style={{ fontSize: "10px", color: "#0d9488", fontWeight: 600 }}
              >
                Live
              </span>
            </span>
          </div>

          {/* Main value */}
          <div
            onClick={() =>
              drillItems?.length &&
              setDrillModal({ segmentName: "All", items: drillItems })
            }
            style={{ cursor: drillItems?.length ? "pointer" : "default" }}
          >
            <span
              style={{
                fontSize: "40px",
                fontWeight: 900,
                color: "#0f172a",
                lineHeight: 1,
                letterSpacing: "-0.03em",
              }}
            >
              {fmtMain(mainValue)}
            </span>
            <p
              style={{
                fontSize: "11px",
                color: "#64748b",
                marginTop: "3px",
                fontWeight: 500,
              }}
            >
              {mainLabel}
            </p>
          </div>

          {/* Breakdown: progress bar + pills */}
          {breakdown.length > 0 && (
            <>
              {/* Mini stacked bar */}
              <div
                style={{
                  display: "flex",
                  height: "5px",
                  borderRadius: "3px",
                  overflow: "hidden",
                  gap: "2px",
                }}
              >
                {breakdown.map(({ label, value: bv }, i) => (
                  <div
                    key={i}
                    style={{
                      flex: bv / totalBreakdown,
                      background: getColor(label).dot,
                      minWidth: bv > 0 ? "3px" : "0",
                    }}
                  />
                ))}
              </div>
              {/* Pills */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                {breakdown.map(({ label, value: bv, isAmount }) => {
                  const c = getColor(label);
                  return (
                    <span
                      key={label}
                      onClick={() => {
                        if (!drillItems) return;
                        const filtered = drillItems.filter((item: any) =>
                          Object.values(item).some((v) => String(v) === label),
                        );
                        setDrillModal({
                          segmentName: label,
                          items: filtered.length ? filtered : drillItems,
                        });
                      }}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px",
                        padding: "3px 10px",
                        borderRadius: "20px",
                        fontSize: "11px",
                        fontWeight: 600,
                        background: c.bg,
                        color: c.text,
                        border: `1px solid ${c.border}`,
                        cursor: drillItems ? "pointer" : "default",
                      }}
                    >
                      <span
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          background: c.dot,
                          display: "inline-block",
                        }}
                      />
                      {label}
                      <span style={{ fontWeight: 800 }}>
                        {isAmount ? `$${Number(bv).toLocaleString()}` : bv}
                      </span>
                    </span>
                  );
                })}
              </div>
            </>
          )}

          {/* Extra numeric fields (e.g. totalpendingamount, pendingInvoicesCount) */}
          {extraFields.length > 0 && (
            <div
              style={{
                display: "flex",
                gap: "16px",
                flexWrap: "wrap",
                paddingTop: "8px",
                borderTop: "1px solid #f1f5f9",
              }}
            >
              {extraFields.map(({ label, raw }) => {
                const lbl = fmtLabel(label);
                const isAmt =
                  lbl.toLowerCase().includes("amount") ||
                  lbl.toLowerCase().includes("value") ||
                  lbl.toLowerCase().includes("revenue");
                const formatted2 = isAmt
                  ? `$${Number(raw).toLocaleString()}`
                  : Number(raw).toLocaleString();
                return (
                  <div
                    key={label}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "18px",
                        fontWeight: 800,
                        color: "#0f172a",
                      }}
                    >
                      {formatted2}
                    </span>
                    <span
                      style={{
                        fontSize: "10px",
                        color: "#94a3b8",
                        fontWeight: 500,
                      }}
                    >
                      {lbl}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Drill modal */}
        {drillModal && (
          <DrillDownModal
            title={widgetName}
            segmentName={drillModal.segmentName}
            items={drillModal.items}
            onClose={() => setDrillModal(null)}
          />
        )}
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
          minHeight: "320px",
          background: `linear-gradient(135deg, #ffffff 60%, ${gaugeBg} 100%)`,
          borderLeft: `4px solid ${gaugeColor}`,
        }}
      >
        <p style={{ ...cardTitle, textAlign: "center" }}>{widgetName}</p>
        <div style={{ position: "relative", width: "100px", height: "100px" }}>
          <svg width="100" height="100" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="9"
            />
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
    // Extract the correct breakdown sub-object for chart rendering
    let chartSourceData = data;
    if (data && typeof data === "object" && !Array.isArray(data)) {
      if (data.stageWiseBreakdown) chartSourceData = data.stageWiseBreakdown;
      else if (data.statusWiseBreakdown)
        chartSourceData = data.statusWiseBreakdown;
    }
    // Normalize segment names: empty string key becomes "Unknown"
    const formatted: { name: string; value: number }[] =
      chartSourceData &&
      typeof chartSourceData === "object" &&
      !Array.isArray(chartSourceData)
        ? Object.entries(chartSourceData).map(([k, v]) => ({
            name: k && k.trim() !== "" ? k : "Unknown",
            value: Number(v) || 0,
          }))
        : normalizeKeyValue(data);
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

    // Build drill-down lookup: segment name → drillBreakoff items
    const drillLookup: Record<string, any[]> = {};
    if (data && typeof data === "object" && !Array.isArray(data)) {
      // Check for stageWiseBreakdown (Donut) or statusWiseBreakdown (Pie)
      const breakdownKey = data.stageWiseBreakdown
        ? "stageWiseBreakdown"
        : data.statusWiseBreakdown
          ? "statusWiseBreakdown"
          : null;

      if (breakdownKey && data.drillBreakoff?.items) {
        const allItems: any[] = data.drillBreakoff.items;
        const breakdownField =
          breakdownKey === "stageWiseBreakdown" ? "stage" : "status";
        // Group items by their segment field
        allItems.forEach((item) => {
          const key = item[breakdownField] ?? "";
          const displayKey = key === "" ? "Unknown" : key;
          if (!drillLookup[displayKey]) drillLookup[displayKey] = [];
          drillLookup[displayKey].push(item);
        });
      }
    }

    // For bar chart with Active/Expired nested structure
    if (data && typeof data === "object" && !Array.isArray(data)) {
      Object.entries(data).forEach(([k, v]: any) => {
        if (v && typeof v === "object" && v.drillBreakoff?.items) {
          drillLookup[k] = v.drillBreakoff.items;
        }
      });
    }

    const handleSegmentClick = (segmentName: string) => {
      // Try exact match, then case-insensitive, then "Unknown" for empty
      let items = drillLookup[segmentName];
      if (!items) {
        const matchKey = Object.keys(drillLookup).find(
          (k) => k.toLowerCase() === segmentName.toLowerCase(),
        );
        if (matchKey) items = drillLookup[matchKey];
      }
      if (!items && segmentName === "Unknown") items = drillLookup[""] || [];
      if (items && items.length > 0) {
        setDrillModal({ segmentName, items });
      }
    };

    const isDonut = chartType === "Donut";

    // Pre-compute for ChartHeader
    const pieAllItems: any[] =
      data?.drillBreakoff?.items ?? Object.values(drillLookup).flat();

    const pieTotalCount: number | undefined =
      data?.totalContracts ?? data?.drillBreakoff?.totalItems ?? undefined;

    const handlePieTitleClick = () => {
      if (pieAllItems.length > 0) {
        setDrillModal({ segmentName: "All", items: pieAllItems });
      }
    };

    return (
      <>
        {drillModal && (
          <DrillDownModal
            title={widgetName}
            segmentName={drillModal.segmentName}
            items={drillModal.items}
            onClose={() => setDrillModal(null)}
          />
        )}
        <div style={{ ...card, padding: 0, minHeight: "300px" }}>
          <ChartHeader
            title={widgetName}
            viewMode={viewMode}
            onViewChange={setViewMode}
            onTitleClick={handlePieTitleClick}
            totalCount={pieTotalCount}
          />

          {viewMode === "list" ? (
            <ChartListView
              rows={formatted}
              drillLookup={drillLookup}
              onRowClick={handleSegmentClick}
            />
          ) : (
            <div style={{ padding: "20px" }}>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "200px",
                }}
              >
                <style>{`
                  .recharts-sector:focus { outline: none !important; }
                  .recharts-pie-sector:focus { outline: none !important; }
                  .recharts-wrapper:focus { outline: none !important; }
                  .recharts-wrapper svg:focus { outline: none !important; }
                  .recharts-surface:focus { outline: none !important; }
                `}</style>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart tabIndex={-1}>
                    <defs>
                      {GRADIENTS.map((grad, i) => (
                        <radialGradient
                          key={i}
                          id={`pieGrad${i}`}
                          cx="50%"
                          cy="50%"
                          r="50%"
                        >
                          <stop
                            offset="0%"
                            stopColor={grad[1]}
                            stopOpacity={0.95}
                          />
                          <stop
                            offset="100%"
                            stopColor={grad[0]}
                            stopOpacity={1}
                          />
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
                      onClick={(entry: any) => {
                        handleSegmentClick(entry.name);
                      }}
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
                          }}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} cursor={false} />
                    {isDonut && (
                      <text
                        x="50%"
                        y="50%"
                        textAnchor="middle"
                        dominantBaseline="central"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          if (pieAllItems.length > 0) {
                            setDrillModal({
                              segmentName: "All",
                              items: pieAllItems,
                            });
                          }
                        }}
                      >
                        <tspan
                          x="50%"
                          dy="-10"
                          fontSize="24"
                          fontWeight="800"
                          fill="#0d9488"
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

              {/* Legend pills */}
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
                    onClick={() => handleSegmentClick(item.name)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      background: `${COLORS[i % COLORS.length]}10`,
                      border: `1px solid ${COLORS[i % COLORS.length]}30`,
                      borderRadius: "20px",
                      padding: "4px 12px",
                      cursor: drillLookup[item.name] ? "pointer" : "default",
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
                      style={{
                        fontSize: "11px",
                        color: "#475569",
                        fontWeight: 500,
                      }}
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
          )}
        </div>
      </>
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
    let multiKeys: string[] = [];

    // ── StackedBar: always array of objects ──
    if (isStacked && Array.isArray(data) && data.length > 0) {
      const first = data[0];

      // Detect the best "name" field: prefer known label keys, else first string field
      const knownNameFields = [
        "escalationLevel",
        "businessArea",
        "counterpartyName",
        "name",
        "label",
        "category",
        "type",
        "stage",
        "status",
      ];
      const nameField =
        knownNameFields.find(
          (f) => f in first && typeof first[f] === "string",
        ) ||
        Object.keys(first).find((k) => typeof first[k] === "string") ||
        Object.keys(first)[0];

      // Detect numeric value fields (skip the name field itself)
      const numericFields = Object.keys(first).filter(
        (k) => k !== nameField && typeof first[k] === "number",
      );

      // Shape A — has sub-array (e.g. `issues`) → stack by a categorical field within it
      const subArrayField = Object.keys(first).find((k) =>
        Array.isArray(first[k]),
      );

      if (subArrayField) {
        // e.g. D005: issues[] → stack by severity/issueType
        formatted = data.map((d: any) => {
          const obj: any = {
            name: d[nameField] ?? "—",
            _originalEntry: d,
          };
          (d[subArrayField] as any[]).forEach((item: any) => {
            const key =
              item.severity ||
              item.issueType ||
              item.type ||
              item.category ||
              "Item";
            obj[key] = (obj[key] || 0) + 1;
          });
          return obj;
        });
      } else if (numericFields.length > 1) {
        // Shape B — multiple numeric fields.
        // Check if fields are on wildly different scales (e.g. totalValue=100k vs contractCount=1).
        // If max values differ by >10x, use only the largest-scale field for the bar;
        // store the rest as metadata (_originalEntry already has them for the modal).
        const fieldMaxes = numericFields.map((f) => ({
          field: f,
          max: Math.max(...data.map((d: any) => Number(d[f]) || 0)),
        }));
        fieldMaxes.sort((a, b) => b.max - a.max);
        const dominantField = fieldMaxes[0].field;
        const scaleRatio =
          fieldMaxes[0].max / (fieldMaxes[fieldMaxes.length - 1].max || 1);

        if (scaleRatio > 10) {
          // Use only dominant field — render as single-series bar (Shape C fallthrough)
          formatted = data.map((d: any) => ({
            name: d[nameField] ?? "—",
            [dominantField]: d[dominantField] ?? 0,
            _originalEntry: d,
          }));
        } else {
          // Comparable scales — stack them all
          formatted = data.map((d: any) => {
            const obj: any = { name: d[nameField] ?? "—", _originalEntry: d };
            numericFields.forEach((f) => {
              obj[f] = d[f] ?? 0;
            });
            return obj;
          });
        }
      } else {
        // Shape C — single numeric field → treat as simple bar with one series
        const valueField = numericFields[0] || "value";
        formatted = data.map((d: any) => ({
          name: d[nameField] ?? "—",
          [valueField]: d[valueField] ?? d.issueCount ?? 0,
          _originalEntry: d,
        }));
      }

      const keys = new Set<string>();
      formatted.forEach((d) =>
        Object.keys(d)
          .filter((k) => k !== "name" && k !== "_originalEntry")
          .forEach((k) => keys.add(k)),
      );
      multiKeys = Array.from(keys);
    }
    // ── HorizontalBar: might be a plain number, object or array ──
    else if (isHorizontal) {
      if (typeof data === "number") {
        formatted = [{ name: widgetName || "Value", value: data }];
      } else {
        formatted = normalizeKeyValue(data).filter(
          (d) => d.value > 0 || d.name !== "Unknown",
        );
      }
    }
    // ── Regular Bar ──
    else {
      if (data && typeof data === "object" && !Array.isArray(data)) {
        const skipKeys = new Set([
          "totalContracts",
          "totalValue",
          "totalItems",
          "drillBreakoff",
          "stageWiseBreakdown",
          "statusWiseBreakdown",
          "byBusinessArea",
        ]);

        // Collect only the non-skipped entries
        const entries = Object.entries(data).filter(
          ([k]) => !skipKeys.has(k) && k.trim() !== "",
        );

        if (entries.length > 0) {
          const firstVal = entries[0][1];

          // Shape A (D001): top-level keys ARE the segments, each mapping to { count, totalValue, drillBreakoff }
          // Detect: the object has a known numeric field like count/totalValue AND optionally drillBreakoff
          const looksLikeSegmentObj = (v: any): boolean => {
            if (!v || typeof v !== "object" || Array.isArray(v)) return false;
            const subKeys = Object.keys(v);
            return subKeys.some((sk) =>
              ["count", "totalValue", "totalItems"].includes(sk),
            );
          };

          if (looksLikeSegmentObj(firstVal)) {
            // D001-style: { Active: { count:4, totalValue:36345, drillBreakoff }, Expired: {...} }
            formatted = entries
              .map(([k, v]: any) => {
                const tv =
                  typeof v?.totalValue === "number" ? v.totalValue : null;
                const cnt = typeof v?.count === "number" ? v.count : null;
                return {
                  name: k,
                  value: tv !== null ? tv : cnt !== null ? cnt : 0,
                };
              })
              .filter((d) => d.value > 0 || entries.length <= 3);
          } else {
            // Shape B (D002): top-level key maps to a sub-object of name→number
            // e.g. { valueDistribution: { Sales:1009692, Legal:112000 } }
            // OR simple key→number at top level
            // Find the sub-object that is a flat name→number map
            let segmentObj: Record<string, number> | null = null;
            for (const [, v] of entries) {
              if (v && typeof v === "object" && !Array.isArray(v)) {
                const subVals = Object.values(v as object);
                if (
                  subVals.length > 0 &&
                  subVals.every((sv) => typeof sv === "number")
                ) {
                  segmentObj = v as Record<string, number>;
                  break;
                }
              }
            }
            if (segmentObj) {
              formatted = Object.entries(segmentObj)
                .filter(([k, v]) => k.trim() !== "" && v > 0)
                .map(([k, v]) => ({ name: k, value: Number(v) }));
            } else {
              // Fallback: simple top-level key→number
              formatted = entries
                .filter(([, v]) => typeof v === "number" && (v as number) > 0)
                .map(([k, v]) => ({ name: k, value: Number(v) }));
            }
          }
        }
      } else {
        formatted = normalizeKeyValue(data);
      }
    }

    if (formatted.length === 0) {
      return <EmptyCard title={widgetName} />;
    }

    // ── Build drill lookup ──
    // Shape A (D001): nested per-segment drillBreakoff → { Active: items[], Expired: items[] }
    // Shape B (D002): flat top-level drillBreakoff → group items by a field matching segment names
    const barDrillLookup: Record<string, any[]> = {};
    const segmentNames = new Set(
      formatted.map((d: any) => (d.name as string).toLowerCase()),
    );

    if (data && typeof data === "object" && !Array.isArray(data)) {
      // Shape A: nested
      Object.entries(data).forEach(([k, v]: any) => {
        if (v && typeof v === "object" && v.drillBreakoff?.items) {
          barDrillLookup[k] = v.drillBreakoff.items;
        }
      });

      // Shape B: flat top-level drillBreakoff — group items by whichever field matches segment names
      if (
        Object.keys(barDrillLookup).length === 0 &&
        data.drillBreakoff?.items
      ) {
        const items: any[] = data.drillBreakoff.items;
        // Detect which field on items matches the segment names (e.g. businessArea, status, stage)
        const candidateFields = [
          "businessArea",
          "status",
          "stage",
          "type",
          "category",
          "severity",
        ];
        const groupField =
          candidateFields.find((f) =>
            items.some((item) =>
              segmentNames.has((item[f] ?? "").toLowerCase()),
            ),
          ) || "businessArea";

        items.forEach((item) => {
          const key = item[groupField] ?? "";
          const displayKey = key.trim() !== "" ? key : "Unknown";
          if (!barDrillLookup[displayKey]) barDrillLookup[displayKey] = [];
          barDrillLookup[displayKey].push(item);
        });
      }
    }

    // List-view rows: segment name + its count from drillLookup (or chart value)
    const barListRows: { name: string; value: number }[] = formatted.map(
      (d: any) => {
        const name = d.name as string;
        const drillItems =
          barDrillLookup[name] ||
          barDrillLookup[
            Object.keys(barDrillLookup).find(
              (k) => k.toLowerCase() === name.toLowerCase(),
            ) ?? ""
          ];
        return {
          name,
          value: drillItems
            ? drillItems.length
            : typeof d.value === "number"
              ? d.value
              : (d.count ?? d.totalValue ?? 0),
        };
      },
    );

    const handleBarClick = (barData: any) => {
      if (!barData) return;
      const segName = barData.name || barData.activeLabel;
      if (!segName) return;
      // Exact match first, then case-insensitive
      let items = barDrillLookup[segName];
      if (!items) {
        const matchKey = Object.keys(barDrillLookup).find(
          (k) => k.toLowerCase() === String(segName).toLowerCase(),
        );
        if (matchKey) items = barDrillLookup[matchKey];
      }
      // Also try top-level flat drillBreakoff filtered by segment name
      if (!items && data?.drillBreakoff?.items) {
        const all: any[] = data.drillBreakoff.items;
        const filtered = all.filter((item: any) =>
          Object.values(item).some(
            (v) => String(v).toLowerCase() === String(segName).toLowerCase(),
          ),
        );
        if (filtered.length > 0) items = filtered;
      }
      if (items && items.length > 0) {
        setDrillModal({ segmentName: segName, items });
      }
    };

    // ── StackedBar drill lookup: key = "barName||segmentKey" → items[] ──
    // Also "barName" alone → all items for that bar row
    const stackedDrillLookup: Record<string, any[]> = {};
    if (isStacked && Array.isArray(data) && data.length > 0) {
      const first = data[0];
      const knownNameFields = [
        "escalationLevel",
        "businessArea",
        "counterpartyName",
        "name",
        "label",
        "category",
        "type",
        "stage",
        "status",
      ];
      const nameField =
        knownNameFields.find(
          (f) => f in first && typeof first[f] === "string",
        ) ||
        Object.keys(first).find((k) => typeof first[k] === "string") ||
        Object.keys(first)[0];
      const subArrayField = Object.keys(first).find((k) =>
        Array.isArray(first[k]),
      );

      data.forEach((d: any) => {
        const barName = d[nameField] ?? "—";
        if (subArrayField) {
          // e.g. issues[] → group by severity per bar
          const subItems: any[] = d[subArrayField] || [];
          stackedDrillLookup[barName] = subItems;
          subItems.forEach((item: any) => {
            const segKey =
              item.severity ||
              item.issueType ||
              item.type ||
              item.category ||
              "Item";
            const compoundKey = `${barName}||${segKey}`;
            if (!stackedDrillLookup[compoundKey])
              stackedDrillLookup[compoundKey] = [];
            stackedDrillLookup[compoundKey].push(item);
          });
        } else {
          // Flat shape (e.g. D006) — the row itself IS the drill record
          stackedDrillLookup[barName] = [d];
        }
      });
    }
    // Auto-switch to horizontal for StackedBar with many/long-named items
    const avgNameLength =
      formatted.reduce((s: number, d: any) => s + (d.name?.length || 0), 0) /
      (formatted.length || 1);
    const forceHorizontal =
      isStacked && (formatted.length > 5 || avgNameLength > 12);

    // Chart height
    const chartHeight =
      isHorizontal || forceHorizontal
        ? Math.max(200, formatted.length * 44 + 40)
        : 220;

    // Pre-compute for ChartHeader to avoid complex inline JSX expressions
    const barAllItems: any[] =
      Object.values(barDrillLookup).flat().length > 0
        ? Object.values(barDrillLookup).flat()
        : data?.drillBreakoff?.items || [];

    const barTotalCount: number | undefined =
      data?.totalContracts ??
      data?.drillBreakoff?.totalItems ??
      (barAllItems.length > 0 ? barAllItems.length : undefined);

    const handleBarTitleClick = () => {
      if (barAllItems.length > 0) {
        setDrillModal({ segmentName: "All", items: barAllItems });
      }
    };

    return (
      <>
        {drillModal && (
          <DrillDownModal
            title={widgetName}
            segmentName={drillModal.segmentName}
            items={drillModal.items}
            onClose={() => setDrillModal(null)}
          />
        )}
        <div
          style={{
            ...card,
            minHeight: isHorizontal || forceHorizontal ? "auto" : "300px",
            overflow: "hidden",
          }}
        >
          <ChartHeader
            title={widgetName}
            viewMode={viewMode}
            onViewChange={setViewMode}
            onTitleClick={handleBarTitleClick}
            totalCount={barTotalCount}
          />

          {viewMode === "list" ? (
            <ChartListView
              rows={barListRows}
              drillLookup={barDrillLookup}
              onRowClick={(name) => handleBarClick({ name })}
            />
          ) : (
            <div style={{ padding: "16px 20px 20px", flex: 1 }}>
              <div style={{ height: chartHeight }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={formatted}
                    layout={
                      isHorizontal || forceHorizontal
                        ? "vertical"
                        : "horizontal"
                    }
                    margin={
                      isHorizontal || forceHorizontal
                        ? { left: 140, right: 80, top: 8, bottom: 8 }
                        : { top: 28, right: 20, left: 0, bottom: 36 }
                    }
                    tabIndex={-1}
                    onClick={(chartData: any) => {
                      if (chartData && chartData.activePayload?.length) {
                        handleBarClick({
                          name: chartData.activeLabel,
                        });
                      }
                    }}
                    style={{
                      cursor:
                        Object.keys(barDrillLookup).length > 0 ||
                        data?.drillBreakoff?.items?.length > 0 ||
                        Object.keys(stackedDrillLookup).length > 0
                          ? "pointer"
                          : "default",
                    }}
                  >
                    <defs>
                      {GRADIENTS.map((grad, i) => (
                        <linearGradient
                          key={i}
                          id={`barG${i}`}
                          x1={isHorizontal || forceHorizontal ? "0" : "0"}
                          y1={isHorizontal || forceHorizontal ? "0" : "0"}
                          x2={isHorizontal || forceHorizontal ? "1" : "0"}
                          y2={isHorizontal || forceHorizontal ? "0" : "1"}
                        >
                          <stop
                            offset="0%"
                            stopColor={grad[1]}
                            stopOpacity={0.9}
                          />
                          <stop
                            offset="100%"
                            stopColor={grad[0]}
                            stopOpacity={1}
                          />
                        </linearGradient>
                      ))}
                    </defs>

                    <CartesianGrid
                      strokeDasharray="4 4"
                      stroke="#f1f5f9"
                      vertical={isHorizontal || forceHorizontal}
                      horizontal={!(isHorizontal || forceHorizontal)}
                    />

                    {isHorizontal || forceHorizontal ? (
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
                          tick={{
                            fontSize: 11,
                            fill: "#64748b",
                            fontWeight: 500,
                          }}
                          width={forceHorizontal ? 160 : 95}
                          axisLine={false}
                          tickLine={false}
                        />
                      </>
                    ) : (
                      <>
                        <XAxis
                          dataKey="name"
                          tick={{
                            fontSize: 11,
                            fill: "#64748b",
                            fontWeight: 500,
                          }}
                          angle={formatted.length > 4 ? -18 : 0}
                          textAnchor={formatted.length > 4 ? "end" : "middle"}
                          interval={0}
                          axisLine={false}
                          tickLine={false}
                          height={40}
                        />
                        <YAxis
                          tick={{ fontSize: 10, fill: "#94a3b8" }}
                          width={40}
                          axisLine={false}
                          tickLine={false}
                        />
                      </>
                    )}

                    <Tooltip
                      content={<CustomTooltip />}
                      cursor={
                        { fill: "rgba(13,148,136,0.05)", radius: 6 } as any
                      }
                    />

                    {/* STACKED bars */}
                    {isStacked && multiKeys.length > 0 ? (
                      <>
                        {multiKeys.map((key, i) => (
                          <Bar
                            key={key}
                            dataKey={key}
                            stackId="a"
                            fill={`url(#barG${i})`}
                            activeBar={{
                              fill: COLORS[i % COLORS.length],
                              opacity: 0.85,
                            }}
                            radius={
                              i === multiKeys.length - 1
                                ? forceHorizontal || isHorizontal
                                  ? [0, 6, 6, 0]
                                  : [6, 6, 0, 0]
                                : [0, 0, 0, 0]
                            }
                            style={{ cursor: "pointer" }}
                            onClick={(_barEntry: any, _index: number) => {
                              // recharts passes the chart event as 3rd arg;
                              // we need the activeLabel from the BarChart click event
                              // Instead, use barEntry which has `name` directly
                              if (_barEntry && _barEntry.name) {
                                const items =
                                  stackedDrillLookup[
                                    `${_barEntry.name}||${key}`
                                  ] || stackedDrillLookup[_barEntry.name];
                                if (items && items.length > 0) {
                                  setDrillModal({
                                    segmentName: `${_barEntry.name} — ${key}`,
                                    items,
                                  });
                                }
                              }
                            }}
                          >
                            {i === multiKeys.length - 1 && (
                              <LabelList
                                dataKey={key}
                                position={
                                  forceHorizontal || isHorizontal
                                    ? "right"
                                    : "top"
                                }
                                content={
                                  forceHorizontal || isHorizontal ? (
                                    <HBarRightLabel />
                                  ) : (
                                    <BarTopLabel />
                                  )
                                }
                              />
                            )}
                          </Bar>
                        ))}
                        {multiKeys.length > 1 && (
                          <Legend
                            iconType="circle"
                            wrapperStyle={{
                              fontSize: "11px",
                              color: "#64748b",
                              paddingTop: "8px",
                            }}
                          />
                        )}
                      </>
                    ) : !isStacked && multiKeys.length > 0 ? (
                      /* GROUPED multi-series bars */
                      <>
                        {multiKeys.map((key, i) => (
                          <Bar
                            key={key}
                            dataKey={key}
                            fill={`url(#barG${i})`}
                            activeBar={false}
                            radius={isHorizontal ? [0, 6, 6, 0] : [6, 6, 0, 0]}
                            maxBarSize={44}
                          >
                            <LabelList
                              dataKey={key}
                              position={isHorizontal ? "right" : "top"}
                              content={
                                isHorizontal ? (
                                  <HBarRightLabel />
                                ) : (
                                  <BarTopLabel />
                                )
                              }
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
                      /* SIMPLE single-series */
                      <Bar
                        dataKey="value"
                        radius={isHorizontal ? [0, 8, 8, 0] : [8, 8, 0, 0]}
                        maxBarSize={52}
                        activeBar={false}
                      >
                        {formatted.map((_: any, i: number) => (
                          <Cell
                            key={i}
                            fill={`url(#barG${i % GRADIENTS.length})`}
                            style={{
                              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.08))",
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

              {/* Summary pills (simple series only) */}
              {multiKeys.length === 0 && formatted.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "6px",
                    marginTop: "12px",
                  }}
                >
                  {formatted.map((item: any, i: number) => (
                    <div
                      key={i}
                      onClick={() => handleBarClick({ name: item.name })}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        background: `${COLORS[i % COLORS.length]}0d`,
                        border: `1px solid ${COLORS[i % COLORS.length]}30`,
                        borderRadius: "20px",
                        padding: "3px 10px",
                        cursor: barDrillLookup[item.name]
                          ? "pointer"
                          : "default",
                      }}
                    >
                      <div
                        style={{
                          width: "7px",
                          height: "7px",
                          borderRadius: "50%",
                          background: COLORS[i % COLORS.length],
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontSize: "11px",
                          color: "#475569",
                          fontWeight: 500,
                        }}
                      >
                        {item.name}
                      </span>
                      <span
                        style={{
                          fontSize: "11px",
                          color: COLORS[i % COLORS.length],
                          fontWeight: 800,
                        }}
                      >
                        {(item.value ?? 0).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </>
    );
  }

  /* =====================================================
     Line
  ===================================================== */
  if (chartType === "Line") {
    // Accept both array AND object (date → value map)
    let lineData: { name: string; value: number }[] = [];

    if (Array.isArray(data) && data.length > 0) {
      // Try to detect shape
      const first = data[0];
      if (typeof first === "object") {
        lineData = data.map((d: any) => ({
          name:
            d.name || d.label || d.monthName || d.date || d.month || String(d),
          value: Number(d.value ?? d.count ?? d.contractCount ?? d.amount ?? 0),
        }));
      }
    } else if (data && typeof data === "object" && !Array.isArray(data)) {
      // Object with date keys → values
      lineData = Object.entries(data).map(([k, v]) => ({
        name: k,
        value: Number(v) || 0,
      }));
    }

    if (lineData.length === 0) {
      return <EmptyCard title={widgetName} />;
    }

    return (
      <div style={{ ...card, minHeight: "280px", overflow: "hidden" }}>
        <SectionHeader title={widgetName} />

        <div style={{ padding: "16px 20px 20px", flex: 1 }}>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={lineData}
                margin={{ top: 10, right: 20, left: -10, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="lineAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0d9488" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#0d9488" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                  interval={
                    lineData.length > 6 ? Math.floor(lineData.length / 6) : 0
                  }
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  width={38}
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

          {/* Min / Max / Latest stat pills */}
          {lineData.length > 0 && (
            <div
              style={{
                display: "flex",
                gap: "8px",
                marginTop: "12px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              {[
                {
                  label: "Latest",
                  val: lineData[lineData.length - 1]?.value,
                  color: "#0d9488",
                  bg: "#f0fdfa",
                },
                {
                  label: "High",
                  val: Math.max(...lineData.map((d) => d.value)),
                  color: "#6366f1",
                  bg: "#eef2ff",
                },
                {
                  label: "Low",
                  val: Math.min(...lineData.map((d) => d.value)),
                  color: "#f59e0b",
                  bg: "#fffbeb",
                },
              ].map(({ label, val, color, bg }) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    background: bg,
                    border: `1px solid ${color}22`,
                    borderRadius: "10px",
                    padding: "6px 14px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "10px",
                      color: "#94a3b8",
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    {label}
                  </span>
                  <span style={{ fontSize: "15px", fontWeight: 800, color }}>
                    {typeof val === "number"
                      ? val.toLocaleString(undefined, {
                          maximumFractionDigits: 1,
                        })
                      : "—"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  /* =====================================================
     Timeline
  ===================================================== */
  if (chartType === "Timeline" && Array.isArray(data)) {
    if (data.length === 0) {
      return <EmptyCard title={widgetName} message="No timeline data" />;
    }

    // Deduplicate by rowKey — keep first occurrence
    const seen = new Set<string>();
    const uniqueData = data.filter((item: any) => {
      const key = item.rowKey || JSON.stringify(item);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

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
      <div style={{ ...card, overflow: "hidden" }}>
        <SectionHeader title={widgetName} />
        <div style={{ padding: "16px 20px 20px", overflowY: "auto" }}>
          <div style={{ position: "relative", paddingLeft: "22px" }}>
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
              {uniqueData.map((item: any, idx: number) => {
                const p = item.priority || "Low";
                const s = priorityStyle[p] || priorityStyle.Low;
                return (
                  <div
                    key={item.rowKey || idx}
                    style={{ position: "relative" }}
                  >
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
                      {item.contractTitle && (
                        <p
                          style={{
                            fontSize: "11px",
                            color: "#64748b",
                            marginTop: "2px",
                            fontWeight: 500,
                          }}
                        >
                          {item.contractTitle}
                        </p>
                      )}
                      <p
                        style={{
                          fontSize: "11px",
                          color: "#94a3b8",
                          marginTop: "2px",
                        }}
                      >
                        {item.milestoneDate
                          ? new Date(item.milestoneDate).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )
                          : "—"}
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
      </div>
    );
  }

  /* =====================================================
     Heatmap
  ===================================================== */
  if (chartType === "Heatmap" && Array.isArray(data)) {
    if (data.length === 0)
      return <EmptyCard title={widgetName} message="No heatmap data" />;

    // Build: months (columns) × businessAreas (rows) → contractCount
    const monthSet = new Set<string>();
    const areaSet = new Set<string>();
    data.forEach((d: any) => {
      if (d.monthName) monthSet.add(d.monthName);
      areaSet.add(
        d.businessArea && d.businessArea.trim() !== ""
          ? d.businessArea
          : "Unknown",
      );
    });

    const months = Array.from(monthSet);
    const areas = Array.from(areaSet);

    // Build lookup: "monthName|area" → count
    const lookup: Record<string, number> = {};
    let maxCount = 0;
    data.forEach((d: any) => {
      const month = d.monthName || "";
      const area =
        d.businessArea && d.businessArea.trim() !== ""
          ? d.businessArea
          : "Unknown";
      const key = `${month}|${area}`;
      lookup[key] = (lookup[key] || 0) + (d.contractCount || 0);
      if (lookup[key] > maxCount) maxCount = lookup[key];
    });

    // Color intensity: 0 = white, max = teal
    const cellColor = (count: number) => {
      if (count === 0) return { bg: "#f8fafc", text: "#cbd5e1" };
      const intensity = count / (maxCount || 1);
      if (intensity > 0.75) return { bg: "#0d9488", text: "#ffffff" };
      if (intensity > 0.5) return { bg: "#14b8a6", text: "#ffffff" };
      if (intensity > 0.25) return { bg: "#5eead4", text: "#0f172a" };
      return { bg: "#ccfbf1", text: "#0f172a" };
    };

    const colW = `${Math.max(80, Math.floor(560 / (months.length || 1)))}px`;

    return (
      <div style={{ ...card, overflow: "hidden", minHeight: "320px" }}>
        <SectionHeader title={widgetName} />
        <div style={{ padding: "16px 20px 20px", overflowX: "auto" }}>
          <table
            style={{
              borderCollapse: "separate",
              borderSpacing: "3px",
              fontFamily: "'Inter',sans-serif",
              fontSize: "11px",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    width: "80px",
                    minWidth: "80px",
                    textAlign: "left",
                    padding: "4px 8px",
                    color: "#94a3b8",
                    fontWeight: 700,
                    fontSize: "10px",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  Area / Month
                </th>
                {months.map((m) => (
                  <th
                    key={m}
                    style={{
                      width: colW,
                      minWidth: "64px",
                      textAlign: "center",
                      padding: "4px 6px",
                      color: "#64748b",
                      fontWeight: 700,
                      fontSize: "10px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {m}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {areas.map((area) => (
                <tr key={area}>
                  <td
                    style={{
                      padding: "4px 8px",
                      fontWeight: 600,
                      color: "#475569",
                      fontSize: "11px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {area}
                  </td>
                  {months.map((month) => {
                    const count = lookup[`${month}|${area}`] || 0;
                    const { bg, text } = cellColor(count);
                    return (
                      <td
                        key={month}
                        style={{
                          width: colW,
                          minWidth: "64px",
                          height: "36px",
                          textAlign: "center",
                          borderRadius: "6px",
                          background: bg,
                          color: text,
                          fontWeight: count > 0 ? 700 : 400,
                          fontSize: "12px",
                          cursor: count > 0 ? "default" : "default",
                          transition: "background 0.15s",
                        }}
                      >
                        {count > 0 ? count : ""}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Legend */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              marginTop: "12px",
            }}
          >
            <span
              style={{ fontSize: "10px", color: "#94a3b8", fontWeight: 500 }}
            >
              Less
            </span>
            {["#ccfbf1", "#5eead4", "#14b8a6", "#0d9488"].map((c) => (
              <div
                key={c}
                style={{
                  width: "20px",
                  height: "12px",
                  borderRadius: "3px",
                  background: c,
                }}
              />
            ))}
            <span
              style={{ fontSize: "10px", color: "#94a3b8", fontWeight: 500 }}
            >
              More
            </span>
          </div>
        </div>
      </div>
    );
  }

  /* =====================================================
     Table — handles BOTH:
       • array of flat objects  (D005, D006)
       • object with nested { count, totalValue } (old shape)
  ===================================================== */
  if (chartType === "Table") {
    // ── Array of flat objects ──
    if (Array.isArray(data) && data.length > 0) {
      // Pick display-worthy keys (skip internal/meta keys)
      const skipKeys = new Set([
        "partitionKey",
        "rowKey",
        "timestamp",
        "eTag",
        "contractId",
        "contractID",
        "modifiedBy",
        "createdBy",
        "created",
        "modified",
      ]);

      const allKeys = Object.keys(data[0]).filter((k) => !skipKeys.has(k));
      // Show at most 5 columns
      const displayKeys = allKeys.slice(0, 5);

      const formatCell = (key: string, val: any): string => {
        if (val === null || val === undefined || val === "") return "—";
        if (typeof val === "boolean") return val ? "Yes" : "No";
        // Date-ish strings
        if (typeof val === "string" && val.match(/^\d{4}-\d{2}-\d{2}T/)) {
          return new Date(val).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });
        }
        if (typeof val === "number") {
          // Likely a value/currency column if key includes 'value' or 'amount'
          if (/value|amount|total/i.test(key)) {
            return `₹ ${val.toLocaleString()}`;
          }
          return val.toLocaleString();
        }
        return String(val);
      };

      const labelify = (key: string) =>
        key
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (s) => s.toUpperCase())
          .trim();

      return (
        <div style={{ ...card, overflow: "hidden" }}>
          <SectionHeader title={widgetName} />
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "12px",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "linear-gradient(90deg,#f0fdfa,#f8fafc)",
                  }}
                >
                  {displayKeys.map((k) => (
                    <th
                      key={k}
                      style={{
                        padding: "10px 16px",
                        textAlign: "left",
                        fontSize: "10px",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "#0d9488",
                        borderBottom: "2px solid #e2e8f0",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {labelify(k)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row: any, idx: number) => (
                  <tr
                    key={idx}
                    style={{
                      background: idx % 2 === 0 ? "#ffffff" : "#f8fafc",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      (
                        e.currentTarget as HTMLTableRowElement
                      ).style.background = "#f0fdfa";
                    }}
                    onMouseLeave={(e) => {
                      (
                        e.currentTarget as HTMLTableRowElement
                      ).style.background =
                        idx % 2 === 0 ? "#ffffff" : "#f8fafc";
                    }}
                  >
                    {displayKeys.map((k, ci) => (
                      <td
                        key={k}
                        style={{
                          padding: "10px 16px",
                          borderBottom: "1px solid #f1f5f9",
                          color: ci === 0 ? "#0f172a" : "#475569",
                          fontWeight: ci === 0 ? 600 : 400,
                          maxWidth: "200px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {/* Status badge */}
                        {k === "status" ? (
                          <span
                            style={{
                              padding: "2px 10px",
                              borderRadius: "20px",
                              fontSize: "10px",
                              fontWeight: 700,
                              background:
                                row[k] === "Active"
                                  ? "#f0fdfa"
                                  : row[k] === "Pending"
                                    ? "#fff7ed"
                                    : "#f1f5f9",
                              color:
                                row[k] === "Active"
                                  ? "#0d9488"
                                  : row[k] === "Pending"
                                    ? "#ea580c"
                                    : "#64748b",
                            }}
                          >
                            {row[k] || "—"}
                          </span>
                        ) : (
                          formatCell(k, row[k])
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Row count footer */}
          <div
            style={{
              padding: "8px 16px",
              background: "#f8fafc",
              borderTop: "1px solid #f1f5f9",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "18px",
                height: "18px",
                borderRadius: "50%",
                background: "#0d948820",
                color: "#0d9488",
                fontSize: "10px",
                fontWeight: 700,
              }}
            >
              {data.length}
            </span>
            <span
              style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 500 }}
            >
              {data.length === 1 ? "record" : "records"}
            </span>
          </div>
        </div>
      );
    }

    // ── Legacy object shape: { label: { count, totalValue } } ──
    if (data && typeof data === "object" && !Array.isArray(data)) {
      const rows = Object.entries(data).map(([k, v]: any) => ({
        label: k,
        count: v?.count ?? 0,
        value: v?.totalValue ?? 0,
      }));

      return (
        <div style={{ ...card, overflow: "hidden" }}>
          <SectionHeader title={widgetName} />
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "12px",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "linear-gradient(90deg,#f0fdfa,#f8fafc)",
                  }}
                >
                  {["Category", "Contracts", "Total Value"].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "10px 16px",
                        textAlign: "left",
                        fontSize: "10px",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "#0d9488",
                        borderBottom: "2px solid #e2e8f0",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r, idx) => (
                  <tr
                    key={r.label}
                    style={{
                      background: idx % 2 === 0 ? "#ffffff" : "#f8fafc",
                    }}
                  >
                    <td
                      style={{
                        padding: "10px 16px",
                        borderBottom: "1px solid #f1f5f9",
                        fontWeight: 600,
                        color: "#0f172a",
                      }}
                    >
                      {r.label}
                    </td>
                    <td
                      style={{
                        padding: "10px 16px",
                        borderBottom: "1px solid #f1f5f9",
                        color: "#475569",
                      }}
                    >
                      {r.count}
                    </td>
                    <td
                      style={{
                        padding: "10px 16px",
                        borderBottom: "1px solid #f1f5f9",
                        color: "#0d9488",
                        fontWeight: 700,
                      }}
                    >
                      ₹ {r.value.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    return <EmptyCard title={widgetName} />;
  }

  return null;
};

export default WidgetRenderer;
