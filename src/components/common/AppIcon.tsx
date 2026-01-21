import React from "react";
import {
  InboxOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  FileOutlined,
  ThunderboltOutlined,
  BarChartOutlined,
  ArrowRightOutlined,
  SettingOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";

const AppIcon: React.FC<{ icon: string; className?: string }> = ({
  icon,
  className = "w-5 h-5",
}) => {
  const iconMap: Record<string, React.ReactNode> = {
    inbox: <InboxOutlined className={className} />,
    doc: <FileTextOutlined className={className} />,
    clock: <ClockCircleOutlined className={className} />,
    file: <FileOutlined className={className} />,
    spark: <ThunderboltOutlined className={className} />,
    chart: <BarChartOutlined className={className} />,
    arrow: <ArrowRightOutlined className={className} />,
    gear: <SettingOutlined className={className} />,
  };

  return <>{iconMap[icon] || <AppstoreOutlined className={className} />}</>;
};

export default AppIcon;
