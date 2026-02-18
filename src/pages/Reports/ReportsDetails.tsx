/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams, useNavigate } from "react-router-dom";
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
import { useState } from "react";
import {
  MOCK_DATA,
  FILTER_FIELDS,
  ALL_COLUMNS,
  STATUS_CONFIG,
  REPORT_NAMES,
  CATEGORY_NAMES,
} from "../../components/reports/mockData";
import * as XLSX from "xlsx";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function ReportDetails() {
  const { categoryId, reportId } = useParams();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters] = useState<string[]>([]);

  const categoryName =
    CATEGORY_NAMES[categoryId as string] || "Unknown Category";
  const reportName = REPORT_NAMES[reportId as string] || "Unknown Report";

  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [selectedFilterFields, setSelectedFilterFields] = useState<string[]>(
    [],
  );
  const [appliedFilters, setAppliedFilters] = useState<string[]>([]);

  const [columnModalOpen, setColumnModalOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    ALL_COLUMNS.map((c) => c.key),
  );

  const MAX_EXPORT_COLUMNS = 8;
  const [showExportWarning, setShowExportWarning] = useState(false);

  // const exportableColumnsCount = visibleColumns.length;

  // const isExportAllowed = exportableColumnsCount <= MAX_EXPORT_COLUMNS;
  // const validateExport = () => {
  //   if (!isExportAllowed) {
  //     toast.custom(
  //       (t) => (
  //         <div
  //           className={`${
  //             t.visible ? "animate-enter" : "animate-leave"
  //           } flex items-start gap-3 max-w-sm w-full bg-white border border-amber-300 shadow-xl rounded-xl p-4`}
  //         >
  //           {/* Icon */}
  //           <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center text-lg">
  //             ⚠️
  //           </div>

  //           {/* Content */}
  //           <div className="flex-1">
  //             <p className="text-xs font-bold text-gray-900">
  //               Export limit exceeded
  //             </p>
  //             <p className="text-xs text-gray-600 mt-1">
  //               You can export a maximum of{" "}
  //               <span className="font-semibold">{MAX_EXPORT_COLUMNS}</span>{" "}
  //               columns.
  //               <br />
  //               Currently selected:{" "}
  //               <span className="font-semibold text-amber-700">
  //                 {exportableColumnsCount}
  //               </span>
  //             </p>
  //           </div>

  //           {/* Close */}
  //           <button
  //             onClick={() => toast.dismiss(t.id)}
  //             className="text-gray-400 hover:text-gray-600 transition"
  //           >
  //             ✕
  //           </button>
  //         </div>
  //       ),
  //       { duration: 3500 },
  //     );

  //     return false;
  //   }

  //   return true;
  // };
  // const validateExport = () => {
  //   if (visibleColumns.length > MAX_EXPORT_COLUMNS) {
  //     setColumnModalOpen(true); // auto-open customize modal
  //     return false;
  //   }
  //   return true;
  // };

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

    const rows = MOCK_DATA.map((row) => {
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

    const headers = visibleColumns.map(
      (col) => ALL_COLUMNS.find((c) => c.key === col)?.label || col,
    );

    const data = MOCK_DATA.map((row) =>
      visibleColumns.map((col) => (row as any)[col]),
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Compact Top Navigation Bar */}
      {/* <Toaster position="top-right" /> */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/60 shadow-sm">
        <div className="mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Left Section */}
            <div className="flex items-center gap-3 flex-1">
              <button
                onClick={() => navigate(-1)}
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
                <tr className="border-b border-gray-200 text-center">
                  {visibleColumns.includes("title") && (
                    <th className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                          Title & Area
                        </span>
                        <ArrowUpDown className="w-3 h-3 text-gray-400" />
                      </div>
                    </th>
                  )}

                  {visibleColumns.includes("type") && (
                    <th className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                          Type
                        </span>
                        <ArrowUpDown className="w-3 h-3 text-gray-400" />
                      </div>
                    </th>
                  )}

                  {visibleColumns.includes("status") && (
                    <th className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                          Status
                        </span>
                        <ArrowUpDown className="w-3 h-3 text-gray-400" />
                      </div>
                    </th>
                  )}
                  {visibleColumns.includes("recordNumber") && (
                    <th className="px-4 py-3 text-center">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                        Record #
                      </span>
                    </th>
                  )}

                  {visibleColumns.includes("owner") && (
                    <th className="px-4 py-3 text-center">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                        Owner
                      </span>
                    </th>
                  )}

                  {visibleColumns.includes("legalEntity") && (
                    <th className="px-4 py-3 text-center">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                        Legal Entity
                      </span>
                    </th>
                  )}

                  {visibleColumns.includes("duration") && (
                    <th className="px-4 py-3 text-center">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                        Duration
                      </span>
                    </th>
                  )}

                  {visibleColumns.includes("value") && (
                    <th className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                          Value
                        </span>
                        <ArrowUpDown className="w-3 h-3 text-gray-400" />
                      </div>
                    </th>
                  )}

                  {visibleColumns.includes("counterparty") && (
                    <th className="px-4 py-3 text-center">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                        Counterparty
                      </span>
                    </th>
                  )}

                  {/* ACTIONS COLUMN – ALWAYS SHOWN */}
                  <th className="px-4 py-3 text-center w-16">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                      Actions
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 bg-white">
                {MOCK_DATA.map((contract) => (
                  <tr
                    key={contract.id}
                    className="hover:bg-gray-50/50 transition-all duration-150 group border-b border-gray-100"
                  >
                    {visibleColumns.includes("title") && (
                      <td className="px-4 py-3.5 text-center">
                        <div>
                          <div className="text-xs font-bold text-gray-900 hover:text-emerald-600 cursor-pointer transition-colors">
                            {contract.title}
                          </div>
                          <div className="text-xs text-gray-500 mt-1 font-medium">
                            {contract.contractArea}
                          </div>
                        </div>
                      </td>
                    )}

                    {visibleColumns.includes("type") && (
                      <td className="px-4 py-3.5 text-center">
                        <div className="text-xs font-medium text-gray-700">
                          {contract.type}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {contract.businessArea}
                        </div>
                      </td>
                    )}

                    {visibleColumns.includes("status") && (
                      <td className="px-4 py-3.5 text-center">
                        <div
                          className={`flex flex-col items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border ${
                            STATUS_CONFIG[
                              contract.status as keyof typeof STATUS_CONFIG
                            ]?.className
                          }`}
                        >
                          {
                            STATUS_CONFIG[
                              contract.status as keyof typeof STATUS_CONFIG
                            ]?.icon
                          }
                          {
                            STATUS_CONFIG[
                              contract.status as keyof typeof STATUS_CONFIG
                            ]?.label
                          }
                        </div>
                      </td>
                    )}

                    {visibleColumns.includes("recordNumber") && (
                      <td className="px-4 py-3.5 text-center">
                        <span className="text-xs font-semibold text-gray-700">
                          {contract.recordNumber}
                        </span>
                      </td>
                    )}

                    {visibleColumns.includes("owner") && (
                      <td className="px-4 py-3.5 text-center">
                        <span className="text-xs font-medium text-gray-700">
                          {contract.owner}
                        </span>
                      </td>
                    )}

                    {visibleColumns.includes("legalEntity") && (
                      <td className="px-4 py-3.5 text-center">
                        <span className="text-xs text-gray-700">
                          {contract.legalEntity}
                        </span>
                      </td>
                    )}

                    {visibleColumns.includes("duration") && (
                      <td className="px-4 py-3.5 text-center">
                        <span className="text-xs font-medium text-gray-700">
                          {contract.duration}
                        </span>
                      </td>
                    )}

                    {visibleColumns.includes("value") && (
                      <td className="px-4 py-3.5 text-center">
                        <div className="text-xs font-bold text-gray-900">
                          ${contract.value.toLocaleString()}
                        </div>
                      </td>
                    )}

                    {visibleColumns.includes("counterparty") && (
                      <td className="px-4 py-3.5 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-100 to-teal-100 border border-emerald-200 flex items-center justify-center text-xs font-bold text-emerald-700">
                            {contract.counterparty.charAt(0)}
                          </div>
                          <div className="text-xs font-medium text-gray-700">
                            {contract.counterparty.split(" ")[0]}
                          </div>
                        </div>
                      </td>
                    )}

                    {/* ACTIONS – ALWAYS SHOWN */}
                    <td className="px-4 py-3.5 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          className="w-7 h-7 rounded-lg hover:bg-emerald-100 flex items-center justify-center text-gray-500 hover:text-emerald-600 transition-all duration-150"
                          title="View details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-all duration-150"
                          title="More options"
                        >
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
              <span className="font-semibold">1-{MOCK_DATA.length}</span> of{" "}
              <span className="font-semibold">{MOCK_DATA.length}</span> results
            </div>
            <div className="flex items-center gap-1.5">
              <button className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700 hover:bg-white border border-gray-200 transition-all">
                Prev
              </button>
              <button className="w-7 h-7 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium text-xs shadow-lg shadow-emerald-500/30">
                1
              </button>
              <button className="w-7 h-7 rounded-lg text-xs font-medium text-gray-700 hover:bg-white border border-gray-200 transition-all">
                2
              </button>
              <button className="w-7 h-7 rounded-lg text-xs font-medium text-gray-700 hover:bg-white border border-gray-200 transition-all">
                3
              </button>
              <button className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700 hover:bg-white border border-gray-200 transition-all">
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
              {ALL_COLUMNS.map((col) => (
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
