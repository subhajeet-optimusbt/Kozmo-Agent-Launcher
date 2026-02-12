// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useEffect, useState } from "react";
// import { useNavigate, useParams, useLocation } from "react-router-dom";
// import {
//   FileText,
//   Folder,
//   ArrowLeft,
//   Users,
//   Mail,
//   Phone,
//   Briefcase,
//   Star,
// } from "lucide-react";

// import { baseUrl } from "../../utils/baseUrl";
// import { getActiveAccountId } from "../../utils/auth";
// import FullscreenLoader from "../../components/ui/FullScreenLoader";

// /* ================= TYPES ================= */
// type SectionKey = "overview" | "contacts" | "contracts";

// interface Contact {
//   rowKey: string;
//   fullName: string;
//   email: string;
//   phone: string;
//   jobTitle: string;
//   department: string;
//   isPrimary: boolean;
//   isBillingContact: boolean;
//   isTechnicalContact: boolean;
//   isExecutiveSponsor: boolean;
// }

// interface Contract {
//   rowKey: string;
//   title: string;
//   description: string;
//   status: string;
//   type: string;
//   businessArea: string;
//   governingLaw: string;
//   counterparty: string;
//   companyName: string;
//   chiScore: number;
//   created: string;
// }

// /* ================= STATIC NAV SECTIONS ================= */
// const SECTIONSINTAKE: {
//   key: SectionKey;
//   label: string;
//   icon: any;
// }[] = [
//   { key: "overview", label: "Overview", icon: FileText },
//   { key: "contacts", label: "Contacts", icon: Users },
//   { key: "contracts", label: "Contracts", icon: Folder },
// ];

// /* ================= PAGE ================= */
// export default function RelationshipsDetailsPage() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const overview = location.state?.overview;
//   const { counterpartyId } = useParams();
//   const accountId = getActiveAccountId();

//   const [active, setActive] = useState<SectionKey>("overview");
//   const [contacts, setContacts] = useState<Contact[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [contracts, setContracts] = useState<Contract[]>([]);

//   /* ================= CONTACTS API ================= */
//   useEffect(() => {
//     if (!counterpartyId || !accountId) return;

//     const fetchContacts = async () => {
//       try {
//         setLoading(true);

//         const res = await fetch(
//           `${baseUrl()}/api/Relationship/${accountId}/CounterpartyContact?counterpartyId=${counterpartyId}`,
//           { credentials: "include" },
//         );

//         const json = await res.json();
//         setContacts(json || []);
//       } catch (err) {
//         console.error("Failed to fetch contacts", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchContacts();
//   }, [counterpartyId, accountId]);

//   useEffect(() => {
//     if (active !== "contracts") return;
//     if (!overview?.displayName || !accountId) return;

//     const fetchContracts = async () => {
//       try {
//         setLoading(true);

//         const res = await fetch(
//           `${baseUrl()}/api/Relationship/${accountId}/CounterpartyContracts?counterpartyName=${encodeURIComponent(
//             overview.displayName,
//           )}`,
//           { credentials: "include" },
//         );

//         const json = await res.json();
//         setContracts(json || []);
//       } catch (err) {
//         console.error("Failed to fetch contracts", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchContracts();
//   }, [active, overview?.displayName, accountId]);

//   return (
//     <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
//       <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

//       <div className="px-8 py-8 flex gap-8">
//         {/* ================= SIDEBAR ================= */}
//         <aside className="w-80 shrink-0">
//           <div className="sticky top-6">
//             <div className="rounded-2xl border border-gray-200 p-5 space-y-2 shadow-lg">
//               <h3 className="text-xs font-bold uppercase tracking-wider mb-4 text-gray-500">
//                 Navigation
//               </h3>

//               {SECTIONSINTAKE.map(({ key, label, icon: Icon }) => (
//                 <button
//                   key={key}
//                   onClick={() => setActive(key)}
//                   className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition
//                     ${
//                       active === key
//                         ? "bg-blue-600 text-white"
//                         : "hover:bg-gray-50 text-gray-700"
//                     }`}
//                 >
//                   <Icon size={16} />
//                   {label}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </aside>

//         {/* ================= CONTENT ================= */}
//         <main className="flex-1 space-y-4 min-w-0">
//           {/* Header */}
//           <div className="rounded-2xl border border-gray-200 shadow-lg p-6 flex justify-between">
//             <h1 className="text-xl font-bold">Relationship Details</h1>
//             <button
//               onClick={() => navigate(-1)}
//               className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm
//                 bg-emerald-50 border border-emerald-200 text-emerald-700"
//             >
//               <ArrowLeft size={16} />
//               Back
//             </button>
//           </div>

//           {/* ================= SECTION CONTENT ================= */}
//           <div className="rounded-2xl border border-gray-200 shadow-lg p-6">
//             {/* OVERVIEW */}
//             {active === "overview" && (
//               <>
//                 {!overview && (
//                   <div className="text-sm text-gray-500 text-center py-10">
//                     Overview data not available. Please open from Relationships
//                     list.
//                   </div>
//                 )}

//                 {overview && (
//                   <div className="space-y-6">
//                     {/* Header */}
//                     <div className="flex items-start justify-between">
//                       <div>
//                         <h2 className="text-xl font-bold text-gray-900">
//                           {overview.displayName}
//                         </h2>
//                         <p className="text-sm text-gray-500 mt-1">
//                           Relationship overview
//                         </p>
//                       </div>

//                       <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
//                         {overview.status}
//                       </span>
//                     </div>

//                     {/* Info Grid */}
//                     <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
//                       <OverviewItem
//                         label="Legal Name"
//                         value={overview.legalName}
//                       />
//                       <OverviewItem
//                         label="Category"
//                         value={overview.category}
//                       />
//                       <OverviewItem label="Created" value={overview.created} />
//                       <OverviewItem
//                         label="Modified"
//                         value={overview.modified}
//                       />
//                     </div>

//                     {/* Hint */}
//                     <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 text-sm text-gray-600">
//                       View obligations, clauses, milestones, documents, and
//                       pricing terms inside the full contract workspace.
//                     </div>
//                   </div>
//                 )}
//               </>
//             )}

//             {active === "contacts" && (
//               <>
//                 {loading && <FullscreenLoader />}
//                 {!loading && contacts.length === 0 && (
//                   <div className="text-center text-sm text-gray-400 py-16">
//                     No contacts found for this counterparty.
//                   </div>
//                 )}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                   {contacts.map((c) => (
//                     <div
//                       key={c.rowKey}
//                       className="rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 p-5"
//                     >
//                       {/* Top Section */}
//                       <div className="flex items-start justify-between gap-3">
//                         {/* Avatar + Name */}
//                         <div className="flex items-center gap-3">
//                           <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-semibold text-sm shrink-0">
//                             {c.fullName
//                               ? c.fullName
//                                   .split(" ")
//                                   .map((n) => n[0])
//                                   .join("")
//                                   .slice(0, 2)
//                                   .toUpperCase()
//                               : "?"}
//                           </div>
//                           <div>
//                             <h3 className="font-semibold text-gray-900 leading-tight">
//                               {c.fullName || "—"}
//                             </h3>
//                             <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
//                               <Briefcase size={12} />
//                               {c.jobTitle || "No title"}
//                             </p>
//                           </div>
//                         </div>

//                         {/* Primary Badge */}
//                         {c.isPrimary && (
//                           <span className="inline-flex items-center gap-1 text-xs font-medium text-yellow-700 bg-yellow-50 border border-yellow-100 rounded-full px-2.5 py-0.5 shrink-0">
//                             <Star
//                               size={11}
//                               className="fill-yellow-500 text-yellow-500"
//                             />
//                             Primary
//                           </span>
//                         )}
//                       </div>

//                       {/* Divider */}
//                       <div className="my-4 border-t border-gray-100" />

//                       {/* Contact Details */}
//                       <div className="space-y-2.5 text-sm text-gray-600">
//                         <div className="flex items-center gap-2.5">
//                           <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
//                             <Mail size={13} className="text-gray-400" />
//                           </div>
//                           <span className="truncate">{c.email || "—"}</span>
//                         </div>
//                         <div className="flex items-center gap-2.5">
//                           <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
//                             <Phone size={13} className="text-gray-400" />
//                           </div>
//                           <span>{c.phone || "—"}</span>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </>
//             )}

//             {/* CONTRACTS */}
//             {active === "contracts" && (
//               <>
//                 {loading && <FullscreenLoader />}

//                 {!loading && contracts.length === 0 && (
//                   <div className="text-center text-sm text-gray-500 py-10">
//                     No contracts found for this counterparty.
//                   </div>
//                 )}

//                 <div className="space-y-4">
//                   {contracts.map((contract) => (
//                     <div
//                       key={contract.rowKey}
//                       className="rounded-xl border border-gray-200 p-5 hover:shadow transition"
//                     >
//                       {/* Header */}
//                       <div className="flex justify-between items-start">
//                         <div>
//                           <h3 className="font-semibold text-gray-900">
//                             {contract.title}
//                           </h3>
//                           <p className="text-sm text-gray-500 mt-1">
//                             {contract.description}
//                           </p>
//                         </div>

//                         <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
//                           {contract.status}
//                         </span>
//                       </div>

//                       {/* Meta */}
//                       <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
//                         <Meta label="Type" value={contract.type} />
//                         <Meta
//                           label="Business Area"
//                           value={contract.businessArea}
//                         />
//                         <Meta
//                           label="Governing Law"
//                           value={contract.governingLaw}
//                         />
//                         <Meta
//                           label="CHI Score"
//                           value={String(contract.chiScore)}
//                         />
//                       </div>

//                       {/* Footer */}
//                       <div className="mt-4 text-xs text-gray-400">
//                         Created on{" "}
//                         {new Date(contract.created).toLocaleDateString()}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </>
//             )}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }

// function OverviewItem({ label, value }: { label: string; value: string }) {
//   return (
//     <div>
//       <div className="text-xs uppercase tracking-wide text-gray-400 mb-1">
//         {label}
//       </div>
//       <div className="text-sm font-semibold text-gray-900">{value || "—"}</div>
//     </div>
//   );
// }

// function Meta({ label, value }: { label: string; value?: string }) {
//   return (
//     <div>
//       <div className="text-xs uppercase tracking-wide text-gray-400">
//         {label}
//       </div>
//       <div className="font-medium text-gray-800">{value || "—"}</div>
//     </div>
//   );
// }

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  FileText,
  Folder,
  ArrowLeft,
  Users,
  Mail,
  Phone,
  Briefcase,
  Star,
} from "lucide-react";

import { baseUrl } from "../../utils/baseUrl";
import { getActiveAccountId } from "../../utils/auth";
import FullscreenLoader from "../../components/ui/FullScreenLoader";

/* ================= TYPES ================= */
type SectionKey = "overview" | "contacts" | "contracts";

interface Contact {
  rowKey: string;
  fullName: string;
  email: string;
  phone: string;
  jobTitle: string;
  department: string;
  isPrimary: boolean;
}

interface Contract {
  rowKey: string;
  title: string;
  description: string;
  status: string;
  type: string;
  businessArea: string;
  governingLaw: string;
  chiScore: number;
  created: string;
}

/* ================= NAV ================= */
const SECTIONS = [
  { key: "overview", label: "Overview", icon: FileText },
  { key: "contacts", label: "Contacts", icon: Users },
  { key: "contracts", label: "Contracts", icon: Folder },
];

/* ================= PAGE ================= */
export default function RelationshipsDetailsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const overview = location.state?.overview;
  const { counterpartyId } = useParams();
  const accountId = getActiveAccountId();

  const [active, setActive] = useState<SectionKey>("overview");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(false);

  /* ================= CONTACTS API ================= */
  useEffect(() => {
    if (!counterpartyId || !accountId) return;

    const fetchContacts = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${baseUrl()}/api/Relationship/${accountId}/CounterpartyContact?counterpartyId=${counterpartyId}`,
          { credentials: "include" },
        );
        setContacts((await res.json()) || []);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [counterpartyId, accountId]);

  /* ================= CONTRACTS API ================= */
  useEffect(() => {
    if (active !== "contracts" || !overview?.displayName || !accountId) return;

    const fetchContracts = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${baseUrl()}/api/Relationship/${accountId}/CounterpartyContracts?counterpartyName=${encodeURIComponent(
            overview.displayName,
          )}`,
          { credentials: "include" },
        );
        setContracts((await res.json()) || []);
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, [active, overview?.displayName, accountId]);

  return (
    <div className="relative bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Top Gradient */}
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

              {SECTIONS.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActive(key as SectionKey)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all
                    ${
                      active === key
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                        : "hover:bg-gray-50 text-gray-700 hover:shadow"
                    }`}
                >
                  <Icon size={16} />
                  <span className="font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* ================= CONTENT ================= */}
        <main className="flex-1 space-y-4 min-w-0">
          {/* Header */}
          <div className="bg-gradient-to-br from-white to-gray-50/60 rounded-2xl border border-gray-200 shadow-lg">
            <div className="px-8 py-6 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Users size={26} className="text-white" />
                </div>

                <div>
                  <h1 className="text-xl font-bold text-gray-800">
                    Relationship Details
                  </h1>
                  <p className="text-sm text-gray-500">
                    Overview, contacts & contracts
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
                  text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100"
              >
                <ArrowLeft size={16} />
                Back
              </button>
            </div>
          </div>

          {/* Section Content */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
            {active === "overview" && (
              <>
                {!overview && (
                  <div className="text-sm text-gray-500 text-center py-10">
                    Overview data not available.
                  </div>
                )}

                {overview && (
                  <div className="space-y-6">
                    <div className="flex justify-between">
                      <div>
                        <h2 className="text-xl font-bold">
                          {overview.displayName}
                        </h2>
                        <p className="text-sm text-gray-500">
                          Relationship overview
                        </p>
                      </div>
                      <span
                        className="inline-flex items-center justify-center
  px-3 py-1
  text-xs font-medium
  rounded-full
  bg-green-100 text-green-700"
                      >
                        {overview.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      <OverviewItem
                        label="Legal Name"
                        value={overview.legalName}
                      />
                      <OverviewItem
                        label="Category"
                        value={overview.category}
                      />
                      <OverviewItem label="Created" value={overview.created} />
                      <OverviewItem
                        label="Modified"
                        value={overview.modified}
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            {active === "contacts" && (
              <>
                {loading && <FullscreenLoader />}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {contacts.map((c) => (
                    <div
                      key={c.rowKey}
                      className="rounded-2xl border bg-gray-50 p-5 hover:shadow"
                    >
                      <div className="flex justify-between">
                        <div className="flex gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-semibold">
                            {c.fullName?.[0]}
                          </div>
                          <div>
                            <p className="font-semibold">{c.fullName}</p>
                            <p className="text-xs text-gray-500 flex gap-1">
                              <Briefcase size={12} /> {c.jobTitle}
                            </p>
                          </div>
                        </div>

                        {c.isPrimary && (
                          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Star size={11} />
                            Primary
                          </span>
                        )}
                      </div>

                      <div className="mt-4 space-y-2 text-sm text-gray-600">
                        <div className="flex gap-2 items-center">
                          <Mail size={14} /> {c.email || "—"}
                        </div>
                        <div className="flex gap-2 items-center">
                          <Phone size={14} /> {c.phone || "—"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {active === "contracts" && (
              <>
                {loading && <FullscreenLoader />}
                <div className="space-y-4">
                  {contracts.map((c) => (
                    <div
                      key={c.rowKey}
                      className="border rounded-xl p-5 bg-gray-50 hover:shadow"
                    >
                      <div className="flex justify-between">
                        <div>
                          <p className="font-semibold">{c.title}</p>
                          <p className="text-sm text-gray-500">
                            {c.description}
                          </p>
                        </div>
                        <span
                          className="inline-flex items-center justify-center
  px-3 py-1
  text-xs font-medium
  rounded-full
  bg-green-100 text-green-700"
                        >
                          {c.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                        <Meta label="Type" value={c.type} />
                        <Meta label="Business Area" value={c.businessArea} />
                        <Meta label="Law" value={c.governingLaw} />
                        <Meta label="CHI" value={String(c.chiScore)} />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

/* ================= HELPERS ================= */
function OverviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-gray-400 mb-1">
        {label}
      </div>
      <div className="text-sm font-semibold text-gray-900">{value || "—"}</div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-gray-400">
        {label}
      </div>
      <div className="font-medium text-gray-800">{value || "—"}</div>
    </div>
  );
}
