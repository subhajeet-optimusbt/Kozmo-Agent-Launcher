interface Step1AccountProps {
  form: {
    tenantName: string;
    ownerName: string;
    ownerEmail: string;
    password: string;
    region: string;
  };
  update: (field: string, value: string) => void;
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
}

export default function Step1Account({ form, update }: Step1AccountProps) {
  return (
    <div className="bg-white rounded-2xl border shadow-sm p-6">
      <h3 className="text-xl font-semibold text-gray-900">
        Account & Owner
      </h3>

      <p className="text-sm text-gray-500 mt-1 mb-6">
        Name your Kozmo account and define the first platform owner.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Field
          label="Account (Tenant) Name"
          required
          value={form.tenantName}
          placeholder="Your company name"
          onChange={(v) => update("tenantName", v)}
        />

        <Field
          label="Primary Owner Name"
          required
          value={form.ownerName}
          placeholder="Full name"
          onChange={(v) => update("ownerName", v)}
        />

        <Field
          label="Primary Owner Email"
          required
          type="email"
          value={form.ownerEmail}
          placeholder="owner@company.com"
          onChange={(v) => update("ownerEmail", v)}
        />

        <Field
          label="Password"
          required
          type="password"
          value={form.password}
          placeholder="Minimum 8 characters"
          helper="Use at least one number and one symbol"
          onChange={(v) => update("password", v)}
        />

        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Region / Country <span className="text-red-500">*</span>
          </label>

          <select
            value={form.region}
            onChange={(e) => update("region", e.target.value)}
            className="w-full h-11 px-3 rounded-lg border border-gray-300 bg-white
                       focus:outline-none focus:ring-2 focus:ring-indigo-500
                       focus:border-indigo-500 transition"
          >
            <option value="">Select region</option>
            <option>United States</option>
            <option>Europe</option>
            <option>India</option>
            <option>Australia</option>
            <option>Other</option>
          </select>
        </div>
      </div>
    </div>
  );
}
function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  helper,
  required,
}: FieldProps & { helper?: string; required?: boolean }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full h-11 px-3 rounded-lg
          border border-gray-300
          text-gray-900 placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-indigo-500
          focus:border-indigo-500
          transition
        "
      />

      {helper && (
        <p className="text-xs text-gray-500">{helper}</p>
      )}
    </div>
  );
}
