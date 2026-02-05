/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

import RelationshipsDashboard from "./tab/RelationshipsDashboard";
import RelationshipsTable from "./tab/RelationshipsTable";

import {
  fetchRelationships,
  fetchRelationshipsDashboard,
} from "../../services/RelationshipsService";
import { mapRelationshipsFromApi } from "../../types/relationships";
import FullscreenLoader from "../../components/ui/FullScreenLoader";
import { getActiveAccountId, ACCOUNT_CHANGED_EVENT } from "../../utils/auth";
import type { Relationships } from "../../constants/apps";
type RelationshipsContextType = {
  activeTab: string;
};

export default function RelationshipsPage() {
  const { activeTab } = useOutletContext<RelationshipsContextType>();

  const [relationships, setRelationships] = useState<Relationships[]>([]);
  const [loading, setLoading] = useState(false);
  const [accountId, setAccountId] = useState(getActiveAccountId());
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
  useEffect(() => {
    if (!accountId) return;

    const loadRelationships = async () => {
      setLoading(true);
      try {
        const apiData = await fetchRelationships(accountId);
        setRelationships(mapRelationshipsFromApi(apiData ?? []));
      } catch (e) {
        console.error(e);
        setRelationships([]);
      } finally {
        setLoading(false);
      }
    };

    loadRelationships();
  }, [accountId]);

  /* ---------------- ACCOUNT CHANGE ---------------- */
  useEffect(() => {
    const handler = () => {
      setAccountId(getActiveAccountId());
      setRelationships([]);
    };

    window.addEventListener(ACCOUNT_CHANGED_EVENT, handler);
    return () => window.removeEventListener(ACCOUNT_CHANGED_EVENT, handler);
  }, []);

  return (
    <div className="relative overflow-hidden bg-white rounded-2xl border border-gray-200 shadow-sm">
      {loading && <FullscreenLoader />}

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
          <RelationshipsTable relationships={relationships} />
        </div>
      )}
    </div>
  );
}
