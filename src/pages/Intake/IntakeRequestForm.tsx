/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Edit3,
  Search,
  Sparkles,
  UploadCloud,
} from "lucide-react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import toast from "react-hot-toast";
import { baseUrl } from "../../utils/baseUrl";

/* ===================== INTENTS ===================== */

const intents = [
  {
    key: "new",
    title: "New Contract Request",
    description: "Create or review a new agreement (NDA, MSA, SOW)",
    icon: FileText,
  },
  {
    key: "amendment",
    title: "Amendment / Change",
    description: "Modify an existing contract (pricing, scope, term, dates)",
    icon: Edit3,
  },
  {
    key: "analysis",
    title: "Document Analysis",
    description: "Summarize, clause extraction, risk & deviation signals",
    icon: Search,
  },
  {
    key: "general",
    title: "General Request",
    description: "Open-ended ask – Intake will classify and route",
    icon: Sparkles,
  },
];

const intentMeta: Record<string, any> = {
  new: {
    Intent: "NewContract",
    IntentLabel: "New Contract Request",
    Title: "New Contract Request",
  },
  amendment: {
    Intent: "Amendment",
    IntentLabel: "Amendment / Change",
    Title: "Amendment / Change",
  },
  analysis: {
    Intent: "DocumentAnalysis",
    IntentLabel: "Document Analysis",
    Title: "Document Analysis",
  },
  general: {
    Intent: "General",
    IntentLabel: "General Request",
    Title: "General Request",
  },
};

/* ===================== PAGE ===================== */

const CreateNewIntakeRequest = () => {
  const navigate = useNavigate();

  /* ---------- GLOBAL STATE ---------- */
  const [intent, setIntent] = useState("new");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  /* ---------- COMMON FIELDS ---------- */
  const [title, setTitle] = useState(intentMeta.new.Title);
  const [description, setDescription] = useState("");
  const [businessArea, setBusinessArea] = useState("General");

  /* ---------- NEW CONTRACT ---------- */
  const [counterparty, setCounterparty] = useState("");
  const [contractType, setContractType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [value, setValue] = useState("");

  /* ---------- AMENDMENT ---------- */
  const [existingContract, setExistingContract] = useState("");
  const [changeType, setChangeType] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");

  /* ===================== HANDLERS ===================== */

  const handleIntentChange = (key: string) => {
    setIntent(key);
    setTitle(intentMeta[key].Title);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setFiles(Array.from(e.target.files));
  };

  const buildPayload = () => {
    const user = JSON.parse(
      localStorage.getItem("user") || sessionStorage.getItem("user") || "{}",
    );

    const basePayload: any = {
      Title: title,
      Description: description,
      Intent: intentMeta[intent].Intent,
      IntentLabel: intentMeta[intent].IntentLabel,
      BusinessArea: businessArea,
      Source: "Upload",
      partitionKey: "11111",
      UserName: user?.userName || "",
      Subject: title,
      Message: description,
    };

    if (intent === "new") {
      basePayload.counterparty = counterparty;
      basePayload.contractType = contractType || undefined;
      basePayload.startDate = startDate;
      basePayload.value = value || undefined;
    }

    if (intent === "amendment") {
      basePayload.existingContract = existingContract;
      basePayload.changeType = changeType;
      basePayload.effectiveDate = effectiveDate;
    }

    return basePayload;
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const user = JSON.parse(
        localStorage.getItem("user") || sessionStorage.getItem("user") || "{}",
      );
      const accountId = user?.activeAccountId;

      const formData = new FormData();
      const payload = buildPayload();

      Object.keys(payload).forEach((key) => {
        if (payload[key] !== undefined && payload[key] !== "") {
          formData.append(key, payload[key]);
        }
      });

      files.forEach((file) => formData.append("Files", file));

      const res = await fetch(baseUrl() + `/api/Intake/${accountId}/Request`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to create intake request");

      toast.success("Intake request created successfully");
      navigate(-1);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ===================== UI ===================== */

  return (
    <div className="relative overflow-hidden bg-white rounded-2xl border border-gray-200 shadow-sm">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500" />

      {/* Header */}
      <div className="mx-8 my-4 flex items-center">
        {/* Left: Title */}
        <div>
    <h3 className="text-2xl font-black tracking-tight text-gray-900">
      Create Intake Request
    </h3>
  </div>

  {/* Right: Back button */}
  <div className="ml-auto">
    <button
      type="button"
      onClick={() => navigate("/intake")}
      className="
        flex items-center gap-2
        px-4 py-2 rounded-xl
        text-sm font-semibold
        text-emerald-700
        bg-emerald-50
        border border-emerald-200
        transition-all duration-200
        hover:bg-emerald-100 hover:border-emerald-300
        hover:-translate-y-[1px]
        active:translate-y-0
      "
    >
      <ArrowLeftOutlined />
      Back
    </button>
  </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 px-6 py-2 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT */}
        <div className="space-y-6">
          <Card title="1. Choose Intent">
            <div className="grid grid-cols-2 gap-3">
              {intents.map((i) => {
                const Icon = i.icon;
                const active = intent === i.key;
                return (
                  <button
                    key={i.key}
                    onClick={() => handleIntentChange(i.key)}
                    className={`p-4 rounded-xl border text-left transition ${
                      active
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="h-4 w-4 text-emerald-600 mb-2" />
                    <div className="text-xs font-bold">{i.title}</div>
                    <div className="text-[11px] text-gray-500">
                      {i.description}
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card title="3. Attach Artifacts">
            <div className="space-y-4">
              {/* Upload Box */}
              <label className="block border border-dashed border-gray-300 rounded-xl p-6 text-center bg-gray-50 hover:border-emerald-400 hover:bg-emerald-50/40 transition cursor-pointer">
                <UploadCloud className="mx-auto h-6 w-6 text-gray-400 mb-2" />

                <p className="text-xs font-semibold text-gray-700">
                  Drop files here or click to upload
                </p>

                <p className="text-[11px] text-gray-400 mt-1">
                  PDF, DOCX, images, or email exports
                </p>

                <input
                  type="file"
                  multiple
                  hidden
                  onChange={handleFileChange}
                />
              </label>

              {/* Link Input */}
              <Input
                label="Or paste a link (optional)"
                placeholder="https://… (SharePoint / Drive / DocuSign)"
              />

              {/* Add Link Button */}
              <button
                type="button"
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
              >
                + Add another link
              </button>
            </div>
          </Card>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          <Card title="2. Request Details">
            <Input
              label="Request title *"
              value={title}
              onChange={(e: any) => setTitle(e.target.value)}
            />
            <Textarea
              label="What do you want Kozmo to do? *"
              value={description}
              onChange={(e: any) => setDescription(e.target.value)}
            />
            <Select
              label="Business area *"
              value={businessArea}
              onChange={(e: any) => setBusinessArea(e.target.value)}
              options={["General", "Sales", "Legal"]}
            />
          </Card>

          <Card title="4. Intent Context">
            {intent === "new" && (
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Counterparty"
                  value={counterparty}
                  onChange={(e: any) => setCounterparty(e.target.value)}
                />
                <Select
                  label="Contract type"
                  value={contractType}
                  onChange={(e: any) => setContractType(e.target.value)}
                  options={[
                    "Sales Agreement",
                    "Dealer Agreement",
                    "Ownership Transfer Agreement",
                  ]}
                />
                <Input
                  type="date"
                  label="Expected start date"
                  value={startDate}
                  onChange={(e: any) => setStartDate(e.target.value)}
                />
                <Input
                  label="Estimated value"
                  value={value}
                  onChange={(e: any) => setValue(e.target.value)}
                />
              </div>
            )}

            {intent === "amendment" && (
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Existing contract"
                  value={existingContract}
                  onChange={(e: any) => setExistingContract(e.target.value)}
                />
                <Select
                  label="Change type"
                  value={changeType}
                  onChange={(e: any) => setChangeType(e.target.value)}
                  options={[
                    "Pricing / Fees",
                    "Dates / Term",
                    "Scope",
                    "Legal Terms",
                    "Other",
                  ]}
                />
                <Input
                  type="date"
                  label="Effective date"
                  value={effectiveDate}
                  onChange={(e: any) => setEffectiveDate(e.target.value)}
                />
              </div>
            )}

            {intent === "analysis" && (
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Analysis type"
                  options={[
                    "Executive Summary",
                    "Risk & Red Flags",
                    "Clause Extraction",
                    "Deviation vs Template",
                    "Pricing / Payment Terms",
                  ]}
                />
                <Select
                  label="Output format"
                  options={["Brief", "Table", "Both"]}
                />
              </div>
            )}

            {intent === "general" && (
              <Select
                label="Hint (optional)"
                options={[
                  "Let Kozmo decide",
                  "Feels like a contract review",
                  "Feels like a renewal",
                  "Feels like an analysis",
                  "Feels like an issue",
                ]}
              />
            )}
          </Card>
        </div>
      </div>

      {/* FOOTER */}
      <div className="bg-white border-t px-6 py-3 flex justify-end gap-3">
        <button
          onClick={() => navigate("/intake")}
          className="
    inline-flex items-center gap-2
    text-sm font-semibold
    text-gray-600
    px-4 py-2
    rounded-lg
    transition-all duration-200
    hover:text-emerald-600
    hover:bg-emerald-50
    hover:shadow-sm
    active:scale-95
  "
        >
          ← Back
        </button>

        <button
          disabled={loading}
          onClick={handleSubmit}
          className="px-6 py-2 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-emerald-600"
        >
          {loading ? "Creating..." : "Create Request"}
        </button>
      </div>
    </div>
  );
};

export default CreateNewIntakeRequest;

/* ===================== REUSABLE ===================== */

const Card = ({ title, children }: any) => (
  <div className="bg-white rounded-2xl border p-5 shadow-sm space-y-4">
    <h2 className="text-xs font-black uppercase">{title}</h2>
    {children}
  </div>
);

const Input = ({ label, ...props }: any) => (
  <div>
    <label className="text-xs font-semibold text-gray-600">{label}</label>
    <input {...props} className="mt-1 w-full h-9 px-3 rounded-lg border" />
  </div>
);

const Textarea = ({ label, ...props }: any) => (
  <div>
    <label className="text-xs font-semibold text-gray-600">{label}</label>
    <textarea
      {...props}
      rows={3}
      className="mt-1 w-full px-3 py-2 rounded-lg border"
    />
  </div>
);

const Select = ({ label, options, ...props }: any) => (
  <div>
    <label className="text-xs font-semibold text-gray-600">{label}</label>
    <select {...props} className="mt-1 w-full h-9 px-3 rounded-lg border">
      <option value="">Select...</option>
      {options.map((o: string) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  </div>
);
