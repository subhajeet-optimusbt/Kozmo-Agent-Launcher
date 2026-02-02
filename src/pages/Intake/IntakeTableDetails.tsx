import { useEffect, useState } from "react";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams, useNavigate } from "react-router-dom";
import { Button, Tag } from "antd";
import {
  FileText,
  ListChecks,
  Flag,
  Folder,
  DollarSign,
  ArrowLeft,
} from "lucide-react";
import { getActiveAccountId, ACCOUNT_CHANGED_EVENT } from "../../utils/auth";
import FullscreenLoader from "../../components/ui/FullScreenLoader";
/* ---------------------------------- */
/* Constants */
/* ---------------------------------- */


const SECTIONS = [
  { key: "overview", label: "Overview", icon: FileText },
  { key: "obligations", label: "Obligations", icon: ListChecks },
  { key: "milestones", label: "Milestones", icon: Flag },
  { key: "documents", label: "Documents", icon: Folder },
  { key: "pricing", label: "Pricing Terms", icon: DollarSign },
];

/* ---------------------------------- */
/* Page */
/* ---------------------------------- */

export default function ContractDetailsPage() {
  const [ACTIVE_TENANT_ID, setACTIVE_TENANT_ID] = useState(getActiveAccountId());

useEffect(() => {
  const handler = () => {
    setACTIVE_TENANT_ID(getActiveAccountId());
  };

  window.addEventListener(ACCOUNT_CHANGED_EVENT, handler);
  return () =>
    window.removeEventListener(ACCOUNT_CHANGED_EVENT, handler);
}, []);

  const { id } = useParams(); // K001
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
          `https://kozmo-saas.azurewebsites.net/api/Contract/${ACTIVE_TENANT_ID}/profile/${id}`
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
  }, [id]);

  if (loading) {
    return (
      <FullscreenLoader />
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">{error}</p>
        <Button onClick={() => navigate(-1)} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  const { contractEntity } = data;

  return (
    <div className="relative bg-white rounded-2xl border shadow-sm">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500" />

      <div className="px-6 py-6 flex gap-6">
        {/* LEFT NAV */}
        <aside className="w-64 shrink-0">
          <div className="rounded-2xl border p-4 space-y-2">
            <h3 className="text-sm font-semibold mb-3">
              Document Navigation
            </h3>

            {SECTIONS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActive(key)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition
                  ${
                    active === key
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "hover:bg-gray-50 text-gray-700"
                  }`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>
        </aside>

        {/* MAIN */}
        <main className="flex-1 space-y-6">
          {/* HEADER */}
          <div className="rounded-2xl border px-6 py-5 flex justify-between">
            <div>
              <h1 className="text-xl font-semibold">
                {contractEntity.ContractTitle}
              </h1>
              <p className="text-sm text-gray-500">
                {contractEntity.CompanyName}
              </p>
              <div className="mt-2 flex gap-2">
                <Tag color="green">{contractEntity.Status}</Tag>
                <Tag>{contractEntity.ContractType}</Tag>
              </div>
            </div>

            <Button icon={<ArrowLeft size={16} />} onClick={() => navigate(-1)}>
              Back
            </Button>
          </div>

          {/* CONTENT */}
          <div className="rounded-2xl border p-6">
            {active === "overview" && <Overview data={data} />}
            {active === "obligations" && (
              <Obligations items={data.contractObligations} />
            )}
            {active === "milestones" && (
              <Milestones items={data.contractMilestones} />
            )}
            {active === "documents" && (
              <Documents items={data.documents} />
            )}
            {active === "pricing" && (
              <Pricing items={data.contractPricingTerms} />
            )}
          </div>
        </main>
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
    <div className="grid grid-cols-2 gap-6 text-sm">
      <Info label="Counterparty" value={c.Counterparty} />
      <Info label="Business Area" value={c.BusinessArea} />
      <Info label="Contract Type" value={c.ContractType} />
      <Info label="Status" value={c.Status} />
      <Info label="Finalized On" value={formatDate(c.FinalizedDate)} />
      <Info label="Created On" value={formatDate(c.Created)} />
    </div>
  );
}

function Obligations({ items }: { items: any[] }) {
  return (
    <div className="space-y-4">
      {items.map((o) => (
        <div key={o.id} className="border rounded-xl p-4">
          <h3 className="font-semibold">{o.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{o.description}</p>
          <p className="text-xs text-gray-400 mt-2">
            Due: {formatDate(o.dueDate)} · {o.frequency}
          </p>
        </div>
      ))}
    </div>
  );
}

function Milestones({ items }: { items: any[] }) {
  return (
    <div className="space-y-4">
      {items.map((m) => (
        <div key={m.id} className="border rounded-xl p-4">
          <h3 className="font-semibold">{m.title}</h3>
          <p className="text-sm text-gray-600">{m.description}</p>
          <p className="text-xs text-gray-400 mt-1">
            {formatDate(m.date)}
          </p>
        </div>
      ))}
    </div>
  );
}

function Documents({ items }: { items: any[] }) {
  return (
    <div className="space-y-4">
      {items.map((d) => (
        <div
          key={d.RowKey}
          className="flex justify-between items-center border rounded-xl p-4"
        >
          <div>
            <h3 className="font-medium">{d.FileName}</h3>
            <p className="text-xs text-gray-400">
              {d.DocumentType} · {d.Status}
            </p>
          </div>

          <Button type="link" href={d.FileUrl} target="_blank">
            View
          </Button>
        </div>
      ))}
    </div>
  );
}

function Pricing({ items }: { items: any[] }) {
  return (
    <div className="space-y-4">
      {items.map((p) => (
        <div key={p.termId} className="border rounded-xl p-4">
          <h3 className="font-semibold">{p.termType}</h3>
          <p className="text-sm text-gray-600 mt-1">{p.termText}</p>
        </div>
      ))}
    </div>
  );
}

/* ---------------------------------- */
/* Helpers */
/* ---------------------------------- */

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-gray-400 mb-1">
        {label}
      </div>
      <div className="font-medium">{value || "-"}</div>
    </div>
  );
}

function formatDate(date?: string) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString();
}
