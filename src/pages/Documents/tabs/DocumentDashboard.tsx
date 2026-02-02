import { FileText, AlertTriangle } from "lucide-react";
import {
  FilePlus,
  FileEdit,
  Tags,
  CheckCircle2,
  FileSearch,
} from "lucide-react";

export default function DocumentDashboard() {
const kpiCards = [
  {
    label: "Document Created",
    value: 0,
    trend: "+ today",
    trendType: "up",
    icon: FilePlus,
    iconColor: "text-blue-600",
  },
  {
    label: "Documents Updated",
    value: 0,
    trend: "vs yesterday",
    icon: FileEdit,
    iconColor: "text-indigo-600",
  },
  {
    label: "Document Classification",
    value: 0,
    trend: "Pending",
    icon: Tags,
    iconColor: "text-yellow-600",
  },
  {
    label: "Documents Completed",
    value: 8,
    trend: "Processed",
    icon: CheckCircle2,
    iconColor: "text-green-600",
  },
  {
    label: "Document Escalated",
    value: 25,
    trend: "Attention",
    danger: true,
    icon: AlertTriangle,
    iconColor: "text-red-600",
  },
  {
    label: "Document Extracted",
    value: 0,
    trend: "Automation",
    icon: FileSearch,
    iconColor: "text-purple-600",
  },
];

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
      count: 12,
      action: "Liability, SLA & pricing edits",
    },
    {
      title: "Missing Fields",
      count: 7,
      action: "CDoc conversion blocked",
    },
    {
      title: "Processing Errors",
      count: 3,
      action: "OCR or parsing failed",
    },
    {
      title: "Critical Signals",
      count: 5,
      action: "Renewal deadlines & SLA risks",
    },
  ];

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

                {/* Trend Badge */}
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
        {/* ===== RECENT ACTIVITY ===== */}
        <div className="bg-white rounded-2xl border border-gray-200">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-semibold">Recent Activity & Signals</h3>
            <p className="text-sm text-gray-500">
              Live updates from ingestion, profiling, analysis.
            </p>
          </div>

          <div className="p-6 space-y-5">
            {alerts.map((item, idx) => (
              <div key={idx} className="flex gap-4 items-start">
                <div className="mt-1">
                  <FileText size={18} className="text-indigo-500" />
                </div>

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

        {/* ===== DOCUMENTS REQUIRING ATTENTION ===== */}
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

                <p className="text-xs text-gray-500 mt-1">{list.action}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
