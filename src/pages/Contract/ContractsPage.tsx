import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import ContractsDashboard from "./tabs/ContractsDashboard";
import ContractsTable from "./tabs/ContractsTable";
import JobsPanel from "./tabs/JobsPanel";
import { getActiveAccountId, ACCOUNT_CHANGED_EVENT } from "../../utils/auth";
import { fetchContractsDashboard } from "../../services/contractsService";
import type { ContractDashboardResponse } from "../../types/contracts";
import FullscreenLoader from "../../components/ui/FullScreenLoader";
import RangeTabs from "../../components/ui/RangeTabs";
type ContractsContextType = {
  activeTab: string;
};
export type RangeType = "today" | "last7days" | "last30days";

export default function ContractsPage() {
  const { activeTab } = useOutletContext<ContractsContextType>();

  const [dashboardData, setDashboardData] =
    useState<ContractDashboardResponse | null>(null);
  const [loading, setLoading] = useState(false);


    const [range, setRange] = useState<RangeType>("today");
  const [accountId, setAccountId] = useState(getActiveAccountId());
  useEffect(() => {
    const handler = () => {
      setAccountId(getActiveAccountId());
    };

    window.addEventListener(ACCOUNT_CHANGED_EVENT, handler);
    return () => window.removeEventListener(ACCOUNT_CHANGED_EVENT, handler);
  }, []);
  useEffect(() => {
    if (!accountId) return;

    const loadDashboard = async () => {
      setLoading(true);
      try {
        const data = await fetchContractsDashboard(accountId,range);
        setDashboardData(data);
      } catch (err) {
        console.error(err);
        setDashboardData(null);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [accountId,range]);
  return (
    <>
      {loading && <FullscreenLoader />}
      <div className="relative overflow-hidden bg-white rounded-2xl border border-gray-200 shadow-sm">
        {/* Subtle top gradient accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500" />

        {/* Header */}
        <div className="mx-8 my-4 flex items-center">
          {/* Left side: title + subtitle */}
          <div>
            <h1 className="text-2xl font-black tracking-tight text-gray-900">
              Contract Agent
            </h1>
            <p className="text-sm text-gray-500">
              Monitor risk, manage contracts, and track execution health.
            </p>
          </div>

        {activeTab !== "contracts" && (
          <div className="ml-auto">
            <RangeTabs value={range} onChange={setRange} />
          </div>
        )}
          {/* Right side: action button */}
        </div>

        {/* Tabs content */}
        {activeTab === "dashboard" && (
          <div className="px-8">
            <ContractsDashboard loading={loading} data={dashboardData} range={range} />
          </div>
        )}

        {activeTab === "contracts" && (
          <div className="px-8">
            <ContractsTable />
          </div>
        )}

        {activeTab === "jobs" && (
          <div className="px-8">
            <JobsPanel accountId={accountId} range={range} />
          </div>
        )}
      </div>
    </>
  );
}
