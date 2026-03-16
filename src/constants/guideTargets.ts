/**
 * FILE: src/constants/guideTargets.ts
 *
 * CSS selector → title + description for every highlighted section.
 *
 * IMPORTANT: The selector strings here must match the className you add
 * to the corresponding JSX elements in Home.tsx (and other page files).
 * See Home.tsx changes below for where each className goes.
 */

export interface GuideTarget {
  selector: string;
  title: string;
  description: string;
  position?: "top" | "bottom" | "left" | "right";
  padding?: number;
  tab?: string;
}

/* ══════════════════════════════════════════════════════════════
   HOME / DASHBOARD — 7 steps, one per visible section
══════════════════════════════════════════════════════════════ */
export const HOME_GUIDE_TARGETS: GuideTarget[] = [
  {
    // className="dashboard-hero"  ← already in your Home.tsx
    selector: ".dashboard-hero",
    title: "Dashboard Overview",
    description:
      "Your real-time command center. Live contract, renewal, and financial metrics update automatically — no refresh needed.",
    position: "bottom",
    padding: 16,
  },
  {
    // className="kpi-cards-section"  ← already in your Home.tsx
    selector: ".kpi-cards-section",
    title: "KPI Cards",
    description:
      "Six key metrics at a glance: Total Contracts, CHI Average, Revenue at Risk, Payment Reliability, Outstanding Invoices, and Open Issues.",
    position: "bottom",
    padding: 16,
  },
  {
    // className="health-trend-card"  ← ADD this to the Health Index Trend <Card> wrapper in Home.tsx
    selector: ".health-trend-card",
    title: "Health Index Trend",
    description:
      "Monthly CHI score history. A rising line means your portfolio is getting healthier. Hover any point for the exact score.",
    position: "bottom",
    padding: 16,
  },
  {
    // className="invoice-distribution-card"  ← ADD to Invoice Distribution <Card> in Home.tsx
    selector: ".invoice-distribution-card",
    title: "Invoice Distribution",
    description:
      "Donut chart showing Pending, Paid, and Overdue invoices. The centre number is your total invoice count.",
    position: "left",
    padding: 16,
  },
  {
    // className="top-contracts-card"  ← ADD to the Top 10 High Value Contracts <Card> wrapper in Home.tsx
    selector: ".top-contracts-card",
    title: "Top 10 High-Value Contracts",
    description:
      "Your most valuable contracts ranked by total value. Click any row to open the full contract detail view.",
    position: "top",
    padding: 16,
  },
  {
    // className="alerts-section"  ← ADD to the Alerts & Summaries column div in Home.tsx
    selector: ".alerts-section",
    title: "Alerts & Summaries",
    description:
      "Contracts expiring in the next 90 days, colour-coded by urgency. Red = expires in ≤ 3 days, Amber = ≤ 14 days.",
    position: "left",
    padding: 16,
  },
  {
    // className="agent-panels"  ← already in your Home.tsx
    selector: ".agent-panels",
    title: "AI Agent Panels",
    description:
      "Monitor your four AI agents (Intake, Document, Contract, Renewal) in real time. Each shows completion rate and active queue stats.",
    position: "top",
    padding: 16,
  },
];

/* ══════════════════════════════════════════════════════════════
   CONTRACTS PAGE
══════════════════════════════════════════════════════════════ */
export const CONTRACTS_GUIDE_TARGETS: GuideTarget[] = [
  // ── Always visible (header) ──
  {
    selector: ".contracts-tab-nav",
    title: "Module Tabs",
    description:
      "Switch between Dashboard (KPIs & alerts), Contracts (full table & portfolio), and Jobs (AI job runs & health).",
    position: "bottom",
    padding: 16,
  },
  {
    selector: ".new-contract-btn",
    title: "Create New Contract",
    description:
      "Click + to start a new contract. Define parties, obligations, key dates, upload documents, and configure renewal reminders.",
    position: "left",
    padding: 14,
  },

  // ── Dashboard tab ──
  {
    selector: ".contract-kpi-grid",
    tab: "dashboard",
    title: "Contract KPIs",
    description:
      "Six live metrics: Total, Active, High-Risk, Needs Review, Expiring in 90 days, and Pending Signature.",
    position: "bottom",
    padding: 16,
  },
  {
    selector: ".contract-alerts",
    tab: "dashboard",
    title: "Alerts & Exceptions",
    description:
      "AI-flagged exceptions: obligation overrides, price drift, missing signatures, usage violations, and clause conflicts.",
    position: "top",
    padding: 16,
  },
  {
    selector: ".contract-worklists",
    tab: "dashboard",
    title: "Key Worklists",
    description:
      "Your most important queues — Legal review, Finance approval, Negotiation, Renewals, Obligations. Click any card to open that filtered view.",
    position: "top",
    padding: 16,
  },

  // ── Contracts tab ──
  {
    selector: ".contract-search-bar",
    tab: "contracts",
    title: "Search & Filter",
    description:
      "Full-text search across title, counterparty, type, and business area. Use Filters & Facets to narrow by status, type, or area.",
    position: "bottom",
    padding: 16,
  },
  {
    selector: ".contract-view-toggle",
    tab: "contracts",
    title: "View Modes",
    description:
      "Switch between Table, Compact list, and Card view. Table is best for sorting; Card view gives a richer per-contract snapshot.",
    position: "bottom",
    padding: 14,
  },
  {
    selector: ".contract-table",
    tab: "contracts",
    title: "Contract Table",
    description:
      "Click any column header to sort. Click a row to open the full contract detail drawer with obligations, history, and documents.",
    position: "top",
    padding: 16,
  },

  // ── Jobs tab ──
  {
    selector: ".jobs-kpi",
    tab: "jobs",
    title: "Jobs KPIs",
    description:
      "Live summary of all AI job runs: total jobs, success rate, failures, and average processing time for the selected range.",
    position: "bottom",
    padding: 16,
  },
  {
    selector: ".jobs-table",
    tab: "jobs",
    title: "Jobs Table",
    description:
      "Every AI job run listed here. Toggle between Health view (status & SLA) and Runs view (execution logs) to diagnose issues fast.",
    position: "top",
    padding: 16,
  },
];
/* ══════════════════════════════════════════════════════════════
   DOCUMENTS PAGE
══════════════════════════════════════════════════════════════ */
export const DOCUMENTS_GUIDE_TARGETS: GuideTarget[] = [
  // ── Always visible (header) ──
  {
    selector: ".document-tab-nav",
    title: "Module Tabs",
    description:
      "Switch between Dashboard (KPIs & signals), Documents (full table), and Jobs (AI job runs & health).",
    position: "bottom",
    padding: 16,
  },
  {
    selector: ".new-document-btn",
    title: "Upload New Document",
    description:
      "Click + to upload a new document. The AI will automatically parse, classify, and begin analysis.",
    position: "left",
    padding: 14,
  },

  // ── Dashboard tab ──
  {
    selector: ".document-kpi-grid",
    tab: "dashboard",
    title: "Document KPIs",
    description:
      "Six live metrics: Created, Updated, Classification, Completed, Escalated, and Extracted — all updated in real time.",
    position: "bottom",
    padding: 16,
  },
  {
    selector: ".document-activity",
    tab: "dashboard",
    title: "Recent Activity & Signals",
    description:
      "Live updates from ingestion, profiling, and analysis — pricing deviations, liability changes, and draft completions.",
    position: "top",
    padding: 16,
  },
  {
    selector: ".document-worklists",
    tab: "dashboard",
    title: "Documents Requiring Attention",
    description:
      "Auto-detected blockers: High-Risk Redlines, Missing Fields, Processing Errors, and Critical Signals — click any card to action that queue.",
    position: "top",
    padding: 16,
  },

  // ── Documents tab ──
  {
    selector: ".document-search-bar",
    tab: "documents",
    title: "Search & Filter",
    description:
      "Full-text search across subject and job name. Use Filters & Facets to narrow by status or current job.",
    position: "bottom",
    padding: 16,
  },
  {
    selector: ".document-view-toggle",
    tab: "documents",
    title: "View Modes",
    description:
      "Switch between Table, Compact list, and Card view. Table is best for sorting; Card view gives a richer per-document snapshot.",
    position: "bottom",
    padding: 14,
  },
  {
    selector: ".document-table",
    tab: "documents",
    title: "Documents Table",
    description:
      "Every document listed here. Click any column header to sort. Click a row to open the full detail drawer with analysis results.",
    position: "top",
    padding: 16,
  },

  // ── Jobs tab ──
  {
    selector: ".document-jobs-kpi",
    tab: "jobs",
    title: "Jobs KPIs",
    description:
      "Live summary of all document AI job runs: total jobs, success rate, failures, and average processing time.",
    position: "bottom",
    padding: 16,
  },
  {
    selector: ".document-jobs-table",
    tab: "jobs",
    title: "Jobs Table",
    description:
      "Every AI job run for documents listed here. Toggle between Health view (status & SLA) and Runs view (execution logs).",
    position: "top",
    padding: 16,
  },
];

/* ══════════════════════════════════════════════════════════════
   INTAKE PAGE
══════════════════════════════════════════════════════════════ */
export const INTAKE_GUIDE_TARGETS: GuideTarget[] = [
  // ── Always visible (header) ──
  {
    selector: ".intake-tab-nav",
    title: "Module Tabs",
    description:
      "Switch between Dashboard (KPIs & triage), Inbox (full intake table), and Jobs (AI job runs & health).",
    position: "bottom",
    padding: 16,
  },
  {
    selector: ".new-intake-btn",
    title: "Create New Intake Request",
    description:
      "Click + to start a new intake request. Select type, upload documents, add context, and submit for AI-powered analysis.",
    position: "left",
    padding: 14,
  },

  // ── Dashboard tab ──
  {
    selector: ".intake-kpi-grid",
    tab: "dashboard",
    title: "Intake KPIs",
    description:
      "Six live metrics: New Requests, With Documents, Running, Completed, Failed, and Escalated — all updated in real time.",
    position: "bottom",
    padding: 16,
  },
  {
    selector: ".intake-source-feed",
    tab: "dashboard",
    title: "Source Feed",
    description:
      "Where requests originate — Email, Upload, Salesforce, Teams and more. Every incoming channel tracked in one place.",
    position: "top",
    padding: 16,
  },
  {
    selector: ".intake-triage",
    tab: "dashboard",
    title: "Requests Requiring Attention",
    description:
      "Triage buckets: Missing Info, Clarification Needed, Ambiguous Routing, and High Priority — click any card to action that queue.",
    position: "top",
    padding: 16,
  },

  // ── Inbox tab ──
  {
    selector: ".intake-search-bar",
    tab: "inbox",
    title: "Search & Filter",
    description:
      "Full-text search across subject, job name, request ID, and documents. Use Filters & Facets to narrow by status or type.",
    position: "bottom",
    padding: 16,
  },
  {
    selector: ".intake-view-toggle",
    tab: "inbox",
    title: "View Modes",
    description:
      "Switch between Table, Compact list, and Card view. Table is best for sorting; Card view gives a richer per-request snapshot.",
    position: "bottom",
    padding: 14,
  },
  {
    selector: ".intake-table",
    tab: "inbox",
    title: "Intake Table",
    description:
      "Every intake request listed here. Click any column header to sort. Click a row to open the full detail drawer.",
    position: "top",
    padding: 16,
  },

  // ── Jobs tab ──
  {
    selector: ".intake-jobs-kpi",
    tab: "jobs",
    title: "Jobs KPIs",
    description:
      "Live summary of all intake AI job runs: total jobs, success rate, failures, and average processing time.",
    position: "bottom",
    padding: 16,
  },
  {
    selector: ".intake-jobs-table",
    tab: "jobs",
    title: "Jobs Table",
    description:
      "Every AI job run for intake listed here. Toggle between Health view (status & SLA) and Runs view (execution logs).",
    position: "top",
    padding: 16,
  },
];
/* ══════════════════════════════════════════════════════════════
   RENEWALS PAGE
══════════════════════════════════════════════════════════════ */
export const RENEWALS_GUIDE_TARGETS: GuideTarget[] = [
  // ── Always visible (header) ──
  {
    selector: ".renewal-tab-nav",
    title: "Module Tabs",
    description:
      "Switch between Dashboard (KPIs & signals), Renewals (full table), and Jobs (AI job runs & health).",
    position: "bottom",
    padding: 16,
  },
  {
    selector: ".new-renewal-btn",
    title: "Create New Renewal",
    description:
      "Click + to start a new renewal plan. Set goals, define key negotiation points, and assign a responsible owner.",
    position: "left",
    padding: 14,
  },

  // ── Dashboard tab ──
  {
    selector: ".renewal-kpi-grid",
    tab: "dashboard",
    title: "Renewal KPIs",
    description:
      "Six live metrics: Documents Created, Updated, Classification, Completed, Escalated, and Extracted — updated in real time.",
    position: "bottom",
    padding: 16,
  },
  {
    selector: ".renewal-activity",
    tab: "dashboard",
    title: "Recent Activity & Signals",
    description:
      "Live updates from ingestion, profiling, and analysis — pricing deviations, liability changes, and draft completions.",
    position: "top",
    padding: 16,
  },
  {
    selector: ".renewal-worklists",
    tab: "dashboard",
    title: "Renewals Requiring Attention",
    description:
      "Auto-detected blockers: High-Risk Redlines, Missing Fields, Processing Errors, and Critical Signals — click any card to action that queue.",
    position: "top",
    padding: 16,
  },

  // ── Renewals tab ──
  {
    selector: ".renewal-search-bar",
    tab: "renewals",
    title: "Search & Filter",
    description:
      "Full-text search across title, counterparty, business area, and owner. Use Filters & Facets to narrow by status or type.",
    position: "bottom",
    padding: 16,
  },
  {
    selector: ".renewal-view-toggle",
    tab: "renewals",
    title: "View Modes",
    description:
      "Switch between Table, Compact list, and Card view. Table is best for sorting; Card view gives a richer per-renewal snapshot.",
    position: "bottom",
    padding: 14,
  },
  {
    selector: ".renewal-table",
    tab: "renewals",
    title: "Renewals Table",
    description:
      "Every renewal listed here. Click any column header to sort. Click a row to open the full detail drawer with negotiation history.",
    position: "top",
    padding: 16,
  },

  // ── Jobs tab ──
  {
    selector: ".renewal-jobs-kpi",
    tab: "jobs",
    title: "Jobs KPIs",
    description:
      "Live summary of all renewal AI job runs: total jobs, success rate, failures, and average processing time.",
    position: "bottom",
    padding: 16,
  },
  {
    selector: ".renewal-jobs-table",
    tab: "jobs",
    title: "Jobs Table",
    description:
      "Every AI job run for renewals listed here. Toggle between Health view (status & SLA) and Runs view (execution logs).",
    position: "top",
    padding: 16,
  },
];

/* ══════════════════════════════════════════════════════════════
   RELATIONSHIPS PAGE
══════════════════════════════════════════════════════════════ */
export const RELATIONSHIPS_GUIDE_TARGETS: GuideTarget[] = [
  // ── Always visible (header) ──
  {
    selector: ".relationship-tab-nav",
    title: "Module Tabs",
    description:
      "Switch between Dashboard (KPIs & signals) and Relationships (full counterparty table with search & filters).",
    position: "bottom",
    padding: 16,
  },
  {
    selector: ".new-relationship-btn",
    title: "Add New Relationship",
    description:
      "Click + to create a new counterparty. Fill in legal name, display name, role, status, and category.",
    position: "left",
    padding: 14,
  },

  // ── Dashboard tab ──
  {
    selector: ".relationship-kpi-grid",
    tab: "dashboard",
    title: "Relationship KPIs",
    description:
      "Three live metrics: Active Counterparties, New Counterparties added, and High Risk Counterparties needing immediate attention.",
    position: "bottom",
    padding: 16,
  },
  {
    selector: ".relationship-signals",
    tab: "dashboard",
    title: "Recent Relationship Signals",
    description:
      "Risk, onboarding and monitoring updates — risk score changes, new relationships pending due diligence, and compliance flags.",
    position: "top",
    padding: 16,
  },
  {
    selector: ".relationship-worklists",
    tab: "dashboard",
    title: "Relationships Requiring Attention",
    description:
      "Compliance and risk blockers: High Risk Counterparties needing immediate review and Pending Onboarding with incomplete KYC.",
    position: "top",
    padding: 16,
  },

  // ── Relationships tab ──
  {
    selector: ".relationship-search-bar",
    tab: "relationships",
    title: "Search & Filter",
    description:
      "Full-text search across display name and legal name. Use Filters & Facets to narrow by status or category.",
    position: "bottom",
    padding: 16,
  },
  {
    selector: ".relationship-view-toggle",
    tab: "relationships",
    title: "View Modes",
    description:
      "Switch between Table, Compact list, and Card view. Table is best for sorting; Card view gives a richer per-counterparty snapshot.",
    position: "bottom",
    padding: 14,
  },
  {
    selector: ".relationship-table",
    tab: "relationships",
    title: "Relationships Table",
    description:
      "Every counterparty listed here. Click any column header to sort. Click a row to open the full detail drawer with contract history and health score.",
    position: "top",
    padding: 16,
  },
];
