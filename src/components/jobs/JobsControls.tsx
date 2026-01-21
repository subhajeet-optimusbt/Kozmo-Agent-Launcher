import { Segmented, Select, Button, Badge } from "antd";
import { Filter, Layers, SlidersHorizontal } from "lucide-react";

type ViewType = "health" | "runs";

interface Props {
  view: ViewType;
  onChange: (v: ViewType) => void;
}

export default function JobsControls({ view, onChange }: Props) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-r from-white via-gray-50 to-white px-5 py-2 shadow-sm">
      {/* subtle top accent */}
      <div className="absolute inset-x-0 top-0 h-[2px] " />

      <div className="flex items-center justify-between">
        {/* Left: Filters */}
        <Button
          type="default"
          icon={<Filter size={16} />}
          className="
            rounded-xl font-medium
            border-gray-200
            hover:border-blue-400 hover:text-blue-600
            transition
          "
        >
          Filters & Facets
          <Badge
            count={3}
            size="small"
            className="ml-2"
            style={{ backgroundColor: "#6366f1" }}
          />
        </Button>

        {/* Right: Controls */}
        <div className="flex items-center gap-4">
          {/* Rows selector */}
          <div className="flex items-center gap-2 rounded-xl border bg-white px-3 py-1.5 shadow-sm">
            <SlidersHorizontal size={14} className="text-gray-400" />
            <Select
              value={10}
              size="small"
              bordered={false}
              className="min-w-[90px]"
              options={[
                { value: 10, label: "10 rows" },
                { value: 20, label: "20 rows" },
                { value: 50, label: "50 rows" },
              ]}
            />
          </div>

          {/* View switch */}
          <div className="rounded-xl border bg-white p-1 shadow-sm">
            <Segmented
              value={view}
              onChange={(v) => onChange(v as ViewType)}
              className="jobs-view-switch"
              options={[
                {
                  label: (
                    <span className="flex items-center gap-2 px-2">
                      <Layers size={14} />
                      Health
                    </span>
                  ),
                  value: "health",
                },
                {
                  label: (
                    <span className="flex items-center gap-2 px-2">
                      <Layers size={14} />
                      Runs
                    </span>
                  ),
                  value: "runs",
                },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
