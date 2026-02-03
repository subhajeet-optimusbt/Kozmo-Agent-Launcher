import {
  AlertCircle,
  FileWarning,
  Clock,
  CheckCircle,
  DollarSign,
  AlertTriangle,
} from "lucide-react";

/* ================= TYPES ================= */

export type IntakeDashboardResponse = {
  total: number;
  withDocs: number;
  running: number;
  completed: number;
  failed: number;
  escalated: number;
};

type Props = {
  data: IntakeDashboardResponse | null;
  loading: boolean;
  range: "today" | "last7days" | "last30days";
};

/* ================= COMPONENT ================= */

export default function IntakeDashboard({
  data,
  loading,
}: Props) {
  if (loading) {
    return (
      <div className="py-10 text-sm text-gray-500">
        Loading dashboard…
      </div>
    );
  }

  if (!data) {
    return (
      <div className="py-10 text-sm text-gray-400">
        No intake dashboard data available
      </div>
    );
  }

  /* ================= KPI MAPPING ================= */

  const kpiCards = [
    {
      label: "New Requests",
      value: data.total,
      trend: "In range",
      trendType: "up",
      icon: Clock,
      iconColor: "text-emerald-600",
    },
    {
      label: "With Documents",
      value: data.withDocs,
      trend: "In range",
      trendType: "up",
      icon: FileWarning,
      iconColor: "text-amber-500",
    },
    {
      label: "Running",
      value: data.running,
      trend: "Processing",
      trendType: "neutral",
      icon: DollarSign,
      iconColor: "text-red-500",
    },
    {
      label: "Completed",
      value: data.completed,
      trend: "Completed",
      trendType: "up",
      icon: CheckCircle,
      iconColor: "text-emerald-600",
    },
    {
      label: "Failed",
      value: data.failed,
      trend: "Attention",
      trendType: "down",
      icon: AlertCircle,
      iconColor: "text-gray-500",
    },
    {
      label: "Escalated",
      value: data.escalated,
      trend: "Critical",
      trendType: "down",
      icon: AlertTriangle,
      iconColor: "text-indigo-500",
    },
  ];

  /* ================= STATIC FEED (UNCHANGED) ================= */

  const alerts = [
    {
      type: "Email",
      message: `"Review this amendment" — 3 docs`,
      time: "From legal@acme.com",
      severity: "border-blue-400",
    },
    {
      type: "Upload",
      message: "NDA-Beta1.pdf uploaded",
      time: "Priya",
      severity: "border-amber-400",
    },
    {
      type: "Salesforce",
      message: `"Q4 SaaS Expansion"`,
      time: "Rahul",
      severity: "border-indigo-400",
    },
    {
      type: "Teams",
      message: `"Validate these SOWs"`,
      time: "Commercial Ops",
      severity: "border-purple-400",
    },
  ];

  const worklists = [
    {
      title: "Missing Info",
      count: data.failed,
      action: "Term/scope incomplete",
      color: "from-red-400 to-red-600",
    },
    {
      title: "Clarification Needed",
      count: data.running,
      action: "Intent unclear",
      color: "from-amber-400 to-amber-600",
    },
    {
      title: "Ambiguous Routing",
      count: data.escalated,
      action: "Multiple possible agents",
      color: "from-indigo-400 to-indigo-600",
    },
    {
      title: "High Priority",
      count: data.escalated,
      action: "Critical flags",
      color: "from-rose-400 to-rose-600",
    },
  ];

  /* ================= RENDER ================= */

  return (
    <div className="space-y-6">
      {/* ================= KPI CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
        {kpiCards.map((kpi, idx) => {
          const Icon = kpi.icon;

          return (
            <div
              key={idx}
              className="group relative rounded-2xl border border-gray-200 bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-12px_rgba(0,0,0,0.15)]"
            >
              {/* top glow */}
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent opacity-0 group-hover:opacity-100 transition" />

              {/* Header */}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-100 bg-gray-50">
                  <Icon size={18} className={kpi.iconColor} />
                </div>

                <p className="text-sm font-semibold text-gray-500">
                  {kpi.label}
                </p>
              </div>

              {/* Value */}
              <div className="mt-4 flex items-end justify-between">
                <span className="text-3xl font-bold tracking-tight text-gray-900">
                  {kpi.value}
                </span>

                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold
                    ${
                      kpi.trendType === "up"
                        ? "bg-emerald-50 text-emerald-600"
                        : kpi.trendType === "down"
                        ? "bg-red-50 text-red-500"
                        : "bg-gray-100 text-gray-500"
                    }`}
                >
                  {kpi.trend}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= ALERTS + WORKLISTS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SOURCE FEED */}
        <div className="bg-white rounded-2xl border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">
              Source Feed
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Where Requests Originate
            </p>
          </div>

          <div className="p-4 space-y-2">
            {alerts.map((alert, idx) => (
              <div
                key={idx}
                className={`flex gap-3 items-start border-l-4 ${alert.severity} bg-white border border-gray-200 rounded-lg px-4 py-3 hover:bg-gray-50 transition`}
              >
                <AlertCircle size={16} className="text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <div className="text-xs font-semibold text-gray-500 uppercase">
                    {alert.type}
                  </div>
                  <p className="text-sm text-gray-700 mt-0.5">
                    {alert.message}
                  </p>
                  <span className="text-xs text-gray-400">
                    {alert.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TRIAGE BUCKETS */}
        <div className="bg-white rounded-2xl border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-900">
              Requests Requiring Attention
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Triage Buckets.
            </p>
          </div>

          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {worklists.map((list, idx) => (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-4 hover:shadow-lg transition"
              >
                <div
                  className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${list.color}`}
                />
                <h4 className="text-sm font-semibold text-gray-900">
                  {list.title}
                </h4>
                <div className="text-3xl font-black text-gray-900 mt-2">
                  {list.count}
                </div>
                <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  {list.action} <span>→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
