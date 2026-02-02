/* eslint-disable @typescript-eslint/no-explicit-any */
import { Table, Tag, Progress } from "antd";
import {
  Activity,
  Clock,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

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

/* ===================== TYPES ===================== */

type Props = {
  view: "health" | "runs";
  jobs: any[];
};

/* ===================== COMPONENT ===================== */

export default function JobsTable({ view, jobs }: Props) {
  const runsData = jobs.map((j) => ({
    key: j.rowKey,
    type: j.jobName,
    run: j.requestIntId || "-",
    status: j.status,
    started: j.startedAt
      ? new Date(j.startedAt).toLocaleString()
      : "-",
    duration:
      typeof j.timeTaken === "number" && j.timeTaken > 0
        ? `${j.timeTaken}s`
        : "-",
    attempts: j.attemptNumber ?? 0,
  }));

  const healthData = buildHealthData(jobs);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <Table<any>
        pagination={false}
        size="middle"
        rowKey="key"
        columns={view === "health" ? healthColumns : runsColumns}
        dataSource={view === "health" ? healthData : runsData}
      />
    </div>
  );
}

/* ===================== HEALTH DATA ===================== */

function buildHealthData(jobs: any[]) {
  const grouped: Record<
    string,
    {
      completed: number;
      failed: number;
      running: number;
      queued: number;
      durations: number[];
    }
  > = {};

  jobs.forEach((j) => {
    if (!grouped[j.jobName]) {
      grouped[j.jobName] = {
        completed: 0,
        failed: 0,
        running: 0,
        queued: 0,
        durations: [],
      };
    }

    if (j.status === JOB_STATUS.COMPLETED)
      grouped[j.jobName].completed++;

    if (j.status === JOB_STATUS.FAILED)
      grouped[j.jobName].failed++;

    if (j.status === JOB_STATUS.RUNNING)
      grouped[j.jobName].running++;

    if (j.status === JOB_STATUS.QUEUED)
      grouped[j.jobName].queued++;

    // ✅ P95 only from completed jobs
    if (
      j.status === JOB_STATUS.COMPLETED &&
      typeof j.timeTaken === "number" &&
      j.timeTaken > 0
    ) {
      grouped[j.jobName].durations.push(j.timeTaken);
    }
  });

  return Object.entries(grouped).map(([jobName, v]) => {
    const C = v.completed;
    const F = v.failed;
    const R = v.running;

    const successRate =
      C + F === 0 ? 100 : (C / (C + F)) * 100;

    const inFlightPressure =
      C + F + R === 0 ? 0 : (R / (C + F + R)) * 100;

    const healthScore =
      0.8 * successRate +
      0.2 * (100 - inFlightPressure);

    const p95 = calculateP95(v.durations);

    return {
      key: jobName,
      type: jobName,
      running: R,
      queued: v.queued,
      failed: F,
      p95: `${Math.round(p95)}s`,
      score: Math.round(healthScore),
    };
  });
}

/* ===================== HEALTH COLUMNS ===================== */

const healthColumns = [
  {
    title: "Job Type",
    dataIndex: "type",
    render: (v: string) => (
      <div className="font-medium text-gray-800">{v}</div>
    ),
  },
  {
    title: "In Progress",
    dataIndex: "running",
    render: (v: number) => (
      <Metric icon={<Activity size={14} />} value={v} color="green" />
    ),
  },
  {
    title: "Queued",
    dataIndex: "queued",
    render: (v: number) => (
      <Metric icon={<Clock size={14} />} value={v} color="orange" />
    ),
  },
  {
    title: "Failed",
    dataIndex: "failed",
    render: (v: number) => (
      <Metric icon={<AlertCircle size={14} />} value={v} color="red" />
    ),
  },
  {
    title: "P95",
    dataIndex: "p95",
    render: (v: string) => (
      <span className="text-sm font-medium text-gray-600">{v}</span>
    ),
  },
  {
    title: "Health Score",
    dataIndex: "score",
    render: (v: number) => (
      <div className="flex items-center gap-3 min-w-[160px]">
        <span className="text-sm font-semibold text-gray-700">
          {v}%
        </span>
        <Progress
          percent={v}
          showInfo={false}
          strokeColor={
            v > 80 ? "#22c55e" : v > 50 ? "#f59e0b" : "#ef4444"
          }
          trailColor="#f1f5f9"
          strokeWidth={8}
        />
      </div>
    ),
  },
];

/* ===================== RUNS COLUMNS ===================== */

const runsColumns = [
  {
    title: "Job Type",
    dataIndex: "type",
  },
  {
    title: "Request / Run",
    dataIndex: "run",
  },
  {
    title: "Status",
    dataIndex: "status",
    render: (v: string) => <StatusPill status={v} />,
  },
  {
    title: "Started",
    dataIndex: "started",
  },
  {
    title: "Duration",
    dataIndex: "duration",
  },
  {
    title: "Attempts",
    dataIndex: "attempts",
  },
];

/* ===================== SMALL UI ===================== */

function Metric({
  icon,
  value,
  color,
}: {
  icon: React.ReactNode;
  value: number;
  color: "green" | "orange" | "red";
}) {
  const colorMap = {
    green: "text-green-600 bg-green-50",
    orange: "text-orange-600 bg-orange-50",
    red: "text-red-600 bg-red-50",
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`p-1.5 rounded-lg ${colorMap[color]}`}>
        {icon}
      </div>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  if (status === JOB_STATUS.COMPLETED) {
    return (
      <Tag
        icon={<CheckCircle2 size={12} />}
        color="success"
        className="px-3 py-1 rounded-full"
      >
        Completed
      </Tag>
    );
  }

  if (status === JOB_STATUS.RUNNING) {
    return <Tag color="green">In Progress</Tag>;
  }

  if (status === JOB_STATUS.QUEUED) {
    return <Tag color="orange">Queued</Tag>;
  }

  if (status === JOB_STATUS.FAILED) {
    return <Tag color="red">Failed</Tag>;
  }

  return <Tag>{status}</Tag>;
}
