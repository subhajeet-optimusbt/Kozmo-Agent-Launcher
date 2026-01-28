/* eslint-disable @typescript-eslint/no-explicit-any */
import { Table, Tag, Progress } from "antd";
import {
  Activity,
  Clock,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

/* ===================== TYPES ===================== */

type Props = {
  view: "health" | "runs";
  jobs: any[];
  loading: boolean;
};

/* ===================== COMPONENT ===================== */

export default function JobsTable({ view, jobs, loading }: Props) {
  const runsData = jobs.map((j) => ({
    key: j.rowKey,
    type: j.jobName,
    run: j.requestId,
    status: j.status,
    started: new Date(j.startedAt).toLocaleString(),
    duration: `${j.timeTaken}s`,
    attempts: j.attemptNumber,
  }));

  const healthData = buildHealthData(jobs);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <Table<any>
        loading={loading}
        pagination={false}
        size="middle"
        className="jobs-table"
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
    { running: number; queued: number; failed: number }
  > = {};

  jobs.forEach((j) => {
    if (!grouped[j.jobName]) {
      grouped[j.jobName] = { running: 0, queued: 0, failed: 0 };
    }

    if (j.status === "Running") grouped[j.jobName].running++;
    if (j.status === "Queued") grouped[j.jobName].queued++;
    if (j.status === "Failed") grouped[j.jobName].failed++;
  });

  return Object.entries(grouped).map(([jobName, v]) => {
    const score =
      v.failed === 0
        ? 100
        : Math.max(0, 100 - v.failed * 10);

    return {
      key: jobName,
      type: jobName,
      running: v.running,
      queued: v.queued,
      failed: v.failed,
      p95: "-",
      score,
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
    title: "Running",
    dataIndex: "running",
    render: (v: number) => (
      <Metric
        icon={<Activity size={14} />}
        value={v}
        color="green"
      />
    ),
  },
  {
    title: "Queued",
    dataIndex: "queued",
    render: (v: number) => (
      <Metric
        icon={<Clock size={14} />}
        value={v}
        color="orange"
      />
    ),
  },
  {
    title: "Failed",
    dataIndex: "failed",
    render: (v: number) => (
      <Metric
        icon={<AlertCircle size={14} />}
        value={v}
        color="red"
      />
    ),
  },
  {
    title: "p95",
    dataIndex: "p95",
    render: (v: string) => (
      <span className="text-sm font-medium text-gray-600">
        {v}
      </span>
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
            v > 80
              ? "#22c55e"
              : v > 50
              ? "#f59e0b"
              : "#ef4444"
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
    render: (v: string) => (
      <div className="font-medium text-gray-800">{v}</div>
    ),
  },
  {
    title: "Request / Run",
    dataIndex: "run",
    render: (v: string) => (
      <span className="text-sm text-gray-600">{v}</span>
    ),
  },
  {
    title: "Status",
    dataIndex: "status",
    render: (v: string) => (
      <StatusPill status={v} />
    ),
  },
  {
    title: "Started",
    dataIndex: "started",
    render: (v: string) => (
      <span className="text-sm text-gray-500">{v}</span>
    ),
  },
  {
    title: "Duration",
    dataIndex: "duration",
    render: (v: string) => (
      <span className="text-sm font-medium text-gray-700">
        {v}
      </span>
    ),
  },
  {
    title: "Attempts",
    dataIndex: "attempts",
    render: (v: number) => (
      <span className="text-sm text-gray-600">{v}</span>
    ),
  },
];

/* ===================== SMALL UI PIECES ===================== */

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
  if (status === "Completed") {
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

  return (
    <Tag color="default" className="px-3 py-1 rounded-full">
      {status}
    </Tag>
  );
}
