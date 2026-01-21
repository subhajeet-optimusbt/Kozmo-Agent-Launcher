import { Card, Tag } from "antd";
import { Activity, Clock, AlertTriangle, Gauge } from "lucide-react";
import { JOB_KPIS } from "../../constants/apps";

const KPI_CARD_BASE =
  "rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition";

export default function JobsKPIs() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
      {/* In Progress */}
      <Card className={KPI_CARD_BASE} bodyStyle={{ padding: 14 }}>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-500">In Progress</span>
          <div className="p-1.5 rounded-lg bg-green-50 text-green-600">
            <Activity size={14} />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-semibold">
            {JOB_KPIS.inProgress}
          </span>
          <Tag color="green" className="m-0 text-xs">
            Running
          </Tag>
        </div>
      </Card>

      {/* Queued */}
      <Card className={KPI_CARD_BASE} bodyStyle={{ padding: 14 }}>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-500">Queued</span>
          <div className="p-1.5 rounded-lg bg-orange-50 text-orange-600">
            <Clock size={14} />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-semibold">
            {JOB_KPIS.queued}
          </span>
          <Tag color="orange" className="m-0 text-xs">
            Pending
          </Tag>
        </div>
      </Card>

      {/* Failed */}
      <Card className={KPI_CARD_BASE} bodyStyle={{ padding: 14 }}>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-500">Failed</span>
          <div className="p-1.5 rounded-lg bg-red-50 text-red-600">
            <AlertTriangle size={14} />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-semibold">
            {JOB_KPIS.failed}
          </span>
          <Tag color="red" className="m-0 text-xs">
            Alert
          </Tag>
        </div>
      </Card>

      {/* p95 Duration */}
      <Card className={KPI_CARD_BASE} bodyStyle={{ padding: 14 }}>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-500">p95 Duration</span>
          <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
            <Gauge size={14} />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-semibold">
            {JOB_KPIS.p95}
          </span>
          <Tag color="blue" className="m-0 text-xs">
            Latency
          </Tag>
        </div>
      </Card>
    </div>
  );
}
