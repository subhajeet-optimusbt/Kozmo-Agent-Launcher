/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ReactNode } from "react";

export interface App {
  description: string;
  subtitle: ReactNode;
  category: string;
  actionHint: ReactNode;
  key: string;
  name: string;
  badge: number;
  route: string;
  icon: string;
  color?: string;
}

export interface Contract {
  key: string;
  title: string;
  area: string;
  type: string;
  company: string;
  counterparty: string;
  status: string;
  updated: string;
}
// utils/mapContracts.ts
export const mapContractsFromApi = (
  apiData: Array<{
    rowKey: string;
    title: string;
    businessArea: string;
    type: string;
    companyName: string;
    counterparty: string;
    status: string;
    modified: string;
  }>,
) => {
  return apiData.map((c) => ({
    key: c.rowKey,
    title: c.title,
    area: c.businessArea,
    type: c.type,
    company: c.companyName,
    counterparty: c.counterparty,

    status: c.status,
    updated: new Date(c.modified).toLocaleDateString(),
  }));
};

export interface Renewal {
  key: string;
  title: string;
  businessArea: string;
  area: string;
  counterparty: string;
  owner: string;
  renewalStatus: string;
  nextRenewaldate: string;
  company?: any;
  type?: any;
}

// constants/apps.ts
export interface Intake {
  key: string;

  subject: string;
  currentJobName: string;
  source: string;

  noOfDocuments: number;
  status: string;

  created: string;
  updated: string;
}

export interface Document {
  key: string;
  subject: string;
  currentJobName: string;
  source: string;
  status: string;
  created: string;
  updated: string;
}

export type RelationshipStatus =
  | "Active"
  | "Inactive"
  | "Prospect"
  | "Blacklisted";

export type Relationships = {
  key: string;
  displayName: string;
  legalName: string;
  category: string;
  status: RelationshipStatus;
  created: string;
  modified: string;
};

export const APPS: App[] = [
  {
    key: "contracts",
    name: "Contracts",
    description: "World model, clauses, issues, obligations",
    badge: 0,
    route: "/contracts",
    icon: "doc",
    color: "blue",
    subtitle: undefined,
    category: "",
    actionHint: undefined,
  },
  {
    key: "renewals",
    name: "Renewals",
    description: "Windows, decisions, runbooks, notices",
    badge: 2,
    route: "/renewals",
    icon: "clock",
    color: "amber",
    subtitle: undefined,
    category: "",
    actionHint: undefined,
  },
  {
    key: "documents",
    name: "Documents",
    description: "Upload, parsing, extraction, versions",
    badge: 0,
    route: "/documents",
    icon: "file",
    color: "indigo",
    subtitle: undefined,
    category: "",
    actionHint: undefined,
  },
  {
    key: "dashboards",
    name: "Dashboard",
    description: "Indexes, quadrants, portfolio health",
    badge: 0,
    route: "/Home",
    icon: "chart",
    color: "rose",
    subtitle: undefined,
    category: "",
    actionHint: undefined,
  },
  {
    key: "intake",
    name: "Intakes",
    description: "Requests, routing, triage and dedupe",
    badge: 0,
    route: "/intake",
    icon: "arrow",
    color: "cyan",
    subtitle: undefined,
    category: "",
    actionHint: undefined,
  },
  {
    key: "relationships",
    name: "Relationships",
    description: "Parties, links, dependencies, contract mapping",
    badge: 0,
    route: "/relationships",
    icon: "users",
    color: "teal",
    subtitle: undefined,
    category: "",
    actionHint: undefined,
  },
];

export const CONTRACTS: Contract[] = Array.from({ length: 42 }).map((_, i) => ({
  key: String(i),
  title: `Enterprise Agreement ${i + 1}`,
  area: ["Sales", "IT", "Legal", "Wealth"][i % 4],
  type: ["MSA", "SOW", "Supply"][i % 3],
  company: "Kozmo Technologies Pvt Ltd",
  counterparty: "External Partner Co.",
  status: "Active",
  updated: "10/01/2027",
}));

// src/mocks/jobs.mock.ts

export const JOB_KPIS = {
  inProgress: 9,
  queued: 2,
  failed: 1,
  p95: "880.7s",
};

export interface JobHealthRow {
  key: string;
  type: string;
  running: number;
  queued: number;
  failed: number;
  p95: string;
  score: number;
}

export const JOB_HEALTH_DATA: JobHealthRow[] = [
  {
    key: "1",
    type: "ContractContextBuilder",
    running: 0,
    queued: 0,
    failed: 0,
    p95: "174.4s",
    score: 100,
  },
  {
    key: "2",
    type: "ContractQueryPlanner",
    running: 0,
    queued: 0,
    failed: 0,
    p95: "0s",
    score: 100,
  },
  {
    key: "3",
    type: "ContractStructuring",
    running: 0,
    queued: 0,
    failed: 0,
    p95: "535.2s",
    score: 100,
  },
  {
    key: "4",
    type: "ContractQueryExecutor",
    running: 0,
    queued: 0,
    failed: 1,
    p95: "0s",
    score: 50,
  },
  {
    key: "5",
    type: "RecordResolution",
    running: 1,
    queued: 0,
    failed: 0,
    p95: "9543.2s",
    score: 100,
  },
  {
    key: "6",
    type: "ContractReportComposer",
    running: 0,
    queued: 1,
    failed: 0,
    p95: "0s",
    score: 70,
  },
  {
    key: "7",
    type: "ContractCompletion",
    running: 8,
    queued: 1,
    failed: 0,
    p95: "0s",
    score: 97,
  },
];
export interface JobRunRow {
  key: string;
  type: string;
  run: string;
  status: "Done" | "Failed" | "Running";
  started: string;
  duration: string;
  attempts: number;
}

export const JOB_RUNS_DATA: JobRunRow[] = [
  {
    key: "r1",
    type: "ContractContextBuilder",
    run: "20251223T062051409632",
    status: "Done",
    started: "3 weeks ago",
    duration: "0.0s",
    attempts: 0,
  },
  {
    key: "r2",
    type: "ContractContextBuilder",
    run: "20251223T132844258170",
    status: "Done",
    started: "3 weeks ago",
    duration: "0.2s",
    attempts: 0,
  },
  {
    key: "r3",
    type: "ContractContextBuilder",
    run: "20251224T061137624238",
    status: "Done",
    started: "3 weeks ago",
    duration: "0.0s",
    attempts: 0,
  },
  {
    key: "r4",
    type: "ContractContextBuilder",
    run: "20251229T092943763558",
    status: "Done",
    started: "2 weeks ago",
    duration: "0.0s",
    attempts: 0,
  },
  {
    key: "r5",
    type: "ContractContextBuilder",
    run: "20260106T124156580112",
    status: "Done",
    started: "1 week ago",
    duration: "0.0s",
    attempts: 0,
  },
];
