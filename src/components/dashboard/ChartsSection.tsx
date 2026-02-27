/* eslint-disable @typescript-eslint/no-explicit-any */
import Card from "../common/Card";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  LineChart,
  Line,
} from "recharts";
import { Skeleton } from "antd";
import { formatCurrency } from "../../services/formmatters";

interface ChartsSectionProps {
  widgets: any[];
  contractMetrics: any;
  loading: boolean;
}

const ChartsSection = ({ widgets, loading }: ChartsSectionProps) => {
  const getWidgetData = (widgetId: string) => {
    return widgets.find((w) => w.widgetId === widgetId);
  };

  const performanceData = getWidgetData("WG034")?.data; // Health Index Trend
  const invoiceDistribution = getWidgetData("WG014")?.data; // Invoice Status
  const topContracts = getWidgetData("WG033")?.data; // Top 10 Contracts

  // Transform health index data for chart
  const healthTrendData = performanceData
    ? Object.entries(performanceData).map(([month, value]) => ({
        name: month,
        value: value as number,
      }))
    : [];

  // Transform invoice data
  const invoiceChartData = invoiceDistribution
    ? Object.entries(invoiceDistribution).map(([name, value]) => ({
        name,
        value: value as number,
        color:
          name === "Pending"
            ? "#f59e0b"
            : name === "Paid"
              ? "#10b981"
              : "#8b5cf6",
      }))
    : [];

  if (loading) {
    return (
      <div className="lg:col-span-2 space-y-6">
        <Skeleton active />
        <Skeleton active />
        <Skeleton active />
      </div>
    );
  }

  return (
    <div className="lg:col-span-2 space-y-6">
      {/* Health Index Trend */}
      <Card
        title="Health Index Trend (Monthly)"
        extra={
          <button className="text-[10px] font-bold text-emerald-600 hover:underline transition-all hover:gap-2">
            View Details →
          </button>
        }
      >
        <div className="h-[300px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={healthTrendData}>
              <defs>
                <linearGradient id="colorHealth" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fontWeight: 600, fill: "#94a3b8" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fontWeight: 600, fill: "#94a3b8" }}
                domain={[0, 100]}
              />
              <RechartsTooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  background: "#fff",
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: "#10b981", r: 5 }}
                activeDot={{ r: 7 }}
                fillOpacity={1}
                fill="url(#colorHealth)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Invoice & Activity Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Invoice Status Distribution */}
        <Card title="Invoice Status Distribution">
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={invoiceChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {invoiceChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    background: "#fff",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-4 mt-4 flex-wrap">
            {invoiceChartData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-[11px] font-bold text-gray-600 uppercase">
                  {item.name} ({item.value})
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card title="Recent Activity & Updates">
          <div className="space-y-3">
            {[
              {
                user: "Sarah M.",
                action: "approved contract",
                target: "VendorCo MSA",
                time: "2m ago",
                color: "emerald",
              },
              {
                user: "Kozmo AI",
                action: "flagged risk",
                target: "Cloud Services",
                time: "15m ago",
                color: "yellow",
              },
              {
                user: "John D.",
                action: "uploaded document",
                target: "Renewal_v2.pdf",
                time: "1h ago",
                color: "blue",
              },
              {
                user: "Emma L.",
                action: "completed review",
                target: "Q1 Contracts",
                time: "2h ago",
                color: "purple",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex gap-3 items-start p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div
                  className={`w-9 h-9 rounded-lg bg-${item.color}-100 flex items-center justify-center text-xs font-bold text-${item.color}-700 flex-shrink-0`}
                >
                  {item.user[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-900 leading-tight">
                    <span className="font-bold">{item.user}</span>{" "}
                    <span className="text-gray-600">{item.action}</span>
                    <span className={`font-bold text-${item.color}-600 ml-1`}>
                      {item.target}
                    </span>
                  </p>
                  <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                    {item.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Top 10 High Value Contracts Table */}
      {topContracts && (
        <Card title="Top 10 High Value Contracts">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-bold text-gray-600 uppercase">
                    Contract
                  </th>
                  <th className="text-left py-3 px-4 font-bold text-gray-600 uppercase">
                    Counterparty
                  </th>
                  <th className="text-left py-3 px-4 font-bold text-gray-600 uppercase">
                    Type
                  </th>
                  <th className="text-right py-3 px-4 font-bold text-gray-600 uppercase">
                    Value
                  </th>
                  <th className="text-center py-3 px-4 font-bold text-gray-600 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {topContracts.slice(0, 5).map((contract: any) => (
                  <tr
                    key={contract.contractId}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4 font-medium text-gray-900 truncate">
                      {contract.title.substring(0, 30)}...
                    </td>
                    <td className="py-3 px-4 text-gray-600 truncate">
                      {contract.counterparty.substring(0, 20)}...
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {contract.type === "Primary Agreement"
                        ? "Primary"
                        : "Other"}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-gray-900">
                      {formatCurrency(contract.value)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                          contract.status === "Active"
                            ? "bg-emerald-100 text-emerald-700"
                            : contract.status === "Signed"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {contract.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ChartsSection;
