import { Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { FileText } from "lucide-react";
import { type Contract } from "../../constants/apps";

export default function ContractTableView({
  data,
  onSelect,
}: {
  data: Contract[];
  onSelect: (c: Contract) => void;
}) {
  const columns: ColumnsType<Contract> = [
    {
      title: "Contract",
      dataIndex: "title",
      key: "title",
      width: "28%",
      render: (_, record) => (
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="mt-1 w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <FileText size={16} />
          </div>

          {/* Text */}
          <div>
            <div className="font-semibold text-gray-900 leading-tight hover:text-emerald-600 transition">
              {record.title}
            </div>
            <div className="text-xs text-gray-500 mt-0.5">
              {record.company}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Area",
      dataIndex: "area",
      key: "area",
      render: (v) => (
        <span className="text-gray-600 font-medium">{v}</span>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (v) => (
        <Tag
          className="rounded-full px-3"
          color="blue"
        >
          {v}
        </Tag>
      ),
    },
    {
      title: "Counterparty",
      dataIndex: "counterparty",
      key: "counterparty",
      render: (v) => (
        <span className="text-gray-700">{v}</span>
      ),
    },
    {
      title: "Status",
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
      title: "Updated",
      dataIndex: "updated",
      key: "updated",
      render: (v) => (
        <span className="text-xs text-gray-400">{v}</span>
      ),
    },
  ];

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
