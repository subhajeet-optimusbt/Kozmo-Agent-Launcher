import { FileText, AlertTriangle } from "lucide-react";
import {
  FilePlus,
  FileEdit,
  Tags,
  CheckCircle2,
  FileSearch,
} from "lucide-react";

/* ================= TYPES ================= */

export type DocumentDashboardResponse = {
  createdDocsInRange: number;
  updatedDocsInRange: number;
  docsclassification: number;
  docscompleted: number;
  docsescalation: number;
  docextraction: number;
};

type Props = {
  data: DocumentDashboardResponse | null;
  loading: boolean;
  range: "today" | "last7days" | "last30days";
};

/* ================= COMPONENT ================= */

export default function DocumentDashboard({
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
        No document dashboard data available
      </div>
    );
  }

  /* ================= KPI MAPPING ================= */

  const kpiCards = [
    {
      label: "Document Created",
      value: data.createdDocsInRange,
      trend: "In range",
      trendType: "up",
      icon: FilePlus,
      iconColor: "text-blue-600",
    },
    {
      label: "Documents Updated",
      value: data.updatedDocsInRange,
      trend: "In range",
      trendType: "neutral",
      icon: FileEdit,
      iconColor: "text-indigo-600",
    },
    {
      label: "Document Classification",
      value: data.docsclassification,
      trend: "Pending",
      trendType: "neutral",
      icon: Tags,
      iconColor: "text-yellow-600",
    },
    {
      label: "Documents Completed",
      value: data.docscompleted,
      trend: "Processed",
      trendType: "up",
      icon: CheckCircle2,
      iconColor: "text-green-600",
    },
    {
      label: "Document Escalated",
      value: data.docsescalation,
      trend: "Attention",
      trendType: "down",
      icon: AlertTriangle,
      iconColor: "text-red-600",
    },
    {
      label: "Document Extracted",
      value: data.docextraction,
      trend: "Automation",
      trendType: "neutral",
      icon: FileSearch,
      iconColor: "text-purple-600",
    },
  ];

  /* ================= STATIC SECTIONS (UNCHANGED) ================= */

  const alerts = [
    {
      title: "Renewal_Addendum.pdf",
      highlight: "Pricing deviation",
      sub: "+22% vs policy band",
      time: "2 min ago",
    },
    {
      title: "MSA_Acme_v2.docx",
      highlight: "Liability cap changed",
      sub: "1x → 3x ARR",
      time: "12 min ago",
    },
    {
      title: "Proposal_Acme_Q4.docx",
      highlight: "Draft ready",
      sub: "Generated via archetype engine",
      time: "40 min ago",
    },
  ];

  const worklists = [
    {
      title: "High-Risk Redlines",
      count: data.docsescalation,
      action: "Liability, SLA & pricing edits",
    },
    {
      title: "Missing Fields",
      count: 0,
      action: "CDoc conversion blocked",
    },
    {
      title: "Processing Errors",
      count: 0,
      action: "OCR or parsing failed",
    },
    {
      title: "Critical Signals",
      count: 0,
      action: "Renewal deadlines & SLA risks",
    },
  ];

  /* ================= RENDER ================= */

  return (
    <div className="space-y-8">
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

      {/* ================= LOWER SECTION ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RECENT ACTIVITY */}
        <div className="bg-white rounded-2xl border border-gray-200">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-semibold">
              Recent Activity & Signals
            </h3>
            <p className="text-sm text-gray-500">
              Live updates from ingestion, profiling, analysis.
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

                <span className="text-xs text-gray-400 whitespace-nowrap">
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
              Documents Requiring Attention
            </h3>
            <p className="text-sm text-gray-500">
              Auto-detected blockers & risks.
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
