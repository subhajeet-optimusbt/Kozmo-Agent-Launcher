/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { WarningOutlined, ClockCircleOutlined } from "@ant-design/icons";
import Card from "../common/Card";
import { Skeleton } from "antd";
import { formatCurrency } from "../../services/formmatters";

interface RightSidebarProps {
  widgets: any[];
  renewalMetrics: any;
  contractMetrics: any;
  loading: boolean;
}

const RightSidebar: React.FC<RightSidebarProps> = ({
  widgets,
  renewalMetrics,
  // contractMetrics,
  loading,
}) => {
  const getWidgetData = (widgetId: string) => {
    return widgets.find((w) => w.widgetId === widgetId)?.data;
  };

  const expiringContracts = getWidgetData("WG009") || [];
  // const usageHealth = getWidgetData("WG013");
  const outstandingInvoices = getWidgetData("WG013");

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton active paragraph={{ rows: 4 }} />
        <Skeleton active paragraph={{ rows: 3 }} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Upcoming Renewals */}
      <Card title="Upcoming Renewals">
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {expiringContracts.length > 0 ? (
            expiringContracts.map((contract: any, idx: number) => (
              <RenewalItem
                key={idx}
                name={contract.title}
                daysLeft={Math.ceil(
                  (new Date(contract.endDate).getTime() -
                    new Date().getTime()) /
                    (1000 * 60 * 60 * 24)
                )}
                amount={`${formatCurrency(contract.value || 0)} / year`}
                risk={contract.riskLevel || "Standard"}
                status={contract.status}
              />
            ))
          ) : (
            <p className="text-sm text-gray-500">No renewals in upcoming period</p>
          )}
        </div>
      </Card>

      {/* Usage Health */}
      <Card title="Usage & Financial Health">
        <div className="space-y-4">
          {outstandingInvoices && (
            <>
              <UsageRow
                label="Outstanding Amount"
                value={formatCurrency(
                  outstandingInvoices.totalOutstandingAmount || 0
                )}
                bar={75}
              />
              <UsageRow
                label="Pending Invoices"
                value={`${outstandingInvoices.pendingInvoicesCount || 0} invoices`}
                bar={outstandingInvoices.pendingInvoicesCount * 10 || 30}
              />
            </>
          )}

          <UsageRow label="License Utilization" value="71%" bar={71} />
          <UsageRow label="Inactive Licenses" value="49 seats" bar={29} />
          <UsageRow label="High-Cost Users" value="18 users" bar={42} />
        </div>
      </Card>

      {/* Cost Alert */}
      <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 rounded-2xl p-4 flex gap-3 hover:shadow-md transition-shadow">
        <WarningOutlined className="text-yellow-600 text-xl mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-xs font-bold text-gray-900 mb-1">
            Unusual Cost Pattern Detected
          </p>
          <p className="text-[10px] text-gray-700 leading-relaxed">
            Datadog and AWS data transfer costs increased by 27% over the last
            billing cycle. Review spending trends immediately.
          </p>
          <button className="mt-2 text-[10px] font-bold text-yellow-700 hover:text-yellow-900 transition-colors">
            Review Details →
          </button>
        </div>
      </div>

      {/* Renewal Summary Card */}
      {renewalMetrics && (
        <Card title="Renewal Summary">
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50">
              <span className="text-xs text-gray-600">Next 30 Days</span>
              <span className="font-bold text-sm text-gray-900">
                {renewalMetrics.currentMetrics?.renewalsNext30Days || 0}
              </span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50">
              <span className="text-xs text-gray-600">Next 90 Days</span>
              <span className="font-bold text-sm text-gray-900">
                {renewalMetrics.currentMetrics?.renewalsNext90Days || 0}
              </span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg bg-emerald-50 rounded-lg">
              <span className="text-xs text-emerald-700 font-medium">
                Total Renewal Value
              </span>
              <span className="font-bold text-sm text-emerald-900">
                {formatCurrency(
                  renewalMetrics.currentMetrics?.totalContractValue || 0
                )}
              </span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

/* =======================
   SMALL COMPONENTS
======================= */

interface RenewalItemProps {
  name: string;
  daysLeft: number;
  amount: string;
  risk: string;
  status: string;
}

const RenewalItem = ({
  name,
  daysLeft,
  amount,

}: RenewalItemProps) => {
  const getRiskBadgeColor = (daysLeft: number) => {
    if (daysLeft <= 7) return "bg-red-50 text-red-700 border-red-200";
    if (daysLeft <= 30) return "bg-yellow-50 text-yellow-700 border-yellow-200";
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  };

  return (
    <div className="flex justify-between items-start p-3 rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all">
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-gray-900 truncate">{name}</p>
        <div className="flex items-center gap-1 mt-1">
          <ClockCircleOutlined className="text-gray-400 text-[10px]" />
          <p className="text-[10px] text-gray-500">
            {daysLeft} days · {amount}
          </p>
        </div>
      </div>
      <span
        className={`px-2 py-1 text-[10px] font-bold rounded-lg border whitespace-nowrap ml-2 ${getRiskBadgeColor(
          daysLeft
        )}`}
      >
        {daysLeft <= 7 ? "Urgent" : daysLeft <= 30 ? "Soon" : "Upcoming"}
      </span>
    </div>
  );
};

interface UsageRowProps {
  label: string;
  value: string;
  bar: number;
}

const UsageRow = ({ label, value, bar }: UsageRowProps) => (
  <div>
    <div className="flex justify-between items-center mb-2">
      <p className="text-xs font-bold text-gray-600">{label}</p>
      <p className="text-xs font-bold text-gray-900">{value}</p>
    </div>
    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all"
        style={{ width: `${Math.min(bar, 100)}%` }}
      />
    </div>
  </div>
);

export default RightSidebar;