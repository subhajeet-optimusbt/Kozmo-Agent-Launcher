import { useOutletContext,useNavigate } from "react-router-dom";
import { Button } from "antd";
import { Plus } from "lucide-react";
import ContractsDashboard from "./tabs/ContractsDashboard";
import ContractsTable from "./tabs/ContractsTable";
import JobsPanel from "./tabs/JobsPanel";

type ContractsContextType = {
  activeTab: string;
};

export default function ContractsPage() {
  const { activeTab } = useOutletContext<ContractsContextType>();
  const navigate = useNavigate();

  const onCreateContract = () => {
     navigate("/contracts/CreateNewContract");
  };

  return (
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
          <ContractsDashboard />
        </div>
      )}

      {activeTab === "contracts" && (
        <div className="px-8">
          <ContractsTable />
        </div>
      )}

      {activeTab === "jobs" && (
        <div className="px-8">
          <JobsPanel />
        </div>
      )}
    </div>
  );
}
