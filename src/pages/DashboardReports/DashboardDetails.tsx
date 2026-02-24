/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import WidgetRenderer from "./WidgetRenderer";
import { baseUrl } from "../../utils/baseUrl";
import { getActiveAccountId } from "../../utils/auth";
import FullscreenLoader from "../../components/ui/FullScreenLoader";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  ArrowLeft,
  Download,
  FileText,
  Printer,
  Clock,
  LayoutDashboard,
} from "lucide-react";
const DashboardDetails = () => {
  const { dashboardId } = useParams();
  const navigate = useNavigate();
  const accountId = getActiveAccountId();

  const [dashboard, setDashboard] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!dashboardId || !accountId) return;

    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${baseUrl()}/api/Dashboard/${accountId}/widgets/${dashboardId}`,
          { credentials: "include" },
        );

        const text = await res.text();

        if (!res.ok) {
          console.error("API ERROR:", text);
          throw new Error("Failed to load dashboard");
        }

        const json = JSON.parse(text);
        setDashboard(json);
        setError(null);
      } catch (err) {
        console.error("Dashboard fetch failed:", err);
        setError("Unable to load dashboard");
      } finally {
        setLoading(false);
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

  if (loading || !dashboard) {
    return <FullscreenLoader />;
  }

  // Calculate responsive grid layout
  const getGridLayout = (widgets: any[]) => {
    return widgets.map((widget) => {
      const { chartType } = widget;

      if (chartType === "KPI" || chartType === "Gauge") {
        return { ...widget, colSpan: 3, rowSpan: 1, priority: "high" };
      } else if (chartType === "Table" || chartType === "Timeline") {
        return { ...widget, colSpan: 12, rowSpan: 2, priority: "medium" };
      } else if (
        chartType === "StackedBar" ||
        chartType === "Bar" ||
        chartType === "HorizontalBar"
      ) {
        return { ...widget, colSpan: 6, rowSpan: 2, priority: "medium" };
      } else if (
        chartType === "Pie" ||
        chartType === "Donut" ||
        chartType === "Line" ||
        chartType === "Gauge"
      ) {
        return { ...widget, colSpan: 4, rowSpan: 1, priority: "high" };
      } else {
        return { ...widget, colSpan: 6, rowSpan: 1, priority: "low" };
      }
    });
  };

  const layoutWidgets = getGridLayout(dashboard.widgets);

  // Organize widgets by priority to minimize scrolling
  const priorityOrder = {
    high: 0,
    medium: 1,
    low: 2,
  };

  const sortedWidgets = [...layoutWidgets].sort(
    (a, b) =>
      priorityOrder[a.priority as keyof typeof priorityOrder] -
      priorityOrder[b.priority as keyof typeof priorityOrder],
  );

  const normalizeWidgetData = (widget: any) => {
    const { data } = widget;

    if (!data) return [];

    // KPI / Gauge
    if (typeof data === "number") {
      return [{ Value: data }];
    }

    // Array data (Table, Timeline, Line etc.)
    if (Array.isArray(data)) {
      return data;
    }

    // Object data (Pie, Bar, Donut)
    if (typeof data === "object") {
      return Object.entries(data).map(([key, value]) => ({
        Name: key,
        Value: value,
      }));
    }

    return [];
  };
  const handleExcel = () => {
    if (!dashboard?.widgets?.length) return;

    const workbook = XLSX.utils.book_new();

    dashboard.widgets.forEach((widget: any, index: number) => {
      const rows = normalizeWidgetData(widget);

      if (!rows.length) return;

      const worksheet = XLSX.utils.json_to_sheet(rows);
      const sheetName =
        widget.widgetName?.substring(0, 30) || `Widget_${index + 1}`;

      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    });

    XLSX.writeFile(
      workbook,
      `${dashboard.dashboardName.replace(/\s+/g, "_")}.xlsx`,
    );
  };
  const handlePdf = () => {
    if (!dashboard?.widgets?.length) return;

    const doc = new jsPDF("landscape");

    dashboard.widgets.forEach((widget: any, index: number) => {
      const rows = normalizeWidgetData(widget);

      if (!rows.length) return;

      const headers = Object.keys(rows[0]);

      const body = rows.map((row: any) =>
        headers.map((h) => String(row[h] ?? "")),
      );

      if (index !== 0) {
        doc.addPage();
      }

      doc.setFontSize(12);
      doc.text(`${widget.widgetName} (${widget.chartType})`, 14, 14);

      autoTable(doc, {
        startY: 20,
        head: [headers],
        body,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [22, 163, 74] }, // emerald
      });
    });

    doc.save(`${dashboard.dashboardName.replace(/\s+/g, "_")}.pdf`);
  };
  const handlePrint = () => {
    window.print();
  };
  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col overflow-hidden">
      {/* ===== Compact Header ===== */}
      <div className="bg-white/70 backdrop-blur border-b border-slate-200 shadow-sm">
        <div className="px-6 py-4 flex items-center justify-between gap-4">
          {/* ================= LEFT: Dashboard context ================= */}
          <div className="flex items-start gap-3 min-w-0">
            {/* Icon */}
            <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <LayoutDashboard size={18} />
            </div>

            {/* Title + meta */}
            <div className="min-w-0 flex flex-col">
              <h1 className="text-base font-semibold text-slate-900 truncate">
                {dashboard.dashboardName}
              </h1>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Clock size={12} />
                <span>
                  Updated {new Date(dashboard.generatedAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* ================= RIGHT: Actions ================= */}
          <div className="flex items-center gap-3">
            {/* Export group */}
            <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
                 <button
                  onClick={handleExcel}
                  className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
     text-gray-700 hover:text-emerald-700 hover:bg-white"
      `}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Excel</span>
                </button>

               <button
                  onClick={handlePdf}
                  className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
       text-gray-700 hover:text-emerald-700 hover:bg-white"
         "
      `}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>PDF</span>
                </button>


           <button
                  onClick={handlePrint}
                  className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
     text-gray-700 hover:text-emerald-700 hover:bg-white"
        
      `}
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
            </div>

            {/* Back */}
            <button
              onClick={() => navigate("/dashboard-reports")}
              className="group flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium text-gray-600 hover:text-emerald-600 bg-gray-50/50 hover:bg-emerald-50 border border-gray-200/60 hover:border-emerald-200 transition-all duration-200 hover:shadow-sm"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
              <span>Back</span>
            </button>
          </div>
        </div>
      </div>

      {/* ===== Optimized Widgets Grid ===== */}
      <div className="flex-1 overflow-auto p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-max">
          {sortedWidgets.map((widget: any) => {
            const { chartType } = widget;

            // Responsive column span calculation
            let responsiveColSpan = "sm:col-span-1 lg:col-span-1 xl:col-span-1";

            if (chartType === "KPI" || chartType === "Gauge") {
              responsiveColSpan = "sm:col-span-1 lg:col-span-1 xl:col-span-1";
            } else if (chartType === "Table" || chartType === "Timeline") {
              responsiveColSpan = "sm:col-span-2 lg:col-span-3 xl:col-span-4";
            } else if (
              chartType === "StackedBar" ||
              chartType === "Bar" ||
              chartType === "HorizontalBar"
            ) {
              responsiveColSpan = "sm:col-span-2 lg:col-span-2 xl:col-span-2";
            } else if (
              chartType === "Pie" ||
              chartType === "Donut" ||
              chartType === "Line"
            ) {
              responsiveColSpan = "sm:col-span-1 lg:col-span-2 xl:col-span-1";
            }

            return (
              <div
                key={widget.widgetId}
                className={`transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${responsiveColSpan}`}
              >
                <WidgetRenderer widget={widget} />
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {sortedWidgets.length === 0 && (
          <div className="h-96 flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-500 text-lg font-medium">
                No widgets available
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardDetails;
