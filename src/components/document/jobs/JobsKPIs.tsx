/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Tag } from "antd";
import { Activity, Clock, AlertTriangle, Gauge } from "lucide-react";

/* ===================== STATUS CONSTANTS ===================== */

const JOB_STATUS = {
  RUNNING: "Running",
  QUEUED: "NotStarted",
  FAILED: "Failed",
  COMPLETED: "Completed",
} as const;

/* ===================== P95 UTILITY ===================== */

function calculateP95(values: number[]): number {
  if (!values.length) return 0;

  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;

  const pos = 0.95 * (n - 1);
  const lo = Math.floor(pos);
  const hi = Math.ceil(pos);

  if (lo === hi) return sorted[lo];

  return sorted[lo] + (pos - lo) * (sorted[hi] - sorted[lo]);
}

/* ===================== COMPONENT ===================== */

type Props = {
  jobs: any[];
};

const KPI_CARD_BASE =
  "rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition";

export default function JobsKPIs({ jobs }: Props) {
  const running = jobs.filter(
    (j) => j.status === JOB_STATUS.RUNNING
  ).length;

  const queued = jobs.filter(
    (j) => j.status === JOB_STATUS.QUEUED
  ).length;

  const failed = jobs.filter(
    (j) => j.status === JOB_STATUS.FAILED
  ).length;

  // ✅ include completed jobs for P95
  const durations = jobs
    .map((j) => j.timeTaken)
    .filter((t) => typeof t === "number" && t > 0);

  const p95 = calculateP95(durations);

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
        label="P95 Duration"
        value={`${Math.round(p95)}s`}
        icon={<Gauge size={14} />}
        color="blue"
      />
    </div>
  );
}

/* ===================== KPI CARD ===================== */

const COLOR_MAP = {
  green: {
    bg: "bg-green-50",
    text: "text-green-600",
    tag: "green",
  },
  orange: {
    bg: "bg-orange-50",
    text: "text-orange-600",
    tag: "orange",
  },
  red: {
    bg: "bg-red-50",
    text: "text-red-600",
    tag: "red",
  },
  blue: {
    bg: "bg-blue-50",
    text: "text-blue-600",
    tag: "blue",
  },
};

function Kpi({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  color: keyof typeof COLOR_MAP;
}) {
  const c = COLOR_MAP[color];

  return (
    <Card className={KPI_CARD_BASE} bodyStyle={{ padding: 14 }}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-500">{label}</span>
        <div className={`p-1.5 rounded-lg ${c.bg} ${c.text}`}>
          {icon}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-2xl font-semibold">{value}</span>
        <Tag color={c.tag} className="m-0 text-xs">
          {label}
        </Tag>
      </div>
    </Card>
  );
}
