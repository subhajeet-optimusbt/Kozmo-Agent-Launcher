import { Select } from "antd";
import { SlidersHorizontal, HeartPulse, PlayCircle } from "lucide-react";

export type ViewType = "health" | "runs";

interface Props {
  view: ViewType;
  onChange: (v: ViewType) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
}

export default function JobsControls({
  view,
  onChange,
  pageSize,
  onPageSizeChange,
}: Props) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-r from-white via-gray-50 to-white px-5 py-3 shadow-sm">
      <div className="flex items-center justify-between">
        {/* -------- ROWS SELECTOR -------- */}
        <div className="flex items-center gap-2 rounded-xl border bg-white px-3 py-1.5 shadow-sm">
          <SlidersHorizontal size={14} className="text-gray-400" />
          <Select
            value={pageSize}
            size="small"
            bordered={false}
            onChange={onPageSizeChange}
            options={[
              { value: 5, label: "5 rows" },
              { value: 10, label: "10 rows" },
              { value: 20, label: "20 rows" },
              { value: 50, label: "50 rows" },
            ]}
          />
        </div>

        {/* -------- VIEW TOGGLE -------- */}
        <div className="flex rounded-xl border bg-white p-1 shadow-sm">
          <ToggleButton
            active={view === "health"}
            label="Health"
            icon={<HeartPulse size={14} />}
            activeClass="from-emerald-500 to-teal-500 ring-emerald-400/40"
            onClick={() => onChange("health")}
          />

          <ToggleButton
            active={view === "runs"}
            label="Runs"
            icon={<PlayCircle size={14} />}
            activeClass="from-indigo-500 to-blue-500 ring-indigo-400/40"
            onClick={() => onChange("runs")}
          />
        </div>
      </div>
    </div>
  );
}

/* ===================== SMALL UI ===================== */

function ToggleButton({
  active,
  label,
  icon,
  activeClass,
  onClick,
}: {
  active: boolean;
  label: string;
  icon: React.ReactNode;
  activeClass: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium
        transition-all
        ${
          active
            ? `bg-gradient-to-r ${activeClass} text-white shadow-md ring-1`
            : "text-gray-600 hover:bg-gray-100"
        }
      `}
    >
      {icon}
      {label}
    </button>
  );
}
