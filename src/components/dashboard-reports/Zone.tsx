/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArrowUpRight } from "lucide-react";
import { KPI } from "./KPI";

const PALETTES: any = {
  emerald: "bg-emerald-50 text-emerald-600 ring-emerald-100",
  blue: "bg-blue-50 text-blue-600 ring-blue-100",
  violet: "bg-violet-50 text-violet-600 ring-violet-100",
  amber: "bg-amber-50 text-amber-600 ring-amber-100",
  rose: "bg-rose-50 text-rose-600 ring-rose-100",
  cyan: "bg-cyan-50 text-cyan-600 ring-cyan-100",
};

export const Zone = ({ title, description, icon: Icon, kpis, palette }: any) => {
  return (
    <div className="rounded-2xl border bg-white p-6 hover:shadow-lg transition">
      <div className="flex justify-between">
        <div className="flex gap-3">
          <div
            className={`h-11 w-11 rounded-xl flex items-center justify-center ${PALETTES[palette]}`}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{title}</h3>
            <p className="text-sm text-slate-400">{description}</p>
          </div>
        </div>

        <button className="flex items-center gap-1 text-xs border rounded-full px-3 py-1.5">
          Open <ArrowUpRight className="h-3 w-3" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-5">
        {kpis.map((k: any) => (
          <KPI key={k.label} {...k} />
        ))}
      </div>
    </div>
  );
};
