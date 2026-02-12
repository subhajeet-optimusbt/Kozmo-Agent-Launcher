import { Drawer, Button, Tag, Divider } from "antd";
import { Eye, ArrowRight } from "lucide-react";
import type { Intake } from "../../constants/apps";
import { useNavigate } from "react-router-dom";

type Props = {
  intake: Intake | null;
  onClose: () => void;
};

export default function IntakePreviewDrawer({ intake, onClose }: Props) {
  const navigate = useNavigate();
  return (
    <Drawer
      open={!!intake}
      width={460}
      placement="right"
      onClose={onClose}
      closable={false}
      bodyStyle={{ padding: 0 }}
    >
      {intake && (
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="px-6 py-5 border-b bg-white">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {intake.subject}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Contract overview & key metadata
                </p>
              </div>

              <Tag
                color="green"
                className="rounded-full px-3 py-1 text-xs font-medium"
              >
                {intake.Status}
              </Tag>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 bg-gray-50">
            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-5 text-sm">
              <Info label="Current Job Name" value={intake.currentJobName} />
              <Info label="Source" value={intake.source} />
              <Info label="Created" value={intake.created} />
              <Info label="Updated" value={intake.updated} />
            </div>

            <Divider className="my-4" />

            {/* Hint Section */}
            <div className="rounded-xl border bg-white p-4">
              <p className="text-sm text-gray-600 leading-relaxed">
                View obligations, clauses, milestones, documents, and pricing
                terms inside the full contract workspace.
              </p>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="px-6 py-4 border-t bg-white">
            <Button
              type="primary"
              size="large"
              icon={<Eye size={16} />}
              className="w-full flex items-center justify-center gap-2"
              onClick={() => {
                navigate(`/intake/${intake.RequestId}`, {
                  state: { overview: intake },
                });
                onClose();
              }}
            >
              View Full Intake
              <ArrowRight size={14} />
            </Button>
          </div>
        </div>
      )}
    </Drawer>
  );
}

/* ---------------------------------- */
/* Reusable Info Item */
/* ---------------------------------- */

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-gray-400 mb-1">
        {label}
      </div>
      <div className="text-sm font-medium text-gray-900">{value}</div>
    </div>
  );
}
