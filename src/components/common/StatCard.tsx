import React from "react";
import Card from "./Card";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";

interface StatCardProps {
  label: string;
  value: string | number;
  trend?: number;
  status?: "good" | "fair" | "poor" | "warning";
  subtexts?: Array<{
    label: string;
    value: number;
    color: string;
  }>;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  trend,
  status,
  subtexts,
  icon,
  color,
}) => {
  const statusConfig = {
    good: { bg: "bg-emerald-50", text: "text-emerald-700", badge: "Good" },
    fair: { bg: "bg-amber-50", text: "text-amber-700", badge: "Fair" },
    poor: { bg: "bg-red-50", text: "text-red-700", badge: "Poor" },
    warning: { bg: "bg-yellow-50", text: "text-yellow-700", badge: "Warning" },
  };

  const config = status ? statusConfig[status] : null;

  return (
    <Card className="flex-1 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="text-[11px] font-bold text-gray-500 uppercase mb-1 tracking-wide">
            {label}
          </p>
          <h4 className="text-3xl font-black text-gray-900">{value}</h4>

          {/* Status Badge */}
          {status && (
            <div
              className={`inline-block mt-2 px-2 py-1 rounded-lg text-[10px] font-bold ${config?.bg} ${config?.text}`}
            >
              {config?.badge}
            </div>
          )}

          {/* Trend */}
          {trend !== undefined && (
            <div
              className={`flex items-center mt-2 text-[10px] font-bold ${
                trend >= 0 ? "text-emerald-600" : "text-rose-600"
              }`}
            >
              {trend >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              <span className="ml-1">{Math.abs(trend)}% vs last month</span>
            </div>
          )}

          {/* Subtexts */}
          {subtexts && (
            <div className="mt-3 space-y-1.5">
              {subtexts.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div
                    className={`w-1.5 h-1.5 rounded-full bg-${item.color}-500`}
                  />
                  <span className="text-[10px] text-gray-600">
                    <span className="font-bold text-gray-900">
                      {item.value}
                    </span>{" "}
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Icon */}
        <div
          className={`w-12 h-12 rounded-xl bg-${color}-50 border border-${color}-100 flex items-center justify-center text-${color}-600 text-lg hover:bg-${color}-100 transition-colors`}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
};

export default StatCard;