interface Form {
  tenantName?: string;
  ownerEmail?: string;
  region?: string;
}

interface LivePreviewProps {
  form: Form;
}

export default function LivePreview({ form }: LivePreviewProps) {
  const workspaceUrl = form.tenantName
    ? `${form.tenantName.toLowerCase().replace(/\s+/g, "-")}.kozmo.app`
    : "your-workspace.kozmo.app";

  return (
    <div className="relative bg-white/70 backdrop-blur border border-gray-200 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-gray-900">
          Live Preview
        </h4>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-medium">
          Real-time
        </span>
      </div>

      <p className="text-xs text-gray-500 mb-4">
        Updates instantly as you configure your workspace.
      </p>

      <div className="space-y-2 text-sm">
        <Row label="Tenant" value={form.tenantName} />

        <Row
          label="Workspace URL"
          value={
            <span className="font-mono text-indigo-600 break-all">
              {workspaceUrl}
            </span>
          }
        />

        <Row label="Owner" value={form.ownerEmail} />
        <Row label="Region" value={form.region} />
      </div>
    </div>
  );
}

interface RowProps {
  label: string;
  value?: React.ReactNode;
}

function Row({ label, value }: RowProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-gray-500 text-xs">{label}</span>
      <span className="font-medium text-gray-900 text-right">
        {value || <span className="text-gray-300">—</span>}
      </span>
    </div>
  );
}
