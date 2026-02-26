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
        if (!res.ok) throw new Error("Failed to load dashboard");
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
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f8fafc",
          color: "#dc2626",
          fontFamily: "'Inter', sans-serif",
          fontSize: "15px",
        }}
      >
        {error}
      </div>
    );
  }

  if (loading || !dashboard) return <FullscreenLoader />;

  const getGridLayout = (widgets: any[]) =>
    widgets.map((widget) => {
      const { chartType } = widget;
      if (chartType === "KPI" || chartType === "Gauge")
        return { ...widget, priority: "high" };
      if (chartType === "Table" || chartType === "Timeline")
        return { ...widget, priority: "medium" };
      if (
        chartType === "StackedBar" ||
        chartType === "Bar" ||
        chartType === "HorizontalBar"
      )
        return { ...widget, priority: "medium" };
      if (chartType === "Pie" || chartType === "Donut" || chartType === "Line")
        return { ...widget, priority: "high" };
      return { ...widget, priority: "low" };
    });

  const priorityOrder = { high: 0, medium: 1, low: 2 };
  const sortedWidgets = [...getGridLayout(dashboard.widgets)].sort(
    (a, b) =>
      priorityOrder[a.priority as keyof typeof priorityOrder] -
      priorityOrder[b.priority as keyof typeof priorityOrder],
  );

  const normalizeWidgetData = (widget: any) => {
    const { data } = widget;
    if (!data) return [];
    if (typeof data === "number") return [{ Value: data }];
    if (Array.isArray(data)) return data;
    if (typeof data === "object")
      return Object.entries(data).map(([key, value]) => ({
        Name: key,
        Value: value,
      }));
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
      if (index !== 0) doc.addPage();
      doc.setFontSize(12);
      doc.text(`${widget.widgetName} (${widget.chartType})`, 14, 14);
      autoTable(doc, {
        startY: 20,
        head: [headers],
        body,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [13, 148, 136] }, // teal
      });
    });
    doc.save(`${dashboard.dashboardName.replace(/\s+/g, "_")}.pdf`);
  };

  const handlePrint = () => window.print();

  /* ======= Inline button hover handler ======= */
  const makeBtnHover = (
    hoverBg: string,
    hoverColor: string,
    hoverBorder: string,
  ) => ({
    onMouseEnter: (e: React.MouseEvent<HTMLButtonElement>) => {
      e.currentTarget.style.background = hoverBg;
      e.currentTarget.style.color = hoverColor;
      e.currentTarget.style.borderColor = hoverBorder;
    },
    onMouseLeave: (e: React.MouseEvent<HTMLButtonElement>) => {
      e.currentTarget.style.background = "transparent";
      e.currentTarget.style.color = "#64748b";
      e.currentTarget.style.borderColor = "#e2e8f0";
    },
  });

  return (
    <div
      style={{
        height: "100vh",
        background: "#f8fafc",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        fontFamily: "'Inter', 'DM Sans', sans-serif",
      }}
    >
      {/* ===== Header ===== */}
      <div
        style={{
          background: "#ffffff",
          borderBottom: "1px solid #e2e8f0",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          padding: "12px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
        }}
      >
        {/* Left: Icon + title */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            minWidth: 0,
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #0d9488, #14b8a6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 8px rgba(13,148,136,0.3)",
              flexShrink: 0,
            }}
          >
            <LayoutDashboard size={16} color="#ffffff" />
          </div>

          <div style={{ minWidth: 0 }}>
            <h1
              style={{
                fontSize: "15px",
                fontWeight: 700,
                color: "#0f172a",
                margin: 0,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {dashboard.dashboardName}
            </h1>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                marginTop: "2px",
              }}
            >
              <Clock size={10} color="#94a3b8" />
              <span style={{ fontSize: "11px", color: "#94a3b8" }}>
                Updated {new Date(dashboard.generatedAt).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* Export group */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "2px",
              background: "#f8fafc",
              borderRadius: "10px",
              padding: "3px",
              border: "1px solid #e2e8f0",
            }}
          >
            {[
              {
                label: "Excel",
                icon: <Download size={13} />,
                action: handleExcel,
              },
              { label: "PDF", icon: <FileText size={13} />, action: handlePdf },
              {
                label: "Print",
                icon: <Printer size={13} />,
                action: handlePrint,
              },
            ].map(({ label, icon, action }) => (
              <button
                key={label}
                onClick={action}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  padding: "6px 12px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                  border: "1px solid #e2e8f0",
                  background: "transparent",
                  color: "#64748b",
                  transition: "all 0.15s ease",
                  fontFamily: "'Inter', sans-serif",
                }}
                {...makeBtnHover("#f0fdfa", "#0d9488", "#99f6e4")}
              >
                {icon}
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Back button */}
          <button
            onClick={() => navigate("/dashboard-reports")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "7px 14px",
              borderRadius: "10px",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              border: "1px solid #e2e8f0",
              background: "#f8fafc",
              color: "#64748b",
              transition: "all 0.15s ease",
              fontFamily: "'Inter', sans-serif",
            }}
            {...makeBtnHover("#f0fdfa", "#0d9488", "#99f6e4")}
          >
            <ArrowLeft size={14} />
            <span>Back</span>
          </button>
        </div>
      </div>

      {/* ===== Widgets Grid ===== */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(20rem, 1fr))",
            gap: "2rem",
            alignItems: "start",
          }}
        >
          {sortedWidgets.map((widget: any) => {
            const { chartType } = widget;
            let gridColumn = "span 1";

            if (chartType === "Table" || chartType === "Timeline") {
              gridColumn = "1 / -1";
            } else if (
              chartType === "Bar" ||
              chartType === "HorizontalBar" ||
              chartType === "StackedBar"
            ) {
              gridColumn = "span 2";
            }

            return (
              <div
                key={widget.widgetId}
                style={{
                  gridColumn,
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform =
                    "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform =
                    "translateY(0)";
                }}
              >
                <WidgetRenderer widget={widget} />
              </div>
            );
          })}
        </div>

        {sortedWidgets.length === 0 && (
          <div
            style={{
              height: "300px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#94a3b8",
              fontSize: "15px",
            }}
          >
            No widgets available
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardDetails;
