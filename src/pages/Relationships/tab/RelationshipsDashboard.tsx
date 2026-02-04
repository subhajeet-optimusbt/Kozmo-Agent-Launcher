// tabs/RelationshipsDashboard.tsx
import {
  Users,
  UserPlus,
  ShieldAlert,
  FileText,
  AlertTriangle,
} from "lucide-react";

import type { RelationshipsDashboardResponse } from "../../../services/RelationshipsService";

type Props = {
  data: RelationshipsDashboardResponse | null;
  loading: boolean;
};

export default function RelationshipsDashboard({
  data,
  loading,
}: Props) {
  if (loading) {
    return (
      <div className="py-10 text-sm text-gray-500">
        Loading relationships dashboard…
      </div>
    );
  }

  if (!data) {
    return (
      <div className="py-10 text-sm text-gray-400">
        No relationships dashboard data available
      </div>
    );
  }

  /* ================= KPI CARDS ================= */

  const kpiCards = [
    {
      label: "Active Counterparties",
      value: data.activeCounterparties,
      trend: "Active",
      trendType: "up",
      icon: Users,
      iconColor: "text-emerald-600",
    },
    {
      label: "New Counterparties",
      value: data.newCounterparties,
      trend: "Added",
      trendType: "up",
      icon: UserPlus,
      iconColor: "text-blue-600",
    },
    {
      label: "High Risk Counterparties",
      value: data.highRiskCounterparties,
      trend: "Attention",
      trendType: "down",
      icon: ShieldAlert,
      iconColor: "text-red-600",
    },
  ];

  /* ================= STATIC SECTIONS ================= */

  const alerts = [
    {
      title: "Acme Corp",
      highlight: "Risk score increased",
      sub: "Financial exposure detected",
      time: "5 min ago",
    },
    {
      title: "Globex Ltd",
      highlight: "New relationship created",
      sub: "Pending due diligence",
      time: "18 min ago",
    },
  ];

  const worklists = [
    {
      title: "High Risk Counterparties",
      count: data.highRiskCounterparties,
      action: "Immediate compliance review",
    },
    {
      title: "Pending Onboarding",
      count: data.newCounterparties,
      action: "KYC & profiling incomplete",
    },
  ];

  return (
    <div className="space-y-8">
      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {kpiCards.map((kpi, idx) => {
          const Icon = kpi.icon;

          return (
            <div
              key={idx}
              className="group relative rounded-2xl border border-gray-200 bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-12px_rgba(0,0,0,0.15)]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-100 bg-gray-50">
                  <Icon size={18} className={kpi.iconColor} />
                </div>
                <p className="text-sm font-semibold text-gray-500">
                  {kpi.label}
                </p>
              </div>

              <div className="mt-4 flex items-end justify-between">
                <span className="text-3xl font-bold text-gray-900">
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

      {/* LOWER SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ACTIVITY */}
        <div className="bg-white rounded-2xl border border-gray-200">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-semibold">
              Recent Relationship Signals
            </h3>
            <p className="text-sm text-gray-500">
              Risk, onboarding & monitoring updates.
            </p>
          </div>

          <div className="p-6 space-y-5">
            {alerts.map((item, idx) => (
              <div key={idx} className="flex gap-4 items-start">
                <FileText size={18} className="text-indigo-500 mt-1" />
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{item.title}</span> —{" "}
                    <span className="font-semibold">{item.highlight}</span>
                  </p>
                  <p className="text-xs text-gray-500">{item.sub}</p>
                </div>
                <span className="text-xs text-gray-400">
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* WORKLISTS */}
        <div className="bg-white rounded-2xl border border-gray-200">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-semibold">
              Relationships Requiring Attention
            </h3>
            <p className="text-sm text-gray-500">
              Compliance & risk blockers.
            </p>
          </div>

          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {worklists.map((list, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-gray-200 p-4 hover:shadow-md transition"
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle size={16} className="text-amber-500" />
                  <h4 className="text-sm font-semibold text-gray-900">
                    {list.title}
                  </h4>
                </div>

                <div className="text-3xl font-bold text-gray-900 mt-3">
                  {list.count}
                </div>

                <p className="text-xs text-gray-500 mt-1">
                  {list.action}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
