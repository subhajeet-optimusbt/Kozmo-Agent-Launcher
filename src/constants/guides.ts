/* Guide content for all modules with enhanced design for interactive tours */

export interface GuideStep {
  title: string;
  description: string;
  details?: string[];
  emoji?: string;
}

export interface GuideModule {
  title: string;
  subtitle: string;
  steps: GuideStep[];
  color: string; // Tailwind color class
  icon: string; // emoji
}

export const GUIDE_CONTENT: Record<string, GuideModule> = {
  /* ==================== HOME / DASHBOARD ==================== */
  home: {
    title: "Dashboard Overview",
    subtitle: "Master your contract ecosystem at a glance",
    icon: "📊",
    color: "emerald",
    steps: [
      {
        title: "Welcome to KOZMO Dashboard",
        description: "Your real-time command center for contracts, renewals, and financial metrics",
        emoji: "👋",
        details: [
          "Live data updates across all agents",
          "Real-time KPI tracking",
          "Multi-module agent visibility",
        ],
      },
      {
        title: "KPI Cards (Top Row)",
        description: "Quick overview of key business metrics in one glance",
        emoji: "📈",
        details: [
          "Total Active Contracts - Total contract count",
          "Health Index (CHI) - Contract health score (0-100)",
          "Revenue At Risk - Contracts at risk of non-renewal",
          "Payment Relationships - Active payment arrangements",
          "Open Issues - Critical tasks requiring attention",
        ],
      },
      {
        title: "Charts & Analytics",
        description: "Deep dive into contract trends and distributions",
        emoji: "📉",
        details: [
          "Health Trend Graph - Contract health over time",
          "Invoice Distribution - Payment patterns and amounts",
          "Contract Status Pie - Active vs Expired breakdown",
        ],
      },
      {
        title: "Top 10 High-Value Contracts",
        description: "Your most critical contracts ranked by value",
        emoji: "💎",
        details: [
          "Sort by title, counterparty, type, value, or status",
          "Click to view full contract details",
          "Track renewal dates and obligations",
        ],
      },
      {
        title: "Agent Panels",
        description: "Monitor your AI agents working in parallel",
        emoji: "🤖",
        details: [
          "Intake Agent - Document processing & intelligence",
          "Document Agent - Redlines & analysis",
          "Contract Agent - Obligations & compliance",
          "Renewal Agent - Risk signals & renewal prep",
          "View completion rates & active queues",
        ],
      },
      {
        title: "Keyboard Shortcuts",
        description: "Navigate like a pro with keyboard commands",
        emoji: "⌨️",
        details: [
          "ESC - Close modals and dialogs",
          "⌘K or Ctrl+K - Open app launcher",
          "→ / ← - Navigate between guides",
        ],
      },
      {
        title: "Pro Tips",
        description: "Get the most out of your dashboard",
        emoji: "💡",
        details: [
          "Use Health Index to prioritize contract reviews",
          "Monitor agent completion rates for workload",
          "Check Expiring Contracts for renewal deadlines",
          "Use filters to drill down into specific issues",
        ],
      },
      {
        title: "You're Ready!",
        description: "Start exploring your contract data",
        emoji: "🚀",
        details: [
          "Click any module in the launcher to dive deeper",
          "Use the guide button anytime for help",
          "Bookmark important contracts for quick access",
        ],
      },
    ],
  },

  /* ==================== CONTRACTS ==================== */
  contracts: {
    title: "Contract Management",
    subtitle: "Manage obligations, billing, risk & compliance",
    icon: "📋",
    color: "teal",
    steps: [
      {
        title: "Welcome to Contracts",
        description: "Your central hub for contract lifecycle management",
        emoji: "👋",
        details: [
          "Full contract repository with advanced search",
          "Risk assessment and compliance tracking",
          "Obligation management and renewal planning",
        ],
      },
      {
        title: "Dashboard View",
        description: "Get a pulse on your entire contract portfolio",
        emoji: "📊",
        details: [
          "Total Contracts Count",
          "Active vs Expired breakdown",
          "Contract health distribution",
          "Upcoming renewals and expirations",
        ],
      },
      {
        title: "Contract Table",
        description: "Powerful table with sorting and filtering",
        emoji: "📑",
        details: [
          "Click any column header to sort",
          "Filter by status, type, counterparty",
          "View contract value and key dates",
          "Click a row to view full details",
        ],
      },
      {
        title: "Contract Details View",
        description: "Deep dive into individual contracts",
        emoji: "🔍",
        details: [
          "Complete contract information and metadata",
          "Obligation breakdown with due dates",
          "Risk assessment and CHI score",
          "Document management and versioning",
          "Amendment history and renewal schedule",
        ],
      },
      {
        title: "Obligations Tracking",
        description: "Never miss a critical date or requirement",
        emoji: "✓",
        details: [
          "Auto-flagged upcoming obligations",
          "Renewal reminders 90 days before expiry",
          "Payment schedule tracking",
          "Compliance checklist status",
        ],
      },
      {
        title: "Risk & Compliance",
        description: "Proactive risk management",
        emoji: "⚠️",
        details: [
          "CHI Score - Contract health indicator",
          "Red flags for renewal risk",
          "Compliance issue tracking",
          "Escalation workflows for critical items",
        ],
      },
      {
        title: "Create & Update",
        description: "Add new contracts or update existing ones",
        emoji: "➕",
        details: [
          "Click 'New Contract' button to create",
          "Upload contract documents",
          "Define obligations and key dates",
          "Set renewal reminders and alerts",
        ],
      },
      {
        title: "Pro Tips",
        description: "Work smarter with contracts",
        emoji: "💡",
        details: [
          "Use CHI score to prioritize reviews",
          "Export contract data for reporting",
          "Set bulk renewal reminders",
          "Use search to find counterparties quickly",
        ],
      },
    ],
  },

  /* ==================== DOCUMENTS ==================== */
  documents: {
    title: "Document Intelligence",
    subtitle: "Redlines, briefs & document analysis",
    icon: "📄",
    color: "blue",
    steps: [
      {
        title: "Welcome to Documents",
        description: "AI-powered document analysis and management",
        emoji: "👋",
        details: [
          "Upload and organize all contract documents",
          "AI-powered redline detection",
          "Automatic brief generation",
          "Real-time document intelligence",
        ],
      },
      {
        title: "Document Dashboard",
        description: "Monitor document processing at scale",
        emoji: "📊",
        details: [
          "Total Documents Count",
          "Processing status breakdown",
          "Completion rates by type",
          "Document health indicators",
        ],
      },
      {
        title: "Document Upload",
        description: "Add documents to the system",
        emoji: "📤",
        details: [
          "Drag & drop or click to upload",
          "Support for PDF, DOCX, TXT formats",
          "Bulk upload multiple documents",
          "Auto-associate with contracts",
        ],
      },
      {
        title: "AI Analysis",
        description: "Leverage AI for document insights",
        emoji: "🤖",
        details: [
          "Automatic redline highlighting",
          "Key clause extraction",
          "Risk identification",
          "Executive brief generation",
        ],
      },
      {
        title: "Document Queue",
        description: "Track processing progress",
        emoji: "⏳",
        details: [
          "View documents in progress",
          "Monitor agent processing time",
          "Download completed briefs",
          "Re-analyze or request new analysis",
        ],
      },
      {
        title: "Search & Filter",
        description: "Find documents instantly",
        emoji: "🔍",
        details: [
          "Full-text search across all documents",
          "Filter by status, type, date",
          "Sort by document name or date added",
          "Save frequent searches",
        ],
      },
      {
        title: "Export & Share",
        description: "Collaborate on document insights",
        emoji: "📤",
        details: [
          "Export briefs as PDF or DOCX",
          "Share analysis with team members",
          "Generate executive summaries",
          "Track document lineage",
        ],
      },
      {
        title: "Pro Tips",
        description: "Maximize document intelligence",
        emoji: "💡",
        details: [
          "Upload variants of the same contract to compare",
          "Use AI briefs for quick reviews",
          "Set redline alerts for critical changes",
          "Archive processed documents after 90 days",
        ],
      },
    ],
  },

  /* ==================== INTAKE ==================== */
  intake: {
    title: "Intake Management",
    subtitle: "Redlines, briefs & document intelligence",
    icon: "📨",
    color: "violet",
    steps: [
      {
        title: "Welcome to Intake",
        description: "Process incoming requests and manage document workflows",
        emoji: "👋",
        details: [
          "Centralized request processing",
          "Status tracking across all stages",
          "Document attachment management",
          "Multi-step approval workflows",
        ],
      },
      {
        title: "Intake Dashboard",
        description: "Overview of all intake requests",
        emoji: "📊",
        details: [
          "Total Requests Count",
          "Status breakdown (New, In Progress, Completed)",
          "Processing queue and backlog",
          "Agent completion metrics",
        ],
      },
      {
        title: "Create New Intake Request",
        description: "Start a new document processing request",
        emoji: "➕",
        details: [
          "Click 'New Request' button",
          "Select request type (brief, analysis, redline, etc.)",
          "Upload one or more documents",
          "Add context and special instructions",
          "Submit for processing",
        ],
      },
      {
        title: "Request Processing",
        description: "Track your request through the pipeline",
        emoji: "⚙️",
        details: [
          "Received - Document accepted",
          "Processing - AI agents working",
          "Completed - Results ready",
          "Failed - Review error details",
        ],
      },
      {
        title: "Your Queue",
        description: "Manage your pending requests",
        emoji: "📋",
        details: [
          "View all requests you've submitted",
          "Track processing time",
          "Reprioritize requests if needed",
          "Cancel incomplete requests",
        ],
      },
      {
        title: "Results & Downloads",
        description: "Access completed analysis",
        emoji: "📥",
        details: [
          "View generated briefs and summaries",
          "Download as PDF or DOCX",
          "See redline annotations",
          "Review AI-generated insights",
        ],
      },
      {
        title: "Bulk Operations",
        description: "Process multiple documents efficiently",
        emoji: "📦",
        details: [
          "Batch upload multiple documents",
          "Process in bulk with same settings",
          "Monitor batch job progress",
          "Download all results together",
        ],
      },
      {
        title: "Pro Tips",
        description: "Optimize your intake workflow",
        emoji: "💡",
        details: [
          "Group related documents in one request",
          "Add clear context for better results",
          "Use saved request templates",
          "Schedule batch processing for off-hours",
        ],
      },
    ],
  },

  /* ==================== RENEWALS ==================== */
  renewals: {
    title: "Renewal Management",
    subtitle: "Renewals, risk signals & value retention",
    icon: "🔄",
    color: "amber",
    steps: [
      {
        title: "Welcome to Renewals",
        description: "Strategic renewal planning and risk management",
        emoji: "👋",
        details: [
          "Renewal calendar and scheduling",
          "Risk signal identification",
          "Negotiation tracking",
          "Value retention strategies",
        ],
      },
      {
        title: "Renewal Dashboard",
        description: "Your renewal strategy hub",
        emoji: "📊",
        details: [
          "Upcoming Renewals Count",
          "At-Risk Renewals highlighting",
          "Timeline for next 90 days",
          "Success rate and metrics",
        ],
      },
      {
        title: "Renewal Calendar",
        description: "See all renewals in chronological order",
        emoji: "📅",
        details: [
          "Month-by-month renewal view",
          "Color-coded by risk level",
          "Hover for quick details",
          "Click to view full renewal details",
        ],
      },
      {
        title: "Risk Signals",
        description: "Identify contracts at renewal risk",
        emoji: "⚠️",
        details: [
          "Payment delays - Historic payment issues",
          "Disputed terms - Previous disagreements",
          "Low CHI - Poor contract health",
          "Counterparty changes - New decision makers",
          "Market shifts - Changing business needs",
        ],
      },
      {
        title: "Renewal Strategy",
        description: "Plan your renewal approach",
        emoji: "🎯",
        details: [
          "Auto-suggest retention strategies",
          "Identify upsell opportunities",
          "Track historical renewal outcomes",
          "Set renewal negotiation goals",
        ],
      },
      {
        title: "Negotiation Tracking",
        description: "Monitor the renewal process",
        emoji: "💬",
        details: [
          "Track offer/counter-offer rounds",
          "Document negotiation notes",
          "Set escalation triggers",
          "Monitor response times",
        ],
      },
      {
        title: "Create Renewal Plan",
        description: "Start planning a renewal",
        emoji: "📋",
        details: [
          "Click 'New Renewal' button",
          "Select contract to renew",
          "Set renewal goals and timeline",
          "Define key negotiation points",
          "Assign responsible party",
        ],
      },
      {
        title: "Pro Tips",
        description: "Master renewal management",
        emoji: "💡",
        details: [
          "Start renewal planning 120 days early",
          "Use risk signals to prepare counterarguments",
          "Track historical value extraction",
          "Set contingency plans for at-risk renewals",
        ],
      },
    ],
  },

  /* ==================== RELATIONSHIPS ==================== */
  relationships: {
    title: "Relationship Management",
    subtitle: "Counterparty insights and relationship health",
    icon: "🤝",
    color: "rose",
    steps: [
      {
        title: "Welcome to Relationships",
        description: "Manage and optimize counterparty relationships",
        emoji: "👋",
        details: [
          "Counterparty profiles and history",
          "Relationship health metrics",
          "Contract portfolio per counterparty",
          "Interaction timeline",
        ],
      },
      {
        title: "Relationship Dashboard",
        description: "Overview of key relationships",
        emoji: "📊",
        details: [
          "Total Counterparties Count",
          "Relationship health distribution",
          "Total exposure and contract value",
          "Recent interaction activity",
        ],
      },
      {
        title: "Counterparty Profiles",
        description: "Complete relationship intelligence",
        emoji: "👤",
        details: [
          "Company information and hierarchy",
          "Key contacts and decision makers",
          "Contract history and timeline",
          "Payment history and reliability",
          "Negotiation history and preferences",
        ],
      },
      {
        title: "Relationship Health",
        description: "Monitor relationship quality",
        emoji: "💚",
        details: [
          "Health Score - Overall relationship status",
          "Payment Reliability - On-time payment percentage",
          "Dispute Rate - Historical issue frequency",
          "Satisfaction - Feedback and sentiment",
          "Trend - Direction of relationship",
        ],
      },
      {
        title: "Contract Portfolio View",
        description: "All contracts with a specific counterparty",
        emoji: "📑",
        details: [
          "Across all business units",
          "Consolidated terms and conditions",
          "Cross-contract obligations",
          "Consolidation opportunities",
        ],
      },
      {
        title: "Interaction Timeline",
        description: "Track all touchpoints with counterparty",
        emoji: "📅",
        details: [
          "Contract signings and amendments",
          "Payment transactions",
          "Disputes and resolutions",
          "Negotiation milestones",
          "Communication history",
        ],
      },
      {
        title: "Relationship Actions",
        description: "Take action on relationships",
        emoji: "⚡",
        details: [
          "Schedule renewal discussions",
          "Flag for legal review",
          "Request payment",
          "Escalate disputes",
          "Set strategic goals",
        ],
      },
      {
        title: "Pro Tips",
        description: "Build stronger relationships",
        emoji: "💡",
        details: [
          "Use health scores to identify at-risk relationships",
          "Review interaction timeline before negotiations",
          "Set quarterly relationship check-ins",
          "Track and recognize key stakeholders",
        ],
      },
    ],
  },
};

export const getTotalSteps = (module: string): number => {
  return GUIDE_CONTENT[module]?.steps.length || 0;
};

export const getGuideModule = (module: string): GuideModule | null => {
  return GUIDE_CONTENT[module] || null;
};