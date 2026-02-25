/* eslint-disable @typescript-eslint/no-explicit-any */
export const mapContractsReports = (data: any) => [
  {
    name: "Active / Effective Contracts",
    count: data.activeContracts?.length ?? 0,
    payload: data.activeContracts,
  },
  {
    name: "Awaiting Signature",
    count: data.awaitingSignature?.length ?? 0,
    status: "warning",
    payload: data.awaitingSignature,
  },
  {
    name: "Cancelled, Expired or On Hold",
    count: data.cancelledExpiredOnHold?.length ?? 0,
    status: "danger",
    payload: data.cancelledExpiredOnHold,
  },
  {
    name: "Draft Contracts",
    count: data.draftContracts?.length ?? 0,
    status: "neutral",
    payload: data.draftContracts,
  },
];

export const mapRenewalsReports = (data: any) => [
  {
    name: "Upcoming Renewals",
    count: data.upcomingRenewals?.length ?? 0,
    payload: data.upcomingRenewals,
  },
  {
    name: "Missed & Expired Renewals",
    count: data.missedAndExpiredRenewals?.length ?? 0,
    status: "danger",
    payload: data.missedAndExpiredRenewals,
  },
  {
    name: "Delayed Renewals",
    count: data.delayedRenewals?.length ?? 0,
    status: "warning",
    payload: data.delayedRenewals,
  },
];

export const mapCounterpartyReports = (data: any) => [
  {
    name: "Active Relationships",
    count: data.activeCounterparties?.length ?? 0,
    payload: data.activeCounterparties,
  },
  {
    name: "Relationship Contacts",
    count: data.counterpartyContacts?.length ?? 0,
    payload: data.counterpartyContacts,
  },
];

export const mapMilestonesReports = (data: any) => [
  {
    name: "Upcoming Milestones",
    count: data.upcomingMilestones?.length ?? 0,
    payload: data.upcomingMilestones,
  },
  {
    name: "Delayed Milestones",
    count: data.delayedMilestones?.length ?? 0,
    status: "danger",
    payload: data.delayedMilestones,
  },
  {
    name: "Upcoming Obligations",
    count: data.upcomingObligations?.length ?? 0,
    payload: data.upcomingObligations,
  },
  {
    name: "Delayed Obligations",
    count: data.delayedObligations?.length ?? 0,
    status: "warning",
    payload: data.delayedObligations,
  },
];

export const mapOtherReports = (issues: any, keyProv: any) => [
  {
    name: "All Issues",
    count: issues.allIssues?.length ?? 0,
    status: "danger",
    payload: issues.allIssues,
  },
  {
    name: "Key Provisions Report",
    count: keyProv.keyProvisions?.length ?? 0,
    payload: keyProv.keyProvisions,
  },
];