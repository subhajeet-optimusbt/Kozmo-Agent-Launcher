/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

import RelationshipsDashboard from "./tab/RelationshipsDashboard";
import RelationshipsTable from "./tab/RelationshipsTable";

import { fetchRelationshipsDashboard } from "../../services/RelationshipsService";
import FullscreenLoader from "../../components/ui/FullScreenLoader";
import { getActiveAccountId, ACCOUNT_CHANGED_EVENT } from "../../utils/auth";
type RelationshipsContextType = {
  activeTab: string;
};

export default function RelationshipsPage() {
  const { activeTab } = useOutletContext<RelationshipsContextType>();
  const [accountId, setAccountId] = useState(getActiveAccountId());

  const [loading, setLoading] = useState(false);

  //   const [range, setRange] = useState<RangeType>("today");
  const [dashboardData, setDashboardData] = useState<any | null>(null);

  useEffect(() => {
    if (!accountId || activeTab !== "dashboard") return;

    const loadDashboard = async () => {
      setLoading(true);
      try {
        const data = await fetchRelationshipsDashboard(accountId);
        setDashboardData(data);
      } catch (err) {
        console.error(err);
        setDashboardData(null);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [accountId, activeTab]);

  /* ---------------- FETCH Relationships ---------------- */

  /* ---------------- ACCOUNT CHANGE ---------------- */
  useEffect(() => {
    const handler = () => {
      setAccountId(getActiveAccountId());
      setDashboardData([]);
    };

    window.addEventListener(ACCOUNT_CHANGED_EVENT, handler);
    return () => window.removeEventListener(ACCOUNT_CHANGED_EVENT, handler);
  }, []);

  return (
    <div className="relative overflow-hidden bg-white rounded-2xl border border-gray-200 shadow-sm">
      {loading && <FullscreenLoader />}

      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500" />

      {/* Header */}
      <div className="mx-8 my-4 flex items-center justify-between">
        {/* Left: Title */}

        <div>
          <h3 className="text-2xl font-black tracking-tight text-gray-900">
            Relationships Dashboard
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            What is coming in, from where, and what needs attention.
          </p>
        </div>
      </div>

      {/* Tabs */}
      {activeTab === "dashboard" && (
        <div className="px-8 pb-8">
          <RelationshipsDashboard loading={loading} data={dashboardData} />
        </div>
      )}

      {activeTab === "relationships" && (
        <div className="px-8 pb-8">
          <RelationshipsTable />
        </div>
      )}
    </div>
  );
}
