/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  FileText,
  Printer,
  Settings2,
  Filter,
  Eye,
  Star,
  MoreVertical,
  Search,
  ChevronDown,
  Check,
  ArrowUpDown,
} from "lucide-react";

import {
  FILTER_FIELDS,
  // STATUS_CONFIG,
  // REPORT_NAMES,
  CATEGORY_NAMES,
} from "../../components/reports/mockData";
import * as XLSX from "xlsx";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function ReportDetails() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  // ✅ Get data from navigation state (NOT from URL params)
  const reportData = (location.state as any)?.reportData || [];
  const reportNameFromState =
    (location.state as any)?.reportName || "Unknown Report";
  const categoryIdFromState =
    (location.state as any)?.categoryId || categoryId || "Unknown";

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters] = useState<string[]>([]);

  // Use state values instead of URL params
  const categoryName =
    CATEGORY_NAMES[categoryIdFromState as string] || "Unknown Category";
  const reportName = reportNameFromState;
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [selectedFilterFields, setSelectedFilterFields] = useState<string[]>(
    [],
  );
  const [appliedFilters, setAppliedFilters] = useState<string[]>([]);

  const [columnModalOpen, setColumnModalOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);

  // ✅ DEFINE HELPER FUNCTIONS FIRST (before useMemo)
  const formatColumnLabel = (key: string): string => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  // ✅ NOW use these functions in useMemo
  const availableColumns = useMemo(() => {
    if (!reportData || reportData.length === 0) return [];

    const firstRecord = reportData[0];
    const keys = Object.keys(firstRecord);

    return keys
      .filter(
        (key) => !["partitionKey", "rowKey", "timestamp", "eTag"].includes(key),
      )
      .map((key) => ({
        key,
        label: formatColumnLabel(key),
      }));
  }, [reportData]);

  // Initialize visible columns on first load
  useMemo(() => {
    if (availableColumns.length > 0 && visibleColumns.length === 0) {
      setVisibleColumns(availableColumns.slice(0, 8).map((c) => c.key));
    }
  }, [availableColumns]);
  // ✅ Helper function to safely get nested values
  const getCellValue = (
    row: any,
    key: string,
  ): string | number | React.ReactNode => {
    const value = row[key];

    if (value === null || value === undefined) return "-";
    if (typeof value === "object") return JSON.stringify(value);
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (typeof value === "number" && key.toLowerCase().includes("date"))
      return new Date(value).toLocaleDateString();

    return String(value);
  };

  const MAX_EXPORT_COLUMNS = 8;
  const [showExportWarning, setShowExportWarning] = useState(false);

  const validateExport = () => {
    return visibleColumns.length <= MAX_EXPORT_COLUMNS;
  };
  const handleExportAttempt = (callback: () => void) => {
    if (!validateExport()) {
      setShowExportWarning(true); // ✅ show warning
      setColumnModalOpen(true); // ✅ open modal
      return;
    }

    setShowExportWarning(false);
    callback();
  };

  const handleExcelExport = () => {
    if (!validateExport()) return;

    const rows = reportData.map((row: any) => {
      const filteredRow: Record<string, any> = {};

      visibleColumns.forEach((col) => {
        filteredRow[col] = (row as any)[col];
      });

      return filteredRow;
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

    XLSX.writeFile(workbook, "report.xlsx");
  };

  const handlePdfExport = () => {
    if (!validateExport()) return;

    const doc = new jsPDF("landscape");

    const headers = visibleColumns.map((col) => {
      const column = availableColumns.find((c) => c.key === col);
      return column?.label || col;
    });

    const data = reportData.map((row: any) =>
      visibleColumns.map((col) => getCellValue(row, col)),
    );

    autoTable(doc, {
      head: [headers],
      body: data,
      styles: { fontSize: 8 },
    });

    doc.save("report.pdf");
  };

  const handlePrint = () => {
    if (!validateExport()) return;
    window.print();
  };

  // Handle empty data
  if (!reportData || reportData.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            No data available for this report
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const filteredData = useMemo(() => {
    if (!searchQuery) return reportData;

    return reportData.filter((row: any) =>
      Object.values(row).some((val) =>
        String(val).toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    );
  }, [reportData, searchQuery]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage]);
  return (
    <div className="relative overflow-hidden bg-white rounded-2xl border border-gray-200 shadow-sm">
      {/* Subtle top gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500" />
      {/* Compact Top Navigation Bar */}
      {/* <Toaster position="top-right" /> */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/60 shadow-sm">
        <div className="mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Left Section */}
            <div className="flex items-center gap-3 flex-1">
              <button
                onClick={() => navigate("/dashboard-reports")}
                className="group flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium text-gray-600 hover:text-emerald-600 bg-gray-50/50 hover:bg-emerald-50 border border-gray-200/60 hover:border-emerald-200 transition-all duration-200 hover:shadow-sm"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform duration-200" />
                <span>Back</span>
              </button>

              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-xs ml-4">
                <span className="text-gray-500 font-medium">
                  {categoryName}
                </span>
                <ChevronDown className="w-3 h-3 text-gray-300 rotate-[-90deg]" />
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-200/50">
                  <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-gray-900 font-bold text-xs">
                    {reportName}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Section - Export & Settings */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 p-1 bg-gray-50/80 rounded-lg border border-gray-200/60">
                <button
                  onClick={() => handleExportAttempt(handleExcelExport)}
                  className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
     text-gray-700 hover:text-emerald-700 hover:bg-white"
      `}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Excel</span>
                </button>

                <button
                  onClick={() => handleExportAttempt(handlePdfExport)}
                  className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
       text-gray-700 hover:text-emerald-700 hover:bg-white"
         "
      `}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>PDF</span>
                </button>

                <button
                  onClick={() => handleExportAttempt(handlePrint)}
                  className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
     text-gray-700 hover:text-emerald-700 hover:bg-white"
        
      `}
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
              </div>

              <button
                onClick={() => {
                  setShowExportWarning(false);
                  setColumnModalOpen(true);
                }}
                className="group relative flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-600 hover:via-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Settings2 className="w-3.5 h-3.5" />
                <span>Customize</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Optimized Layout */}
      <div className="mx-auto px-6 py-6">
        {/* Filter & Search Bar - Horizontal Layout */}
        <div className="mb-4 bg-white rounded-xl border border-gray-200/60 shadow-sm overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200/60">
            <div className="flex items-center justify-between gap-4">
              {/* Left: Filter Button */}
              <button
                onClick={() => setFilterModalOpen(true)}
                className="group flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-emerald-600 hover:text-white bg-emerald-50 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-600 border border-emerald-200 hover:border-transparent transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-emerald-500/30 whitespace-nowrap"
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Filters</span>
                {activeFilters.length > 0 && (
                  <div className="ml-1 px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold">
                    {activeFilters.length}
                  </div>
                )}
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-300 ${filterModalOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Middle: Search */}
              <div className="flex-1 relative max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search contracts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>

              {/* Right: Action Buttons */}
              <div className="flex items-center gap-2">
                <button className="group relative overflow-hidden flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-amber-700 bg-gradient-to-br from-amber-50 via-amber-100/80 to-orange-50 hover:from-amber-100 hover:via-amber-200/80 hover:to-orange-100 border border-amber-300/50 hover:border-amber-400/60 transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-amber-500/20 hover:-translate-y-0.5 active:translate-y-0">
                  <Star className="w-3.5 h-3.5 group-hover:fill-amber-500 group-hover:rotate-12 transition-all duration-300" />
                  <span>Save</span>
                </button>
                <button className="px-3 py-2 rounded-lg text-xs font-semibold text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 transition-all shadow-sm hover:shadow-md">
                  Reset
                </button>
                <button className="group relative overflow-hidden px-3 py-2 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-600 hover:via-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
                  <span className="relative z-10 flex items-center gap-1.5">
                    Apply
                    <Check className="w-3.5 h-3.5" />
                  </span>
                </button>
              </div>
            </div>

            {filterModalOpen && (
              <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
                <div className="bg-white w-[420px] rounded-xl shadow-xl p-4">
                  <h3 className="text-sm font-bold mb-3">Add Filters</h3>

                  <div className="max-h-[300px] overflow-y-auto space-y-2">
                    {FILTER_FIELDS.map((field) => (
                      <label
                        key={field}
                        className="flex items-center gap-2 text-xs font-medium text-gray-700"
                      >
                        <input
                          type="checkbox"
                          checked={selectedFilterFields.includes(field)}
                          onChange={() =>
                            setSelectedFilterFields((prev) =>
                              prev.includes(field)
                                ? prev.filter((f) => f !== field)
                                : [...prev, field],
                            )
                          }
                        />
                        {field}
                      </label>
                    ))}
                  </div>

                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      onClick={() => setFilterModalOpen(false)}
                      className="px-3 py-1.5 text-xs border rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        setAppliedFilters(selectedFilterFields);
                        setFilterModalOpen(false);
                      }}
                      className="px-3 py-1.5 text-xs bg-emerald-600 text-white rounded-lg"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )}
            {appliedFilters.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                {appliedFilters.map((filter) => (
                  <div key={filter}>
                    <label className="text-xs font-bold text-gray-700 mb-1 block">
                      {filter}
                    </label>
                    <select className="w-full px-3 py-2 rounded-lg border text-xs">
                      <option>All</option>
                    </select>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Table Container - Fixed Height with Scroll */}
        <div className="bg-white rounded-xl border border-gray-200/60 shadow-sm overflow-hidden flex flex-col">
          {/* Scrollable Table Body */}
          <div className="overflow-y-auto max-h-[calc(100vh-160px)]">
            <table className="w-full">
              <thead className="bg-gray-50/50 sticky top-0 z-10">
                <tr className="border-b border-gray-200">
                  {visibleColumns.map((colKey) => {
                    const column = availableColumns.find(
                      (c) => c.key === colKey,
                    );
                    return (
                      <th key={colKey} className="px-4 py-3 text-left">
                        <div className="flex items-center justify-between gap-1.5">
                          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                            {column?.label || colKey}
                          </span>
                          <ArrowUpDown className="w-3 h-3 text-gray-400" />
                        </div>
                      </th>
                    );
                  })}
                  {/* Actions Column */}
                  <th className="px-4 py-3 text-center w-16">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                      Actions
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 bg-white">
                {paginatedData.map((record: any, idx: number) => (
                  <tr
                    key={idx}
                    className="hover:bg-gray-50/50 transition-all duration-150 group border-b border-gray-100"
                  >
                    {visibleColumns.map((colKey) => (
                      <td key={colKey} className="px-4 py-3.5 text-left">
                        <span className="text-xs text-gray-700">
                          {getCellValue(record, colKey)}
                        </span>
                      </td>
                    ))}
                    {/* Actions */}
                    <td className="px-4 py-3.5 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button className="w-7 h-7 rounded-lg hover:bg-emerald-100 flex items-center justify-center text-gray-500 hover:text-emerald-600 transition-all duration-150">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-all duration-150">
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Compact Footer - Pagination */}
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs">
            <div className="text-gray-600">
              Showing{" "}
              <span className="font-semibold">
                {(currentPage - 1) * pageSize + 1}-
                {Math.min(currentPage * pageSize, filteredData.length)}
              </span>{" "}
              of <span className="font-semibold">{filteredData.length}</span>{" "}
              results
            </div>
            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700 hover:bg-white border border-gray-200 transition-all disabled:opacity-40"
              >
                Prev
              </button>

              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-7 h-7 rounded-lg text-xs font-medium ${
                    currentPage === i + 1
                      ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
                      : "text-gray-700 hover:bg-white border border-gray-200"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700 hover:bg-white border border-gray-200 transition-all disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
      {columnModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white w-[420px] rounded-xl p-4 shadow-xl">
            <h3 className="text-sm font-bold mb-3">Manage Report Fields</h3>

            {showExportWarning &&
              visibleColumns.length > MAX_EXPORT_COLUMNS && (
                <div className="mb-3 p-3 rounded-lg border border-amber-300 bg-amber-50 text-amber-800 text-xs">
                  <strong>Export limit exceeded.</strong>
                  <br />
                  You can export a maximum of <b>{MAX_EXPORT_COLUMNS}</b>{" "}
                  columns.
                  <br />
                  Currently selected: <b>{visibleColumns.length}</b>
                  <br />
                  Please uncheck some columns to continue.
                </div>
              )}
            <div className="max-h-[300px] overflow-y-auto space-y-2">
              {availableColumns.map((col) => (
                <label key={col.key} className="flex gap-2 text-xs">
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
                  />
                  {col.label}
                </label>
              ))}
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setColumnModalOpen(false)}
                className="px-3 py-1.5 border rounded-lg text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => setColumnModalOpen(false)}
                className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
