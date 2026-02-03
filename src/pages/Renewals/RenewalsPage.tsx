import { useEffect, useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { Button } from "antd";
import { Plus } from "lucide-react";

import RenewalsDashboard from "./tabs/RenewalsDashboard";
import RenewalsTable from "./tabs/RenewalsTable";
import RenewalsJobsPanel from "./tabs/RenewalsJobsPanel";

import { fetchRenewals } from "../../services/renewalsService";
import { mapRenewalsFromApi } from "../../types/renewals";
import FullscreenLoader from "../../components/ui/FullScreenLoader";
import { getActiveAccountId, ACCOUNT_CHANGED_EVENT } from "../../utils/auth";
import type { Renewal } from "../../constants/apps";

type RenewalsContextType = {
  activeTab: string;
};

export default function RenewalsPage() {
  const { activeTab } = useOutletContext<RenewalsContextType>();
  const navigate = useNavigate();

  const [renewals, setRenewals] = useState<Renewal[]>([]);
  const [loading, setLoading] = useState(false);
  const [accountId, setAccountId] = useState(getActiveAccountId());

  /* ---------------- FETCH ON PAGE LOAD ---------------- */
  useEffect(() => {
    if (!accountId) return;

    const loadRenewals = async () => {
      setLoading(true);
      try {
        const apiData = await fetchRenewals(accountId);
        const normalized = Array.isArray(apiData) ? apiData : [];
        setRenewals(mapRenewalsFromApi(normalized));
      } finally {
        setLoading(false);
      }
    };

    loadRenewals();
  }, [accountId]);

  /* ---------------- ACCOUNT CHANGE ---------------- */
  useEffect(() => {
    const handler = () => {
      setAccountId(getActiveAccountId());
      setRenewals([]);
    };

    window.addEventListener(ACCOUNT_CHANGED_EVENT, handler);
    return () =>
      window.removeEventListener(ACCOUNT_CHANGED_EVENT, handler);
  }, []);

  const onCreateRequest = () => {
    navigate("/renewals/CreateNewRequest");
  };

  return (
    <div className="relative overflow-hidden bg-white rounded-2xl border border-gray-200 shadow-sm">
      {loading && <FullscreenLoader />}

      {/* Header */}
      <div className="mx-8 my-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900">
            Renewals Dashboard
          </h1>
          <p className="text-sm text-gray-500">
            What is coming in, from where, and what needs attention.
          </p>
        </div>

        <Button
          onClick={onCreateRequest}
          className="!border-0 !text-white rounded-full px-4 py-2 flex items-center gap-2
                     !bg-gradient-to-r !from-emerald-500 !to-teal-500 shadow-lg"
        >
          <Plus size={14} />
          Create New Request
        </Button>
      </div>

      {/* Tabs */}
      {activeTab === "dashboard" && (
        <div className="px-8 pb-8">
          <RenewalsDashboard  />
        </div>
      )}

      {activeTab === "renewals" && (
        <div className="px-8 pb-8">
          <RenewalsTable renewals={renewals} />
        </div>
      )}

      {activeTab === "jobs" && (
        <div className="px-8 pb-8">
          <RenewalsJobsPanel accountId={""} />
        </div>
      )}
    </div>
  );
}
