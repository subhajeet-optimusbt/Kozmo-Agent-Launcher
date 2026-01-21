import { Badge, Tag } from "antd";
import { FileText } from "lucide-react";
import { type Contract } from "../../constants/apps";

export default function ContractCardView({
  data,
  onSelect,
}: {
  data: Contract[];
  onSelect: (c: Contract) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
      {data.map((c) => (
        <div
          key={c.key}
          onClick={() => onSelect(c)}
          className="
            group
            relative
            rounded-2xl
            border border-gray-200/80
            bg-gradient-to-br from-white via-gray-50 to-white
            p-5
            cursor-pointer
            transition-all
            shadow-sm
            hover:shadow-lg
            hover:-translate-y-[2px]
            hover:border-emerald-200
          "
        >
          {/* Soft default accent */}
          <div
            className="
              pointer-events-none
              absolute inset-0
              rounded-2xl
              bg-gradient-to-br
              from-emerald-50/20
              to-transparent
            "
          />

          {/* Top row */}
          <div className="relative flex items-start justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="
                  w-10 h-10
                  rounded-xl
                  bg-gradient-to-br from-emerald-50 to-emerald-100
                  text-emerald-600
                  flex items-center justify-center
                  ring-1 ring-emerald-100
                "
              >
                <FileText size={18} />
              </div>

              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 truncate group-hover:text-emerald-700 transition">
                  {c.title}
                </h3>
                <p className="text-xs text-gray-500 truncate">
                  {c.company}
                </p>
              </div>
            </div>

            <Badge
              color="green"
              text={c.status}
              className="text-xs font-medium px-2 py-[2px] rounded-full"
            />
          </div>

          {/* Meta */}
          <div className="relative mt-4 flex flex-wrap items-center gap-2 text-xs">
            <Tag className="rounded-full px-3" color="blue">
              {c.type}
            </Tag>

            <span className="text-gray-400">•</span>
            <span className="text-gray-600">{c.area}</span>

            <span className="text-gray-400">•</span>
            <span className="text-gray-500 truncate">
              {c.counterparty}
            </span>
          </div>

          {/* Footer */}
          <div className="relative mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
            <span>Last updated</span>
            <span className="font-medium text-gray-500">
              {c.updated}
            </span>
          </div>

          {/* Hover accent (unchanged) */}
          <div
            className="
              pointer-events-none
              absolute inset-0
              rounded-2xl
              opacity-0
              group-hover:opacity-100
              transition
              bg-gradient-to-r
              from-emerald-50/40
              to-transparent
            "
          />
        </div>
      ))}
    </div>
  );
}
