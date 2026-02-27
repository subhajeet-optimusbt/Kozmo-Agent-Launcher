/* eslint-disable @typescript-eslint/no-explicit-any */
import Card from "../common/Card";
import { Skeleton } from "antd";
import {
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  AlertOutlined,
} from "@ant-design/icons";

interface AgentMetricsSectionProps {
  intakeMetrics: any;
  documentMetrics: any;
  contractMetrics: any;
  renewalMetrics: any;
  loading: boolean;
}

const AgentMetricsSection = ({
  intakeMetrics,
  documentMetrics,
  contractMetrics,
  renewalMetrics,
  loading,
}: AgentMetricsSectionProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} active paragraph={{ rows: 3 }} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Intake Agent Metrics */}
      {intakeMetrics && (
        <Card title="Intake Agent (DMA)" className="lg:col-span-1">
          <div className="space-y-3">
            <AgentMetricRow
              icon={<ClockCircleOutlined />}
              label="In Progress"
              value={intakeMetrics.currentMetrics?.running || 0}
              color="blue"
            />
            <AgentMetricRow
              icon={<CheckCircleOutlined />}
              label="Completed"
              value={intakeMetrics.currentMetrics?.completed || 0}
              color="emerald"
            />
            <AgentMetricRow
              icon={<AlertOutlined />}
              label="Failed"
              value={intakeMetrics.currentMetrics?.failed || 0}
              color="red"
            />
            <div className="pt-3 border-t border-gray-100">
              <p className="text-[10px] text-gray-500">Completion Rate</p>
              <p className="text-lg font-bold text-gray-900 mt-1">
                {intakeMetrics.currentMetrics?.completionRate?.toFixed(1) ||
                  0}
                %
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Document Agent Metrics */}
      {documentMetrics && (
        <Card title="Document Agent (DMA)" className="lg:col-span-1">
          <div className="space-y-3">
            <AgentMetricRow
              icon={<FileTextOutlined />}
              label="Running"
              value={documentMetrics.currentMetrics?.running || 0}
              color="blue"
            />
            <AgentMetricRow
              icon={<CheckCircleOutlined />}
              label="Completed"
              value={documentMetrics.currentMetrics?.completed || 0}
              color="emerald"
            />
            <AgentMetricRow
              icon={<AlertOutlined />}
              label="Failed"
              value={documentMetrics.currentMetrics?.failed || 0}
              color="red"
            />
            <div className="pt-3 border-t border-gray-100">
              <p className="text-[10px] text-gray-500">Total Processed</p>
              <p className="text-lg font-bold text-gray-900 mt-1">
                {documentMetrics.currentMetrics?.totalDocuments || 0}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Contract Agent Metrics */}
      {contractMetrics && (
        <Card title="Contract Agent" className="lg:col-span-1">
          <div className="space-y-3">
            <AgentMetricRow
              icon={<CheckCircleOutlined />}
              label="Active Contracts"
              value={contractMetrics.currentMetrics?.activeContracts || 0}
              color="emerald"
            />
            <AgentMetricRow
              icon={<AlertOutlined />}
              label="Expiring (30 days)"
              value={contractMetrics.currentMetrics?.expireWithin30Days || 0}
              color="red"
            />
            <AgentMetricRow
              icon={<ClockCircleOutlined />}
              label="Expiring (90 days)"
              value={contractMetrics.currentMetrics?.expireWithin90Days || 0}
              color="yellow"
            />
            <div className="pt-3 border-t border-gray-100">
              <p className="text-[10px] text-gray-500">Total Contracts</p>
              <p className="text-lg font-bold text-gray-900 mt-1">
                {contractMetrics.currentMetrics?.totalContracts || 0}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Renewal Agent Metrics */}
      {renewalMetrics && (
        <Card title="Renewal Agent" className="lg:col-span-1">
          <div className="space-y-3">
            <AgentMetricRow
              icon={<ClockCircleOutlined />}
              label="Manual Renewals"
              value={renewalMetrics.currentMetrics?.manualRenewals || 0}
              color="blue"
            />
            <AgentMetricRow
              icon={<CheckCircleOutlined />}
              label="Auto Renewals"
              value={renewalMetrics.currentMetrics?.autoRenewals || 0}
              color="emerald"
            />
            <AgentMetricRow
              icon={<AlertOutlined />}
              label="Overdue"
              value={renewalMetrics.currentMetrics?.overdueRenewals || 0}
              color="red"
            />
            <div className="pt-3 border-t border-gray-100">
              <p className="text-[10px] text-gray-500">Total Renewals</p>
              <p className="text-lg font-bold text-gray-900 mt-1">
                {renewalMetrics.currentMetrics?.totalRenewals || 0}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

interface AgentMetricRowProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}

const AgentMetricRow = ({
  icon,
  label,
  value,
  color,
}: AgentMetricRowProps) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <div className={`text-${color}-600 text-sm`}>{icon}</div>
      <span className="text-xs text-gray-600">{label}</span>
    </div>
    <span className="font-bold text-sm text-gray-900">{value}</span>
  </div>
);

export default AgentMetricsSection;