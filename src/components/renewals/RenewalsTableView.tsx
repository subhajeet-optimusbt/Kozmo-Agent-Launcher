/* eslint-disable react-hooks/static-components */
import { Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { FileText } from "lucide-react";
import { type Renewal } from "../../constants/apps";

type Sorter = {
  field?: keyof Renewal;
  order?: "ascend" | "descend";
};

export default function RenewalsTableView({
  data,
  onSelect,
  sorter,
  onSortChange,
}: {
  data: Renewal[];
  onSelect: (c: Renewal) => void;
  sorter: Sorter;
  onSortChange: (s: Sorter) => void;
}) {
  /* ---------------- SORT TOGGLE LOGIC ---------------- */
  const handleSortClick = (field: keyof Renewal) => {
    if (sorter.field !== field) {
      onSortChange({ field, order: "ascend" });
    } else {
      onSortChange({
        field,
        order: sorter.order === "ascend" ? "descend" : "ascend",
      });
    }
  };

  /* ---------------- SORTABLE HEADER ---------------- */
  const SortableHeader = ({
    label,
    field,
  }: {
    label: string;
    field: keyof Renewal;
  }) => {
    const active = sorter.field === field;

    return (
      <div
        onClick={() => handleSortClick(field)}
        className="flex items-center gap-1 cursor-pointer select-none"
      >
        <span
          className={
            active ? "font-semibold text-emerald-600" : "text-gray-700"
          }
        >
          {label}
        </span>

        {active && (
          <span className="text-xs transition-all">
            {sorter.order === "ascend" ? "↑" : "↓"}
          </span>
        )}
      </div>
    );
  };


const getRenewalStatusTag = (status: string) => {
  switch (status) {
    case "Completed":
      return { color: "green", className: "bg-green-50 text-green-700 border-green-200" };
    case "NotStarted":
      return { color: "blue", className: "bg-blue-50 text-blue-700 border-blue-200" };
    case "Failed":
      return { color: "red", className: "bg-red-50 text-red-700 border-red-200" };
    default:
      return { color: "default", className: "bg-gray-50 text-gray-600 border-gray-200" };
  }
};

  /* ---------------- COLUMNS ---------------- */
  const columns: ColumnsType<Renewal> = [
    {
      title: <SortableHeader label="Contract Title" field="title" />,
      dataIndex: "title",
      key: "title",
      width: "28%",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
            <FileText size={16} strokeWidth={1.8} />
          </div>

          {/* Title */}
          <div className="flex flex-col">
            <span className="font-semibold text-gray-900 leading-snug">
              {record.title}
            </span>
          </div>
        </div>
      ),
    },

    {
      title: <SortableHeader label="Business Area" field="area" />,
      dataIndex: "area",
      key: "area",
      render: (v) => <span className="font-medium text-gray-600">{v}</span>,
    },
    {
      title: <SortableHeader label="Counterparty" field="counterparty" />,
      dataIndex: "counterparty",
      key: "counterparty",
      render: (v) => <span className="text-gray-700">{v}</span>,
    },
   {
  title: <SortableHeader label="Owner" field="owner" />,
  dataIndex: "owner",
  key: "owner",
  render: (v: string) => (
    <span className={v === "N/A" ? "text-gray-400 italic" : "text-gray-700"}>
      {v}
    </span>
  ),
},

   {
  title: <SortableHeader label="Renewal Status" field="renewalStatus" />,
  dataIndex: "renewalStatus",
  key: "renewalStatus",
  render: (v: string) => {
    const tag = getRenewalStatusTag(v);

    return (
      <Tag
        className={`rounded-full px-3 py-0.5 text-xs font-medium ${tag.className}`}
      >
        {v}
      </Tag>
    );
  },
},

  {
  title: <SortableHeader label="Next Renewal Date" field={"type"} />,
  dataIndex: "nextRenewaldate",
  key: "nextRenewaldate",
  render: (v: string) => (
    <span className="text-xs text-gray-500 font-medium">{v}</span>
  ),
},

  ];

  /* ---------------- TABLE ---------------- */
  return (
    <div className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
      <Table
        rowKey="key"
        pagination={false}
        dataSource={data}
        columns={columns}
        onRow={(record) => ({
          onClick: () => onSelect(record),
          className:
            "cursor-pointer transition-all hover:bg-gradient-to-r hover:from-emerald-50/60 hover:to-transparent",
        })}
        className="kozmo-table"
      />
    </div>
  );
}
