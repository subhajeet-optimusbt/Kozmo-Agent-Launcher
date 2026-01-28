import { Button, Select, Badge } from "antd";
import { Filter, SlidersHorizontal, HeartPulse, PlayCircle } from "lucide-react";

type ViewType = "health" | "runs";

interface Props {
  view: ViewType;
  onChange: (v: ViewType) => void;
}

export default function JobsControls({ view, onChange }: Props) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-r from-white via-gray-50 to-white px-5 py-3 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Filter */}
        <Button
          icon={<Filter size={16} />}
          className="rounded-xl border-gray-200 shadow-sm"
        >
          Filters
          <Badge count={3} size="small" className="ml-2" />
        </Button>

        <div className="flex items-center gap-4">
          {/* Rows */}
          <div className="flex items-center gap-2 rounded-xl border bg-white px-3 py-1.5 shadow-sm">
            <SlidersHorizontal size={14} className="text-gray-400" />
            <Select
              value={10}
              size="small"
              bordered={false}
              options={[
                { value: 10, label: "10 rows" },
                { value: 20, label: "20 rows" },
                { value: 50, label: "50 rows" },
              ]}
            />
          </div>

          {/* --------- CUSTOM VIEW TOGGLE --------- */}
          <div className="flex rounded-xl border bg-white p-1 shadow-sm">
            {/* Health */}
            <button
              onClick={() => onChange("health")}
              className={`
                flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium
                transition-all
                ${
                  view === "health"
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md ring-1 ring-emerald-400/40"
                    : "text-gray-600 hover:bg-gray-100"
                }
              `}
            >
              <HeartPulse size={14} />
              Health
            </button>

            {/* Runs */}
            <button
              onClick={() => onChange("runs")}
              className={`
                flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium
                transition-all
                ${
                  view === "runs"
                    ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-md ring-1 ring-indigo-400/40"
                    : "text-gray-600 hover:bg-gray-100"
                }
              `}
            >
              <PlayCircle size={14} />
              Runs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
