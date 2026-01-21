import {
  FileTextOutlined,
  ClockCircleOutlined,
  ThunderboltOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import StatCard from "../common/StatCard";

const StatsOverview = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 mx-8  my-4">
    <StatCard
      label="Active Contracts"
      value="1,284"
      trend={12}
      icon={<FileTextOutlined />}
      color="emerald"
    />
    <StatCard
      label="Pending Renewals"
      value="42"
      trend={-5}
      icon={<ClockCircleOutlined />}
      color="amber"
    />
    <StatCard
      label="Total Savings"
      value="$2.4M"
      trend={18}
      icon={<ThunderboltOutlined />}
      color="purple"
    />
    <StatCard
      label="Compliance Score"
      value="98%"
      trend={2}
      icon={<BarChartOutlined />}
      color="blue"
    />
  </div>
);

export default StatsOverview;
