/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/static-components */
import { Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { FileText } from "lucide-react";
import { type Document } from "../../constants/apps";

type Sorter = {
  field?: keyof Document;
  order?: "ascend" | "descend";
};

export default function DocumentTableView({
  data,
  onSelect,
  sorter,
  onSortChange,
}: {
  data: any;
  onSelect: (c: Document) => void;
  sorter: Sorter;
  onSortChange: (s: Sorter) => void;
}) {
  /* ---------------- SORT TOGGLE LOGIC ---------------- */
  const handleSortClick = (field: keyof Document) => {
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
    field: keyof Document;
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

  const getDocumentStatusTag = (status: string) => {
    switch (status) {
      case "Completed":
        return {
          color: "green",
          className: "bg-green-50 text-green-700 border-green-200",
        };
      case "NotStarted":
        return {
          color: "blue",
          className: "bg-blue-50 text-blue-700 border-blue-200",
        };
      case "Failed":
        return {
          color: "red",
          className: "bg-red-50 text-red-700 border-red-200",
        };
      default:
        return {
          color: "default",
          className: "bg-gray-50 text-gray-600 border-gray-200",
        };
    }
  };

  /* ---------------- COLUMNS ---------------- */
  const columns: ColumnsType<Document> = [
    {
      title: <SortableHeader label="File Name" field="subject" />,
      dataIndex: "subject",
      key: "subject",
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
              {record.subject}
            </span>
          </div>
        </div>
      ),
    },

    {
      title: <SortableHeader label="Current Job Name" field="currentJobName" />,
      dataIndex: "currentJobName",
      key: "currentJobName",
      render: (v) => <span className="font-medium text-gray-600">{v}</span>,
    },
    {
      title: <SortableHeader label="Source" field="source" />,
      dataIndex: "source",
      key: "source",
      render: (v) => <span className="text-gray-700">{v}</span>,
    },

    {
      title: <SortableHeader label="Status" field="status" />,
      dataIndex: "status",
      width: 140,
      render: (v: string) => {
        const tag = getDocumentStatusTag(v);

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
      title: <SortableHeader label="Created" field="created"/>,
      dataIndex: "created",
      width: 160,
    },
    {
      title: <SortableHeader label="Updated" field="updated" />,
      dataIndex: "updated",
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
