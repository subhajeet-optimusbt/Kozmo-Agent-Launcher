/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "antd";
import {
  FileText,
  ListChecks,
  Scale,
  DollarSign,
  Flag,
  ShieldCheck,
  ArrowLeft,
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
} from "lucide-react";

import { baseUrl } from "../../utils/baseUrl";
import { getActiveAccountId, ACCOUNT_CHANGED_EVENT } from "../../utils/auth";
import FullscreenLoader from "../../components/ui/FullScreenLoader";

/* ---------------------------------- */
/* Sidebar Sections */
/* ---------------------------------- */

const SECTIONS = [
  {
    key: "overview",
    label: "Overview",
    icon: FileText,
    visible: (data: any) => data?.metadata?.length > 0,
  },
  {
    key: "milestones",
    label: "Milestones",
    icon: Flag,
    visible: (data: any) => data?.milestones?.length > 0,
  },
  {
    key: "obligations",
    label: "Obligations",
    icon: ListChecks,
    visible: (data: any) => data?.obligations?.length > 0,
  },
  {
    key: "clauses",
    label: "Clauses",
    icon: Scale,
    visible: (data: any) => data?.clauses?.length > 0,
  },
  {
    key: "pricing",
    label: "Pricing Terms",
    icon: DollarSign,
    visible: (data: any) => data?.pricing_terms?.length > 0,
  },
  {
    key: "provisions",
    label: "Key Provisions",
    icon: ShieldCheck,
    visible: (data: any) => data?.key_provisions?.length > 0,
  },
  {
    key: "activity",
    label: "Activity",
    icon: Activity,
    always: true,
  },
];

/* ---------------------------------- */
/* Page */
/* ---------------------------------- */

// export default function DocumentDetailsPage() {
//   const [ACTIVE_TENANT_ID, setACTIVE_TENANT_ID] =
//     useState(getActiveAccountId());

//   useEffect(() => {
//     const handler = () => setACTIVE_TENANT_ID(getActiveAccountId());
//     window.addEventListener(ACCOUNT_CHANGED_EVENT, handler);
//     return () => window.removeEventListener(ACCOUNT_CHANGED_EVENT, handler);
//   }, []);

//   const { documentId } = useParams();
//   const navigate = useNavigate();

//   const [active, setActive] = useState("overview");
//   const [data, setData] = useState<any>(null);
//   const [activity, setActivity] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   /* ---------------------------------- */
//   /* Fetch Document Profile (MAIN PAGE) */
//   /* ---------------------------------- */
//   useEffect(() => {
//     if (!documentId) return;

//     const fetchDocument = async () => {
//       try {
//         setLoading(true);

//         const res = await fetch(
//           `${baseUrl()}/api/Document/${ACTIVE_TENANT_ID}/profile/${documentId}`,
//           {
//             credentials: "include",
//           },
//         );

//         if (!res.ok) throw new Error("Failed to load document");

//         const json = await res.json();
//         setData(json); // ✅ CORRECT
//       } catch (err: any) {
//         setError(err.message || "Something went wrong");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDocument();
//   }, [documentId, ACTIVE_TENANT_ID]);

//   /* ---------------------------------- */
//   /* Fetch Activity Log (SILENT) */
//   /* ---------------------------------- */
//   useEffect(() => {
//     if (!documentId) return;

//     const fetchDocumentActivity = async () => {
//       try {
//         const res = await fetch(
//           `${baseUrl()}/api/Document/${ACTIVE_TENANT_ID}/ActivityLog/${documentId}`,
//           {
//             credentials: "include",
//           },
//         );

//         if (!res.ok) throw new Error("Failed to load activity");

//         const json = await res.json();
//         setActivity(json); // ✅ CORRECT
//       } catch (err) {
//         console.error("Activity API failed", err);
//       }
//     };

//     fetchDocumentActivity();
//   }, [documentId, ACTIVE_TENANT_ID]);

//   /* ---------------------------------- */
//   /* UI States */
//   /* ---------------------------------- */

//   if (loading) return <FullscreenLoader />;

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <p className="text-red-500">{error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-[1500px] mx-auto bg-white rounded-2xl shadow-lg border">
//         <div className="flex gap-6 p-6">
//           {/* Sidebar */}
//           <aside className="w-72">
//             <div className="space-y-2">
//               {SECTIONS.filter((s) => s.always || s.visible?.(data)).map(
//                 ({ key, label, icon: Icon }) => (
//                   <button
//                     key={key}
//                     onClick={() => setActive(key)}
//                     className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm
//                     ${
//                       active === key
//                         ? "bg-blue-600 text-white"
//                         : "hover:bg-gray-100"
//                     }`}
//                   >
//                     <Icon size={16} />
//                     {label}
//                   </button>
//                 ),
//               )}
//             </div>
//           </aside>

//           {/* Content */}
//           <main className="flex-1">
//             <div className="flex justify-between mb-4">
//               <h1 className="text-xl font-bold">Document Details</h1>

//               <Button
//                 icon={<ArrowLeft size={16} />}
//                 onClick={() => navigate(-1)}
//               >
//                 Back
//               </Button>
//             </div>

//             {active === "overview" && (
//               <DocumentOverview metadata={data.metadata} />
//             )}

//             {active === "milestones" && (
//               <DocumentMilestones items={data.milestones} />
//             )}

//             {active === "obligations" && (
//               <DocumentObligations items={data.obligations} />
//             )}

//             {active === "clauses" && <DocumentClauses items={data.clauses} />}

//             {active === "pricing" && (
//               <DocumentPricing items={data.pricing_terms} />
//             )}

//             {active === "provisions" && (
//               <DocumentProvisions items={data.key_provisions} />
//             )}

//             {active === "activity" && <DocumentActivity items={activity} />}
//           </main>
//         </div>
//       </div>
//     </div>
//   );
// }

export default function DocumentDetailsPage() {
  const [ACTIVE_TENANT_ID, setACTIVE_TENANT_ID] =
    useState(getActiveAccountId());

  useEffect(() => {
    const handler = () => setACTIVE_TENANT_ID(getActiveAccountId());
    window.addEventListener(ACCOUNT_CHANGED_EVENT, handler);
    return () => window.removeEventListener(ACCOUNT_CHANGED_EVENT, handler);
  }, []);

  const { documentId } = useParams();
  const navigate = useNavigate();

  const [active, setActive] = useState("overview");
  const [data, setData] = useState<any>(null);
  const [activity, setActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ---------------- FETCH ---------------- */

  useEffect(() => {
    if (!documentId) return;

    const fetchDocument = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${baseUrl()}/api/Document/${ACTIVE_TENANT_ID}/profile/${documentId}`,
          { credentials: "include" },
        );

        if (!res.ok) throw new Error("Failed to load document");

        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [documentId, ACTIVE_TENANT_ID]);

  useEffect(() => {
    if (!documentId) return;

    fetch(
      `${baseUrl()}/api/Document/${ACTIVE_TENANT_ID}/ActivityLog/${documentId}`,
      { credentials: "include" },
    )
      .then((r) => r.json())
      .then(setActivity)
      .catch(() => {});
  }, [documentId, ACTIVE_TENANT_ID]);

  /* ---------------- STATES ---------------- */

  if (loading) return <FullscreenLoader />;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        {" "}
        <p className="text-red-500">{error}</p>{" "}
      </div>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
      {/* Top Gradient Accent */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
      <div className="px-8 py-8 flex gap-8">
        {/* ================= SIDEBAR ================= */}

        <aside className="w-80 shrink-0">
          <div className="sticky top-6">
            <div className="bg-gradient-to-br from-white to-gray-50/60 rounded-2xl border border-gray-200 p-5 space-y-2 shadow-lg">
              <h3 className="text-xs font-bold uppercase tracking-wider mb-4 text-gray-500 flex items-center gap-2">
                <div className="w-1 h-4 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
                Navigation
              </h3>

              {SECTIONS.filter((s) => s.always || s.visible?.(data)).map(
                ({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setActive(key)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200
                    ${
                      active === key
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                        : "hover:bg-gray-50 text-gray-700 hover:shadow"
                    }`}
                  >
                    <Icon size={16} />
                    <span className="font-medium">{label}</span>
                  </button>
                ),
              )}
            </div>
          </div>
        </aside>

        {/* ================= CONTENT ================= */}

        <main className="flex-1 space-y-4 min-w-0">
          {/* Header Card */}
          <div className="bg-gradient-to-br from-white to-gray-50/60 rounded-2xl border border-gray-200 shadow-lg">
            <div className="px-8 py-6 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <FileText className="text-white" size={26} />
                </div>

                <div>
                  <h1 className="text-xl font-bold text-gray-800">
                    Document Details
                  </h1>
                  <p className="text-sm text-gray-500">
                    Complete document profile & metadata
                  </p>
                </div>
              </div>

              <Button
                icon={<ArrowLeft size={16} />}
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100"
              >
                Back
              </Button>
            </div>
          </div>

          {/* Section Content Card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
            <div className="p-6">
              {active === "overview" && (
                <DocumentOverview metadata={data.metadata} />
              )}

              {active === "milestones" && (
                <DocumentMilestones items={data.milestones} />
              )}

              {active === "obligations" && (
                <DocumentObligations items={data.obligations} />
              )}

              {active === "clauses" && <DocumentClauses items={data.clauses} />}

              {active === "pricing" && (
                <DocumentPricing items={data.pricing_terms} />
              )}

              {active === "provisions" && (
                <DocumentProvisions items={data.key_provisions} />
              )}

              {active === "activity" && <DocumentActivity items={activity} />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export function DocumentOverview({ metadata }: { metadata: any[] }) {
  const getValue = (name: string) =>
    metadata?.find((m) => m.FieldName === name)?.FieldValue || "—";

  return (
    <div className="bg-white rounded-2xl border shadow-sm p-6">
      {/* Header */}
      <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-800">
        <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
          <FileText size={18} />
        </div>
        Overview
      </h2>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        <InfoCard label="Company Name" value={getValue("CompanyName")} />
        <InfoCard label="Counterparty" value={getValue("Counterparty")} />
        <InfoCard
          label="Originating Party"
          value={getValue("OriginatingParty")}
        />
        <InfoCard label="Jurisdiction" value={getValue("Jurisdiction")} />
        <InfoCard label="Governing Law" value={getValue("GoverningLaw")} />
        <InfoCard
          label="Billing Frequency"
          value={getValue("BillingFrequency")}
        />
        <InfoCard label="Payment Term" value={getValue("PaymentTerm")} />
        <InfoCard label="Currency" value={getValue("Currency")} />
        <InfoCard label="Start Date" value={getValue("StartDate")} />
        <InfoCard label="End Date" value={getValue("EndDate")} />
      </div>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border rounded-xl p-4 bg-gray-50">
      <div className="text-xs uppercase text-gray-500 font-semibold mb-1">
        {label}
      </div>
      <div className="text-sm font-medium text-gray-800">{value || "-"}</div>
    </div>
  );
}

export function DocumentMilestones({ items }: { items: any[] }) {
  return (
    <div className="bg-white rounded-2xl border shadow-sm p-6">
      {/* Header */}
      <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-800">
        <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
          <Flag size={18} />
        </div>
        Milestones
        <span className="text-sm font-medium text-gray-500">
          ({items.length})
        </span>
      </h2>

      {/* Empty State */}
      {items.length === 0 && (
        <div className="text-sm text-gray-500 bg-gray-50 border rounded-xl p-6 text-center">
          No milestones available for this document.
        </div>
      )}

      {/* Timeline */}
      <div className="relative space-y-6">
        {/* Vertical line */}
        <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200" />

        {items.map((m, i) => (
          <div key={i} className="relative flex gap-4">
            {/* Dot */}
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 text-white shadow">
              <Flag size={14} />
            </div>

            {/* Card */}
            <div className="flex-1 border rounded-xl p-4 bg-gray-50 hover:bg-white transition shadow-sm">
              <h3 className="font-semibold text-gray-800">{m.Title}</h3>

              <p className="text-sm text-gray-600 mt-1">
                {m.Description || "No description"}
              </p>

              <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                <Calendar size={14} />
                <span className="px-2 py-1 rounded-md bg-white border">
                  {m.Date || "—"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DocumentObligations({ items }: { items: any[] }) {
  return (
    <div>
      <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
        <ListChecks size={18} /> Obligations ({items.length})
      </h2>

      <div className="space-y-4">
        {items.map((o, i) => (
          <div key={i} className="border rounded-xl p-4 bg-gray-50">
            <h3 className="font-semibold text-gray-800">{o.Obligation}</h3>
            <p className="text-sm text-gray-600 mt-1">{o.Description}</p>

            <div className="flex gap-4 mt-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                {o.DueDate || "—"}
              </span>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                {o.Frequency}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DocumentClauses({ items }: { items: any[] }) {
  return (
    <div>
      <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
        <Scale size={18} /> Clauses ({items.length})
      </h2>

      <div className="space-y-4">
        {items.map((c, i) => (
          <div key={i} className="border rounded-xl p-4 bg-white">
            <h3 className="font-semibold text-gray-800 mb-2">{c.ClauseType}</h3>
            <p className="text-sm text-gray-600">{c.ClauseText}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DocumentPricing({ items }: { items: any[] }) {
  return (
    <div className="bg-white rounded-2xl border shadow-sm p-6">
      {/* Header */}
      <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-800">
        <div className="p-2 rounded-lg bg-green-50 text-green-600">
          <DollarSign size={18} />
        </div>
        Pricing Terms
        <span className="text-sm font-medium text-gray-500">
          ({items.length})
        </span>
      </h2>

      {/* Empty State */}
      {items.length === 0 && (
        <div className="text-sm text-gray-500 bg-gray-50 border rounded-xl p-6 text-center">
          No pricing terms defined for this document.
        </div>
      )}

      {/* Pricing Cards */}
      <div className="space-y-4">
        {items.map((p, i) => (
          <div
            key={i}
            className="
              border rounded-xl p-5 
              bg-gradient-to-br from-green-50 to-white
              hover:shadow-md transition
              flex gap-4 items-start
            "
          >
            {/* Icon */}
            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-green-100 text-green-600">
              <DollarSign size={18} />
            </div>

            {/* Content */}
            <div className="flex-1">
              {/* Term Type */}
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold text-gray-800">
                  {p.TermType || "Pricing Term"}
                </h3>

                {/* Badge */}
                <span className="text-xs px-2 py-1 rounded-md bg-white border text-gray-600">
                  Financial
                </span>
              </div>

              {/* Term Text */}
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                {p.TermText || "No description available."}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DocumentProvisions({ items }: { items: any[] }) {
  return (
    <div>
      <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
        <ShieldCheck size={18} /> Key Provisions ({items.length})
      </h2>

      <div className="space-y-4">
        {items.map((p, i) => (
          <div key={i} className="border rounded-xl p-4 bg-purple-50">
            <h3 className="font-semibold text-gray-800">{p.Provision}</h3>
            <p className="text-sm text-gray-600 mt-1">{p.Description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DocumentActivity({ items = [] }: { items: any[] }) {
  return (
    <div className="bg-white rounded-2xl border shadow-sm p-6">
      {/* Header */}
      <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-800">
        <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
          <Activity size={18} />
        </div>
        Activity Log
        <span className="text-sm font-medium text-gray-500">
          ({items.length})
        </span>
      </h2>

      {/* Empty */}
      {items.length === 0 && (
        <div className="text-sm text-gray-500 bg-gray-50 border rounded-xl p-6 text-center">
          No activity recorded for this document.
        </div>
      )}

      {/* Timeline */}
      <div className="relative space-y-6">
        {/* Vertical line */}
        <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200" />

        {items.map((a, index) => (
          <div key={index} className="relative flex gap-4">
            {/* Dot */}
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-purple-500 text-white shadow">
              <Activity size={14} />
            </div>

            {/* Card */}
            <div className="flex-1 border rounded-xl p-4 bg-gray-50 hover:bg-white transition shadow-sm">
              <div className="flex justify-between items-start gap-4">
                <div>
                  {/* Action */}
                  <h3 className="font-semibold text-gray-800">{a.action}</h3>

                  {/* Details */}
                  <p className="text-sm text-gray-600 mt-1">
                    {a.details || "No details available"}
                  </p>

                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {a.timestamp || "—"}
                    </span>

                    <span className="px-2 py-1 rounded-md bg-white border">
                      {a.source || "System"}
                    </span>
                  </div>
                </div>

                {/* Status */}
                <StatusBadge status={a.status} />
              </div>

              {/* Footer IDs */}
              <div className="mt-4 pt-3 border-t text-xs text-gray-400 grid grid-cols-2 gap-2">
                <span>Document ID: {a.documentid || "—"}</span>
                <span>Request ID: {a.requestid || "—"}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------- */
/* Status Badge */
/* ---------------------------------- */

function StatusBadge({ status }: { status: string }) {
  if (status === "Success") {
    return (
      <span className="flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-lg bg-green-100 text-green-700">
        <CheckCircle size={14} />
        Success
      </span>
    );
  }

  return (
    <span className="flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-lg bg-red-100 text-red-700">
      <XCircle size={14} />
      Failed
    </span>
  );
}
