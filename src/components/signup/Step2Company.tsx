/* eslint-disable @typescript-eslint/no-explicit-any */
const useCaseOptions = [
  { id: "sell", label: "Sell-side · Renewals & Upsell" },
  { id: "buy", label: "Buy-side · SaaS / Vendors" },
  { id: "legal", label: "Legal · Contracts & Redlines" },
];

export default function Step2Company({ form, update }: any) {
  return (
    <div className="bg-white rounded-2xl border shadow-sm p-6">
      <h3 className="text-xl font-semibold text-gray-900">
        Company & Use-case
      </h3>

      <p className="text-sm text-gray-500 mt-1 mb-6">
        Help Kozmo understand where to start — renewals, vendors, or contracts.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-5">
          <Select
            label="Company Size"
            required
            value={form.companySize}
            onChange={(v: string) => update("companySize", v)}
            options={["1-10", "11-50", "51-200", "201-1000", "1000+"]}
          />

          <Select
            label="Your Role"
            required
            value={form.role}
            onChange={(v: string) => update("role", v)}
            options={["Sales", "Legal", "Procurement", "IT / Admin", "Executive"]}
          />
        </div>

        {/* Right column */}
        <div className="space-y-5">
          <Select
            label="Industry"
            required
            value={form.industry}
            onChange={(v: string) => update("industry", v)}
            options={[
              "SaaS",
              "Consulting",
              "Manufacturing",
              "Finance",
              "Healthcare",
            ]}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary Use-case <span className="text-red-500">*</span>
            </label>

            <div className="space-y-3">
              {useCaseOptions.map((o) => {
                const selected = form.useCase === o.id;

                return (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => update("useCase", o.id)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-xl border
                      text-sm text-left transition
                      ${
                        selected
                          ? "bg-indigo-50 border-indigo-400 ring-2 ring-indigo-100"
                          : "bg-white border-gray-200 hover:bg-gray-50"
                      }
                    `}
                  >
                    <span
                      className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                        selected
                          ? "border-indigo-600"
                          : "border-gray-400"
                      }`}
                    >
                      {selected && (
                        <span className="h-2 w-2 rounded-full bg-indigo-600" />
                      )}
                    </span>

                    <span className="text-gray-800 font-medium">
                      {o.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
function Select({ label, value, onChange, options, required }: any) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full h-11 px-3 rounded-lg
          border border-gray-300 bg-white
          text-gray-900
          focus:outline-none focus:ring-2 focus:ring-indigo-500
          focus:border-indigo-500
          transition
        "
      >
        <option value="">Select</option>
        {options.map((o: string) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
