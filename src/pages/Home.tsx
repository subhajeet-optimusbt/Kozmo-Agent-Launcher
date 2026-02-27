/* eslint-disable @typescript-eslint/no-explicit-any */
// Home.tsx — Enhanced Dynamic Dashboard

import React from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts";
import { Skeleton, Tooltip } from "antd";
import {
  FileTextOutlined,
  ThunderboltOutlined,
  AlertOutlined,
  ExclamationCircleOutlined,
  CalendarOutlined,
  WarningOutlined,
  RiseOutlined,
  FallOutlined,
  SafetyCertificateOutlined,
  // ClockCircleOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";
import { useDashboardData } from "../services/landingpage";
import FullscreenLoader from "../components/ui/FullScreenLoader";

/* ─────────────────────────────────────────────
   FORMATTERS
───────────────────────────────────────────── */
const formatCurrency = (value: number | undefined): string => {
  if (!value && value !== 0) return "$0";
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value.toLocaleString()}`;
};

const formatDate = (dateStr: string): string => {
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "—";
  }
};

const getDaysRemaining = (endDate: string): number => {
  const end = new Date(endDate);
  return Math.ceil((end.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
};

/* ─────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────── */
const STATUS_COLORS: Record<string, string> = {
  Active: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Signed: "bg-sky-100 text-sky-700 border-sky-200",
  Expired: "bg-rose-100 text-rose-700 border-rose-200",
  "In Review": "bg-amber-100 text-amber-700 border-amber-200",
  "Pending Signature": "bg-purple-100 text-purple-700 border-purple-200",
};

const CHI_COLOR = (v: number) =>
  v >= 75 ? "#10b981" : v >= 60 ? "#f59e0b" : "#ef4444";
const CHI_LABEL = (v: number) => (v >= 75 ? "Good" : v >= 60 ? "Fair" : "Poor");
const CHI_BG = (v: number) =>
  v >= 75
    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
    : v >= 60
      ? "bg-amber-50 text-amber-700 border border-amber-200"
      : "bg-rose-50 text-rose-700 border border-rose-200";

/* ─────────────────────────────────────────────
   SECTION DIVIDER
───────────────────────────────────────────── */
const SectionLabel: React.FC<{
  children: React.ReactNode;
  action?: React.ReactNode;
}> = ({ children, action }) => (
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-3">
      <div className="h-4 w-1 rounded-full bg-gradient-to-b from-emerald-500 to-blue-500" />
      <span className="text-[11px] font-black uppercase tracking-[0.12em] text-slate-500">
        {children}
      </span>
    </div>
    {action && <div>{action}</div>}
  </div>
);

/* ─────────────────────────────────────────────
   CARD
───────────────────────────────────────────── */
interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  badge?: string;
  extra?: React.ReactNode;
  hasError?: boolean;
  noPad?: boolean;
  accent?: string;
}
const Card: React.FC<CardProps> = ({
  children,
  className = "",
  title,
  badge,
  extra,
  hasError,
  noPad,
  accent,
}) => (
  <div
    className={`bg-white rounded-2xl border ${hasError ? "border-amber-200" : "border-gray-100"} shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden ${accent ? `border-l-2 border-l-${accent}-400` : ""} ${className}`}
  >
    {(title || extra) && (
      <div
        className={`px-5 py-3.5 border-b ${hasError ? "border-amber-100 bg-amber-50/40" : "border-gray-50 bg-gray-50/80"} flex justify-between items-center`}
      >
        <div className="flex items-center gap-2">
          {title && (
            <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-[0.1em]">
              {title}
            </h3>
          )}
          {badge && (
            <span className="text-[9px] font-bold bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full uppercase tracking-wide">
              {badge}
            </span>
          )}
          {hasError && (
            <span className="text-[9px] font-bold bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full flex items-center gap-1">
              <WarningOutlined /> Partial data
            </span>
          )}
        </div>
        {extra && <div>{extra}</div>}
      </div>
    )}
    <div className={noPad ? "" : "p-5"}>{children}</div>
  </div>
);

/* ─────────────────────────────────────────────
   PANEL ERROR
───────────────────────────────────────────── */
const PanelError: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex items-start gap-2.5 p-3.5 bg-amber-50 rounded-xl border border-amber-200">
    <WarningOutlined className="text-amber-500 mt-0.5 flex-shrink-0 text-sm" />
    <p className="text-[11px] text-amber-700 font-semibold">{message}</p>
  </div>
);

/* ─────────────────────────────────────────────
   GAUGE CHART
───────────────────────────────────────────── */
const GaugeChart: React.FC<{ value: number; size?: number }> = ({
  value,
  size = 96,
}) => {
  const r = 36,
    cx = size / 2,
    cy = size / 2 + 10;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const arc = (s: number, e: number, color: string, w = 8) => {
    const x1 = cx + r * Math.cos(toRad(s)),
      y1 = cy + r * Math.sin(toRad(s));
    const x2 = cx + r * Math.cos(toRad(e)),
      y2 = cy + r * Math.sin(toRad(e));
    return (
      <path
        d={`M ${x1} ${y1} A ${r} ${r} 0 ${Math.abs(e - s) > 180 ? 1 : 0} 1 ${x2} ${y2}`}
        fill="none"
        stroke={color}
        strokeWidth={w}
        strokeLinecap="round"
      />
    );
  };
  const clamp = Math.min(Math.max(value, 0), 100);
  const angle = -180 + (clamp / 100) * 180;
  const color = CHI_COLOR(value);
  const nx = cx + (r - 7) * Math.cos(toRad(angle));
  const ny = cy + (r - 7) * Math.sin(toRad(angle));
  return (
    <svg width={size} height={size * 0.6} viewBox={`0 0 ${size} ${size * 0.6}`}>
      {arc(-180, 0, "#e2e8f0", 8)}
      {arc(-180, angle, color, 8)}
      <circle cx={nx} cy={ny} r="4.5" fill={color} />
      <circle cx={nx} cy={ny} r="2" fill="white" />
    </svg>
  );
};

/* ─────────────────────────────────────────────
   ★ ENHANCED KPI ACCENT MAP  (muted, SaaS palette)
───────────────────────────────────────────── */
const kpiAccentMap: Record<
  string,
  { topBar: string; iconBg: string; iconText: string }
> = {
  emerald: {
    topBar: "from-emerald-400 to-teal-500",
    iconBg: "bg-emerald-50",
    iconText: "text-emerald-600",
  },
  amber: {
    topBar: "from-amber-400 to-orange-400",
    iconBg: "bg-amber-50",
    iconText: "text-amber-600",
  },
  rose: {
    topBar: "from-rose-400 to-pink-500",
    iconBg: "bg-rose-50",
    iconText: "text-rose-500",
  },
  sky: {
    topBar: "from-sky-400 to-blue-500",
    iconBg: "bg-sky-50",
    iconText: "text-sky-600",
  },
  slate: {
    topBar: "from-slate-400 to-slate-500",
    iconBg: "bg-slate-50",
    iconText: "text-slate-500",
  },
};

/* ─────────────────────────────────────────────
   ★ ENHANCED KPI CARD  — full-height, premium
───────────────────────────────────────────── */
interface KpiCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  accentColor: string;
  sub?: React.ReactNode;
  trend?: number;
  footnote?: string;
}
const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  icon,
  accentColor,
  sub,
  trend,
  footnote,
}) => {
  const c = kpiAccentMap[accentColor] || kpiAccentMap.slate;
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-px transition-all duration-300 relative overflow-hidden flex flex-col h-full group cursor-default">
      {/* 2 px accent top bar */}
      <div
        className={`absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r ${c.topBar} opacity-85`}
      />

      <div className="flex flex-col flex-1 p-5 pt-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400 mb-3">
              {label}
            </p>
            <p className="text-[32px] font-bold text-slate-900 leading-none tracking-tight">
              {value}
            </p>
          </div>
          <div
            className={`w-9 h-9 rounded-xl ${c.iconBg} ${c.iconText} flex items-center justify-center text-[15px] flex-shrink-0 group-hover:scale-105 transition-transform duration-200 mt-0.5`}
          >
            {icon}
          </div>
        </div>

        {/* Trend */}
        {trend !== undefined && (
          <div
            className={`flex items-center gap-1 mt-3 text-[10px] font-semibold ${trend >= 0 ? "text-emerald-600" : "text-rose-500"}`}
          >
            {trend >= 0 ? (
              <RiseOutlined className="text-[9px]" />
            ) : (
              <FallOutlined className="text-[9px]" />
            )}
            <span>{Math.abs(trend)}% vs last month</span>
          </div>
        )}

        {/* Sub content */}
        {sub && <div className="mt-3 flex-1">{sub}</div>}

        {/* Footnote pinned at bottom */}
        {footnote && (
          <p className="text-[10px] text-slate-400 mt-auto pt-3 border-t border-slate-50">
            {footnote}
          </p>
        )}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   ★ ENHANCED GAUGE KPI CARD — full-height
───────────────────────────────────────────── */
interface GaugeKpiProps {
  label: string;
  value: number;
  topBar: string;
}
const GaugeKpi: React.FC<GaugeKpiProps> = ({ label, value, topBar }) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-px transition-all duration-300 relative overflow-hidden flex flex-col h-full cursor-default group">
    <div
      className={`absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r ${topBar} opacity-85`}
    />

    <div className="flex flex-col flex-1 p-5 pt-6">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400 mb-3">
        {label}
      </p>

      {/* Value */}
      <p className="text-[32px] font-bold text-slate-900 leading-none tracking-tight mb-3">
        {value.toFixed(value % 1 === 0 ? 0 : 1)}
      </p>

      {/* Gauge centered */}
      <div className="flex justify-center my-1">
        <GaugeChart value={value} size={80} />
      </div>

      {/* Badge + avg pinned to bottom */}
      <div className="mt-auto space-y-1.5 pt-2">
        <span
          className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full ${CHI_BG(value)}`}
        >
          <CheckCircleFilled className="text-[8px]" /> {CHI_LABEL(value)}
        </span>
        <p className="text-[10px] text-slate-400">
          avg = {value.toFixed(1)} / 100
        </p>
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   ★ DOT BADGE  (for Total Contracts sub)
───────────────────────────────────────────── */
const DotBadge: React.FC<{
  label: string;
  count: number;
  dotClass: string;
}> = ({ label, count, dotClass }) => (
  <div className="flex items-center gap-2 text-[10px] font-medium text-slate-500 py-0.5">
    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotClass}`} />
    <span>{label}:</span>
    <span className="font-bold text-slate-700">{count}</span>
  </div>
);

/* ─────────────────────────────────────────────
   STATUS BADGE
───────────────────────────────────────────── */
const StatusBadge: React.FC<{ status: string }> = ({ status }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${STATUS_COLORS[status] || "bg-gray-100 text-gray-600 border-gray-200"}`}
  >
    {status}
  </span>
);

/* ─────────────────────────────────────────────
   PROGRESS ROW
───────────────────────────────────────────── */
const ProgressRow: React.FC<{
  label: string;
  value: string;
  pct: number;
  color?: string;
}> = ({ label, value, pct, color = "emerald" }) => (
  <div>
    <div className="flex justify-between items-center mb-1.5">
      <span className="text-[11px] font-semibold text-gray-500">{label}</span>
      <span className="text-[11px] font-black text-gray-800">{value}</span>
    </div>
    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
      <div
        className={`h-full bg-gradient-to-r from-${color}-500 to-${color}-400 rounded-full`}
        style={{
          width: `${Math.min(Math.max(pct, 0), 100)}%`,
          transition: "width 0.8s ease",
        }}
      />
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   AGENT PANEL
───────────────────────────────────────────── */
const agentAccent: Record<
  string,
  { pill: string; btn: string; dot: string; bar: string; headerBg: string }
> = {
  violet: {
    pill: "bg-violet-100 text-violet-700",
    btn: "bg-white text-violet-700 hover:bg-violet-50 border-violet-200",
    dot: "bg-violet-400",
    bar: "bg-gradient-to-r from-violet-500 to-purple-500",
    headerBg: "bg-gradient-to-br from-violet-50 to-purple-50/30",
  },
  blue: {
    pill: "bg-blue-100 text-blue-700",
    btn: "bg-white text-blue-700 hover:bg-blue-50 border-blue-200",
    dot: "bg-blue-400",
    bar: "bg-gradient-to-r from-blue-500 to-sky-500",
    headerBg: "bg-gradient-to-br from-blue-50 to-sky-50/30",
  },
  teal: {
    pill: "bg-teal-100 text-teal-700",
    btn: "bg-white text-teal-700 hover:bg-teal-50 border-teal-200",
    dot: "bg-teal-400",
    bar: "bg-gradient-to-r from-teal-500 to-emerald-500",
    headerBg: "bg-gradient-to-br from-teal-50 to-emerald-50/30",
  },
  orange: {
    pill: "bg-orange-100 text-orange-700",
    btn: "bg-white text-orange-700 hover:bg-orange-50 border-orange-200",
    dot: "bg-orange-400",
    bar: "bg-gradient-to-r from-orange-500 to-amber-500",
    headerBg: "bg-gradient-to-br from-orange-50 to-amber-50/30",
  },
};

interface AgentPanelProps {
  title: string;
  subtitle: string;
  linkLabel: string;
  bullets: { text: string; icon?: React.ReactNode }[];
  actions: { label: string }[];
  accentColor: string;
  hasError?: boolean;
  errorMsg?: string;
  completionRate?: number;
}
const AgentPanel: React.FC<AgentPanelProps> = ({
  title,
  subtitle,
  linkLabel,
  bullets,
  actions,
  accentColor,
  hasError,
  errorMsg,
  completionRate,
}) => {
  const c = agentAccent[accentColor] || agentAccent.blue;
  return (
    <div
      className={`bg-white rounded-2xl border ${hasError ? "border-amber-200" : "border-gray-100"} shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden`}
    >
      <div className={`px-5 py-4 border-b border-gray-50 ${c.headerBg}`}>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-[13px] font-black text-gray-800">{title}</h3>
              <span
                className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${c.pill}`}
              >
                {linkLabel}
              </span>
              {hasError && (
                <span className="text-[9px] font-bold bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <WarningOutlined /> Unavailable
                </span>
              )}
            </div>
            <p className="text-[10px] text-gray-400 mt-0.5 font-medium">
              {subtitle}
            </p>
          </div>
        </div>
        {completionRate !== undefined && !hasError && (
          <div className="mt-3">
            <div className="flex justify-between mb-1">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">
                Completion
              </span>
              <span className="text-[9px] font-black text-gray-600">
                {completionRate.toFixed(0)}%
              </span>
            </div>
            <div className="h-1 bg-white/60 rounded-full overflow-hidden">
              <div
                className={`h-full ${c.bar} rounded-full`}
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
        )}
      </div>
      <div className="px-5 py-4">
        {hasError ? (
          <PanelError message={errorMsg || "Could not load agent data"} />
        ) : (
          <>
            <ul className="space-y-2.5 mb-4">
              {bullets.map((b, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2.5 text-[11px] text-gray-600"
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${c.dot} flex-shrink-0`}
                  />
                  {b.text}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-1.5">
              {actions.map((a) => (
                <button
                  key={a.label}
                  className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-all hover:shadow-sm ${c.btn}`}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   EXPIRING CONTRACT ITEM
───────────────────────────────────────────── */
const ExpiringItem: React.FC<{ contract: any }> = ({ contract }) => {
  const days = getDaysRemaining(contract.endDate);
  const isUrgent = days <= 3,
    isSoon = days <= 14;
  return (
    <div
      className={`p-3.5 rounded-xl border transition-all hover:shadow-md cursor-default group ${isUrgent ? "border-rose-200 bg-rose-50/30 hover:border-rose-300" : isSoon ? "border-amber-200 bg-amber-50/20 hover:border-amber-300" : "border-gray-100 hover:border-gray-200"}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-black text-gray-800 truncate group-hover:text-gray-900">
            {contract.title}
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5 truncate">
            {contract.counterparty?.split(",")[0]}
          </p>
          <div className="flex items-center gap-1 mt-1.5">
            <CalendarOutlined className="text-gray-300 text-[9px]" />
            <span className="text-[10px] text-gray-400">
              {formatDate(contract.endDate)}
            </span>
          </div>
        </div>
        <span
          className={`px-2.5 py-1 text-[9px] font-black rounded-lg border whitespace-nowrap flex-shrink-0 ${isUrgent ? "bg-rose-100 text-rose-700 border-rose-200" : isSoon ? "bg-amber-100 text-amber-700 border-amber-200" : "bg-emerald-100 text-emerald-700 border-emerald-200"}`}
        >
          {days <= 0 ? "⚡ Today" : `${days}d left`}
        </span>
      </div>
      <div className="mt-2">
        <StatusBadge status={contract.status} />
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   CUSTOM RECHARTS TOOLTIP
───────────────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-xl p-3 text-[11px]">
      <p className="font-black text-gray-500 mb-1">{label}</p>
      <p className="font-black text-emerald-600 text-base">
        {Number(payload[0].value).toFixed(1)}
      </p>
      <p className="text-gray-400">CHI Score</p>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   HOME — MAIN COMPONENT
═══════════════════════════════════════════════ */
export default function Home() {
  const {
    widgets,
    intakeMetrics,
    documentMetrics,
    contractMetrics,
    renewalMetrics,
    apiStatus,
    loading,
    error,
  } = useDashboardData();

  const getWidgetData = (id: string) =>
    widgets.find((w: any) => w.widgetId === id)?.data;

  const totalContractsData = getWidgetData("WG001");
  const chiScore: number = getWidgetData("WG006") ?? 0;
  const revenueAtRisk = getWidgetData("WG011");
  const paymentRel: number = getWidgetData("WG012") ?? 0;
  const expiringContracts: any[] = getWidgetData("WG009") ?? [];
  const openIssues: number = getWidgetData("WG016") ?? 0;
  const outstandingInv = getWidgetData("WG013");
  const invoiceDistrib = getWidgetData("WG014");
  const topContracts: any[] = getWidgetData("WG033") ?? [];
  const healthTrendRaw = getWidgetData("WG034");

  const healthTrendData = healthTrendRaw
    ? Object.entries(healthTrendRaw).map(([month, val]) => ({
        name: month.replace(/(\d{4})-(\d{2})/, (_, y, m) => {
          const months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ];
          return `${months[parseInt(m) - 1]} '${y.slice(2)}`;
        }),
        value: val as number,
      }))
    : [];

  const invoiceChartData = invoiceDistrib
    ? Object.entries(invoiceDistrib).map(([name, value]) => ({
        name,
        value: value as number,
        color:
          name === "Pending"
            ? "#f59e0b"
            : name === "Paid"
              ? "#10b981"
              : "#8b5cf6",
      }))
    : [];

  const totalInvoices = invoiceChartData.reduce((s, i) => s + i.value, 0);
  const rm = renewalMetrics?.currentMetrics;
  const cm = contractMetrics?.currentMetrics;
  const im = intakeMetrics?.currentMetrics;
  const dm = documentMetrics?.currentMetrics;

  const failedApis = Object.values(apiStatus || {}).filter(
    (s) => s === "error",
  ).length;
  const widgetsFailed = apiStatus?.widgets === "error";

  return (
    <>
      {loading && <FullscreenLoader />}
      <div className="relative overflow-hidden bg-white rounded-2xl border border-gray-200 shadow-sm">
        {/* Top gradient accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500" />

        <div className="mx-8 my-4 flex items-center">
          <div className="flex-1 min-w-0 pb-8 pt-2 space-y-8">
            {/* ── Page Title ── */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                  Dashboard
                </h1>
                <p className="text-[12px] text-gray-400 font-medium mt-0.5">
                  Real-time contract, renewal &amp; financial metrics
                </p>
              </div>
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-[10px] font-bold text-emerald-600">
                  Live Data
                </span>
              </div>
            </div>

            {/* ── ERROR BANNERS ── */}
            {error && widgetsFailed && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3">
                <ExclamationCircleOutlined className="text-rose-500 text-lg flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-rose-800 text-sm font-black">
                    Dashboard unavailable
                  </p>
                  <p className="text-rose-600 text-[11px] mt-0.5">{error}</p>
                </div>
              </div>
            )}
            {!widgetsFailed && failedApis > 0 && !loading && (
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
                <WarningOutlined className="text-amber-500 flex-shrink-0" />
                <p className="text-amber-700 text-[11px] font-semibold flex-1">
                  {failedApis} data source{failedApis > 1 ? "s" : ""} could not
                  be loaded. Affected panels are marked below.
                </p>
              </div>
            )}

            {/* ════════════════════════════════════
                SECTION 1 — ENHANCED KPI OVERVIEW ROW
                6-column grid → all 6 cards in ONE single row, equal height
            ════════════════════════════════════ */}
            <div>
              <SectionLabel>Overview</SectionLabel>

              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} active paragraph={{ rows: 2 }} />
                  ))}
                </div>
              ) : (
                /*
                 * 6-column grid. Every card is col-span-1.
                 * All cards use flex-col h-full so they all stretch
                 * to the tallest item in the row (the gauge cards).
                 */
                <div
                  className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4"
                  style={{ alignItems: "stretch" }}
                >
                  {/* 1 — Total Contracts */}
                  <KpiCard
                    label="Total Contracts"
                    value={totalContractsData?.totalContracts ?? 0}
                    icon={<FileTextOutlined />}
                    accentColor="emerald"
                    footnote="All-time contract portfolio"
                    sub={
                      <div className="flex flex-col gap-1 mt-1">
                        {Object.entries(
                          totalContractsData?.statusWiseBreakdown ?? {},
                        ).map(([s, v]) => (
                          <DotBadge
                            key={s}
                            label={s}
                            count={v as number}
                            dotClass={
                              s === "Active"
                                ? "bg-emerald-400"
                                : s === "Signed"
                                  ? "bg-sky-400"
                                  : "bg-rose-400"
                            }
                          />
                        ))}
                      </div>
                    }
                  />

                  {/* 2 — CHI Average Gauge */}
                  <GaugeKpi
                    label="CHI Average"
                    value={chiScore}
                    topBar="from-amber-400 to-orange-400"
                  />

                  {/* 3 — Revenue at Risk */}
                  <KpiCard
                    label="Revenue at Risk"
                    value={formatCurrency(revenueAtRisk?.totalRevenueAtRisk)}
                    icon={<ThunderboltOutlined />}
                    accentColor="amber"
                    footnote="Contracts with CHI < 60"
                  />

                  {/* 4 — Payment Reliability Gauge */}
                  <GaugeKpi
                    label="Payment Reliability"
                    value={paymentRel}
                    topBar="from-emerald-400 to-teal-500"
                  />

                  {/* 5 — Expiring 90 Days */}
                  {/* <KpiCard
                    label="Expiring (90 days)"
                    value={expiringContracts.length}
                    icon={<ClockCircleOutlined />}
                    accentColor="rose"
                    footnote="Need attention"
                  /> */}
                  {/* 5 — Outstanding Invoices */}
                  {/* 5 — Outstanding Invoices */}
                  <KpiCard
                    label="Outstanding Invoices"
                    value={formatCurrency(
                      outstandingInv?.totalOutstandingAmount,
                    )}
                    icon={<ExclamationCircleOutlined />}
                    accentColor="rose"
                    sub={
                      outstandingInv && (
                        <div className="space-y-3">
                          {/* Pending invoices */}
                          <div className="flex items-center gap-2 py-1.5 px-2 bg-amber-50 rounded-lg border border-amber-100">
                            <ExclamationCircleOutlined className="text-amber-500 text-[10px]" />
                            <span className="text-[10px] text-amber-700 font-bold">
                              {outstandingInv.pendingInvoicesCount ?? 0} pending
                              invoices
                            </span>
                          </div>

                          {/* Pending Amount */}
                          <ProgressRow
                            label="Pending Amount"
                            value={formatCurrency(
                              outstandingInv.totalpendingamount,
                            )}
                            pct={
                              (outstandingInv.totalpendingamount /
                                Math.max(
                                  outstandingInv.totalOutstandingAmount,
                                  1,
                                )) *
                              100
                            }
                            color="amber"
                          />

                          {/* Invoices Paid */}
                          <ProgressRow
                            label="Invoices Paid"
                            value={`${invoiceChartData.find((i) => i.name === "Paid")?.value ?? 0} / ${totalInvoices}`}
                            pct={
                              ((invoiceChartData.find((i) => i.name === "Paid")
                                ?.value ?? 0) /
                                Math.max(totalInvoices, 1)) *
                              100
                            }
                            color="emerald"
                          />
                        </div>
                      )
                    }
                  />

                  {/* 6 — Open Issues */}
                  <KpiCard
                    label="Open Issues"
                    value={openIssues}
                    icon={<AlertOutlined />}
                    accentColor={openIssues > 5 ? "rose" : "sky"}
                    footnote="Unresolved"
                  />
                </div>
              )}
            </div>

            {/* ════════════════════════════════════
        SECTION 2 — CHARTS + ALERTS
════════════════════════════════════ */}
            <div className="space-y-6">
              {/* ================= ROW 1 ================= */}
              <div className="grid grid-cols-1 lg:grid-cols-10 gap-5">
                {/* Health Index Trend — 70% */}
                <div className="lg:col-span-7">
                  {loading ? (
                    <Skeleton active paragraph={{ rows: 6 }} />
                  ) : (
                    <Card
                      title="Health Index Trend (Snapshot)"
                      badge="Monthly Trend"
                    >
                      {healthTrendData.length === 0 ? (
                        <PanelError message="Health trend data unavailable" />
                      ) : (
                        <>
                          <div className="h-[260px] mt-2">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart
                                data={healthTrendData}
                                margin={{
                                  top: 5,
                                  right: 5,
                                  bottom: 0,
                                  left: 0,
                                }}
                              >
                                <defs>
                                  <linearGradient
                                    id="chiAreaGrad"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                  >
                                    <stop
                                      offset="0%"
                                      stopColor="#10b981"
                                      stopOpacity={0.15}
                                    />
                                    <stop
                                      offset="100%"
                                      stopColor="#10b981"
                                      stopOpacity={0}
                                    />
                                  </linearGradient>
                                </defs>

                                <CartesianGrid
                                  strokeDasharray="3 3"
                                  vertical={false}
                                  stroke="#f8fafc"
                                />

                                <XAxis
                                  dataKey="name"
                                  axisLine={false}
                                  tickLine={false}
                                  tick={{
                                    fontSize: 10,
                                    fontWeight: 700,
                                    fill: "#94a3b8",
                                  }}
                                />

                                <YAxis
                                  axisLine={false}
                                  tickLine={false}
                                  tick={{
                                    fontSize: 10,
                                    fontWeight: 700,
                                    fill: "#94a3b8",
                                  }}
                                  domain={[50, 100]}
                                  tickCount={4}
                                />

                                <RechartsTooltip content={<CustomTooltip />} />

                                <Area
                                  type="monotone"
                                  dataKey="value"
                                  stroke="#10b981"
                                  strokeWidth={2.5}
                                  fill="url(#chiAreaGrad)"
                                />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>

                          <p className="text-[10px] text-gray-400 font-medium mt-2 px-1">
                            Portfolio CHI average (monthly snapshots)
                          </p>
                        </>
                      )}
                    </Card>
                  )}
                </div>

                {/* Invoice Distribution — 30% */}
                <div className="lg:col-span-3">
                  {loading ? (
                    <Skeleton active paragraph={{ rows: 4 }} />
                  ) : (
                    <Card title="Invoice Distribution" badge="Donut">
                      {invoiceChartData.length === 0 ? (
                        <PanelError message="Invoice distribution unavailable" />
                      ) : (
                        <>
                          <div className="h-[260px] relative">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={invoiceChartData}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={55}
                                  outerRadius={85}
                                  paddingAngle={4}
                                  dataKey="value"
                                  strokeWidth={0}
                                >
                                  {invoiceChartData.map((entry, index) => (
                                    <Cell key={index} fill={entry.color} />
                                  ))}
                                </Pie>
                              </PieChart>
                            </ResponsiveContainer>

                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-center">
                                <p className="text-2xl font-black text-gray-800">
                                  {totalInvoices}
                                </p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase">
                                  Total
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-center gap-4 mt-2 flex-wrap">
                            {invoiceChartData.map((item) => (
                              <div
                                key={item.name}
                                className="flex items-center gap-1.5"
                              >
                                <div
                                  className="w-2 h-2 rounded-full"
                                  style={{ backgroundColor: item.color }}
                                />
                                <span className="text-[10px] font-bold text-gray-500">
                                  {item.name}
                                  <span className="text-gray-800 ml-1">
                                    {item.value}
                                  </span>
                                </span>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </Card>
                  )}
                </div>
              </div>

              {/* ================= ROW 2 ================= */}
              <div className="grid grid-cols-1 lg:grid-cols-10 gap-5 items-stretch">
                {/* Top Contracts — 70% */}
                <div className="lg:col-span-7 h-full">
                  {loading ? (
                    <Skeleton active paragraph={{ rows: 6 }} />
                  ) : (
                    <Card
                      title="Top 10 High Value Contracts"
                      badge="By Value"
                      className="h-full"
                    >
                      {topContracts.length === 0 ? (
                        <PanelError message="Contract data unavailable" />
                      ) : (
                        <div className="overflow-x-auto -mx-5">
                          <table className="w-full text-[11px]">
                            <thead>
                              <tr className="border-b border-gray-100">
                                {[
                                  "Contract",
                                  "Counterparty",
                                  "Type",
                                  "Value",
                                  "Status",
                                ].map((h, i) => (
                                  <th
                                    key={h}
                                    className={`py-3 px-4 font-black text-gray-400 uppercase tracking-wider text-[10px]
                        ${
                          i === 3
                            ? "text-right"
                            : i === 4
                              ? "text-center"
                              : "text-left"
                        }`}
                                  >
                                    {h}
                                  </th>
                                ))}
                              </tr>
                            </thead>

                            <tbody>
                              {topContracts
                                .slice(0, 8)
                                .map((c: any, idx: number) => (
                                  <tr
                                    key={c.contractId}
                                    className={`border-b border-gray-50 hover:bg-gray-50/80
                      ${idx % 2 !== 0 ? "bg-gray-50/30" : ""}`}
                                  >
                                    <td className="py-3 px-4 font-semibold text-gray-800">
                                      <Tooltip title={c.title}>
                                        <span className="truncate block">
                                          {c.title.length > 35
                                            ? c.title.substring(0, 35) + "…"
                                            : c.title}
                                        </span>
                                      </Tooltip>
                                    </td>

                                    <td className="py-3 px-4 text-gray-400">
                                      {c.counterparty?.split(",")[0]}
                                    </td>

                                    <td className="py-3 px-4 text-gray-400">
                                      {c.type}
                                    </td>

                                    <td className="py-3 px-4 font-black text-right">
                                      {formatCurrency(c.value)}
                                    </td>

                                    <td className="py-3 px-4 text-center">
                                      <StatusBadge status={c.status} />
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </Card>
                  )}
                </div>

                {/* Alerts & Summaries — 30% */}
                <div className="lg:col-span-3 h-full">
                  {loading ? (
                    <Skeleton active paragraph={{ rows: 5 }} />
                  ) : (
                    <div className="h-full flex flex-col">
                      <SectionLabel>Alerts & Summaries</SectionLabel>

                      <Card
                        title="Expiring Soon"
                        badge="90 days"
                        className="flex flex-col flex-1"
                      >
                        {/* Dynamic height — fills full space */}
                        <div className="space-y-2.5 flex-1 overflow-y-auto custom-scroll">
                          {expiringContracts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full">
                              <SafetyCertificateOutlined className="text-3xl text-emerald-200 mb-2" />
                              <p className="text-sm text-gray-400 font-medium">
                                No upcoming expirations
                              </p>
                            </div>
                          ) : (
                            expiringContracts.map((c: any, i: number) => (
                              <ExpiringItem key={i} contract={c} />
                            ))
                          )}
                        </div>
                      </Card>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ════════════════════════════════════
                SECTION 3 — AI AGENT PANELS
            ════════════════════════════════════ */}
            <div>
              <SectionLabel>
                AI Agent Activity
                <span className="ml-2 text-[9px] font-bold bg-gradient-to-r from-emerald-100 to-blue-100 text-gray-500 px-2 py-0.5 rounded-full border border-gray-100">
                  Today
                </span>
              </SectionLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                {loading ? (
                  [...Array(4)].map((_, i) => (
                    <Skeleton key={i} active paragraph={{ rows: 4 }} />
                  ))
                ) : (
                  <>
                    <AgentPanel
                      title="Intake Agent"
                      subtitle="Redlines, briefs & document intelligence."
                      linkLabel="Inbox"
                      accentColor="violet"
                      hasError={apiStatus?.intake === "error"}
                      errorMsg="Intake agent data unavailable"
                      completionRate={im?.completionRate}
                      bullets={
                        im
                          ? [
                              { text: `${im.running} requests in progress` },
                              {
                                text: `${im.withDocuments} requests with documents`,
                              },
                              { text: `${im.completed} completed today` },
                              { text: `${im.failed} failed requests` },
                            ]
                          : []
                      }
                      actions={[
                        { label: "Summarize all" },
                        { label: "Generate briefs" },
                        { label: "My queue" },
                      ]}
                    />
                    <AgentPanel
                      title="Document Agent"
                      subtitle="Redlines, briefs & document intelligence."
                      linkLabel="Documents"
                      accentColor="blue"
                      hasError={apiStatus?.document === "error"}
                      errorMsg="Document agent data unavailable"
                      completionRate={
                        dm
                          ? (dm.completed / Math.max(dm.totalDocuments, 1)) *
                            100
                          : undefined
                      }
                      bullets={
                        dm
                          ? [
                              { text: `${dm.running} documents in progress` },
                              { text: `${dm.completed} documents completed` },
                              { text: `${dm.failed} documents need attention` },
                              {
                                text: `${dm.totalDocuments} total documents today`,
                              },
                            ]
                          : []
                      }
                      actions={[
                        { label: "Summarize all" },
                        { label: "Generate briefs" },
                        { label: "My queue" },
                      ]}
                    />
                    <AgentPanel
                      title="Contract Agent"
                      subtitle="Obligations, billing, risk & compliance."
                      linkLabel="Contracts"
                      accentColor="teal"
                      hasError={apiStatus?.contract === "error"}
                      errorMsg="Contract agent data unavailable"
                      bullets={
                        cm
                          ? [
                              {
                                text: `${cm.activeContracts} active contracts tracked`,
                              },
                              {
                                text: `${cm.highRiskContracts} high-risk contracts`,
                              },
                              {
                                text: `${cm.expireWithin30Days} expiring within 30 days`,
                              },
                              { text: `${cm.expired} expired contracts` },
                            ]
                          : []
                      }
                      actions={[
                        { label: "View obligations" },
                        { label: "Contract brief" },
                        { label: "Billing anomalies" },
                      ]}
                    />
                    <AgentPanel
                      title="Renewal Agent"
                      subtitle="Renewals, risk signals & value retention."
                      linkLabel="Renewal"
                      accentColor="orange"
                      hasError={apiStatus?.renewal === "error"}
                      errorMsg="Renewal agent data unavailable"
                      bullets={
                        rm
                          ? [
                              {
                                text: `${rm.totalRenewals} contracts entering renewal window`,
                              },
                              {
                                text: `${rm.autoRenewals} auto-renew clauses detected`,
                              },
                              {
                                text: `${rm.overdueRenewals} overdue renewals`,
                              },
                              {
                                text: `${formatCurrency(rm.totalContractValue)} renewal value at stake`,
                              },
                            ]
                          : []
                      }
                      actions={[
                        { label: "Renewal readiness" },
                        { label: "Risk & leverage analysis" },
                        { label: "Launch renewal playbook" },
                      ]}
                    />
                  </>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-center gap-2 pt-2">
              <span className="w-1 h-1 rounded-full bg-emerald-400" />
              <p className="text-[10px] text-gray-300 font-medium">
                Kozmo · Real-time data
              </p>
              <span className="w-1 h-1 rounded-full bg-blue-400" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
