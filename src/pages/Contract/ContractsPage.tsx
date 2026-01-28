import { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { Button } from "antd";
import { Plus } from "lucide-react";
import ContractsDashboard from "./tabs/ContractsDashboard";
import ContractsTable from "./tabs/ContractsTable";
import JobsPanel from "./tabs/JobsPanel";
import { getActiveAccountId, ACCOUNT_CHANGED_EVENT } from "../../utils/auth";
import { fetchContractsDashboard } from "../../services/contractsService";
import type { ContractDashboardResponse } from "../../types/contracts";
import FullscreenLoader from "../../components/ui/FullScreenLoader";
type ContractsContextType = {
  activeTab: string;
};
export default function ContractsPage() {
  const { activeTab } = useOutletContext<ContractsContextType>();
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] =
    useState<ContractDashboardResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const onCreateContract = () => {
    navigate("/contracts/CreateNewContract");
  };

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
        const data = await fetchContractsDashboard(accountId);
        setDashboardData(data);
      } catch (err) {
        console.error(err);
        setDashboardData(null);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [accountId]);
  return (
    <>
      {loading && <FullscreenLoader />}
      <div className="relative overflow-hidden bg-white rounded-2xl border border-gray-200 shadow-sm">
        {/* Subtle top gradient accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500" />

        {/* Header */}
        <div className="mx-8 my-4 flex items-center justify-between">
          {/* Left side: title + subtitle */}
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-black tracking-tight text-gray-900">
              Contract Agent
            </h1>
            <p className="text-sm text-gray-500">
              Monitor risk, manage contracts, and track execution health.
            </p>
          </div>

          {/* Right side: action button */}
          <Button
            onClick={onCreateContract}
            type="default"
            size="middle"
            className="
            !border-0 !text-white
            flex items-center gap-2
            rounded-full px-4 py-2
            !bg-gradient-to-r !from-emerald-500 !to-teal-500
            shadow-lg hover:shadow-xl
            transition-all
          "
          >
            <Plus size={14} />
            <span className="font-semibold">Create New Contract</span>
          </Button>
        </div>

        {/* Tabs content */}
        {activeTab === "dashboard" && (
          <div className="px-8">
            <ContractsDashboard loading={loading} data={dashboardData} />
          </div>
        )}

        {activeTab === "contracts" && (
          <div className="px-8">
            <ContractsTable />
          </div>
        )}

        {activeTab === "jobs" && (
          <div className="px-8">
            <JobsPanel accountId={accountId} />
          </div>
        )}
      </div>
    </>
  );
}
