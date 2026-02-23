/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useNavigate } from "react-router-dom";

export const PremiumReportGroup = ({
  title,
  description,
  reports,
  defaultOpen = false,
  categoryId,
}: any) => {
  const [open, setOpen] = React.useState(defaultOpen);
  const navigate = useNavigate();

  // ✅ Handle report click - navigate to details with data
  const handleReportClick = (report: any, reportIndex: number) => {
    // Generate a unique reportId (slug from report name)
    const reportId = report.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    navigate(`/reports/${categoryId}/${reportId}`, {
      state: {
        reportData: report.payload || [],
        reportName: report.name,
        categoryId: categoryId,
      },
    });
  };

  return (
    <div className="rounded-2xl border bg-white hover:shadow-md transition">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-6 py-5 flex justify-between text-left"
      >
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
        <span className={`transition ${open ? "rotate-180" : ""}`}>⌄</span>
      </button>

      {open && (
        <div className="px-6 pb-6 flex flex-wrap gap-3">
          {reports.map((r: any, index: number) => (
            <button
              key={`${r.name}-${index}`}
              onClick={() => handleReportClick(r, index)}
              className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 hover:shadow-md text-sm font-medium cursor-pointer transition-all duration-200"
            >
              {r.name} {r.count && `(${r.count})`}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};