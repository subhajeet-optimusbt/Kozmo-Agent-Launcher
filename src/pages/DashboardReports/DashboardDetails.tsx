/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import WidgetRenderer from "./WidgetRenderer";
import { baseUrl } from "../../utils/baseUrl";
import { getActiveAccountId } from "../../utils/auth";

const DASHBOARD_THEME: Record<string, string> = {
  D001: "from-indigo-500 to-indigo-600",
  D002: "from-emerald-500 to-emerald-600",
  D003: "from-sky-500 to-sky-600",
  D004: "from-amber-500 to-amber-600",
  D005: "from-rose-500 to-rose-600",
  D006: "from-purple-500 to-purple-600",
  D007: "from-slate-500 to-slate-600"
};
const DashboardDetails = () => {
  const { dashboardId } = useParams();
  const navigate = useNavigate();
  const accountId = getActiveAccountId();

  const [dashboard, setDashboard] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!dashboardId || !accountId) return;

    const fetchDashboard = async () => {
      try {
        const res = await fetch(
          `${baseUrl()}/api/Dashboard/${accountId}/widgets/${dashboardId}`,
          { credentials: "include" }
        );

        const text = await res.text();

        if (!res.ok) {
          console.error("API ERROR:", text);
          throw new Error("Failed to load dashboard");
        }

        const json = JSON.parse(text);
        setDashboard(json);
      } catch (err) {
        console.error("Dashboard fetch failed:", err);
        setError("Unable to load dashboard");
      }
    };

    fetchDashboard();
  }, [dashboardId, accountId]);

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-400">
        Loading dashboard…
      </div>
    );
  }

  const theme =
    DASHBOARD_THEME[dashboardId || ""] ||
    "from-slate-500 to-slate-600";
   return (
    <div className="h-screen bg-slate-100 flex flex-col overflow-hidden">
      {/* ===== Hero Header ===== */}
      <div className={`bg-gradient-to-r ${theme} text-white`}>
        <div className="px-6 py-6 flex items-center gap-4">
          <button onClick={() => navigate("/dashboard-reports")}>
            <ArrowLeft />
          </button>
          <div>
            <h1 className="text-xl font-bold">
              {dashboard.dashboardName}
            </h1>
            <p className="text-sm opacity-80">
              Last updated {new Date(dashboard.generatedAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* ===== Widgets ===== */}
      <div className="flex-1 overflow-auto p-6 grid grid-cols-12 gap-6 auto-rows-[220px]">
        {dashboard.widgets.map((widget: any) => (
          <div
            key={widget.widgetId}
            className={`transition-all hover:-translate-y-1 hover:shadow-xl
              ${
                widget.chartType === "KPI" || widget.chartType === "Gauge"
                  ? "col-span-3"
                  : widget.chartType === "Table"
                  ? "col-span-12"
                  : "col-span-6"
              }`}
          >
            <WidgetRenderer widget={widget} theme={theme} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardDetails;
