/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { ReportsAPI } from "../../services/reports";
import { getActiveAccountId, ACCOUNT_CHANGED_EVENT } from "../../utils/auth";
import FullscreenLoader from "../../components/ui/FullScreenLoader";
import {
  mapContractsReports,
  mapRenewalsReports,
  mapCounterpartyReports,
  mapMilestonesReports,
  mapOtherReports,
} from "../../services/reportsmapper";
interface Props {
  PremiumReportGroup: any;
}

const ReportsSection: React.FC<Props> = ({ PremiumReportGroup }) => {
  const [activeAccountId, setActiveAccountId] = useState(getActiveAccountId());

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [contracts, setContracts] = useState<any[]>([]);
  const [renewals, setRenewals] = useState<any[]>([]);
  const [counterparties, setCounterparties] = useState<any[]>([]);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [issues, setIssues] = useState<any[]>([]);
  const [keyProvisions] = useState<any[]>([]);

  /* 🔁 listen to account switch (EXACTLY like Dashboard) */
  useEffect(() => {
    const handler = () => {
      setActiveAccountId(getActiveAccountId());
    };

    window.addEventListener(ACCOUNT_CHANGED_EVENT, handler);
    return () => window.removeEventListener(ACCOUNT_CHANGED_EVENT, handler);
  }, []);

  const fetchReports = async () => {
    if (!activeAccountId) return;

    try {
      setLoading(true);
      setError(null);

      // 🔹 Fetch all reports in parallel
      const [
        contractsResponse,
        renewalsResponse,
        counterpartiesResponse,
        milestonesResponse,
        issuesResponse,
        keyProvisionsResponse,
      ] = await Promise.all([
        ReportsAPI.contracts(activeAccountId),
        ReportsAPI.renewals(activeAccountId),
        ReportsAPI.counterparties(activeAccountId),
        ReportsAPI.milestones(activeAccountId),
        ReportsAPI.issues(activeAccountId),
        ReportsAPI.keyProvisions(activeAccountId),
      ]);

      // 🔹 Map API responses → UI-ready report groups
      const contractsReports = mapContractsReports(contractsResponse);
      const renewalsReports = mapRenewalsReports(renewalsResponse);
      const counterpartyReports = mapCounterpartyReports(
        counterpartiesResponse,
      );
      const milestoneReports = mapMilestonesReports(milestonesResponse);
      const otherReports = mapOtherReports(
        issuesResponse,
        keyProvisionsResponse,
      );

      // 🔹 Update state
      setContracts(contractsReports);
      setRenewals(renewalsReports);
      setCounterparties(counterpartyReports);
      setMilestones(milestoneReports);
      setIssues(otherReports);
    } catch (error) {
      console.error("Reports fetch failed", error);
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
        categoryId="contracts"
      />

      <PremiumReportGroup
        colorIdx={1}
        title="Renewal & Expiration Reports"
        description="Track upcoming, missed, and high-risk renewals."
        reports={renewals}
        categoryId="renewals"
      />

      <PremiumReportGroup
        colorIdx={2}
        title="Relationship Reports"
        description="Risk exposure and dependency tracking across partners."
        reports={counterparties}
        categoryId="counterparties"
      />

      <PremiumReportGroup
        colorIdx={3}
        title="Workflow & Obligations"
        description="Operational tracking of tasks, milestones & compliance."
        reports={milestones}
        categoryId="milestones"
      />

      <PremiumReportGroup
        colorIdx={4}
        title="Other Reports"
        description="Issues and contractual provisions."
        reports={[...issues, ...keyProvisions]}
        categoryId="others"
      />
    </div>
  );
};

export default ReportsSection;
