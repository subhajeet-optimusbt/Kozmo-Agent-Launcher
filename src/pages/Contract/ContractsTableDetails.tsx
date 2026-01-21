import { useParams, useNavigate } from "react-router-dom";
import { Button } from "antd";
import {
  FileText,
  ListChecks,
  Flag,
  Folder,
  DollarSign,
  ArrowLeft,
} from "lucide-react";
import { CONTRACTS } from "../../constants/apps";
import { useState } from "react";

const SECTIONS = [
  { key: "overview", label: "Overview", icon: FileText },
  { key: "obligations", label: "Obligations", icon: ListChecks },
  { key: "milestones", label: "Milestones", icon: Flag },
  { key: "documents", label: "Documents", icon: Folder },
  { key: "pricing", label: "Pricing Terms", icon: DollarSign },
];

export default function ContractDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [active, setActive] = useState("overview");

  const contract = CONTRACTS.find((c) => String(c.key) === id);
  if (!contract) return null;

  return (
    <div className="relative bg-white rounded-2xl border border-gray-200 shadow-sm">
      {/* Subtle top gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500" />
      <div className="px-6 py-6 flex gap-6">
        {/* LEFT NAV */}
        <aside className="w-64 shrink-0">
          <div className="rounded-2xl border bg-white p-4 space-y-2">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
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

        {/* MAIN CONTENT */}
        <main className="flex-1 space-y-6">
          {/* Header */}
          <div className="rounded-2xl border bg-white px-6 py-5 flex justify-between items-center">
            <div>
              <h1 className="text-xl font-semibold">{contract.title}</h1>
              <p className="text-sm text-gray-500 mt-1">Contract Information</p>
            </div>

            <Button icon={<ArrowLeft size={16} />} onClick={() => navigate(-1)}>
              Back
            </Button>
          </div>

          {/* Section Content */}
          <div className="rounded-2xl border bg-white p-6">
            {/* {active === "overview" && <Overview contract={contract} />} */}
            {active === "obligations" && <Obligations />}
            {active === "milestones" && <Milestones />}
            {active === "documents" && <Documents />}
            {active === "pricing" && <Pricing />}
          </div>
        </main>
      </div>
    </div>
  );
}

function Obligations() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold">Annual Subscription Payment</h3>
        <p className="text-sm text-gray-600 mt-1">
          Pay annual fees as per pricing exhibit.
        </p>
        <p className="text-xs text-gray-400 mt-2">
          Due: 31 Dec 2025 · Frequency: Annual
        </p>
      </div>

      <div className="border-t pt-4">
        <h3 className="font-semibold">Quarterly Performance Report</h3>
        <p className="text-sm text-gray-600 mt-1">
          Vendor to provide quarterly performance metrics.
        </p>
        <p className="text-xs text-gray-400 mt-2">
          Due: 30 Jun 2025 · Frequency: Quarterly
        </p>
      </div>
    </div>
  );
}

function Milestones() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold">Annual Subscription Payment</h3>
        <p className="text-sm text-gray-600 mt-1">
          Pay annual fees as per pricing exhibit.
        </p>
        <p className="text-xs text-gray-400 mt-2">
          Due: 31 Dec 2025 · Frequency: Annual
        </p>
      </div>

      <div className="border-t pt-4">
        <h3 className="font-semibold">Quarterly Performance Report</h3>
        <p className="text-sm text-gray-600 mt-1">
          Vendor to provide quarterly performance metrics.
        </p>
        <p className="text-xs text-gray-400 mt-2">
          Due: 30 Jun 2025 · Frequency: Quarterly
        </p>
      </div>
    </div>
  );
}

function Documents() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold">Annual Subscription Payment</h3>
        <p className="text-sm text-gray-600 mt-1">
          Pay annual fees as per pricing exhibit.
        </p>
        <p className="text-xs text-gray-400 mt-2">
          Due: 31 Dec 2025 · Frequency: Annual
        </p>
      </div>

      <div className="border-t pt-4">
        <h3 className="font-semibold">Quarterly Performance Report</h3>
        <p className="text-sm text-gray-600 mt-1">
          Vendor to provide quarterly performance metrics.
        </p>
        <p className="text-xs text-gray-400 mt-2">
          Due: 30 Jun 2025 · Frequency: Quarterly
        </p>
      </div>
    </div>
  );
}

function Pricing() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold">Annual Subscription Payment</h3>
        <p className="text-sm text-gray-600 mt-1">
          Pay annual fees as per pricing exhibit.
        </p>
        <p className="text-xs text-gray-400 mt-2">
          Due: 31 Dec 2025 · Frequency: Annual
        </p>
      </div>

      <div className="border-t pt-4">
        <h3 className="font-semibold">Quarterly Performance Report</h3>
        <p className="text-sm text-gray-600 mt-1">
          Vendor to provide quarterly performance metrics.
        </p>
        <p className="text-xs text-gray-400 mt-2">
          Due: 30 Jun 2025 · Frequency: Quarterly
        </p>
      </div>
    </div>
  );
}
