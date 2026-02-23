/* eslint-disable @typescript-eslint/no-explicit-any */
import { TrendingDown, TrendingUp } from "lucide-react";

export const KPI = ({ label, sub, trend }: any) => {

  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 hover:bg-white hover:shadow-md transition">
      <p className="text-xs uppercase tracking-wider text-slate-400 mb-1">
        {label}
      </p>
      <div className="flex items-center gap-2 mt-1">
        {sub && <span className="text-xs text-slate-400">{sub}</span>}
        {trend === "up" && <TrendingUp className="h-3 w-3 text-emerald-500" />}
        {trend === "down" && (
          <TrendingDown className="h-3 w-3 text-rose-500" />
        )}
      </div>
    </div>
  );
};

