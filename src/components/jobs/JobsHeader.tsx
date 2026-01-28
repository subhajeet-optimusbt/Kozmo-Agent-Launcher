/* eslint-disable @typescript-eslint/no-explicit-any */
import { Segmented } from "antd";

type Props = {
  range: "today" | "7d" | "30d";
  onChange: (v: "today" | "7d" | "30d") => void;
};

export default function JobsHeader({ range, onChange }: Props) {
  return (
    <div className="flex justify-between items-start">
      <div>
        <h1 className="text-xl font-semibold">Jobs</h1>
        <p className="text-sm text-gray-500">
          Grouped health by JobType. Click any row to drill into runs.
        </p>
      </div>

      <Segmented
        value={range}
        onChange={(v) => onChange(v as any)}
        options={[
          { label: "Today", value: "today" },
          { label: "Last 7 days", value: "7d" },
          { label: "Last 30 days", value: "30d" },
        ]}
      />
    </div>
  );
}
