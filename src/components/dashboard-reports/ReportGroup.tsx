/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

export const PremiumReportGroup = ({
  title,
  description,
  reports,
  defaultOpen = false,
}: any) => {
  const [open, setOpen] = React.useState(defaultOpen);

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
          {reports.map((r: any) => (
            <span
              key={r.name}
              className="px-4 py-2 rounded-full bg-slate-100 text-sm font-medium"
            >
              {r.name} {r.count && `(${r.count})`}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
