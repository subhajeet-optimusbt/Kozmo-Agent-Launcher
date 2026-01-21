import React from "react";
import Card from "./Card";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";

const StatCard: React.FC<{
  label: string;
  value: string | number;
  trend?: number;
  icon: React.ReactNode;
  color: string;
}> = ({ label, value, trend, icon, color }) => (
  <Card className="flex-1">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-[11px] font-bold text-gray-500 uppercase mb-1">
          {label}
        </p>
        <h4 className="text-2xl font-black text-gray-900">{value}</h4>
        {trend !== undefined && (
          <div
            className={`flex items-center mt-1 text-[10px] font-bold ${
              trend >= 0 ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {trend >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            <span className="ml-1">{Math.abs(trend)}% vs last month</span>
          </div>
        )}
      </div>
      <div
        className={`w-10 h-10 rounded-xl bg-${color}-50 border border-${color}-100 flex items-center justify-center text-${color}-600`}
      >
        {icon}
      </div>
    </div>
  </Card>
);

export default StatCard;
