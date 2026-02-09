import {
  AlertCircle,
  FileWarning,
  Clock,
  CheckCircle,
  DollarSign,
} from "lucide-react";
import FullscreenLoader from "../../../components/ui/FullScreenLoader";
type Props = {
  loading: boolean;
  range: "today" | "last7days" | "last30days";

}

export default function RenewalsDashboard({loading}: Props) {
 
    if (loading) {
      return (
        <FullscreenLoader />
      );
    }
  /* ============================
      STATIC KPI DATA
  ============================ */
  const kpiCards = [
    {
      label: "Document Created",
      value: 0,
      status: "+ today",
      icon: CheckCircle,
      iconColor: "text-emerald-500",
      trend: "+",
    },
    {
      label: "Documents Updated",
      value: 0,
      status: "vs yesterday",
      icon: Clock,
      iconColor: "text-gray-500",
      trend: "-",
    },
    {
      label: "Document Classification",
      value: 0,
      status: "Pending",
      icon: FileWarning,
      iconColor: "text-orange-500",
      trend: "+",
    },
    {
      label: "Documents Completed",
      value: 8,
      status: "Processed",
      icon: CheckCircle,
      iconColor: "text-emerald-600",
      trend: "+",
    },
    {
      label: "Document Escalated",
      value: 25,
      status: "Attention",
      icon: AlertCircle,
      iconColor: "text-red-500",
      trend: "+",
    },
    {
      label: "Document Extracted",
      value: 0,
      status: "Automation",
      icon: DollarSign,
      iconColor: "text-purple-500",
      trend: "-",
    },
  ];

  /* ============================
      RECENT ACTIVITY / SIGNALS
  ============================ */
  const alerts = [
    {
      type: "Renewal_Addendum.pdf",
      message: "Pricing deviation — +22% vs policy band",
      severity: "border-red-500",
      time: "2 min ago",
    },
    {
      type: "MSA_Acme_v2.docx",
      message: "Liability cap changed — 1x → 3x ARR",
      severity: "border-orange-400",
      time: "12 min ago",
    },
    {
      type: "Proposal_Acme_Q4.docx",
      message: "Draft ready — Generated via archetype engine",
      severity: "border-emerald-400",
      time: "40 min ago",
    },
  ];

  /* ============================
      WORKLISTS / ATTENTION
  ============================ */
  const worklists = [
    {
      title: "High-Risk Redlines",
      count: 12,
      action: "Liability, SLA & pricing edits",
      color: "from-red-500 to-red-600",
    },
    {
      title: "Missing Fields",
      count: 7,
      action: "CDoc conversion blocked",
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Processing Errors",
      count: 3,
      action: "OCR or parsing failed",
      color: "from-orange-500 to-orange-600",
    },
    {
      title: "Critical Signals",
      count: 5,
      action: "Renewal deadlines & SLA risks",
      color: "from-purple-500 to-purple-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* ================= KPI CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
        {kpiCards.map((kpi, idx) => {
          const Icon = kpi.icon;

          return (
            <div
              key={idx}
              className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 py-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent opacity-0 group-hover:opacity-100 transition" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gray-50 border border-gray-100">
                    <Icon size={18} className={kpi.iconColor} />
                  </div>
                  <span className="text-xs font-semibold text-gray-500">
                    {kpi.label}
                  </span>
                </div>

                <span
                  className={`text-xs font-semibold ${
                    kpi.trend === "+" ? "text-emerald-600" : "text-red-500"
                  }`}
                >
                  {kpi.trend}
                </span>
              </div>

              <div className="mt-4 text-2xl font-bold text-gray-900">
                {kpi.value}
              </div>

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

      {/* ================= ALERTS + WORKLISTS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ===== RECENT ACTIVITY ===== */}
        <div className="bg-white rounded-2xl border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Activity & Signals
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Live updates from ingestion, profiling, analysis.
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
                  <span className="text-xs text-gray-400">{alert.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== DOCUMENTS REQUIRING ATTENTION ===== */}
        <div className="bg-white rounded-2xl border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-900">
              Documents Requiring Attention
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Auto-detected blockers & risks.
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
