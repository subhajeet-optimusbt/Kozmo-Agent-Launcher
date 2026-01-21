import { Table, Tag, Progress } from "antd";
import {
  Activity,
  Clock,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import {
  JOB_HEALTH_DATA,
  JOB_RUNS_DATA,
  type JobHealthRow,
  type JobRunRow,
} from "../../constants/apps";

export default function JobsTable({ view }: { view: "health" | "runs" }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <Table<JobHealthRow | JobRunRow>
        rowKey="key"
        pagination={false}
        size="middle"
        className="jobs-table"
        columns={view === "health" ? healthColumns : runsColumns}
        dataSource={view === "health" ? JOB_HEALTH_DATA : JOB_RUNS_DATA}
      />
    </div>
  );
}

/* -------------------- HEALTH VIEW -------------------- */

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
    title: "p95",
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

/* -------------------- RUNS VIEW -------------------- */

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

/* -------------------- SMALL UI PIECES -------------------- */

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
      <div
        className={`p-1.5 rounded-lg ${colorMap[color]}`}
      >
        {icon}
      </div>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  if (status === "Done") {
    return (
      <Tag
        icon={<CheckCircle2 size={12} />}
        color="success"
        className="px-3 py-1 rounded-full"
      >
        Done
      </Tag>
    );
  }

  return (
    <Tag color="default" className="px-3 py-1 rounded-full">
      {status}
    </Tag>
  );
}
