/* eslint-disable react-hooks/rules-of-hooks */

/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { BarChart3 } from "lucide-react";

import DashboardSection from "./Dashboard";
import ReportsSection from "./Reports";
import { useNavigate } from "react-router-dom";
/* ── helpers ── */
export const cx = (...classes: (string | undefined | false)[]) =>
  classes.filter(Boolean).join(" ");

export function useCountUp(target: string | number, duration = 1200) {
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (target === null || target === undefined) {
      setDisplay("-");
      return;
    }

    const stringValue = String(target);

    const num = parseFloat(stringValue.replace(/[^0-9.]/g, ""));

    if (isNaN(num)) {
      setDisplay(stringValue);
      return;
    }

    const start = performance.now();

    const raf = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);

      const cur = (num * ease).toFixed(num % 1 !== 0 ? 2 : 0);

      setDisplay(stringValue.replace(/[0-9]+(\.[0-9]+)?/, cur));

      if (p < 1) requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);
  }, [target, duration]);

  return display;
}

export const KPI = ({ label, value }: any) => {
  const shouldAnimate = typeof value === "number"; // animate only pure numbers

  const animated = shouldAnimate ? useCountUp(value ?? "-") : value;

  return (
    <div className="rounded-xl p-3.5 bg-white border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-200">
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
        {label}
      </p>

      <p className="text-lg font-bold text-gray-800 tabular-nums truncate">
        {animated}
      </p>
    </div>
  );
};

/* ── Zone palettes ── */
export const ZONE_CONFIGS: Record<string, any> = {
  emerald: {
    icon: "bg-emerald-50 text-emerald-600",
    border: "hover:border-emerald-200",
    accent: "#10b981",
  },
  blue: {
    icon: "bg-blue-50 text-blue-600",
    border: "hover:border-blue-200",
    accent: "#3b82f6",
  },
  violet: {
    icon: "bg-violet-50 text-violet-600",
    border: "hover:border-violet-200",
    accent: "#8b5cf6",
  },
  amber: {
    icon: "bg-amber-50 text-amber-600",
    border: "hover:border-amber-200",
    accent: "#f59e0b",
  },
  rose: {
    icon: "bg-rose-50 text-rose-600",
    border: "hover:border-rose-200",
    accent: "#f43f5e",
  },
  cyan: {
    icon: "bg-cyan-50 text-cyan-600",
    border: "hover:border-cyan-200",
    accent: "#06b6d4",
  },
};

/* ── Zone card ── */
export const Zone = ({ title, icon: Icon, kpis, palette, onClick }: any) => {
  const cfg = ZONE_CONFIGS[palette];
  return (
    <div
      onClick={onClick}
      className={cx(
        "group relative flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5",
        "shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 cursor-pointer",
        cfg.border,
      )}
    >
      {/* top accent line */}
      <div
        className="absolute top-0 left-2 right-2 h-0.5"
        style={{ background: cfg.accent, opacity: 0.7 }}
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={cx(
              "h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
              cfg.icon,
            )}
          >
            <Icon className="h-5 w-5" />
          </div>

          <h2 className="font-semibold text-gray-800 text-sm">{title}</h2>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {kpis.map((k: any) => (
          <KPI key={k.label} {...k} />
        ))}
      </div>
    </div>
  );
};

/* ── Report Item ── */
export const ReportItem = ({
  name,
  count,
  status,
  payload,
  categoryId,
}: any) => {
  const navigate = useNavigate();

  const statusConfig: Record<string, any> = {
    warning: {
      dot: "bg-amber-400",
      badge: "bg-amber-50 text-amber-700 border-amber-200",
      row: "hover:bg-amber-50/50",
    },
    danger: {
      dot: "bg-rose-400",
      badge: "bg-rose-50 text-rose-700 border-rose-200",
      row: "hover:bg-rose-50/50",
    },
    neutral: {
      dot: "bg-gray-400",
      badge: "bg-gray-50 text-gray-600 border-gray-200",
      row: "hover:bg-gray-100/70",
    },
  };
  const s = status ? statusConfig[status] : null;

  const isClickable = count > 0;

  const handleReportClick = () => {
    if (!isClickable) return;

    navigate(`/reports/${categoryId}`, {
      state: { reportData: payload, reportName: name },
    });
  };

  return (
    <button
      onClick={handleReportClick}
      className={cx(
        "group flex items-center justify-between w-full rounded-xl px-4 py-3 text-left",
        "border border-gray-100 bg-gray-50/60 transition-all duration-150",
        isClickable
          ? s
            ? s.row
            : "hover:bg-gray-100/80 cursor-pointer"
          : "opacity-60 cursor-not-allowed bg-gray-100",
      )}
      disabled={!isClickable}
    >
      <div className="flex items-center gap-3">
        <div
          className={cx(
            "h-2 w-2 rounded-full shrink-0",
            s ? s.dot : "bg-emerald-400",
          )}
        />
        <span className="text-sm font-medium text-gray-700">{name}</span>
      </div>

      <span
        className={cx(
          "text-xs font-semibold px-2.5 py-1 rounded-full border tabular-nums",
          s ? s.badge : "bg-white text-gray-500 border-gray-200",
        )}
      >
        {count > 0 ? count : "n/a"}
      </span>
    </button>
  );
};

/* ── Group color configs ── */
export const GROUP_COLORS = [
  {
    accent: "#10b981",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    badgeBg: "bg-emerald-50",
    badgeText: "text-emerald-700",
    badgeBorder: "border-emerald-200",
    bar: "from-emerald-400 to-teal-400",
  },
  {
    accent: "#f59e0b",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    badgeBg: "bg-amber-50",
    badgeText: "text-amber-700",
    badgeBorder: "border-amber-200",
    bar: "from-amber-400 to-orange-400",
  },
  {
    accent: "#8b5cf6",
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
    badgeBg: "bg-violet-50",
    badgeText: "text-violet-700",
    badgeBorder: "border-violet-200",
    bar: "from-violet-400 to-blue-400",
  },
  {
    accent: "#f43f5e",
    iconBg: "bg-rose-50",
    iconColor: "text-rose-600",
    badgeBg: "bg-rose-50",
    badgeText: "text-rose-700",
    badgeBorder: "border-rose-200",
    bar: "from-rose-400 to-pink-400",
  },
];

/* ── Premium Accordion Report Group ── */
export const PremiumReportGroup = ({
  title,
  description,
  reports,
  defaultOpen = false,
  colorIdx = 0,
  categoryId,
}: any) => {
  const [open, setOpen] = React.useState(defaultOpen);
  const cfg = GROUP_COLORS[colorIdx % GROUP_COLORS.length];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      {/* top gradient bar */}
      <div className={cx("h-0.5 w-full bg-gradient-to-r", cfg.bar)} />

      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50/60 transition-colors duration-150"
      >
        <div className="flex items-center gap-3">
          <div
            className={cx(
              "h-8 w-8 rounded-lg flex items-center justify-center shrink-0",
              cfg.iconBg,
              cfg.iconColor,
            )}
          >
            <BarChart3 className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 text-sm">{title}</h3>
            <p className="text-xs text-gray-400 mt-0.5">{description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={cx(
              "text-xs font-semibold px-2.5 py-1 rounded-full border",
              cfg.badgeBg,
              cfg.badgeText,
              cfg.badgeBorder,
            )}
          >
            {reports.length} reports
          </span>
          <span
            className="text-gray-400 text-xs inline-block transition-transform duration-300"
            style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
          >
            ▼
          </span>
        </div>
      </button>

      <div
        style={{
          maxHeight: open ? `${reports.length * 68}px` : "0px",
          opacity: open ? 1 : 0,
          overflow: "hidden",
          transition:
            "max-height 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.25s ease",
        }}
      >
        <div className="px-5 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8">
            {reports.map((r: any) => (
              <ReportItem key={r.name} {...r} categoryId={categoryId} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Section Shell ── */
const SectionShell = ({ children, title, icon: Icon }: any) => (
  <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
    <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
      <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center shadow-md">
        <Icon className="h-4 w-4 text-white" />
      </div>
      <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
        {title}
      </h3>
    </div>
    <div className="p-5">{children}</div>
  </div>
);

/* ── Main page ── */
const DashboardReportsPage: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-white rounded-2xl border border-gray-200 shadow-sm">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500" />

      <div className="mx-auto px-6 py-8 space-y-6 bg-gray-50/40">
        <SectionShell title="Dashboards" icon={BarChart3}>
          <DashboardSection Zone={Zone} />
        </SectionShell>

        <SectionShell title="Reports" icon={BarChart3}>
          <ReportsSection PremiumReportGroup={PremiumReportGroup} />
        </SectionShell>
      </div>
    </div>
  );
};

export default DashboardReportsPage;
