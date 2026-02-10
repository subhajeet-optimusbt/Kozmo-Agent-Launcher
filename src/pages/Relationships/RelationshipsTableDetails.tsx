/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Folder, ArrowLeft } from "lucide-react";

/* ================= STATIC NAV SECTIONS ================= */
const SECTIONSINTAKE = [
  { key: "overview", label: "Overview", icon: FileText },
  { key: "contracts", label: "Contracts", icon: Folder },
];

/* ================= STATIC PAGE ================= */
export default function RelationshipsDetailsPage() {
  const navigate = useNavigate();
  const [active, setActive] = useState<"overview" | "contracts">("overview");

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
                  onClick={() => setActive(key as any)}
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
                    Relationships Request Details
                  </h1>
                  <p className="text-sm text-gray-500">
                    Request overview, contracts & activity
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

          {/* ================= SECTION CONTENT ================= */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
            <div className="p-6">
              {active === "overview" && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Overview
                  </h2>
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
                    This is a static overview section. API data, metadata, and
                    relationships summary will be added later.
                  </div>
                </div>
              )}

              {active === "contracts" && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Contracts
                  </h2>
                  <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-sm text-gray-500 text-center">
                    No contracts connected yet. Contract integration will be
                    added later.
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
