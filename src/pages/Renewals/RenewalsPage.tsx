import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

import RenewalsDashboard from "./tabs/RenewalsDashboard";
import RenewalsTable from "./tabs/RenewalsTable";
import RenewalsJobsPanel from "./tabs/RenewalsJobsPanel";

import { fetchRenewals } from "../../services/renewalsService";
import { mapRenewalsFromApi } from "../../types/renewals";
import FullscreenLoader from "../../components/ui/FullScreenLoader";
import { getActiveAccountId, ACCOUNT_CHANGED_EVENT } from "../../utils/auth";
import type { Renewal } from "../../constants/apps";
import RangeTabs from "../../components/ui/RangeTabs";

export type RangeType = "today" | "last7days" | "last30days";

type RenewalsContextType = {
  activeTab: string;
};

export default function RenewalsPage() {
  const { activeTab } = useOutletContext<RenewalsContextType>();
  const [renewals, setRenewals] = useState<Renewal[]>([]);
  const [loading, setLoading] = useState(false);
  const [accountId, setAccountId] = useState(getActiveAccountId());
  const [range,setRange] = useState<RangeType>("today");
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

  return (
    <div className="relative overflow-hidden bg-white rounded-2xl border border-gray-200 shadow-sm">
      {loading && <FullscreenLoader />}

      {/* Header */}
      <div className="mx-8 my-4 flex items-center">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900">
            Renewals Dashboard
          </h1>
          <p className="text-sm text-gray-500">
            What is coming in, from where, and what needs attention.
          </p>
        </div>
          {activeTab !== "renewals" && (
                  <div className="ml-auto">
                    <RangeTabs value={range} onChange={setRange} />
                  </div>
                )}
      </div>

      {/* Tabs */}
      {activeTab === "dashboard" && (
        <div className="px-8 pb-8">
          <RenewalsDashboard  loading={loading} range={range} />
        </div>
      )}

      {activeTab === "renewals" && (
        <div className="px-8 pb-8">
          <RenewalsTable renewals={renewals} />
        </div>
      )}

      {activeTab === "jobs" && (
        <div className="px-8 pb-8">
          <RenewalsJobsPanel accountId={accountId} range={range} />
        </div>
      )}
    </div>
  );
}
