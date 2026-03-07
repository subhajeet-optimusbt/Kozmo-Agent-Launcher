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
  {
    selector: ".contracts-hero",
    title: "Contract Management Hub",
    description:
      "Full lifecycle management for every contract — from draft to expiry. Search, filter, and act on any contract from here.",
    position: "bottom",
    padding: 16,
  },
  {
    selector: ".contract-metrics",
    title: "Contract Dashboard",
    description:
      "Portfolio-level KPIs: total count, active vs expired, health distribution, and upcoming renewals in one row.",
    position: "bottom",
    padding: 16,
  },
  {
    selector: ".contract-table",
    title: "Contract Table",
    description:
      "Click any column header to sort. Use the filter bar to narrow by status, type, or counterparty. Click a row to open the full detail view.",
    position: "top",
    padding: 16,
  },
  {
    selector: ".chi-indicator",
    title: "Contract Health Index (CHI)",
    description:
      "CHI 75+ = Good (green), 60–74 = Fair (amber), below 60 = Poor (red). Use this score to prioritise which contracts need attention first.",
    position: "right",
    padding: 16,
  },
  {
    selector: ".obligation-tracker",
    title: "Obligation Tracking",
    description:
      "Auto-flagged upcoming milestones: renewal reminders, payment schedules, compliance checklists. Never miss a critical date.",
    position: "top",
    padding: 16,
  },
  {
    selector: ".new-contract-btn",
    title: "Create New Contract",
    description:
      "Click here to add a new contract. Define obligations, set key dates, upload documents, and configure renewal reminders.",
    position: "left",
    padding: 14,
  },
];

/* ══════════════════════════════════════════════════════════════
   DOCUMENTS PAGE
══════════════════════════════════════════════════════════════ */
export const DOCUMENTS_GUIDE_TARGETS: GuideTarget[] = [
  {
    selector: ".documents-hero",
    title: "Document Intelligence",
    description:
      "AI-powered document analysis. Upload contracts and get automatic redlines, briefs, clause extraction, and risk flags.",
    position: "bottom",
    padding: 16,
  },
  {
    selector: ".document-metrics",
    title: "Document Dashboard",
    description:
      "Processing status at a glance: total documents, completion rates, documents in progress, and any items needing attention.",
    position: "bottom",
    padding: 16,
  },
  {
    selector: ".upload-area",
    title: "Upload Documents",
    description:
      "Drag & drop or click to upload PDF, DOCX, or TXT files. The AI will automatically parse and begin analysis.",
    position: "top",
    padding: 16,
  },
  {
    selector: ".document-queue",
    title: "Processing Queue",
    description:
      "Live view of documents being worked on. Download generated briefs or redlines once the AI finishes processing.",
    position: "top",
    padding: 16,
  },
  {
    selector: ".document-search",
    title: "Search & Filter",
    description:
      "Full-text search across all documents. Filter by status, type, or date to find any document in seconds.",
    position: "bottom",
    padding: 16,
  },
];

/* ══════════════════════════════════════════════════════════════
   INTAKE PAGE
══════════════════════════════════════════════════════════════ */
export const INTAKE_GUIDE_TARGETS: GuideTarget[] = [
  {
    selector: ".intake-hero",
    title: "Intake Management",
    description:
      "Centralised request intake. Process incoming documents, track status from received → in-progress → completed.",
    position: "bottom",
    padding: 16,
  },
  {
    selector: ".intake-metrics",
    title: "Intake Dashboard",
    description:
      "Total requests, status breakdown, average processing time, and completion rates — all in one overview row.",
    position: "bottom",
    padding: 16,
  },
  {
    selector: ".new-request-btn",
    title: "Create New Request",
    description:
      "Start a new intake request. Select type, upload documents, add context, and submit for AI-powered analysis.",
    position: "left",
    padding: 14,
  },
  {
    selector: ".request-queue",
    title: "Your Queue",
    description:
      "All requests you've submitted. Track processing progress, download completed results, or re-prioritise items.",
    position: "top",
    padding: 16,
  },
  {
    selector: ".bulk-upload",
    title: "Bulk Operations",
    description:
      "Process multiple documents in one go. Apply the same settings across a batch for faster turnaround.",
    position: "top",
    padding: 16,
  },
];

/* ══════════════════════════════════════════════════════════════
   RENEWALS PAGE
══════════════════════════════════════════════════════════════ */
export const RENEWALS_GUIDE_TARGETS: GuideTarget[] = [
  {
    selector: ".renewals-hero",
    title: "Renewal Management",
    description:
      "Strategic renewal planning and risk management. Identify at-risk renewals early and build your negotiation playbook.",
    position: "bottom",
    padding: 16,
  },
  {
    selector: ".renewal-metrics",
    title: "Renewal Dashboard",
    description:
      "Upcoming renewals, at-risk items, total renewal value at stake, and historical success rates — all in one view.",
    position: "bottom",
    padding: 16,
  },
  {
    selector: ".renewal-calendar",
    title: "Renewal Calendar",
    description:
      "All renewals plotted chronologically. Colour-coded by risk: red = critical, amber = needs attention, green = on track.",
    position: "top",
    padding: 16,
  },
  {
    selector: ".risk-signals",
    title: "Risk Signals",
    description:
      "AI-flagged risks: payment delays, disputed terms, low CHI score, counterparty changes, and market shifts.",
    position: "top",
    padding: 16,
  },
  {
    selector: ".negotiation-tracker",
    title: "Negotiation Tracker",
    description:
      "Monitor live renewal negotiations: offers, counter-offers, open points, and escalation triggers.",
    position: "top",
    padding: 16,
  },
  {
    selector: ".new-renewal-btn",
    title: "Create Renewal Plan",
    description:
      "Start planning a renewal. Set goals, define key negotiation points, and assign a responsible owner.",
    position: "left",
    padding: 14,
  },
];

/* ══════════════════════════════════════════════════════════════
   RELATIONSHIPS PAGE
══════════════════════════════════════════════════════════════ */
export const RELATIONSHIPS_GUIDE_TARGETS: GuideTarget[] = [
  {
    selector: ".relationships-hero",
    title: "Relationship Management",
    description:
      "Manage and optimise counterparty relationships. Track history, health metrics, and full contract portfolios.",
    position: "bottom",
    padding: 16,
  },
  {
    selector: ".relationships-metrics",
    title: "Relationship Dashboard",
    description:
      "Total counterparties, overall relationship health score, total exposure, and recent activity in one overview.",
    position: "bottom",
    padding: 16,
  },
  {
    selector: ".counterparty-profiles",
    title: "Counterparty Profiles",
    description:
      "Complete intelligence card: company info, key contacts, contract history, payment reliability score, and preferences.",
    position: "top",
    padding: 16,
  },
  {
    selector: ".health-score",
    title: "Relationship Health Score",
    description:
      "Composite quality indicator. Factors in payment reliability, dispute rate, satisfaction, and trend direction.",
    position: "right",
    padding: 16,
  },
  {
    selector: ".contract-portfolio",
    title: "Contract Portfolio View",
    description:
      "Every contract with this counterparty across all business units. Spot consolidation and cross-sell opportunities.",
    position: "top",
    padding: 16,
  },
  {
    selector: ".interaction-timeline",
    title: "Interaction Timeline",
    description:
      "Full history of touchpoints: signings, amendments, payments, disputes, and negotiation milestones.",
    position: "top",
    padding: 16,
  },
];