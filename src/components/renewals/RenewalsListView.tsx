import { Badge, Tag } from "antd";
import { FileText } from "lucide-react";
import { type Renewal } from "../../constants/apps";

export default function ContractListView({
  data,
  onSelect,
}: {
  data: Renewal[];
  onSelect: (c: Renewal) => void;
}) {
  return (
    <div className="space-y-3">
      {data.map((c) => (
        <div
          key={c.key}
          onClick={() => onSelect(c)}
          className="
            group
            grid grid-cols-[48px_1fr_160px]
            items-center
            gap-4
            rounded-2xl
            border border-gray-100
            bg-white
            px-4 py-3
            cursor-pointer
            transition-all
            hover:border-emerald-200
            hover:bg-gradient-to-r
            hover:from-emerald-50/60
            hover:to-transparent
          "
        >
          {/* Icon */}
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <FileText size={16} />
          </div>

          {/* Main content */}
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 truncate group-hover:text-emerald-700 transition">
              {c.title}
            </h3>

            <p className="text-sm text-gray-500 truncate">
              {c.company}
            </p>

            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
              <Tag className="rounded-full px-3" color="blue">
                {c.owner}
              </Tag>

              <span className="text-gray-400">•</span>
              <span className="text-gray-600">{c.businessArea}</span>

              <span className="text-gray-400">•</span>
              <span className="text-gray-500 truncate">
                {c.counterparty}
              </span>
            </div>
          </div>

          {/* Meta */}
          <div className="flex flex-col items-end gap-2 text-xs">
            <Badge
              color={c.renewalStatus === "Active" ? "green" : "default"}
              text={c.renewalStatus}
            />
            <span className="text-gray-400">
              Updated {c.nextRenewaldate}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
