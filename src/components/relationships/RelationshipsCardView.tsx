/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge } from "antd";
import { FileText } from "lucide-react";
import { type Relationships } from "../../constants/apps";

/* ---------------- STATUS COLOR MAP ---------------- */
const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case "Active":
      return "green";
    case "Inactive":
      return "default";
    case "Prospect":
      return "blue";
    case "Blacklisted":
      return "red";
    default:
      return "default";
  }
};

export default function RelationshipsCardView({
  data,
  onSelect,
}: {
  data: Relationships[];
  onSelect: (c: Relationships) => void;
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
          {/* Soft accent */}
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
                  {c.displayName}
                </h3>
                <p className="text-xs text-gray-500 truncate">
                  {c.legalName}
                </p>
              </div>
            </div>

            {/* STATUS */}
            <Badge
              color={getStatusBadgeColor(c.status)}
              text={c.status}
              className="text-xs font-medium px-2 py-[2px] rounded-full"
            />
          </div>

          {/* Meta */}
          <div className="relative mt-4 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-gray-400">•</span>
            <span className="text-gray-600">{c.created}</span>

            <span className="text-gray-400">•</span>
            <span className="text-gray-500 truncate">{c.category}</span>
          </div>

          {/* Footer */}
          <div className="relative mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
            <span>Modified</span>
            <span className="font-medium text-gray-500">{c.modified}</span>
          </div>

          {/* Hover accent */}
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
