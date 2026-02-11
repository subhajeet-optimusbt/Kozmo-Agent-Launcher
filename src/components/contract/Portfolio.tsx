/* eslint-disable @typescript-eslint/no-explicit-any */
const DashboardLeftSection = () => {
  return (
    <div className="h-full bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-8 overflow-auto">
      <div className="max-w-7xl mx-auto">
        <div className="relative">
          {/* Main Chart Area */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <div className="relative h-[600px]">
              {/* Quadrant Counters */}
              <QuadrantCard label="CHALLENGERS" value={14} position="top-left" color="blue" />
              <QuadrantCard label="LEADERS" value={22} position="top-right" color="green" />
              <QuadrantCard label="NICHE PLAYERS" value={21} position="bottom-left" color="gray" />
              <QuadrantCard label="VISIONARIES" value={14} position="bottom-right" color="purple" />

              {/* Grid */}
              <div className="absolute inset-0 opacity-10">
                <svg className="w-full h-full">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>

              {/* Axis */}
              <div className="absolute inset-x-0 top-1/2 border-t-2 border-gray-200" />
              <div className="absolute inset-y-0 left-1/2 border-l-2 border-gray-200" />

              {/* Labels */}
              <div className="absolute left-4 top-1/2 -rotate-90 text-sm font-semibold text-gray-600">
                Criticality →
              </div>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm font-semibold text-gray-600">
                Value →
              </div>

              {/* Points */}
              {generateDataPoints().map((point, i) => (
                <div
                  key={i}
                  className="absolute w-3 h-3 rounded-full hover:scale-150 transition"
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
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-6 w-80 border">
            <h3 className="text-sm font-bold mb-4">Executive Actions</h3>
            <div className="space-y-3 text-sm">
              <ActionItem color="green" text="Leaders: Protect & negotiate hard" />
              <ActionItem color="blue" text="Challengers: Ensure continuity" />
              <ActionItem color="purple" text="Visionaries: Optimize & standardize" />
              <ActionItem color="gray" text="Niche: Simplify or terminate" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   SPLIT RIGHT SECTION (Unchanged from SplitVerticalLayout)
========================================================= */

const SplitRightSection = () => {
  return (
    <div className="w-96 bg-white p-8 shadow-2xl overflow-y-auto">
      <h3 className="text-xl font-bold mb-6">Analytics Dashboard</h3>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <MetricCard label="Total Contracts" value="71" trend="+5%" />
        <MetricCard label="Total Value" value="$24M" trend="+12%" />
        <MetricCard label="High Priority" value="36" trend="-2%" />
        <MetricCard label="Renewals Due" value="8" trend="0%" />
      </div>

      <div className="space-y-4">
        <CategoryBar label="Leaders" count={22} percentage={31} color="bg-green-500" />
        <CategoryBar label="Niche Players" count={21} percentage={30} color="bg-gray-400" />
        <CategoryBar label="Challengers" count={14} percentage={20} color="bg-blue-500" />
        <CategoryBar label="Visionaries" count={14} percentage={20} color="bg-purple-500" />
      </div>

      <div className="mt-8">
        <h4 className="text-sm font-bold uppercase mb-4">Priority Actions</h4>
        <PriorityItem priority="high" text="Review 8 Leader contracts expiring Q2" />
        <PriorityItem priority="medium" text="Optimize 5 Visionary relationships" />
        <PriorityItem priority="low" text="Evaluate 12 Niche consolidation" />
      </div>
    </div>
  );
};

/* =========================================================
   FINAL SINGLE LAYOUT (ONLY ONE LAYOUT)
========================================================= */

const Portfolio = () => {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* LEFT: Dashboard design */}
      <div className="flex-1 relative">
        <DashboardLeftSection />
      </div>

      {/* RIGHT: Split layout analytics */}
      <SplitRightSection />
    </div>
  );
};

export default Portfolio;

/* =========================================================
   HELPER COMPONENTS
========================================================= */

const QuadrantCard = ({
  label,
  value,
  position,
  color,
}: {
  label: string;
  value: number;
  position: string;
  color: string;
}) => {
  const positions: any = {
    "top-left": "top-6 left-6",
    "top-right": "top-6 right-6",
    "bottom-left": "bottom-6 left-6",
    "bottom-right": "bottom-6 right-6",
  };

  return (
    <div className={`absolute ${positions[position]} z-10`}>
      <div className={`bg-${color}-500 text-white px-4 py-2 rounded-xl shadow-lg`}>
        <div className="text-xs font-semibold opacity-90">{label}</div>
        <div className="text-2xl font-bold">{value}</div>
      </div>
    </div>
  );
};

const ActionItem = ({ color, text }: { color: string; text: string }) => (
  <div className="flex items-start gap-2">
    <div className={`w-1.5 h-1.5 rounded-full bg-${color}-500 mt-1.5`} />
    <span>{text}</span>
  </div>
);

const MetricCard = ({ label, value, trend }: any) => (
  <div className="bg-gray-50 rounded-xl p-4 border">
    <div className="text-xs text-gray-500">{label}</div>
    <div className="text-2xl font-bold">{value}</div>
    <div className={`text-xs ${trend.startsWith("+") ? "text-green-600" : "text-red-600"}`}>
      {trend}
    </div>
  </div>
);

const CategoryBar = ({ label, count, percentage, color }: any) => (
  <div>
    <div className="flex justify-between text-sm mb-1">
      <span>{label}</span>
      <span>{count} ({percentage}%)</span>
    </div>
    <div className="w-full bg-gray-100 rounded-full h-2">
      <div className={`${color} h-2 rounded-full`} style={{ width: `${percentage}%` }} />
    </div>
  </div>
);

const PriorityItem = ({ priority, text }: any) => {
  const colors: any = {
    high: "bg-red-100 text-red-700",
    medium: "bg-yellow-100 text-yellow-700",
    low: "bg-blue-100 text-blue-700",
  };
  return <div className={`px-3 py-2 rounded-lg text-xs ${colors[priority]}`}>{text}</div>;
};

/* =========================================================
   DATA
========================================================= */

const generateDataPoints = () => {
  const points: any[] = [];
  const quadrants = [
    { count: 22, x: [50, 95], y: [50, 95], color: "#10b981" },
    { count: 14, x: [5, 50], y: [50, 95], color: "#3b82f6" },
    { count: 14, x: [50, 95], y: [5, 50], color: "#a855f7" },
    { count: 21, x: [5, 50], y: [5, 50], color: "#9ca3af" },
  ];

  quadrants.forEach((q) => {
    for (let i = 0; i < q.count; i++) {
      points.push({
        x: q.x[0] + Math.random() * (q.x[1] - q.x[0]),
        y: q.y[0] + Math.random() * (q.y[1] - q.y[0]),
        color: q.color,
      });
    }
  });

  return points;
};
