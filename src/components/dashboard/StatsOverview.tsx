/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  FileTextOutlined,
  ThunderboltOutlined,
  BarChartOutlined,
  DollarOutlined,
  AlertOutlined,
} from "@ant-design/icons";
import StatCard from "../common/StatCard";
import { Skeleton } from "antd";

interface StatsOverviewProps {
  widgets: any[];
  loading: boolean;
}

const StatsOverview = ({ widgets, loading }: StatsOverviewProps) => {
  const getWidgetData = (widgetId: string) => {
    return widgets.find((w) => w.widgetId === widgetId)?.data;
  };

  const totalContracts = getWidgetData("WG001");
  const contractHealth = getWidgetData("WG006");
  const revenueAtRisk = getWidgetData("WG011");
  const paymentReliability = getWidgetData("WG012");
  const openIssues = getWidgetData("WG016");

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6 mx-8 my-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} active paragraph={{ rows: 2 }} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6 mx-8 my-4">
      <StatCard
        label="Total Contracts"
        value={totalContracts?.totalContracts || 0}
        subtexts={[
          {
            label: "Active",
            value: totalContracts?.statusWiseBreakdown?.Active || 0,
            color: "emerald",
          },
          {
            label: "Signed",
            value: totalContracts?.statusWiseBreakdown?.Signed || 0,
            color: "blue",
          },
        ]}
        icon={<FileTextOutlined />}
        color="emerald"
      />

      <StatCard
        label="Contract Health"
        value={contractHealth ? `${contractHealth.toFixed(1)}%` : "0%"}
        status={
          contractHealth >= 75 ? "good" : contractHealth >= 60 ? "fair" : "poor"
        }
        icon={<BarChartOutlined />}
        color="blue"
      />

      <StatCard
        label="Revenue at Risk"
        value={
          revenueAtRisk
            ? `$${(revenueAtRisk.totalRevenueAtRisk / 1000).toFixed(1)}K`
            : "$0"
        }
        trend={-5}
        icon={<ThunderboltOutlined />}
        color="amber"
      />

      <StatCard
        label="Payment Reliability"
        value={paymentReliability ? `${paymentReliability}%` : "0%"}
        status="good"
        icon={<DollarOutlined />}
        color="purple"
      />

      <StatCard
        label="Open Issues"
        value={openIssues || 0}
        status={openIssues > 5 ? "warning" : "good"}
        icon={<AlertOutlined />}
        color="red"
      />
    </div>
  );
};

export default StatsOverview;
