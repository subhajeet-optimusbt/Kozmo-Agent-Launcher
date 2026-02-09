/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Tag } from "antd";
import {
  FileText,
  ListChecks,
  Flag,
  Folder,
  DollarSign,
  Scale,
  FileSignature,
  ShieldCheck,
  ArrowLeft,
  Download,
  Calendar,
  Building2,
  Clock,
} from "lucide-react";

import { getActiveAccountId, ACCOUNT_CHANGED_EVENT } from "../../utils/auth";
import FullscreenLoader from "../../components/ui/FullScreenLoader";
import "./ContractDetails.css";

/* ---------------------------------- */
/* Sidebar Sections Mapping */
/* ---------------------------------- */

const SECTIONS = [
  {
    key: "overview",
    label: "Overview",
    icon: FileText,
    apiKey: "contractEntity",
  },
  { key: "documents", label: "Documents", icon: Folder, apiKey: "documents" },
  {
    key: "milestones",
    label: "Milestones",
    icon: Flag,
    apiKey: "contractMilestones",
  },
  {
    key: "provisions",
    label: "Provisions",
    icon: FileSignature,
    apiKey: "contractKeyProvisions",
  },
  {
    key: "obligations",
    label: "Obligations",
    icon: ListChecks,
    apiKey: "contractObligations",
  },
  { key: "clauses", label: "Clauses", icon: Scale, apiKey: "contractClauses" },
  {
    key: "pricing",
    label: "Pricing Terms",
    icon: DollarSign,
    apiKey: "contractPricingTerms",
  },
  {
    key: "provenance",
    label: "Provenance",
    icon: ShieldCheck,
    apiKey: "provenance",
  },
];

/* ---------------------------------- */
/* Page */
/* ---------------------------------- */

export default function ContractDetailsPage() {
  const [ACTIVE_TENANT_ID, setACTIVE_TENANT_ID] =
    useState(getActiveAccountId());

  useEffect(() => {
    const handler = () => setACTIVE_TENANT_ID(getActiveAccountId());
    window.addEventListener(ACCOUNT_CHANGED_EVENT, handler);
    return () => window.removeEventListener(ACCOUNT_CHANGED_EVENT, handler);
  }, []);

  const { id } = useParams();
  const navigate = useNavigate();

  const [active, setActive] = useState("overview");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchContract = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `https://kozmo-saas.azurewebsites.net/api/Contract/${ACTIVE_TENANT_ID}/profile/${id}`,
        );

        if (!res.ok) throw new Error("Failed to load contract");

        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchContract();
  }, [id, ACTIVE_TENANT_ID]);

  if (loading) return <FullscreenLoader />;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center border border-red-100">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="text-red-500" size={32} />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Error Loading Contract
          </h2>
          <p className="text-red-500 mb-6">{error}</p>
          <Button
            type="primary"
            onClick={() => navigate(-1)}
            className="bg-gradient-to-r from-blue-500 to-blue-600 border-0"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const { contractEntity } = data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-purple-50/20 p-6">
      <div className="max-w-[1600px] mx-auto">
        <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          {/* Gradient accent */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500" />

          <div className="px-8 py-8 flex gap-8">
            {/* ---------------------------------- */}
            {/* Sidebar */}
            {/* ---------------------------------- */}

            <aside className="w-80 shrink-0">
              <div className="sticky top-6">
                <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl border border-gray-200 p-5 space-y-2 shadow-lg backdrop-blur-sm">
                  <h3 className="text-xs font-bold uppercase tracking-wider mb-4 text-gray-500 flex items-center gap-2">
                    <div className="w-1 h-4 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
                    Navigation
                  </h3>

                  {SECTIONS.map(({ key, label, icon: Icon, apiKey }) => {
                    const count = Array.isArray(data?.[apiKey])
                      ? data[apiKey].length
                      : null;

                    return (
                      <button
                        key={key}
                        onClick={() => setActive(key)}
                        className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 group
                          ${
                            active === key
                              ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 scale-[1.02]"
                              : "hover:bg-gray-50 text-gray-700 hover:shadow-md hover:scale-[1.01]"
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`transition-transform duration-200 ${active === key ? "" : "group-hover:scale-110"}`}
                          >
                            <Icon
                              size={12}
                              strokeWidth={active === key ? 2.5 : 2}
                            />
                          </div>
                          <span
                            className={
                              active === key ? "font-semibold" : "font-medium"
                            }
                          >
                            {label}
                          </span>
                        </div>

                        {count !== null && (
                          <span
                            className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors
                            ${
                              active === key
                                ? "bg-white/20 text-white"
                                : "bg-gray-100 text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-600"
                            }`}
                          >
                            {count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </aside>

            {/* ---------------------------------- */}
            {/* Main Content */}
            {/* ---------------------------------- */}

            <main className="flex-1 space-y-3 min-w-0">
              {/* Header */}
              <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
                <div className="px-8 py-6">
                  <div className="flex justify-between items-start gap-6">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                          <FileText
                            className="text-white"
                            size={28}
                            strokeWidth={2}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h1 className="text-xl font-bold text-gray-800 mb-1 truncate">
                            {contractEntity.ContractTitle}
                          </h1>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Building2 size={12} />
                            <p className="text-sm font-medium">
                              {contractEntity.CompanyName}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Tag
                          color="success"
                          className="px-3 py-1 rounded-lg border-0 bg-green-50 text-green-700 font-medium flex items-center"
                        >
                          {contractEntity.Status}
                        </Tag>

                        <Tag className="px-3 py-1 rounded-lg border border-blue-200 bg-blue-50 text-blue-700 font-medium flex items-center">
                          {contractEntity.ContractType}
                        </Tag>

                        {contractEntity.FinalizedDate && (
                          <Tag className="px-3 py-1 rounded-lg border border-gray-200 bg-gray-50 text-gray-700 font-medium flex items-center gap-1">
                            <Calendar size={14} />
                            <span>
                              {formatDate(contractEntity.FinalizedDate)}
                            </span>
                          </Tag>
                        )}
                      </div>
                    </div>

                    <Button
                      icon={<ArrowLeft size={18} />}
                      onClick={() => navigate(-1)}
                      className="h-10 px-5 rounded-xl border-gray-300 hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm hover:shadow-md"
                    >
                      Back
                    </Button>
                  </div>
                </div>
              </div>

              {/* Section Content */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
                <div className="p-4">
                  <div className="animate-fadeIn">
                    {active === "overview" && <Overview data={data} />}
                    {active === "documents" && (
                      <Documents items={data.documents} />
                    )}
                    {active === "milestones" && (
                      <Milestones items={data.contractMilestones} />
                    )}
                    {active === "provisions" && (
                      <Provisions items={data.contractKeyProvisions} />
                    )}
                    {active === "obligations" && (
                      <Obligations items={data.contractObligations} />
                    )}
                    {active === "clauses" && (
                      <Clauses items={data.contractClauses} />
                    )}
                    {active === "pricing" && (
                      <Pricing items={data.contractPricingTerms} />
                    )}
                    {active === "provenance" && (
                      <Provenance data={data.provenance} />
                    )}
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------- */
/* Sections */
/* ---------------------------------- */

function Overview({ data }: { data: any }) {
  const c = data.contractEntity;

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
        <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
        Contract Overview
      </h2>
      <div className="grid grid-cols-2 gap-6">
        <InfoCard
          label="Counterparty"
          value={c.Counterparty}
          icon={Building2}
        />
        <InfoCard label="Business Area" value={c.BusinessArea} icon={Folder} />
        <InfoCard
          label="Contract Type"
          value={c.ContractType}
          icon={FileText}
        />
        <InfoCard label="Status" value={c.Status} icon={ShieldCheck} />
        <InfoCard
          label="Finalized On"
          value={formatDate(c.FinalizedDate)}
          icon={Calendar}
        />
        <InfoCard
          label="Created On"
          value={formatDate(c.Created)}
          icon={Clock}
        />
      </div>
    </div>
  );
}

function Documents({ items }: { items: any[] }) {
  return (
    <div>
      <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
        <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
        Documents ({items.length})
      </h2>
      <div className="space-y-3">
        {items.map((d) => (
          <div
            key={d.RowKey}
            className="group flex justify-between items-center border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-blue-300 transition-all duration-200 bg-gradient-to-r hover:from-blue-50/50"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <FileText className="text-blue-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-0.5">
                  {d.FileName}
                </h3>
                <p className="text-xs text-gray-500 flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-gray-100 rounded">
                    {d.DocumentType}
                  </span>
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded">
                    {d.Status}
                  </span>
                </p>
              </div>
            </div>

            <Button
              type="primary"
              icon={<Download size={16} />}
              href={d.FileUrl}
              target="_blank"
              className="bg-gradient-to-r from-blue-500 to-blue-600 border-0 rounded-lg shadow-md hover:shadow-lg"
            >
              View
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Milestones({ items }: { items: any[] }) {
  return (
    <div>
      <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
        <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
        Milestones ({items.length})
      </h2>
      <div className="space-y-3">
        {items.map((m, idx) => (
          <div
            key={m.id}
            className="relative border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-200 bg-gradient-to-r hover:from-purple-50/50 hover:border-purple-300 group"
          >
            <div className="absolute left-5 top-5 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
              {idx + 1}
            </div>
            <div className="pl-12">
              <h3 className="font-semibold text-gray-800 mb-2">{m.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{m.description}</p>
              <p className="text-xs text-gray-500 flex items-center gap-1.5">
                <Calendar size={14} />
                {formatDate(m.date)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Provisions({ items }: { items: any[] }) {
  return (
    <div>
      <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
        <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
        Key Provisions ({items.length})
      </h2>
      <div className="grid grid-cols-1 gap-4">
        {items.map((p) => (
          <div
            key={p.id}
            className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-200 bg-gradient-to-r hover:from-emerald-50/50 hover:border-emerald-300"
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <h3 className="font-semibold text-gray-800 flex-1">{p.title}</h3>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold">
                {p.category}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3">{p.description}</p>
            <div className="pt-3 border-t border-gray-100">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Value:{" "}
              </span>
              <span className="text-sm font-medium text-gray-800">
                {p.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Obligations({ items }: { items: any[] }) {
  return (
    <div>
      <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
        <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
        Obligations ({items.length})
      </h2>
      <div className="space-y-3">
        {items.map((o) => (
          <div
            key={o.id}
            className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-200 bg-gradient-to-r hover:from-blue-50/50 hover:border-blue-300 group"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <ListChecks className="text-white" size={20} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{o.title}</h3>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-3 ml-13">{o.description}</p>
            <div className="flex items-center gap-4 text-xs text-gray-500 ml-13">
              <span className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 rounded-lg">
                <Calendar size={14} />
                Due: {formatDate(o.dueDate)}
              </span>
              <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-lg font-medium">
                {o.frequency}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Clauses({ items }: { items: any[] }) {
  return (
    <div>
      <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
        <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
        Clauses ({items.length})
      </h2>
      <div className="space-y-3">
        {items.map((c) => (
          <div
            key={c.id}
            className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-200 bg-gradient-to-r hover:from-amber-50/50 hover:border-amber-300"
          >
            <div className="flex items-center gap-2 mb-3">
              <Scale className="text-amber-600" size={18} />
              <h3 className="font-semibold text-gray-800">{c.clauseType}</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed pl-7">
              {c.clauseText}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Pricing({ items }: { items: any[] }) {
  return (
    <div>
      <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
        <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
        Pricing Terms ({items.length})
      </h2>
      <div className="grid grid-cols-1 gap-4">
        {items.map((p) => (
          <div
            key={p.termId}
            className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-200 bg-gradient-to-r hover:from-green-50/50 hover:border-green-300 group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <DollarSign
                  className="text-white"
                  size={20}
                  strokeWidth={2.5}
                />
              </div>
              <h3 className="font-semibold text-gray-800">{p.termType}</h3>
            </div>
            <p className="text-sm text-gray-600 pl-13">{p.termText}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Provenance({ data }: { data: any }) {
  return (
    <div>
      <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
        <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
        Provenance Information
      </h2>
      <div className="grid grid-cols-2 gap-6">
        <InfoCard
          label="Created By"
          value={data.createdBy}
          icon={ShieldCheck}
        />
        <InfoCard
          label="Created On"
          value={formatDate(data.createdOn)}
          icon={Clock}
        />
        <InfoCard
          label="Modified By"
          value={data.modifiedBy}
          icon={ShieldCheck}
        />
        <InfoCard
          label="Modified On"
          value={formatDate(data.modifiedOn)}
          icon={Clock}
        />
      </div>
    </div>
  );
}

function InfoCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: any;
}) {
  return (
    <div className="group border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-white to-gray-50/50 hover:border-blue-300">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center group-hover:from-blue-100 group-hover:to-blue-200 transition-colors">
          <Icon
            className="text-gray-600 group-hover:text-blue-600 transition-colors"
            size={20}
          />
        </div>
        <div className="text-xs font-bold uppercase tracking-wider text-gray-500">
          {label}
        </div>
      </div>
      <div className="font-semibold text-gray-800 text-base pl-13">
        {value || "-"}
      </div>
    </div>
  );
}

// function Info({ label, value }: { label: string; value: string }) {
//   return (
//     <div>
//       <div className="text-xs uppercase tracking-wide text-gray-400 mb-1">
//         {label}
//       </div>
//       <div className="font-medium">{value || "-"}</div>
//     </div>
//   );
// }

function formatDate(date?: string) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString();
}
