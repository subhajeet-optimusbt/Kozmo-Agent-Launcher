/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  FileText,
  Printer,
  Settings2,
  Filter,
  Star,
  RotateCcw,
  Check,
  ArrowUpDown,
  X,
  ChevronDown,
} from "lucide-react";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ─── Types ────────────────────────────────────────────────────────────────────
type FilterValues = Record<string, string>;
type SavedFilter = { name: string; filters: FilterValues };

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatColumnLabel = (key: string): string =>
  key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();

const isNumericKey = (key: string) =>
  ["value", "score", "percent", "days", "amount", "criticality"].some((k) =>
    key.toLowerCase().includes(k),
  );

const isDateKey = (key: string) =>
  key.toLowerCase().includes("date") || key.toLowerCase().includes("at");

const EXCLUDED_KEYS = ["partitionKey", "rowKey", "timestamp", "eTag"];
const FILTERABLE_TYPES = [
  "status",
  "type",
  "businessArea",
  "termType",
  "stage",
  "renewable",
];
const MAX_EXPORT_COLUMNS = 8;

// ─── Component ────────────────────────────────────────────────────────────────
export default function ReportDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const reportData: any[] = (location.state as any)?.reportData || [];
  const reportName: string = (location.state as any)?.reportName || "Report";

  // ── Column visibility ──────────────────────────────────────────────────────
  const availableColumns = useMemo(() => {
    if (!reportData.length) return [];
    return Object.keys(reportData[0])
      .filter((k) => !EXCLUDED_KEYS.includes(k))
      .map((key) => ({ key, label: formatColumnLabel(key) }));
  }, [reportData]);

  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);
  const [columnModalOpen, setColumnModalOpen] = useState(false);
  const [showExportWarning, setShowExportWarning] = useState(false);

  useEffect(() => {
    if (availableColumns.length && !visibleColumns.length) {
      setVisibleColumns(availableColumns.slice(0, 8).map((c) => c.key));
    }
  }, [availableColumns]);

  // ── Dynamic filters ────────────────────────────────────────────────────────
  /**
   * Build filter fields dynamically from API data.
   * Only include columns that have a small set of distinct string values (≤ 15).
   */
  const filterableFields = useMemo(() => {
    if (!reportData.length) return [];
    return availableColumns
      .filter(({ key }) => {
        const values = reportData
          .map((r) => r[key])
          .filter((v) => v !== null && v !== undefined && v !== "");
        const distinct = new Set(values.map(String));
        // Show as filter if: known filterable type OR small set of categorical values
        return (
          FILTERABLE_TYPES.includes(key) ||
          (distinct.size <= 15 &&
            distinct.size >= 2 &&
            !isNumericKey(key) &&
            !isDateKey(key))
        );
      })
      .map(({ key, label }) => {
        const distinctValues = Array.from(
          new Set(
            reportData
              .map((r) => r[key])
              .filter((v) => v !== null && v !== undefined && v !== "")
              .map(String),
          ),
        ).sort();
        return { key, label, options: distinctValues };
      });
  }, [availableColumns, reportData]);

  const [pendingFilters, setPendingFilters] = useState<FilterValues>({});
  const [appliedFilters, setAppliedFilters] = useState<FilterValues>({});
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [saveFilterName, setSaveFilterName] = useState("");
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);

  const activeFilterCount =
    Object.values(appliedFilters).filter(Boolean).length;

  const handleApplyFilters = () => {
    setAppliedFilters({ ...pendingFilters });
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setPendingFilters({});
    setAppliedFilters({});
    setCurrentPage(1);
  };

  const handleSaveFilter = () => {
    if (!saveFilterName.trim()) return;
    setSavedFilters((prev) => [
      ...prev,
      { name: saveFilterName.trim(), filters: { ...appliedFilters } },
    ]);
    setSaveFilterName("");
    setSaveModalOpen(false);
  };

  const handleLoadSavedFilter = (saved: SavedFilter) => {
    setPendingFilters(saved.filters);
    setAppliedFilters(saved.filters);
    setCurrentPage(1);
  };

  // ── Filtered + paginated data ──────────────────────────────────────────────
  const filteredData = useMemo(() => {
    return reportData.filter((row) =>
      Object.entries(appliedFilters).every(([key, val]) => {
        if (!val) return true;
        return String(row[key] ?? "").toLowerCase() === val.toLowerCase();
      }),
    );
  }, [reportData, appliedFilters]);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(filteredData.length / pageSize);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage]);

  // ── Cell rendering ─────────────────────────────────────────────────────────
  const getCellValue = (row: any, key: string): string => {
    const value = row[key];
    if (value === null || value === undefined || value === "") return "—";
    if (typeof value === "object") return JSON.stringify(value);
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (isDateKey(key) && typeof value === "string" && value.includes("T"))
      return new Date(value).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    return String(value);
  };

  // ── Export helpers ─────────────────────────────────────────────────────────
  const validateExport = () => visibleColumns.length <= MAX_EXPORT_COLUMNS;

  const handleExportAttempt = (cb: () => void) => {
    if (!validateExport()) {
      setShowExportWarning(true);
      setColumnModalOpen(true);
      return;
    }
    setShowExportWarning(false);
    cb();
  };

  const handleExcelExport = () => {
    if (!validateExport()) return;
    const rows = filteredData.map((row) => {
      const out: Record<string, any> = {};
      visibleColumns.forEach((col) => {
        out[formatColumnLabel(col)] = getCellValue(row, col);
      });
      return out;
    });
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, `${reportName}.xlsx`);
  };

  const handlePdfExport = () => {
    if (!validateExport()) return;
    const doc = new jsPDF("landscape");
    const headers = visibleColumns.map(
      (col) => availableColumns.find((c) => c.key === col)?.label || col,
    );
    const data = filteredData.map((row) =>
      visibleColumns.map((col) => getCellValue(row, col)),
    );
    autoTable(doc, { head: [headers], body: data, styles: { fontSize: 8 } });
    doc.save(`${reportName}.pdf`);
  };

  const handlePrint = () => {
    if (!validateExport()) return;
    window.print();
  };

  // ── Status badge ───────────────────────────────────────────────────────────
  const getStatusStyle = (val: string) => {
    const v = val.toLowerCase();
    if (["active", "signed", "yes"].includes(v))
      return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    if (["expired", "cancelled", "no"].includes(v))
      return "bg-red-50 text-red-700 border border-red-200";
    if (["pending", "renewal", "on hold"].includes(v))
      return "bg-amber-50 text-amber-700 border border-amber-200";
    return "bg-gray-50 text-gray-600 border border-gray-200";
  };

  const isBadgeColumn = (key: string) =>
    ["status", "stage", "renewable", "termType"].includes(key);

  // ── Guard ───────���──────────────────────────────────────────────────────────
  if (!reportData.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            No data available for this report.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* ── Top gradient accent ── */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 z-[60]" />

      {/* ═════════════════════════════════════════════════════���════════════════
          TOP NAVBAR
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-100 shadow-sm">
        <div className="px-6 py-4 flex items-center justify-between">
          {/* Left */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard-reports")}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-gray-600 hover:text-emerald-600 bg-gray-100 hover:bg-emerald-50 border border-gray-200 hover:border-emerald-200 transition-all duration-200"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </button>

            <div className="h-5 w-px bg-gray-200" />

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/60">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-gray-900">
                {reportName}
              </span>
            </div>

            <div className="flex items-center gap-1 text-xs text-gray-600">
              <span className="font-semibold text-gray-800">
                {filteredData.length}
              </span>
              <span>records</span>
              {activeFilterCount > 0 && (
                <span className="ml-2 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[11px] font-bold">
                  {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""}{" "}
                  active
                </span>
              )}
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            {/* Export buttons */}
            <div className="flex items-center gap-0.5 p-1.5 bg-gray-100 rounded-lg border border-gray-200">
              {[
                { icon: Download, label: "Excel", action: handleExcelExport },
                { icon: FileText, label: "PDF", action: handlePdfExport },
                { icon: Printer, label: "Print", action: handlePrint },
              ].map(({ icon: Icon, label, action }) => (
                <button
                  key={label}
                  onClick={() => handleExportAttempt(action)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium text-gray-700 hover:text-emerald-700 hover:bg-white transition-all duration-200"
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              ))}
            </div>

            {/* Customize */}
            <button
              onClick={() => {
                setShowExportWarning(false);
                setColumnModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-500/20 transition-all duration-200 hover:shadow-emerald-500/30"
            >
              <Settings2 className="w-3.5 h-3.5" />
              Customize
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          MAIN CONTENT
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="px-6 py-6 space-y-5">
        {/* ══════════════════════════════════════════════════════════════════
            FILTER ROW — REQUIREMENT 1
        ══════════════════════════════════════════════════════════════════ */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-200">
          {/* Filter header bar */}
          <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setFilterPanelOpen((p) => !p)}
                className="flex items-center gap-2 text-xs font-semibold text-gray-700 hover:text-emerald-600 transition-colors duration-200"
              >
                <Filter className="w-4 h-4 text-emerald-500" />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold">
                    {activeFilterCount}
                  </span>
                )}
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${filterPanelOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Saved filter pills */}
              {savedFilters.length > 0 && (
                <div className="flex items-center gap-2 ml-2 border-l border-gray-200 pl-3">
                  <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                    Saved:
                  </span>
                  {savedFilters.map((sf) => (
                    <button
                      key={sf.name}
                      onClick={() => handleLoadSavedFilter(sf)}
                      className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-all duration-200"
                    >
                      {sf.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              {/* Save Filter */}
              <button
                onClick={() => setSaveModalOpen(true)}
                disabled={activeFilterCount === 0}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 hover:border-amber-300 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-amber-50"
              >
                <Star className="w-3.5 h-3.5" />
                Save
              </button>

              {/* Reset */}
              <button
                onClick={handleResetFilters}
                disabled={activeFilterCount === 0}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-gray-600 bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>

              {/* Apply */}
              <button
                onClick={handleApplyFilters}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-500/20 transition-all duration-200 hover:shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Check className="w-3.5 h-3.5" />
                Apply
              </button>
            </div>
          </div>

          {/* Filter dropdowns row */}
          {filterPanelOpen && (
            <div className="px-5 py-4 border-t border-gray-100 bg-gradient-to-b from-gray-50/50 to-white">
              {filterableFields.length === 0 ? (
                <p className="text-xs text-gray-400 italic">
                  No filterable fields found in this report.
                </p>
              ) : (
                <div className="flex flex-wrap gap-4">
                  {filterableFields.map(({ key, label, options }) => (
                    <div
                      key={key}
                      className="flex flex-col gap-2 min-w-[180px]"
                    >
                      <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">
                        {label}
                      </label>
                      <div className="relative">
                        <select
                          value={pendingFilters[key] || ""}
                          onChange={(e) =>
                            setPendingFilters((prev) => ({
                              ...prev,
                              [key]: e.target.value,
                            }))
                          }
                          className={`w-full appearance-none pl-3 pr-8 py-2.5 text-xs rounded-lg border transition-all outline-none cursor-pointer font-medium
                            ${
                              pendingFilters[key]
                                ? "border-emerald-400 bg-emerald-50 text-emerald-800 shadow-sm shadow-emerald-500/10"
                                : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                            } focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400`}
                        >
                          <option value="">All {label}s</option>
                          {options.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        {pendingFilters[key] && (
                          <button
                            onClick={() =>
                              setPendingFilters((prev) => {
                                const n = { ...prev };
                                delete n[key];
                                return n;
                              })
                            }
                            className="absolute right-7 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors duration-200"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Active filter chips */}
              {activeFilterCount > 0 && (
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                  <span className="text-[10px] text-gray-500 font-medium self-center">
                    Active Filters:
                  </span>
                  {Object.entries(appliedFilters)
                    .filter(([, v]) => v)
                    .map(([key, val]) => (
                      <span
                        key={key}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm shadow-emerald-500/5"
                      >
                        <span className="text-emerald-600">
                          {formatColumnLabel(key)}:
                        </span>
                        <span className="text-emerald-800">{val}</span>
                        <button
                          onClick={() => {
                            const next = { ...appliedFilters };
                            const pending = { ...pendingFilters };
                            delete next[key];
                            delete pending[key];
                            setAppliedFilters(next);
                            setPendingFilters(pending);
                            setCurrentPage(1);
                          }}
                          className="ml-1 text-emerald-400 hover:text-red-500 transition-colors duration-200"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            EXCEL-STYLE TABLE — REQUIREMENT 2
        ══════════════════════════════════════════════════════════════════ */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-auto max-h-[calc(100vh-350px)]">
            <table className="w-full border-collapse text-xs">
              {/* ── THEAD ── */}
              <thead className="sticky top-0 z-20">
                {/* Subtle top glow line */}
                <tr>
                  <td
                    colSpan={visibleColumns.length + 1}
                    className="h-px p-0 border-0 bg-gradient-to-r from-emerald-400/60 via-teal-400/40 to-transparent"
                  />
                </tr>

                <tr className="group/header">
                  {/* Row number column */}
                  <th
                    className="
        w-12 px-3 py-3
        text-center select-none
        bg-slate-50 border-b-2 border-slate-200
        border-r border-slate-200
        text-[10px] font-bold uppercase tracking-widest text-slate-400
      "
                  >
                    #
                  </th>

                  {visibleColumns.map((colKey, i) => {
                    const col = availableColumns.find((c) => c.key === colKey);
                    const isNum = isNumericKey(colKey);
                    const isLast = i === visibleColumns.length - 1;

                    return (
                      <th
                        key={colKey}
                        className={`
            relative px-4 py-3
            bg-slate-50
            border-b-2 border-slate-200
            ${!isLast ? "border-r border-slate-100" : ""}
            text-[11px] font-semibold uppercase tracking-wide
            text-slate-500
            cursor-pointer select-none
            transition-all duration-150
            hover:bg-white hover:text-slate-800
            group
            ${isNum ? "text-right" : "text-left"}
          `}
                      >
                        {/* Active column accent line */}
                        <span
                          className="
              absolute bottom-0 left-0 right-0 h-0.5
              bg-emerald-400
              opacity-0 group-hover:opacity-100
              transition-opacity duration-200
              rounded-t-full
            "
                        />

                        <div
                          className={`flex items-center gap-2 ${
                            isNum ? "justify-end" : "justify-between"
                          }`}
                        >
                          <span className="truncate leading-none">
                            {col?.label || colKey}
                          </span>

                          <ArrowUpDown
                            className="
                w-3 h-3 flex-shrink-0
                text-slate-300
                group-hover:text-emerald-500
                transition-colors duration-150
              "
                          />
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              {/* ── TBODY ── */}
              <tbody>
                {paginatedData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={visibleColumns.length + 1}
                      className="py-16 text-center bg-gradient-to-b from-gray-50 to-white border border-gray-200"
                    >
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                          <Filter className="w-5 h-5 text-gray-400" />
                        </div>
                        <p className="font-semibold text-gray-600 text-sm">
                          No records match the current filters.
                        </p>
                        <button
                          onClick={handleResetFilters}
                          className="mt-2 text-xs text-emerald-600 hover:text-emerald-700 hover:underline font-medium transition-colors duration-200"
                        >
                          Clear all filters
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((record: any, idx: number) => {
                    const isEven = idx % 2 === 0;
                    const rowNum = (currentPage - 1) * pageSize + idx + 1;
                    return (
                      <tr
                        key={idx}
                        className={`
                          group transition-all duration-150
                          ${
                            isEven
                              ? "bg-white hover:bg-emerald-50/70"
                              : "bg-gray-50/60 hover:bg-emerald-50/60"
                          }
                          border-b border-gray-100
                        `}
                      >
                        {/* Row number */}
                        <td
                          className="
                          px-4 py-3 text-center font-semibold text-gray-400 text-[11px]
                          border-r border-gray-100 bg-gray-50/40 group-hover:bg-emerald-50/50 select-none w-12
                          transition-colors duration-150
                        "
                        >
                          {rowNum}
                        </td>

                        {visibleColumns.map((colKey) => {
                          const cellVal = getCellValue(record, colKey);
                          const isNum = isNumericKey(colKey);
                          const showBadge =
                            isBadgeColumn(colKey) && cellVal !== "—";

                          return (
                            <td
                              key={colKey}
                              className={`
                                px-5 py-3.5 border-r border-gray-100
                                ${isNum ? "text-right tabular-nums" : "text-left"}
                                transition-colors duration-150
                              `}
                            >
                              {showBadge ? (
                                <span
                                  className={`
                                  inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-semibold shadow-sm
                                  ${getStatusStyle(cellVal)}
                                `}
                                >
                                  {cellVal}
                                </span>
                              ) : isNum && cellVal !== "—" ? (
                                <span className="font-mono text-gray-800 text-xs font-medium">
                                  {isNaN(Number(cellVal))
                                    ? cellVal
                                    : Number(cellVal).toLocaleString()}
                                </span>
                              ) : (
                                <span
                                  className={`text-xs text-gray-700 ${colKey === "title" ? "font-semibold text-gray-900" : "font-normal"}`}
                                >
                                  {cellVal}
                                </span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })
                )}
              </tbody>

              {/* ── TFOOT summary ── */}
              {paginatedData.length > 0 && (
                <tfoot>
                  <tr className="bg-gradient-to-r from-gray-50 to-white border-t-2 border-gray-200 hover:bg-gray-100/50 transition-colors duration-200">
                    <td className="px-4 py-3.5 border-r border-gray-100 text-[11px] text-gray-500 font-bold text-center bg-gray-50/80">
                      Σ
                    </td>
                    {visibleColumns.map((colKey) => {
                      if (isNumericKey(colKey)) {
                        const total = filteredData.reduce((sum, row) => {
                          const v = parseFloat(row[colKey]);
                          return isNaN(v) ? sum : sum + v;
                        }, 0);
                        return (
                          <td
                            key={colKey}
                            className="px-5 py-3.5 border-r border-gray-100 text-right font-bold text-xs text-slate-700 tabular-nums bg-gradient-to-r from-emerald-50/50 to-transparent"
                          >
                            {total.toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                            })}
                          </td>
                        );
                      }
                      return (
                        <td
                          key={colKey}
                          className="px-5 py-3.5 border-r border-gray-100 text-xs text-gray-400 italic font-medium"
                        >
                          {colKey === visibleColumns[0]
                            ? `${filteredData.length} records`
                            : ""}
                        </td>
                      );
                    })}
                  </tr>
                </tfoot>
              )}
            </table>
          </div>

          {/* ── Pagination ── */}
          <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-t border-gray-200 flex items-center justify-between">
            <div className="text-xs text-gray-600">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {filteredData.length === 0
                  ? 0
                  : (currentPage - 1) * pageSize + 1}
                –{Math.min(currentPage * pageSize, filteredData.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900">
                {filteredData.length}
              </span>{" "}
              results
              {activeFilterCount > 0 && (
                <span className="text-emerald-600 ml-2 font-medium">
                  (filtered from {reportData.length} total)
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-3 py-2 rounded-lg text-xs font-semibold text-gray-700 bg-white hover:bg-gray-100 border border-gray-200 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white shadow-sm"
              >
                ← Prev
              </button>

              {Array.from({ length: Math.min(totalPages, 7) }).map((_, i) => {
                // Windowed pagination
                let page = i + 1;
                if (totalPages > 7) {
                  const half = 3;
                  let start = Math.max(1, currentPage - half);
                  const end = Math.min(totalPages, start + 6);
                  start = Math.max(1, end - 6);
                  page = start + i;
                }
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 rounded-lg text-xs font-bold transition-all duration-200 ${
                      currentPage === page
                        ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30"
                        : "text-gray-600 bg-white hover:bg-gray-100 border border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-3 py-2 rounded-lg text-xs font-semibold text-gray-700 bg-white hover:bg-gray-100 border border-gray-200 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white shadow-sm"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          SAVE FILTER MODAL
      ══════════════════════════════════════════════════════════════════════ */}
      {saveModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-96 rounded-xl shadow-2xl p-6 border border-gray-200/80">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-900">
                Save Filter Preset
              </h3>
              <button
                onClick={() => setSaveModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mb-4 leading-relaxed">
              Name this filter preset to quickly reuse it later.
            </p>
            <input
              type="text"
              value={saveFilterName}
              onChange={(e) => setSaveFilterName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSaveFilter()}
              placeholder="e.g. Active Sales Contracts"
              className="w-full px-4 py-2.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all duration-200 bg-white"
              autoFocus
            />
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setSaveModalOpen(false)}
                className="flex-1 px-3 py-2.5 text-xs font-semibold border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveFilter}
                disabled={!saveFilterName.trim()}
                className="flex-1 px-3 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20"
              >
                Save Preset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          CUSTOMIZE COLUMNS MODAL
      ══════════════════════════════════════════════════════════════════════ */}
      {columnModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-[480px] rounded-xl shadow-2xl overflow-hidden border border-gray-200/80">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <div>
                <h3 className="text-sm font-bold text-gray-900">
                  Manage Report Columns
                </h3>
                <p className="text-xs text-gray-500 mt-1.5">
                  {visibleColumns.length} of {availableColumns.length} columns
                  selected
                  {showExportWarning &&
                    visibleColumns.length > MAX_EXPORT_COLUMNS && (
                      <span className="ml-2 text-amber-600 font-bold">
                        (max {MAX_EXPORT_COLUMNS} for export)
                      </span>
                    )}
                </p>
              </div>
              <button
                onClick={() => setColumnModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {showExportWarning &&
              visibleColumns.length > MAX_EXPORT_COLUMNS && (
                <div className="mx-6 mt-4 p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800 font-medium">
                  <strong>Export limit:</strong> Please select at most{" "}
                  <b>{MAX_EXPORT_COLUMNS}</b> columns. Currently:{" "}
                  <b>{visibleColumns.length}</b>
                </div>
              )}

            <div className="px-6 py-4 max-h-[380px] overflow-y-auto">
              <div className="grid grid-cols-2 gap-2">
                {availableColumns.map((col) => (
                  <label
                    key={col.key}
                    className={`flex items-center gap-3 px-3.5 py-3 rounded-lg cursor-pointer border text-xs font-medium transition-all duration-200
                      ${
                        visibleColumns.includes(col.key)
                          ? "bg-emerald-50 border-emerald-200 text-emerald-800 shadow-sm shadow-emerald-500/10"
                          : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300"
                      }`}
                  >
                    <input
                      type="checkbox"
                      checked={visibleColumns.includes(col.key)}
                      onChange={() =>
                        setVisibleColumns((prev) =>
                          prev.includes(col.key)
                            ? prev.filter((c) => c !== col.key)
                            : [...prev, col.key],
                        )
                      }
                      className="accent-emerald-600 w-4 h-4 cursor-pointer"
                    />
                    <span>{col.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white flex items-center justify-between">
              <button
                onClick={() =>
                  setVisibleColumns(
                    availableColumns.slice(0, 8).map((c) => c.key),
                  )
                }
                className="text-xs font-medium text-gray-600 hover:text-emerald-600 hover:underline transition-colors duration-200"
              >
                Reset to default
              </button>
              <div className="flex gap-3">
                <button
                  onClick={() => setColumnModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-semibold border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowExportWarning(false);
                    setColumnModalOpen(false);
                  }}
                  className="px-4 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 shadow-lg shadow-emerald-500/20"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
