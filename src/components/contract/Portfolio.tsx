import { useState, type JSX } from "react";

// ==================== DESIGN 1: DASHBOARD LAYOUT ====================
// Full-width chart with floating metrics cards overlay
const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Main Chart Area with Floating Cards */}
        <div className="relative">
          {/* Background Chart */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <div className="relative h-[600px]">
              {/* Quadrant Labels - Corner Positioned */}
              <div className="absolute top-6 left-6 z-10">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white px-4 py-2 rounded-xl shadow-lg">
                  <div className="text-xs font-semibold opacity-90">
                    CHALLENGERS
                  </div>
                  <div className="text-2xl font-bold">14</div>
                </div>
              </div>

              <div className="absolute top-6 right-6 z-10">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white px-4 py-2 rounded-xl shadow-lg">
                  <div className="text-xs font-semibold opacity-90">
                    LEADERS
                  </div>
                  <div className="text-2xl font-bold">22</div>
                </div>
              </div>

              <div className="absolute bottom-6 left-6 z-10">
                <div className="bg-gradient-to-br from-gray-400 to-gray-500 text-white px-4 py-2 rounded-xl shadow-lg">
                  <div className="text-xs font-semibold opacity-90">
                    NICHE PLAYERS
                  </div>
                  <div className="text-2xl font-bold">21</div>
                </div>
              </div>

              <div className="absolute bottom-6 right-6 z-10">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white px-4 py-2 rounded-xl shadow-lg">
                  <div className="text-xs font-semibold opacity-90">
                    VISIONARIES
                  </div>
                  <div className="text-2xl font-bold">14</div>
                </div>
              </div>

              {/* Grid Background */}
              <div className="absolute inset-0">
                <svg className="w-full h-full" style={{ opacity: 0.1 }}>
                  <defs>
                    <pattern
                      id="grid"
                      width="40"
                      height="40"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M 40 0 L 0 0 0 40"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                      />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>

              {/* Axis lines */}
              <div className="absolute inset-x-0 top-1/2 border-t-2 border-gray-200" />
              <div className="absolute inset-y-0 left-1/2 border-l-2 border-gray-200" />

              {/* Axis labels */}
              <div className="absolute left-4 top-1/2 -translate-y-1/2 -rotate-90">
                <span className="text-sm font-semibold text-gray-600">
                  Criticality →
                </span>
              </div>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <span className="text-sm font-semibold text-gray-600">
                  Value →
                </span>
              </div>

              {/* Data Points */}
              {generateDataPoints().map((point, i) => (
                <div
                  key={i}
                  className="absolute w-3 h-3 rounded-full cursor-pointer transition-all hover:scale-150 hover:shadow-lg"
                  style={{
                    top: `${point.y}%`,
                    left: `${point.x}%`,
                    backgroundColor: point.color,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Floating Action Panel */}
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 w-80 border border-gray-200">
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Executive Actions
            </h3>
            <div className="space-y-3 text-sm">
              <ActionItem
                color="green"
                text="Leaders: Protect & negotiate hard"
              />
              <ActionItem color="blue" text="Challengers: Ensure continuity" />
              <ActionItem
                color="purple"
                text="Visionaries: Optimize & standardize"
              />
              <ActionItem color="gray" text="Niche: Simplify or terminate" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== DESIGN 2: SPLIT VERTICAL ====================
// Chart on left, detailed analytics on right
const SplitVerticalLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left: Chart */}
      <div className="flex-1 p-8 bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="h-full flex flex-col">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-1">
              Portfolio Quadrant
            </h2>
            <p className="text-slate-400 text-sm">Value × Criticality Matrix</p>
          </div>

          <div className="flex-1 relative bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
            {/* Quadrant backgrounds */}
            <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-blue-500/10 rounded-tl-2xl" />
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-green-500/10 rounded-tr-2xl" />
            <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gray-500/10 rounded-bl-2xl" />
            <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-purple-500/10 rounded-br-2xl" />

            {/* Axis */}
            <div className="absolute inset-x-0 top-1/2 border-t border-white/20" />
            <div className="absolute inset-y-0 left-1/2 border-l border-white/20" />

            {/* Labels */}
            <div className="absolute top-4 left-4 text-blue-400 text-xs font-bold">
              CHALLENGERS
            </div>
            <div className="absolute top-4 right-4 text-green-400 text-xs font-bold">
              LEADERS
            </div>
            <div className="absolute bottom-4 left-4 text-gray-400 text-xs font-bold">
              NICHE
            </div>
            <div className="absolute bottom-4 right-4 text-purple-400 text-xs font-bold">
              VISIONARIES
            </div>

            {/* Points */}
            {generateDataPoints().map((point, i) => (
              <div
                key={i}
                className="absolute w-2.5 h-2.5 rounded-full shadow-lg"
                style={{
                  top: `${point.y}%`,
                  left: `${point.x}%`,
                  backgroundColor: point.color,
                  boxShadow: `0 0 10px ${point.color}`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right: Analytics */}
      <div className="w-96 bg-white p-8 shadow-2xl overflow-y-auto">
        <h3 className="text-xl font-bold text-gray-900 mb-6">
          Analytics Dashboard
        </h3>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <MetricCard label="Total Contracts" value="71" trend="+5%" />
          <MetricCard label="Total Value" value="$24M" trend="+12%" />
          <MetricCard label="High Priority" value="36" trend="-2%" />
          <MetricCard label="Renewals Due" value="8" trend="0%" />
        </div>

        {/* Category Breakdown */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
            Category Breakdown
          </h4>

          <CategoryBar
            label="Leaders"
            count={22}
            percentage={31}
            color="bg-green-500"
          />
          <CategoryBar
            label="Niche Players"
            count={21}
            percentage={30}
            color="bg-gray-400"
          />
          <CategoryBar
            label="Challengers"
            count={14}
            percentage={20}
            color="bg-blue-500"
          />
          <CategoryBar
            label="Visionaries"
            count={14}
            percentage={20}
            color="bg-purple-500"
          />
        </div>

        {/* Priority List */}
        <div className="mt-8">
          <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">
            Priority Actions
          </h4>
          <div className="space-y-2">
            <PriorityItem
              priority="high"
              text="Review 8 Leader contracts expiring Q2"
            />
            <PriorityItem
              priority="medium"
              text="Optimize 5 Visionary relationships"
            />
            <PriorityItem
              priority="low"
              text="Evaluate 12 Niche consolidation"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== DESIGN 3: MODERN CARD GRID ====================
// Cards-first approach with embedded mini-chart
const CardGridLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Contract Intelligence
            </h1>
            <p className="text-gray-600 mt-1">
              Portfolio optimization platform
            </p>
          </div>
          <button className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-shadow">
            Export Report
          </button>
        </div>

        {/* Top Stats Row */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <StatsCard
            icon="🎯"
            label="Leaders"
            value={22}
            subtitle="High value & critical"
            color="from-green-500 to-emerald-600"
          />
          <StatsCard
            icon="⚡"
            label="Challengers"
            value={14}
            subtitle="Critical to operations"
            color="from-blue-500 to-blue-600"
          />
          <StatsCard
            icon="✨"
            label="Visionaries"
            value={14}
            subtitle="High value potential"
            color="from-purple-500 to-purple-600"
          />
          <StatsCard
            icon="📊"
            label="Niche Players"
            value={21}
            subtitle="Specialized needs"
            color="from-gray-500 to-gray-600"
          />
        </div>

        {/* Main Chart Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Quadrant Analysis
            </h2>
            <div className="flex gap-2">
              <FilterButton label="All" active />
              <FilterButton label="Leaders" active={undefined} />
              <FilterButton label="At Risk" active={undefined} />
            </div>
          </div>

          <div className="relative h-96 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 p-6">
            {/* Axis */}
            <div className="absolute inset-x-0 top-1/2 border-t-2 border-dashed border-gray-300" />
            <div className="absolute inset-y-0 left-1/2 border-l-2 border-dashed border-gray-300" />

            {/* Quadrant Labels with Icons */}
            <div className="absolute top-8 left-8 flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full">
              <span className="text-xl">⚡</span>
              <span className="text-sm font-bold text-blue-700">
                CHALLENGERS
              </span>
            </div>
            <div className="absolute top-8 right-8 flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full">
              <span className="text-xl">🎯</span>
              <span className="text-sm font-bold text-green-700">LEADERS</span>
            </div>
            <div className="absolute bottom-8 left-8 flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
              <span className="text-xl">📊</span>
              <span className="text-sm font-bold text-gray-700">NICHE</span>
            </div>
            <div className="absolute bottom-8 right-8 flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-full">
              <span className="text-xl">✨</span>
              <span className="text-sm font-bold text-purple-700">
                VISIONARIES
              </span>
            </div>

            {/* Data Points */}
            {generateDataPoints().map((point, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 rounded-full cursor-pointer transition-transform hover:scale-150"
                style={{
                  top: `${point.y}%`,
                  left: `${point.x}%`,
                  backgroundColor: point.color,
                }}
              />
            ))}
          </div>
        </div>

        {/* Bottom Action Cards */}
        <div className="grid grid-cols-3 gap-6">
          <ActionCard
            title="Optimization Opportunities"
            description="14 contracts eligible for consolidation"
            action="Review Now"
            color="bg-purple-50 border-purple-200"
          />
          <ActionCard
            title="Renewal Pipeline"
            description="8 high-value renewals in next 90 days"
            action="View Calendar"
            color="bg-blue-50 border-blue-200"
          />
          <ActionCard
            title="Risk Assessment"
            description="3 critical vendors need backup plans"
            action="Assess Risks"
            color="bg-orange-50 border-orange-200"
          />
        </div>
      </div>
    </div>
  );
};

// ==================== HELPER COMPONENTS ====================

const ActionItem = ({ color, text }: { color: string; text: string }) => (
  <div className="flex items-start gap-2">
    <div className={`w-1.5 h-1.5 rounded-full bg-${color}-500 mt-1.5`} />
    <span className="text-gray-700">{text}</span>
  </div>
);

const MetricCard = ({
  label,
  value,
  trend,
}: {
  label: string;
  value: number | string;
  trend: string;
}) => (
  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
    <div className="text-xs text-gray-500 mb-1">{label}</div>
    <div className="text-2xl font-bold text-gray-900">{value}</div>
    <div
      className={`text-xs mt-1 ${trend.startsWith("+") ? "text-green-600" : "text-red-600"}`}
    >
      {trend}
    </div>
  </div>
);

const CategoryBar = ({
  label,
  count,
  percentage,
  color,
}: {
  label: string;
  count: number | string;
  percentage: number;
  color: string;
}) => (
  <div>
    <div className="flex justify-between text-sm mb-1">
      <span className="text-gray-700 font-medium">{label}</span>
      <span className="text-gray-500">
        {count} ({percentage}%)
      </span>
    </div>
    <div className="w-full bg-gray-100 rounded-full h-2">
      <div
        className={`${color} h-2 rounded-full transition-all`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  </div>
);

type Priority = "high" | "medium" | "low";
const PriorityItem = ({
  priority,
  text,
}: {
  priority: Priority;
  text: string;
}) => {
  const colors = {
    high: "bg-red-100 text-red-700 border-red-200",
    medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
    low: "bg-blue-100 text-blue-700 border-blue-200",
  };
  return (
    <div className={`px-3 py-2 rounded-lg border text-xs ${colors[priority]}`}>
      {text}
    </div>
  );
};

const StatsCard = ({
  icon,
  label,
  value,
  subtitle,
  color,
}: {
  icon: string;
  label: string;
  value: number;
  subtitle: string;
  color: string;
}) => (
  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
    <div
      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-2xl mb-3`}
    >
      {icon}
    </div>
    <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
    <div className="text-sm font-semibold text-gray-700 mb-1">{label}</div>
    <div className="text-xs text-gray-500">{subtitle}</div>
  </div>
);

const FilterButton = ({
  label,
  active,
}: {
  label: string;
  active?: boolean;
}) => (
  <button
    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
      active
        ? "bg-indigo-100 text-indigo-700"
        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
    }`}
  >
    {label}
  </button>
);

const ActionCard = ({
  title,
  description,
  action,
  color,
}: {
  title: string;
  description: string;
  action: string;
  color: string;
}) => (
  <div className={`${color} border rounded-2xl p-6`}>
    <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-sm text-gray-600 mb-4">{description}</p>
    <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
      {action} →
    </button>
  </div>
);

// ==================== DATA GENERATION ====================

const generateDataPoints = () => {
  const points: { x: number; y: number; color: string; quadrant: string }[] =
    [];
  const quadrants = [
    {
      name: "leaders",
      count: 22,
      xRange: [50, 95],
      yRange: [50, 95],
      color: "#10b981",
    },
    {
      name: "challengers",
      count: 14,
      xRange: [5, 50],
      yRange: [50, 95],
      color: "#3b82f6",
    },
    {
      name: "visionaries",
      count: 14,
      xRange: [50, 95],
      yRange: [5, 50],
      color: "#a855f7",
    },
    {
      name: "niche",
      count: 21,
      xRange: [5, 50],
      yRange: [5, 50],
      color: "#9ca3af",
    },
  ];

  quadrants.forEach((quad) => {
    for (let i = 0; i < quad.count; i++) {
      points.push({
        x: quad.xRange[0] + Math.random() * (quad.xRange[1] - quad.xRange[0]),
        y: quad.yRange[0] + Math.random() * (quad.yRange[1] - quad.yRange[0]),
        color: quad.color,
        quadrant: quad.name,
      });
    }
  });

  return points;
};

// ==================== MAIN EXPORT ====================
type LayoutType = "dashboard" | "split" | "cards";

const Portfolio = () => {
  const [activeLayout, setActiveLayout] = useState<LayoutType>("dashboard");

  const layouts: Record<LayoutType, JSX.Element> = {
    dashboard: <DashboardLayout />,
    split: <SplitVerticalLayout />,
    cards: <CardGridLayout />,
  };

  const layoutKeys = Object.keys(layouts) as LayoutType[];

  return (
    <div>
      {/* Layout Switcher */}
      <div className="fixed top-12 right-4 z-50 bg-white rounded-xl shadow-xl border border-gray-200 p-2 flex gap-2">
        {layoutKeys.map((layout) => (
          <button
            key={layout}
            onClick={() => setActiveLayout(layout)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
              activeLayout === layout
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {layout}
          </button>
        ))}
      </div>

      {/* Active Layout */}
      {layouts[activeLayout]}
    </div>
  );
};

export default Portfolio;
