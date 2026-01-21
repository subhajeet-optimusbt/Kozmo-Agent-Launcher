/* eslint-disable @typescript-eslint/no-explicit-any */
export default function Step4Review({ form }: any) {
  const workspaceUrl = form.tenantName
    ? `${form.tenantName.toLowerCase().replace(/\s+/g, "-")}.kozmo.app`
    : "your-workspace.kozmo.app";

  return (
    <div className="bg-white rounded-2xl border shadow-sm p-6">
      <h3 className="text-xl font-semibold text-gray-900">
        Review & Create
      </h3>

      <p className="text-sm text-gray-500 mt-1 mb-6">
        Confirm the key details below before creating your Kozmo workspace.
      </p>

      {/* Summary card */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-4">
        <Section title="Workspace">
          <Row label="Tenant Name" value={form.tenantName} />
          <Row
            label="Workspace URL"
            value={
              <span className="font-mono text-indigo-600">
                {workspaceUrl}
              </span>
            }
          />
          <Row label="Region" value={form.region} />
        </Section>

        <Divider />

        <Section title="Owner & Company">
          <Row label="Owner Email" value={form.ownerEmail} />
          <Row
            label="Company"
            value={`${form.companySize || "—"} · ${form.industry || "—"}`}
          />
          <Row label="Role" value={form.role} />
        </Section>

        <Divider />

        <Section title="Plan & Setup">
          <Row label="Business Area" value={form.businessAreaName} />
          <Row label="Plan" value={formatPlan(form.plan)} />
          <Row
            label="Agents Enabled"
            value={
              form.agents?.length
                ? form.agents.join(", ")
                : "No agents selected"
            }
          />
        </Section>
      </div>

      <p className="text-xs text-gray-400 mt-5 leading-relaxed">
        By creating this workspace, you confirm that you are authorized to
        configure Kozmo for your organization. You can change plans, regions,
        and agents at any time after setup.
      </p>
    </div>
  );
}
function Section({ title, children }: any) {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold text-gray-800">
        {title}
      </h4>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-gray-200" />;
}

function Row({ label, value }: any) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-900 text-right">
        {value || "—"}
      </span>
    </div>
  );
}

function formatPlan(plan: string) {
  if (!plan) return "—";
  return plan
    .replace("_", " · ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
