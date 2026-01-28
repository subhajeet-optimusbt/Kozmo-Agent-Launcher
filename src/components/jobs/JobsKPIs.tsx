/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Tag } from "antd";
import { Activity, Clock, AlertTriangle, Gauge } from "lucide-react";

type Props = {
  jobs: any[];
};

const KPI_CARD_BASE =
  "rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition";

export default function JobsKPIs({ jobs }: Props) {
  const running = jobs.filter((j) => j.status === "Running").length;
  const queued = jobs.filter((j) => j.status === "Queued").length;
  const failed = jobs.filter((j) => j.status === "Failed").length;

  const p95 =
    jobs.length > 0 ? Math.max(...jobs.map((j) => j.timeTaken || 0)) : 0;
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
      <Kpi
        label="In Progress"
        value={running}
        icon={<Activity size={14} />}
        color="green"
      />
      <Kpi
        label="Queued"
        value={queued}
        icon={<Clock size={14} />}
        color="orange"
      />
      <Kpi
        label="Failed"
        value={failed}
        icon={<AlertTriangle size={14} />}
        color="red"
      />
      <Kpi
        label="p95 Duration"
        value={`${p95}s`}
        icon={<Gauge size={14} />}
        color="blue"
      />
    </div>
  );
}

function Kpi({ label, value, icon, color }: any) {
  return (
    <Card className={KPI_CARD_BASE} bodyStyle={{ padding: 14 }}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-500">{label}</span>
        <div className={`p-1.5 rounded-lg bg-${color}-50 text-${color}-600`}>
          {icon}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-2xl font-semibold">{value}</span>
        <Tag color={color} className="m-0 text-xs">
          {label}
        </Tag>
      </div>
    </Card>
  );
}
