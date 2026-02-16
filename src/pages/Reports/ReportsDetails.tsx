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
  X,
  //   Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronDown,
  Check,
  ArrowUpDown,
} from "lucide-react";
import { useState } from "react";

const MOCK_DATA = [
  {
    id: 1,
    contractArea: "Technology Services",
    businessArea: "IT Department",
    title: "Cloud Infrastructure Agreement",
    type: "Service Agreement",
    value: 245000,
    counterparty: "AWS Enterprise",
    status: "active",
    startDate: "2024-01-15",
    endDate: "2025-01-14",
  },
  {
    id: 2,
    contractArea: "Sales & Marketing",
    businessArea: "Marketing Division",
    title: "Digital Marketing Services",
    type: "Consulting Agreement",
    value: 125000,
    counterparty: "MediaTech Solutions",
    status: "active",
    startDate: "2024-02-01",
    endDate: "2024-12-31",
  },
  {
    id: 3,
    contractArea: "Operations",
    businessArea: "Facilities Management",
    title: "Office Lease Agreement",
    type: "Real Estate",
    value: 480000,
    counterparty: "Metro Properties Inc",
    status: "active",
    startDate: "2023-06-01",
    endDate: "2026-05-31",
  },
  {
    id: 4,
    contractArea: "Human Resources",
    businessArea: "HR Department",
    title: "Recruitment Services Contract",
    type: "Service Agreement",
    value: 89000,
    counterparty: "TalentFinder Pro",
    status: "pending",
    startDate: "2024-03-15",
    endDate: "2024-09-14",
  },
  {
    id: 5,
    contractArea: "Legal & Compliance",
    businessArea: "Legal Department",
    title: "Legal Advisory Retainer",
    type: "Professional Services",
    value: 340000,
    counterparty: "Sterling Law Group",
    status: "active",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
  },
];

const CATEGORY_NAMES: { [key: string]: string } = {
  "contract-status": "Contract Status",
  renewals: "Renewals & Expirations",
  workflow: "Workflow Analytics",
  access: "Security & Access",
};

const REPORT_NAMES: { [key: string]: string } = {
  active: "Active Contracts",
  recent: "Recently Signed",
  cancelled: "Cancelled & Expired",
  abandoned: "Abandoned Contracts",
  draft: "Draft Contracts",
  upcoming: "Upcoming Renewals",
  history: "Renewal History",
};

const STATUS_CONFIG = {
  active: {
    label: "Active",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    className: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  pending: {
    label: "Pending",
    icon: <Clock className="w-3.5 h-3.5" />,
    className: "bg-amber-100 text-amber-700 border-amber-200",
  },
  expired: {
    label: "Expired",
    icon: <AlertCircle className="w-3.5 h-3.5" />,
    className: "bg-red-100 text-red-700 border-red-200",
  },
};

export default function ReportDetails() {
  const { categoryId, reportId } = useParams();
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const categoryName =
    CATEGORY_NAMES[categoryId as string] || "Unknown Category";
  const reportName = REPORT_NAMES[reportId as string] || "Unknown Report";

  const removeFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter((f) => f !== filter));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Compact Top Navigation Bar */}
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
                <button className="group flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700 hover:text-emerald-700 hover:bg-white transition-all duration-200">
                  <Download className="w-3.5 h-3.5" />
                  <span>Excel</span>
                </button>
                <button className="group flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700 hover:text-emerald-700 hover:bg-white transition-all duration-200">
                  <FileText className="w-3.5 h-3.5" />
                  <span>PDF</span>
                </button>
                <button className="group flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700 hover:text-emerald-700 hover:bg-white transition-all duration-200">
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
              </div>

              <button className="group relative flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-600 hover:via-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98]">
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
                onClick={() => setShowFilters(!showFilters)}
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
                  className={`w-3.5 h-3.5 transition-transform duration-300 ${showFilters ? "rotate-180" : ""}`}
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

            {/* Expandable Filters Section */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200/60">
                {/* Active Filters Pills */}
                {activeFilters.length > 0 && (
                  <div className="mb-4 pb-4 border-b border-gray-200/60">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Active Filters ({activeFilters.length})
                      </div>
                      <button
                        onClick={() => setActiveFilters([])}
                        className="group flex items-center gap-1 text-xs text-gray-500 hover:text-red-600 font-semibold transition-colors"
                      >
                        <X className="w-3 h-3" />
                        Clear
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {activeFilters.map((filter) => (
                        <div
                          key={filter}
                          className="group inline-flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-lg bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 text-emerald-700 text-xs font-medium border border-emerald-200/60 hover:border-emerald-300 shadow-sm hover:shadow-md transition-all duration-200"
                        >
                          <span className="font-semibold">{filter}</span>
                          <button
                            onClick={() => removeFilter(filter)}
                            className="w-4 h-4 flex items-center justify-center hover:bg-emerald-200 rounded transition-all duration-200 hover:rotate-90"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Filter Controls - Compact Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    {
                      label: "Status",
                      icon: "📊",
                      options: ["All Statuses", "Active", "Pending", "Expired"],
                    },
                    {
                      label: "Contract Type",
                      icon: "📄",
                      options: [
                        "All Types",
                        "Service Agreement",
                        "Consulting Agreement",
                        "Real Estate",
                      ],
                    },
                    {
                      label: "Date Range",
                      icon: "📅",
                      options: [
                        "All Time",
                        "Last 30 Days",
                        "Last 90 Days",
                        "This Year",
                      ],
                    },
                    {
                      label: "Business Area",
                      icon: "🏢",
                      options: [
                        "All Areas",
                        "IT Department",
                        "Marketing Division",
                        "HR Department",
                      ],
                    },
                  ].map((filter) => (
                    <div key={filter.label} className="group">
                      <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700 mb-2">
                        <span className="text-sm">{filter.icon}</span>
                        {filter.label}
                      </label>
                      <div className="relative">
                        <select className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 hover:border-emerald-300 text-xs font-medium text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 cursor-pointer appearance-none shadow-sm hover:shadow-md">
                          {filter.options.map((option) => (
                            <option key={option}>{option}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none group-hover:text-emerald-600 transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
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
                  <th className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                        Title & Area
                      </span>
                      <ArrowUpDown className="w-3 h-3 text-gray-400" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                        Type
                      </span>
                      <ArrowUpDown className="w-3 h-3 text-gray-400" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                        Status
                      </span>
                      <ArrowUpDown className="w-3 h-3 text-gray-400" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                        Value
                      </span>
                      <ArrowUpDown className="w-3 h-3 text-gray-400" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-center">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                      Counterparty
                    </span>
                  </th>
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

                    <td className="px-4 py-3.5 text-center">
                      <div className="text-xs font-medium text-gray-700">
                        {contract.type}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {contract.businessArea}
                      </div>
                    </td>

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

                    <td className="px-4 py-3.5 text-center">
                      <div className="text-xs font-bold text-gray-900">
                        ${contract.value.toLocaleString()}
                      </div>
                    </td>

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

                    <td className="px-4 py-3.5 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          className="w-7 h-7 rounded-lg hover:bg-emerald-100 flex items-center justify-center text-gray-500 hover:text-emerald-600 transition-all duration-150"
                          title="View details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-all duration-150 "
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
              <button className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700 hover:bg-white border border-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
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
    </div>
  );
}
