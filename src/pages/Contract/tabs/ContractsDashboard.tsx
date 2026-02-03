/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  AlertCircle,
  TrendingUp,
  FileWarning,
  Clock,
  CheckCircle,
} from "lucide-react";
import type { ContractDashboardResponse } from "../../../types/contracts";

type Props = {
  data: ContractDashboardResponse | null;
  loading: boolean;
  range: "today" | "last7days" | "last30days";

};

export default function ContractsDashboard({ data, loading }: Props) {
  if (loading) {
    return (
      <div className="py-10 text-sm text-gray-500">Loading dashboard…</div>
    );
  }

  if (!data) {
    return (
      <div className="py-10 text-sm text-gray-400">
        No contract data available
      </div>
    );
  }

  const m = data;

  const kpiCards = [
    {
      label: "Total Contracts",
      value: m.totalContracts,
      status: "Healthy",
      icon: CheckCircle,
      iconColor: "text-emerald-500",
      trend: "+",
    },
    {
      label: "Active contracts",
      value: m.activeContracts,
      status: "Healthy",
      icon: CheckCircle,
      iconColor: "text-emerald-500",
      trend: "+",
    },
    {
      label: "High-risk contracts",
      value: m.highRiskContracts,
      status: "Attention",
      icon: AlertCircle,
      iconColor: "text-red-500",
      trend: "-",
    },
    {
      label: "Needs review",
      value: m.contractsNeedingReview,
      status: "Pending",
      icon: FileWarning,
      iconColor: "text-orange-500",
      trend: "+",
    },
    {
      label: "Expiring (90 days)",
      value: m.expireWithin90Days,
      status: "Upcoming",
      icon: Clock,
      iconColor: "text-amber-500",
      trend: "+",
    },
    {
      label: "Pending signature",
      value: m.pendingSignature,
      status: "In progress",
      icon: TrendingUp,
      iconColor: "text-blue-500",
      trend: "+",
    },
  ];

  const alerts = [
    {
      type: "Risk",
      message: "Contract #542 – Obligation overdue by 14 days.",
      severity: "border-l-red-400",
    },
    {
      type: "Drift",
      message: "SOW-992 – Price deviation from parent MSA.",
      severity: "border-l-orange-400",
    },
    {
      type: "Signature",
      message: "MSA-Acme – Missing signature on Amendment v3.",
      severity: "border-l-amber-400",
    },
    {
      type: "Usage",
      message: "Renewal – API overage detected (policy violation).",
      severity: "border-l-yellow-400",
    },
    {
      type: "Region",
      message: "DPA – Cross-region clause conflict (EU vs US).",
      severity: "border-l-pink-400",
    },
  ];
  const worklists = [
    {
      title: "Contracts needing Legal review",
      count: m.highRiskContracts,
      action: "Open Legal queue",
      color: "from-red-500 to-red-600",
    },
    {
      title: "Contracts needing Finance approval",
      count: 0,
      action: "Finance queue",
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Contracts in negotiation",
      count: 0,
      action: "Negotiation queue",
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Renewals approaching",
      count: 0,
      action: "Renewal pipeline",
      color: "from-orange-500 to-orange-600",
    },
    {
      title: "Obligations requiring action",
      count: 0,
      action: "Obligation hub",
      color: "from-emerald-500 to-emerald-600",
    },
    {
      title: "Total contracts",
      count: 0,
      action: "Contract inventory",
      color: "from-pink-500 to-pink-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
        {kpiCards.map((kpi, idx) => {
          const Icon = kpi.icon;

          return (
            <div
              key={idx}
              className="
          group relative overflow-hidden
          rounded-2xl border border-gray-200
          bg-white
          px-5 py-4
          transition-all duration-300
          hover:-translate-y-0.5
          hover:shadow-lg hover:shadow-gray-100
        "
            >
              {/* subtle top glow */}
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent opacity-0 group-hover:opacity-100 transition" />

              {/* header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="
                w-9 h-9 rounded-xl
                flex items-center justify-center
                bg-gray-50 border border-gray-100
                group-hover:bg-emerald-50
                transition
              "
                  >
                    <Icon size={18} className={kpi.iconColor} />
                  </div>

                  <span className="text-xs font-semibold text-gray-500">
                    {kpi.label}
                  </span>
                </div>

                <span
                  className={`
              text-xs font-semibold
              ${
                kpi.trend?.startsWith("+") ? "text-emerald-600" : "text-red-500"
              }
            `}
                >
                  {kpi.trend}
                </span>
              </div>

              {/* value */}
              <div className="mt-4">
                <div className="text-2xl font-bold tracking-tight text-gray-900">
                  {kpi.value}
                </div>
              </div>

              {/* footer */}
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-gray-400">{kpi.status}</span>

                <span className="text-[10px] uppercase tracking-widest text-gray-300">
                  KPI
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ALERTS & WORKLISTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ALERTS */}
        <div className="bg-white rounded-2xl border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">
              Alerts & Exceptions
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Exceptions requiring attention across contracts.
            </p>
          </div>

          <div className="p-4 space-y-2">
            {alerts.map((alert, idx) => (
              <div
                key={idx}
                className={`flex gap-3 items-start bg-white border border-gray-200 ${alert.severity} border-l-4 rounded-lg px-4 py-3 hover:bg-gray-50 transition`}
              >
                <AlertCircle size={16} className="text-gray-400 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase">
                    {alert.type}
                  </div>
                  <p className="text-sm text-gray-700 mt-0.5">
                    {alert.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* WORKLISTS — untouched */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-900">Key Worklists</h3>
            <p className="text-sm text-gray-500 mt-1">
              Your most important queues, ready to open as filtered views.
            </p>
          </div>

          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {worklists.map((list, idx) => (
              <div
                key={idx}
                className="group relative overflow-hidden bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <div
                  className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${list.color}`}
                />
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-900">
                    {list.title}
                  </h4>
                  <div className="text-3xl font-black text-gray-900">
                    {list.count}
                  </div>
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    {list.action}
                    <span>→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
