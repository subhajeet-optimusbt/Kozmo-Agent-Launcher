import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import IntakeDashboard from "./tabs/IntakeDashboard";
import IntakeInboxTable from "./tabs/IntakeInboxTable";
import IntakeJobsPanel from "./tabs/IntakeJobsPanel";

import {
  fetchIntake,
  fetchIntakeDashboard,
} from "../../services/intakeService";
import { mapIntakeFromApi } from "../../types/intake";
import FullscreenLoader from "../../components/ui/FullScreenLoader";
import RangeTabs from "../../components/ui/RangeTabs";
import { getActiveAccountId, ACCOUNT_CHANGED_EVENT } from "../../utils/auth";
import type { Intake } from "../../constants/apps";
import type { IntakeDashboardResponse } from "../../services/intakeService";

type IntakeContextType = {
  activeTab: string;
};

export type RangeType = "today" | "last7days" | "last30days";

export default function IntakePage() {
  const { activeTab } = useOutletContext<IntakeContextType>();

  const [intake, setIntake] = useState<Intake[]>([]);
  const [dashboardData, setDashboardData] =
    useState<IntakeDashboardResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [accountId, setAccountId] = useState(getActiveAccountId());
  const [range, setRange] = useState<RangeType>("today");

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      try {
        const data = await fetchIntakeDashboard(accountId, range);
        setDashboardData(data);
      } catch (err) {
        console.error(err);
        setDashboardData(null);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [accountId, range, activeTab]);
  /* ---------------- FETCH INBOX ---------------- */
  useEffect(() => {
    if (!accountId || activeTab !== "inbox") return;

    const loadIntake = async () => {
      setLoading(true);
      try {
        const apiData = await fetchIntake(accountId);
        const normalized = Array.isArray(apiData) ? apiData : [];
        setIntake(mapIntakeFromApi(normalized));
      } finally {
        setLoading(false);
      }
    };

    loadIntake();
  }, [accountId, activeTab]);

  /* ---------------- ACCOUNT CHANGE ---------------- */
  useEffect(() => {
    const handler = () => {
      setAccountId(getActiveAccountId());
      setIntake([]);
    };

    window.addEventListener(ACCOUNT_CHANGED_EVENT, handler);
    return () => window.removeEventListener(ACCOUNT_CHANGED_EVENT, handler);
  }, []);

 

  return (
    <div className="relative overflow-hidden bg-white rounded-2xl border border-gray-200 shadow-sm">
      {loading && <FullscreenLoader />}

<div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500" />

      {/* Header */}
      <div className="mx-8 my-4 flex items-center">
        {/* Left: Title */}
        <div>
          <h3 className="text-2xl font-black tracking-tight text-gray-900">
            Intake Agent
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            What is coming in, from where, and what needs attention.
          </p>
        </div>

        {/* Center: Range Tabs (dashboard & jobs only) */}
        {activeTab !== "inbox" && (
          <div className="ml-auto">
            <RangeTabs value={range} onChange={setRange} />
          </div>
        )}
      </div>

      {/* Tabs */}
      {activeTab === "dashboard" && (
        <div className="px-8 pb-8">
          <IntakeDashboard
            loading={loading}
            data={dashboardData}
            range={range}
          />
        </div>
      )}

      {activeTab === "inbox" && (
        <div className="px-8 pb-8">
          <IntakeInboxTable intake={intake} />
        </div>
      )}

      {activeTab === "jobs" && (
        <div className="px-8 pb-8">
          <IntakeJobsPanel accountId={accountId!} range={range} />
        </div>
      )}
    </div>
  );
}
