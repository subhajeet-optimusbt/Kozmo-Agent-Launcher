/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  FileText,
  Folder,
  Activity,
  ArrowLeft,
  Download,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

import { baseUrl } from "../../utils/baseUrl";
import { getActiveAccountId } from "../../utils/auth";
import FullscreenLoader from "../../components/ui/FullScreenLoader";

const SECTIONSINTAKE = [
  { key: "overview", label: "Overview", icon: FileText },

  {
    key: "files",
    label: "Files",
    icon: Folder,
    visible: (data: any[]) => data?.length > 0,
  },

  {
    key: "history",
    label: "History",
    icon: Activity,
    always: true,
  },
];

export default function IntakeDetailsPage() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const overview = location.state?.overview;
  const tenantId = getActiveAccountId();

  const [active, setActive] = useState("files");
  const [files, setFiles] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- FILES API ---------------- */
  useEffect(() => {
    if (!requestId) return;

    const fetchFiles = async () => {
      const res = await fetch(
        `${baseUrl()}/api/Intake/${tenantId}/RequestFile?requestId=${requestId}`,
        { credentials: "include" },
      );

      const json = await res.json();
      setFiles(json || []);
    };

    fetchFiles();
  }, [requestId, tenantId]);

  /* ---------------- HISTORY API ---------------- */
  useEffect(() => {
    if (!requestId) return;

    const fetchHistory = async () => {
      const res = await fetch(
        `${baseUrl()}/api/Intake/${tenantId}/ActivityLog?requestId=${requestId}`,
        { credentials: "include" },
      );

      const json = await res.json();
      setHistory(json || []);
      setLoading(false);
    };

    fetchHistory();
  }, [requestId, tenantId]);

  if (loading) return <FullscreenLoader />;

  return (
    <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
      {/* Top Gradient Accent */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

      <div className="px-8 py-8 flex gap-8">
        {/* ================= SIDEBAR ================= */}
        <aside className="w-80 shrink-0">
          <div className="sticky top-6">
            <div className="bg-gradient-to-br from-white to-gray-50/60 rounded-2xl border border-gray-200 p-5 space-y-2 shadow-lg">
              <h3 className="text-xs font-bold uppercase tracking-wider mb-4 text-gray-500 flex items-center gap-2">
                <div className="w-1 h-4 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
                Navigation
              </h3>

              {SECTIONSINTAKE.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActive(key)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200
                ${
                  active === key
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                    : "hover:bg-gray-50 text-gray-700 hover:shadow"
                }`}
                >
                  <Icon size={16} />
                  <span className="font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* ================= CONTENT ================= */}
        <main className="flex-1 space-y-4 min-w-0">
          {/* Header Card */}
          <div className="bg-gradient-to-br from-white to-gray-50/60 rounded-2xl border border-gray-200 shadow-lg">
            <div className="px-8 py-6 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <FileText className="text-white" size={26} />
                </div>

                <div>
                  <h1 className="text-xl font-bold text-gray-800">
                    Intake Request Details
                  </h1>
                  <p className="text-sm text-gray-500">
                    Request overview, files & activity history
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
              text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100"
              >
                <ArrowLeft size={16} />
                Back
              </button>
            </div>
          </div>

          {/* Section Content Card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
            <div className="p-6">
              {active === "overview" && (
                <>
                  {!overview && (
                    <div className="text-sm text-gray-500 text-center py-10">
                      Overview data not available.
                    </div>
                  )}

                  {overview && (
                    <div className="space-y-6">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div>
                          <h2 className="text-xl font-bold text-gray-900">
                            {overview.subject}
                          </h2>
                          <p className="text-sm text-gray-500 mt-1">
                            Intake overview
                          </p>
                        </div>

                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          {overview.Status}
                        </span>
                      </div>

                      {/* Info Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        <OverviewItem
                          label="Current Job Name"
                          value={overview.currentJobName}
                        />
                        <OverviewItem
                          label="No Of Documents"
                          value={overview.noOfDocuments}
                        />
                        <OverviewItem
                          label="Created"
                          value={overview.created}
                        />
                        <OverviewItem
                          label="Modified"
                          value={overview.modified}
                        />
                      </div>

                      {/* Hint */}
                      <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 text-sm text-gray-600">
                        View obligations, clauses, milestones, documents, and
                        pricing terms inside the full contract workspace.
                      </div>
                    </div>
                  )}
                </>
              )}

              {active === "files" && <IntakeFiles items={files} />}

              {active === "history" && <IntakeHistory items={history} />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function OverviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-gray-400 mb-1">
        {label}
      </div>
      <div className="text-sm font-semibold text-gray-900">{value || "—"}</div>
    </div>
  );
}
export function IntakeFiles({ items }: { items: any[] }) {
  return (
    <div className="bg-white rounded-2xl border shadow-sm p-6">
      {/* Header */}
      <h2 className="text-lg font-ssemibold mb-6 flex items-center gap-2">
        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
          <FileText size={18} />
        </div>
        Files ({items.length})
      </h2>

      {items.length === 0 && (
        <p className="text-sm text-gray-500">No files uploaded.</p>
      )}

      <div className="space-y-4">
        {items.map((f, i) => (
          <div
            key={i}
            className="border rounded-xl p-4 bg-gray-50 hover:shadow transition"
          >
            <div className="flex justify-between items-start">
              {/* Left */}
              <div>
                <p className="font-semibold text-gray-800">{f.fileName}</p>

                <p className="text-xs text-gray-500 mt-1">
                  {f.documentType} • {f.contractType}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  {f.companyName} ↔ {f.counterparty}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <a
                  href={f.fileUrl}
                  target="_blank"
                  className="p-2 rounded-lg border hover:bg-white"
                >
                  <Eye size={16} />
                </a>

                <a
                  href={f.fileUrl}
                  download
                  className="p-2 rounded-lg border hover:bg-white"
                >
                  <Download size={16} />
                </a>
              </div>
            </div>

            {/* Footer Meta */}
            <div className="flex gap-4 mt-3 text-xs text-gray-500">
              <span>Status: {f.status}</span>
              <span>Stage: {f.stage}</span>
              <span>Source: {f.source}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function IntakeHistory({ items }: { items: any[] }) {
  return (
    <div className="bg-white rounded-2xl border shadow-sm p-6">
      {/* Header */}
      <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
          <Activity size={18} />
        </div>
        History ({items.length})
      </h2>

      {items.length === 0 && (
        <p className="text-sm text-gray-500">No history available.</p>
      )}

      <div className="space-y-4 border-l pl-6">
        {items.map((h, i) => (
          <div key={i} className="relative">
            {/* Dot */}
            <div className="absolute -left-[9px] top-1 w-4 h-4 bg-blue-500 rounded-full" />

            <div className="border rounded-xl p-4 bg-gray-50">
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold text-gray-800">{h.action}</p>

                  <p className="text-sm text-gray-600 mt-1">{h.details}</p>

                  <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                    <Clock size={14} />
                    {h.timestamp}
                  </p>
                </div>

                <StatusBadge status={h.status} />
              </div>

              <div className="text-xs text-gray-400 mt-3">
                Document ID: {h.documentId}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "Success") {
    return (
      <span className="flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-lg bg-green-100 text-green-700">
        <CheckCircle size={14} />
        Success
      </span>
    );
  }

  return (
    <span className="flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-lg bg-red-100 text-red-700">
      <XCircle size={14} />
      Failed
    </span>
  );
}
