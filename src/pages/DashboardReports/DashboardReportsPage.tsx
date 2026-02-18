/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
// Dashboard & Reports section — Enhanced Design
// React + TypeScript + Tailwind

import React, { useState, useEffect } from "react";
import {
  BarChart3,
  ShieldAlert,
  RefreshCcw,
  Clock,
  FileBarChart,
  Cpu,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

/* ── tiny helpers ── */
const cx = (...classes: (string | undefined | false)[]) =>
  classes.filter(Boolean).join(" ");

/* ── Animated number hook ── */
function useCountUp(target: string, duration = 1200) {
  const [display, setDisplay] = useState("0");
  useEffect(() => {
    const num = parseFloat(target.replace(/[^0-9.]/g, ""));
    if (isNaN(num)) {
      setDisplay(target);
      return;
    }
    const start = performance.now();
    const raf = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      const cur = (num * ease).toFixed(num % 1 !== 0 ? 1 : 0);
      setDisplay(target.replace(/[0-9]+(\.[0-9]+)?/, cur));
      if (p < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [target, duration]);
  return display;
}

/* ── Pill badge ── */
const Pill = ({
  children,
  color = "emerald",
}: {
  children: React.ReactNode;
  color?: string;
}) => {
  const colors: Record<string, string> = {
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-700",
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    amber: "bg-amber-50 border-amber-200 text-amber-700",
    rose: "bg-rose-50 border-rose-200 text-rose-700",
  };
  return (
    <span
      className={cx(
        "rounded-full border px-3 py-1 text-xs font-medium tracking-wide",
        colors[color],
      )}
    >
      {children}
    </span>
  );
};

/* ── KPI tile ── */
const KPI = ({ label, value, sub, trend }: any) => {
  const animated = useCountUp(value);
  return (
    <div className="group relative rounded-xl border border-slate-100 bg-slate-50/60 p-4 transition-all duration-200 hover:bg-white hover:shadow-md hover:border-slate-200">
      <p className="text-xs font-medium uppercase tracking-wider text-slate-400 mb-1">
        {label}
      </p>
      <p className="text-2xl font-bold text-slate-900 tabular-nums">
        {animated}
      </p>
      <div className="flex items-center gap-2 mt-1">
        {sub && <p className="text-xs text-slate-400">{sub}</p>}
        {trend === "up" && <TrendingUp className="h-3 w-3 text-emerald-500" />}
        {trend === "down" && <TrendingDown className="h-3 w-3 text-rose-500" />}
      </div>
    </div>
  );
};

/* ── Zone card (dashboard tiles) ── */
const ZONE_PALETTES: Record<
  string,
  { icon: string; ring: string; dot: string }
> = {
  emerald: {
    icon: "bg-emerald-50 text-emerald-600",
    ring: "ring-emerald-100",
    dot: "bg-emerald-400",
  },
  blue: {
    icon: "bg-blue-50 text-blue-600",
    ring: "ring-blue-100",
    dot: "bg-blue-400",
  },
  violet: {
    icon: "bg-violet-50 text-violet-600",
    ring: "ring-violet-100",
    dot: "bg-violet-400",
  },
  amber: {
    icon: "bg-amber-50 text-amber-600",
    ring: "ring-amber-100",
    dot: "bg-amber-400",
  },
  rose: {
    icon: "bg-rose-50 text-rose-600",
    ring: "ring-rose-100",
    dot: "bg-rose-400",
  },
  cyan: {
    icon: "bg-cyan-50 text-cyan-600",
    ring: "ring-cyan-100",
    dot: "bg-cyan-400",
  },
};

const Zone = ({
  title,
  description,
  icon: Icon,
  kpis,
  palette = "emerald",
}: any) => {
  const p = ZONE_PALETTES[palette] ?? ZONE_PALETTES.emerald;
  return (
    <div
      className={cx(
        "group relative flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-6",
        "shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5",
        "ring-1 ring-transparent hover:" + p.ring,
      )}
    >
      {/* top bar accent */}
      <div
        className={cx(
          "absolute top-0 left-6 right-6 h-0.5 rounded-b-full opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          p.dot,
        )}
      />

      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div
            className={cx(
              "h-11 w-11 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
              p.icon,
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 leading-tight">
              {title}
            </h3>
            <p className="text-sm text-slate-400 mt-0.5">{description}</p>
          </div>
        </div>
        <button className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all duration-150 shadow-sm">
          Open <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {kpis.map((k: any) => (
          <KPI key={k.label} {...k} />
        ))}
      </div>
    </div>
  );
};

/* ── Report card ── */
const ReportCard = ({
  title,
  subtitle,
  metrics,
  tag,
  tagColor,
}: {
  title: string;
  subtitle: string;
  metrics: { label: string; value: string; sub?: string; trend?: string }[];
  tag?: string;
  tagColor?: string;
}) => (
  <div className="group relative flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
    <div className="flex items-start justify-between gap-3">
      <div className="space-y-1 min-w-0">
        <h3 className="font-semibold text-slate-900 leading-tight">{title}</h3>
        <p className="text-xs text-slate-400">{subtitle}</p>
        {tag && <Pill color={tagColor}>{tag}</Pill>}
      </div>
      <button className="shrink-0 flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100 transition-all duration-150 shadow-sm">
        Run <ArrowUpRight className="h-3.5 w-3.5" />
      </button>
    </div>

    <div className="grid grid-cols-2 gap-3">
      {metrics.map((m) => (
        <KPI key={m.label} {...m} />
      ))}
    </div>
  </div>
);

/* ── Main page ── */
const DashboardReportsPage: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-[#f8f9fc] font-sans">
      {/* Top gradient stripe */}
      <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 via-blue-500 to-violet-500" />

      <div className="mx-auto px-6 py-8 space-y-10">
        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center shadow-md">
                <BarChart3 className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Dashboards
              </h3>
            </div>
            <p className="text-slate-400 text-sm ml-11">
              Operational dashboards and analytical reports — real-time posture
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700 font-medium shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              Live posture
            </div>
            <button className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 font-medium hover:bg-slate-50 shadow-sm transition-all">
              <RefreshCcw className="h-3.5 w-3.5" /> Refresh
            </button>
          </div>
        </div>

        {/* ── Dashboard Zones ── */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <Zone
              title="Portfolio Posture"
              description="Stages, lifecycle, documents"
              icon={BarChart3}
              palette="emerald"
              kpis={[
                {
                  label: "Active",
                  value: "1,012",
                  sub: "contracts",
                  trend: "up",
                },
                {
                  label: "Lifecycle Avg",
                  value: "23.4d",
                  sub: "Draft → Active",
                },
              ]}
            />
            <Zone
              title="Value & Exposure"
              description="Revenue, invoices, outstanding"
              icon={FileBarChart}
              palette="blue"
              kpis={[
                { label: "Active Value", value: "₹124.8Cr", trend: "up" },
                { label: "Outstanding", value: "₹2.5Cr", trend: "down" },
              ]}
            />
            <Zone
              title="Health & Intelligence"
              description="CHI, trends, risk signals"
              icon={ShieldAlert}
              palette="violet"
              kpis={[
                { label: "CHI Avg", value: "78/100" },
                { label: "Risky (<60)", value: "118", trend: "down" },
              ]}
            />
            <Zone
              title="Renewal & Time Risk"
              description="Upcoming renewals & expiries"
              icon={Clock}
              palette="amber"
              kpis={[
                { label: "Renewals (90d)", value: "22" },
                { label: "High Risk", value: "7", trend: "down" },
              ]}
            />
            <Zone
              title="Operational Stress"
              description="Issues, escalations, SLA"
              icon={RefreshCcw}
              palette="rose"
              kpis={[
                { label: "Open Issues", value: "47", trend: "down" },
                { label: "SLA Breach", value: "6" },
              ]}
            />
            <Zone
              title="AI Ops"
              description="AI processing health"
              icon={Cpu}
              palette="cyan"
              kpis={[
                {
                  label: "Processed",
                  value: "1,922",
                  sub: "last 24h",
                  trend: "up",
                },
                { label: "Failed", value: "6", sub: "last 24h" },
              ]}
            />
          </div>
        </div>

        {/* ── Reports Section ── */}
        <div className="space-y-4">
          {/* ── Reports Header (Dashboard-style) ── */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center shadow-md">
                  <FileBarChart className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  Reports
                </h3>
              </div>
              <p className="text-slate-400 text-sm ml-11">
                Operational, financial, renewal and workflow insights
              </p>
            </div>

            <button className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 font-medium hover:bg-slate-50 shadow-sm transition-all">
              View all <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <ReportCard
              title="Active (Effective) Contracts"
              subtitle="Contract Status Reports"
              tag="Status"
              tagColor="emerald"
              metrics={[
                {
                  label: "Result",
                  value: "1,012",
                  sub: "contracts",
                  trend: "up",
                },
                { label: "Updated", value: "Today", sub: "last run" },
              ]}
            />
            <ReportCard
              title="Upcoming Renewals"
              subtitle="Renewal & Expiration Reports"
              tag="Renewal"
              tagColor="amber"
              metrics={[
                { label: "Next 90d", value: "22", sub: "contracts" },
                { label: "High Risk", value: "7", sub: "items", trend: "down" },
              ]}
            />
            <ReportCard
              title="Missed Renewals / Expirations"
              subtitle="Renewal & Expiration Reports"
              tag="Alert"
              tagColor="rose"
              metrics={[
                { label: "Last 90d", value: "4", sub: "events" },
                { label: "Top Cause", value: "No notice", sub: "signal" },
              ]}
            />
            <ReportCard
              title="Contract Financial Report"
              subtitle="Value & Invoices"
              tag="Finance"
              tagColor="blue"
              metrics={[
                { label: "Outstanding", value: "₹ 2.5Cr" },
                { label: "Revenue at Risk", value: "₹ 18.2Cr", trend: "down" },
              ]}
            />
            <ReportCard
              title="Task Status Report"
              subtitle="Workflow Reports"
              tag="Workflow"
              tagColor="emerald"
              metrics={[
                { label: "Pending", value: "86", sub: "tasks" },
                { label: "Overdue", value: "19", sub: "tasks", trend: "down" },
              ]}
            />
            <ReportCard
              title="Upcoming Obligations"
              subtitle="Milestone & Obligation Reports"
              tag="Milestone"
              tagColor="blue"
              metrics={[
                { label: "Next 30d", value: "28", sub: "items" },
                { label: "Delayed", value: "6", sub: "items", trend: "down" },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardReportsPage;
