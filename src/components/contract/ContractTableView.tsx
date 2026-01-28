/* eslint-disable react-hooks/static-components */
import { Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { FileText } from "lucide-react";
import { type Contract } from "../../constants/apps";

type Sorter = {
  field?: keyof Contract;
  order?: "ascend" | "descend";
};

export default function ContractTableView({
  data,
  onSelect,
  sorter,
  onSortChange,
}: {
  data: Contract[];
  onSelect: (c: Contract) => void;
  sorter: Sorter;
  onSortChange: (s: Sorter) => void;
}) {
  /* ---------------- SORT TOGGLE LOGIC ---------------- */
  const handleSortClick = (field: keyof Contract) => {
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
    field: keyof Contract;
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

  /* ---------------- COLUMNS ---------------- */
  const columns: ColumnsType<Contract> = [
    {
      title: <SortableHeader label="Contract Title" field="title" />,
      dataIndex: "title",
      key: "title",
      width: "28%",
      render: (_, record) => (
        <div className="flex items-start gap-3">
          <div className="mt-1 w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <FileText size={16} />
          </div>

          <div>
            <div className="font-semibold text-gray-900 leading-tight">
              {record.title}
            </div>
            <div className="text-xs text-gray-500 mt-0.5">{record.company}</div>
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
      title: <SortableHeader label="Contract Type" field="type" />,
      dataIndex: "type",
      key: "type",
      render: (v) => (
        <Tag className="rounded-full px-3" color="blue">
          {v}
        </Tag>
      ),
    },
    {
      title: <SortableHeader label="Company" field="company" />,
      dataIndex: "company",
      key: "company",
      render: (v) => <span className="text-gray-700">{v}</span>,
    },
    {
      title: <SortableHeader label="Counterparty" field="counterparty" />,
      dataIndex: "counterparty",
      key: "counterparty",
      render: (v) => <span className="text-gray-700">{v}</span>,
    },
    {
      title: <SortableHeader label="Status" field="status" />,
      dataIndex: "status",
      key: "status",
      render: (v: string) => (
        <Tag
          className="rounded-full px-3"
          color={v === "Active" ? "green" : "default"}
        >
          {v}
        </Tag>
      ),
    },
    {
      title: <SortableHeader label="Last Updated" field="updated" />,
      dataIndex: "updated",
      key: "updated",
      render: (v) => <span className="text-xs text-gray-400">{v}</span>,
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
