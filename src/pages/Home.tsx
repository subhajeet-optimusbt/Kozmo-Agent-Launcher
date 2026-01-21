import StatsOverview from "../components/dashboard/StatsOverview";
import ChartsSection from "../components/dashboard/ChartsSection";
import RightSidebar from "../components/dashboard/RightSidebar";

export default function Home() {
  return (
    <>
      <div className="relative overflow-hidden bg-white rounded-2xl border border-gray-200 shadow-sm">
        {/* Subtle top gradient accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500" />
        <StatsOverview />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mx-6 my-4">
          <ChartsSection />
          <RightSidebar />
        </div>
      </div>
    </>
  );
}
