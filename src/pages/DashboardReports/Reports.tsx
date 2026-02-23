/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { ReportsAPI } from "../../services/reports";
import { normalizeReports } from "../../services/reports";
import { getActiveAccountId,ACCOUNT_CHANGED_EVENT } from "../../utils/auth";
import FullscreenLoader from "../../components/ui/FullScreenLoader";

interface Props {
  PremiumReportGroup: any;
}

const ReportsSection: React.FC<Props> = ({ PremiumReportGroup }) => {
  const [activeAccountId, setActiveAccountId] = useState(
    getActiveAccountId(),
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [contracts, setContracts] = useState<any[]>([]);
  const [renewals, setRenewals] = useState<any[]>([]);
  const [counterparties, setCounterparties] = useState<any[]>([]);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [issues, setIssues] = useState<any[]>([]);
  const [keyProvisions, setKeyProvisions] = useState<any[]>([]);

  /* 🔁 listen to account switch (EXACTLY like Dashboard) */
  useEffect(() => {
    const handler = () => {
      setActiveAccountId(getActiveAccountId());
    };

    window.addEventListener(ACCOUNT_CHANGED_EVENT, handler);
    return () =>
      window.removeEventListener(ACCOUNT_CHANGED_EVENT, handler);
  }, []);

  const fetchReports = async () => {
    if (!activeAccountId) return;

    try {
      setLoading(true);
      setError(null);

      const [
        contractsData,
        renewalsData,
        counterpartiesData,
        milestonesData,
        issuesData,
        keyProvData,
      ] = await Promise.all([
        ReportsAPI.contracts(activeAccountId),
        ReportsAPI.renewals(activeAccountId),
        ReportsAPI.counterparties(activeAccountId),
        ReportsAPI.milestones(activeAccountId),
        ReportsAPI.issues(activeAccountId),
        ReportsAPI.keyProvisions(activeAccountId),
      ]);

      setContracts(normalizeReports(contractsData));
      setRenewals(normalizeReports(renewalsData));
      setCounterparties(normalizeReports(counterpartiesData));
      setMilestones(normalizeReports(milestonesData));
      setIssues(normalizeReports(issuesData));
      setKeyProvisions(normalizeReports(keyProvData));
    } catch (e) {
      console.error("Reports fetch failed", e);
      setError("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  /* 🔄 refetch when account changes */
  useEffect(() => {
    fetchReports();
  }, [activeAccountId]);

  if (loading) {
    return <FullscreenLoader />;
  }

  if (error) {
    return (
      <div className="text-sm text-rose-600 bg-rose-50 p-3 rounded-lg border border-rose-200">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <PremiumReportGroup
        colorIdx={0}
        title="Contract Status Reports"
        description="Visibility into contract lifecycle stages and portfolio posture."
        defaultOpen
        reports={contracts}
      />

      <PremiumReportGroup
        colorIdx={1}
        title="Renewal & Expiration Reports"
        description="Track upcoming, missed, and high-risk renewals."
        reports={renewals}
      />

      <PremiumReportGroup
        colorIdx={2}
        title="Counterparty Reports"
        description="Risk exposure and dependency tracking across partners."
        reports={counterparties}
      />

      <PremiumReportGroup
        colorIdx={3}
        title="Workflow & Obligations"
        description="Operational tracking of tasks, milestones & compliance."
        reports={milestones}
      />

      {/* ⭐ STRICT RULE */}
      <PremiumReportGroup
        colorIdx={4}
        title="Other Reports"
        description="Issues and contractual provisions."
        reports={[...issues, ...keyProvisions]}
      />
    </div>
  );
};

export default ReportsSection;