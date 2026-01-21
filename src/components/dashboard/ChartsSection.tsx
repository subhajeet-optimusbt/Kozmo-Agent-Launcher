import Card from "../common/Card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import {
  PERFORMANCE_DATA,
  DISTRIBUTION_DATA,
} from "../../constants/chartsData";

const ChartsSection = () => (
  <div className="lg:col-span-2 space-y-6">
    <Card
      title="Contract Volume Trend"
      extra={
        <button className="text-[10px] font-bold text-emerald-600 hover:underline">
          View Report
        </button>
      }
    >
      <div className="h-[300px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={PERFORMANCE_DATA}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fontWeight: 600, fill: "#94a3b8" }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fontWeight: 600, fill: "#94a3b8" }}
            />
            <RechartsTooltip
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#10b981"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorValue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card title="Status Distribution">
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={DISTRIBUTION_DATA}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {DISTRIBUTION_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <RechartsTooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex justify-center gap-4 mt-2">
          {DISTRIBUTION_DATA.map((item) => (
            <div key={item.name} className="flex items-center gap-1.5">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-[10px] font-bold text-gray-500 uppercase">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Recent Activity">
        <div className="space-y-4 mt-2">
          {[
            {
              user: "Sarah M.",
              action: "approved contract",
              target: "VendorCo MSA",
              time: "2m ago",
            },
            {
              user: "Kozmo AI",
              action: "flagged risk",
              target: "Cloud Services",
              time: "15m ago",
            },
            {
              user: "John D.",
              action: "uploaded document",
              target: "Renewal_v2.pdf",
              time: "1h ago",
            },
          ].map((item, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                {item.user[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-900 leading-tight">
                  <span className="font-black">{item.user}</span>{" "}
                  {item.action}{" "}
                  <span className="font-bold text-emerald-600">
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
  </div>
);

export default ChartsSection;
