import React, { useState } from "react";
import {
  BarChart3,
  RefreshCcw,
  FileText,
  Workflow,
  ShieldCheck,
  ChartBarIcon,
  Search,
  Star,
  Download,
  Share2,
  Clock,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

type SubReport = {
  id: string;
  name: string;
  description?: string;
  lastUpdated?: string;
  isFavorite?: boolean;
  viewCount?: number;
};

type ReportCategory = {
  id: string;
  name: string;
  icon: React.ReactNode;
  reports: SubReport[];
};

const REPORT_DATA: ReportCategory[] = [
  {
    id: "contract-status",
    name: "Contract Status Reports",
    icon: <BarChart3 size={18} />,
    reports: [
      { id: "active", name: "Active (Effective) Contracts", lastUpdated: "2 hours ago", viewCount: 234 },
      { id: "recent", name: "Recently Signed & Awaiting Signature", lastUpdated: "1 hour ago", viewCount: 156 },
      { id: "cancelled", name: "Cancelled, Expired & On Hold", lastUpdated: "5 hours ago", viewCount: 89 },
      { id: "abandoned", name: "Abandoned (No Recent Activity)", lastUpdated: "1 day ago", viewCount: 45 },
      { id: "draft", name: "Draft Contracts", lastUpdated: "30 min ago", viewCount: 312 },
    ],
  },
  {
    id: "renewals",
    name: "Renewal & Expiration Reports",
    icon: <RefreshCcw size={18} />,
    reports: [
      { id: "history", name: "Renewal History", lastUpdated: "3 hours ago", viewCount: 178 },
      { id: "missed", name: "Missed Renewals & Terminations", lastUpdated: "2 hours ago", viewCount: 234 },
      { id: "upcoming", name: "Upcoming Renewals", lastUpdated: "30 min ago", viewCount: 567 },
      { id: "unauthorized", name: "Unauthorized & Delayed Renewals", lastUpdated: "4 hours ago", viewCount: 98 },
    ],
  },
  {
    id: "workflow",
    name: "Workflow Reports",
    icon: <Workflow size={18} />,
    reports: [
      { id: "cycle-time", name: "Cycle Time Report", lastUpdated: "6 hours ago", viewCount: 145 },
      { id: "bottlenecks", name: "Bottleneck Analysis", lastUpdated: "2 hours ago", viewCount: 289 },
    ],
  },
  {
    id: "access",
    name: "Access & Permission Reports",
    icon: <ShieldCheck size={18} />,
    reports: [
      { id: "role-access", name: "Role Access Summary", lastUpdated: "1 day ago", viewCount: 67 },
      { id: "permission-audit", name: "Permission Audit Log", lastUpdated: "2 hours ago", viewCount: 423 },
    ],
  },
];

export default function ReportsSection() {
  const [activeCategory, setActiveCategory] = useState<ReportCategory>(REPORT_DATA[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const navigate = useNavigate();

  // Filter reports based on search
  const filteredReports = activeCategory.reports.filter((report) =>
    report.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleReportClick = (categoryId: string, reportId: string) => {
    navigate(`/reports/${categoryId}/${reportId}`);
  };

  const toggleFavorite = (e: React.MouseEvent, reportId: string) => {
    e.stopPropagation();
    const newFavorites = new Set(favorites);
    if (newFavorites.has(reportId)) {
      newFavorites.delete(reportId);
    } else {
      newFavorites.add(reportId);
    }
    setFavorites(newFavorites);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* ===== HEADER ===== */}
      <div className="px-8 pt-8 pb-6 border-b border-gray-200/40 bg-white/50 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ChartBarIcon className="w-7 h-7 text-emerald-600" />
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
              Reports Analytics
            </h1>
          </div>
          
          {/* Metadata Display */}
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Zap size={14} className="text-emerald-500" />
              Real-time data
            </div>
            <div className="w-px h-4 bg-gray-300"></div>
            <div className="flex items-center gap-1">
              <Clock size={14} />
              Last updated 30 min ago
            </div>
          </div>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex flex-1 px-6 pb-8 gap-6 overflow-hidden">
        {/* ===== LEFT SIDEBAR ===== */}
        <aside className="w-72 shrink-0 flex flex-col bg-white/70 backdrop-blur-md border border-gray-200/60 rounded-2xl p-4 shadow-sm overflow-y-auto">
          <div className="flex flex-col gap-2">
            {REPORT_DATA.map((category) => {
              const active = activeCategory.id === category.id;

              return (
                <button
                  key={category.id}
                  onClick={() => {
                    setActiveCategory(category);
                    setSearchTerm("");
                  }}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                    ${
                      active
                        ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md"
                        : "text-gray-700 hover:bg-gray-100"
                    }
                  `}
                >
                  <span className={`${active ? "text-white" : "text-emerald-600"}`}>
                    {category.icon}
                  </span>
                  <span className="flex-1 text-left">{category.name}</span>
                  {active && (
                    <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                      {category.reports.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        {/* ===== RIGHT CONTENT AREA ===== */}
        <div className="flex-1 flex flex-col bg-white/70 backdrop-blur-md border border-gray-200/60 rounded-2xl shadow-sm overflow-hidden">
          {/* === CONTENT HEADER WITH SEARCH === */}
          <div className="border-b border-gray-200/50 p-6 bg-gradient-to-r from-white/50 to-emerald-50/30">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {activeCategory.name}
              </h2>
              <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {filteredReports.length} reports
              </span>
            </div>

            {/* === SEARCH & FILTERS === */}
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                Filters
              </button>
            </div>
          </div>

          {/* === REPORTS GRID === */}
          <div className="flex-1 p-6 overflow-y-auto">
            {filteredReports.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <FileText size={40} className="text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No reports found</p>
                  <p className="text-xs text-gray-400 mt-1">Try adjusting your search</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {filteredReports.map((report) => (
                  <div
                    key={report.id}
                    onClick={() => handleReportClick(activeCategory.id, report.id)}
                    className="
                      group
                      rounded-xl
                      border border-gray-200
                      bg-white
                      p-4
                      cursor-pointer
                      transition-all
                      hover:shadow-md
                      hover:-translate-y-0.5
                      hover:border-emerald-200
                      overflow-hidden
                      relative
                      h-56
                    "
                  >
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/5 group-hover:to-emerald-500/10 transition-all pointer-events-none" />

                    <div className="relative z-10 flex flex-col h-full">
                      {/* Header with Icon and Favorite */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors">
                          <FileText size={16} className="text-emerald-600" />
                        </div>
                        <button
                          onClick={(e) => toggleFavorite(e, report.id)}
                          className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <Star
                            size={14}
                            className={`transition-all ${
                              favorites.has(report.id)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        </button>
                      </div>

                      {/* Report Title */}
                      <h3 className="font-semibold text-sm text-gray-900 group-hover:text-emerald-600 transition mb-2 line-clamp-2">
                        {report.name}
                      </h3>

                      {/* Metadata */}
                      <div className="flex flex-col gap-2 text-xs text-gray-500 mb-auto pb-3 border-t border-gray-100">
                        {report.lastUpdated && (
                          <div className="flex items-center gap-1 mt-2">
                            <Clock size={11} />
                            <span className="line-clamp-1">{report.lastUpdated}</span>
                          </div>
                        )}
                        {report.viewCount && (
                          <div className="flex items-center gap-1">
                            <TrendingUp size={11} />
                            {report.viewCount} views
                          </div>
                        )}
                      </div>

                      {/* Action Buttons - Always Visible */}
                      <div className="flex gap-2 mt-3">
                        <button
                          className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-emerald-100 hover:text-emerald-700 rounded-lg transition-colors"
                        >
                          <Download size={11} />
                          <span className="hidden sm:inline">Export</span>
                        </button>
                        <button
                          className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-emerald-100 hover:text-emerald-700 rounded-lg transition-colors"
                        >
                          <Share2 size={11} />
                          <span className="hidden sm:inline">Share</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}