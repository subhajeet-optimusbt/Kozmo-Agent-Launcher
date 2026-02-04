/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/static-components */
import { Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { FileText } from "lucide-react";
import { type Relationships } from "../../constants/apps";

type Sorter = {
  field?: keyof Relationships;
  order?: "ascend" | "descend";
};

export default function RelationshipsTableView({
  data,
  onSelect,
  sorter,
  onSortChange,
}: {
  data: any;
  onSelect: (c: Relationships) => void;
  sorter: Sorter;
  onSortChange: (s: Sorter) => void;
}) {
  /* ---------------- SORT TOGGLE LOGIC ---------------- */
  const handleSortClick = (field: keyof Relationships) => {
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
    field: keyof Relationships;
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

  const getRelationshipStatusTag = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";

      case "Inactive":
        return "bg-gray-100 text-gray-600 border-gray-200";

      case "Prospect":
        return "bg-blue-50 text-blue-700 border-blue-200";

      case "Blacklisted":
        return "bg-red-50 text-red-700 border-red-200";

      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  /* ---------------- COLUMNS ---------------- */
  const columns: ColumnsType<Relationships> = [
    {
      title: <SortableHeader label="Display Name" field="displayName" />,
      dataIndex: "displayName",
      key: "displayName",
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
              {record.displayName}
            </span>
          </div>
        </div>
      ),
    },

    {
      title: <SortableHeader label="Legal Name" field="legalName" />,
      dataIndex: "legalName",
      key: "legalName",
      render: (v) => <span className="font-medium text-gray-600">{v}</span>,
    },
    {
      title: <SortableHeader label="Category" field="category" />,
      dataIndex: "category",
      key: "category",
      render: (v) => <span className="text-gray-700">{v}</span>,
    },

    {
      title: <SortableHeader label="Status" field="status" />,
      dataIndex: "status",
      width: 140,
      render: (v: string) => (
        <Tag
          className={`rounded-full px-3 py-0.5 text-xs font-medium ${getRelationshipStatusTag(v)}`}
        >
          {v}
        </Tag>
      ),
    },
    {
      title: <SortableHeader label="Created" field="created" />,
      dataIndex: "created",
      width: 160,
    },
    {
      title: <SortableHeader label="Modified" field="modified" />,
      dataIndex: "modified",
      width: 160,
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
