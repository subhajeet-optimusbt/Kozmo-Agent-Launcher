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

  const formatDate = (value?: string) => {
    if (!value) return "N/A";

    return new Date(value).toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    });
  };

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
                      <OverviewItem
                        label="Created"
                        value={formatDate(overview.created)}
                      />
                      <OverviewItem
                        label="Modified"
                        value={formatDate(overview.modified)}
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
