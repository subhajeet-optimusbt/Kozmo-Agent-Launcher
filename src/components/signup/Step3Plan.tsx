/* eslint-disable @typescript-eslint/no-explicit-any */
const plans = [
  { id: "team", label: "Team" },
  { id: "business", label: "Business" },
  { id: "business_advanced", label: "Business · Advanced" },
];

const areaTypes = [
  { id: "sell", label: "Sell-side" },
  { id: "buy", label: "Buy-side" },
  { id: "legal", label: "Legal" },
];

const agents = [
  { id: "intake", label: "Intake Agent" },
  { id: "document", label: "Document Agent" },
  { id: "contract", label: "Contract Agent" },
  { id: "renewal", label: "Renewal Agent" },
  { id: "commercial", label: "Commercial / Opportunities" },
];

export default function Step3Plan({ form, update }: any) {
  const toggleAgent = (id: string) => {
    update(
      "agents",
      form.agents.includes(id)
        ? form.agents.filter((a: string) => a !== id)
        : [...form.agents, id]
    );
  };

  return (
    <div className="bg-white rounded-2xl border shadow-sm p-6">
      <h3 className="text-xl font-semibold text-gray-900">
        Plan & Agents
      </h3>

      <p className="text-sm text-gray-500 mt-1 mb-6">
        Choose a starting plan and which agents to enable on Day 1.
      </p>

      <div className="space-y-7">
        {/* Plan */}
        <Pills
          label="Plan"
          required
          items={plans}
          value={form.plan}
          onChange={(v: string) => update("plan", v)}
        />

        {/* Business area name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">
            First Business Area Name <span className="text-red-500">*</span>
          </label>

          <input
            value={form.businessAreaName}
            onChange={(e) => update("businessAreaName", e.target.value)}
            placeholder="Sales Renewals"
            className="
              w-full h-11 px-3 rounded-lg
              border border-gray-300
              focus:outline-none focus:ring-2 focus:ring-indigo-500
              focus:border-indigo-500
              transition
            "
          />
        </div>

        {/* Area type */}
        <Pills
          label="Business Area Type"
          required
          items={areaTypes}
          value={form.businessAreaType}
          onChange={(v: string) => update("businessAreaType", v)}
        />

        {/* Agents */}
        <Pills
          label="Agents to enable"
          helper="You can change these anytime later"
          items={agents}
          value={form.agents}
          multi
          onChange={toggleAgent}
        />
      </div>
    </div>
  );
}
function Pills({
  label,
  items,
  value,
  onChange,
  multi,
  required,
  helper,
}: any) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>

      {helper && (
        <p className="text-xs text-gray-500">{helper}</p>
      )}

      <div className="flex flex-wrap gap-3">
        {items.map((i: any) => {
          const selected = multi ? value.includes(i.id) : value === i.id;

          return (
            <button
              key={i.id}
              type="button"
              onClick={() => onChange(i.id)}
              className={`
                px-4 py-2 rounded-full border text-sm font-medium
                transition focus:outline-none focus:ring-2 focus:ring-indigo-500
                ${
                  selected
                    ? "bg-indigo-50 border-indigo-400 text-indigo-700"
                    : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                }
              `}
            >
              {selected && multi && <span className="mr-1">✓</span>}
              {i.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
