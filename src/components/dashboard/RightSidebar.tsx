import React from "react";
import {
  WarningOutlined,
} from "@ant-design/icons";
import Card from "../common/Card";

const RightSidebar: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card title="Upcoming Renewals">
        <div className="space-y-4">
          <RenewalItem
            name="AWS Enterprise Support"
            days={9}
            amount="$420,000 / year"
            risk="High Risk"
            color="red"
          />
          <RenewalItem
            name="Salesforce CRM"
            days={21}
            amount="$96,000 / year"
            risk="Negotiable"
            color="yellow"
          />
          <RenewalItem
            name="Atlassian Jira + Confluence"
            days={34}
            amount="$54,300 / year"
            risk="Review"
            color="yellow"
          />
          <RenewalItem
            name="Figma Organization Plan"
            days={61}
            amount="$28,800 / year"
            risk="Low Risk"
            color="green"
          />
          <RenewalItem
            name="Datadog Infrastructure"
            days={78}
            amount="$112,000 / year"
            risk="Usage Spike"
            color="red"
          />
                <RenewalItem
            name="Atlassian Jira + Confluence"
            days={34}
            amount="$54,300 / year"
            risk="Review"
            color="yellow"
          />
          <RenewalItem
            name="Figma Organization Plan"
            days={61}
            amount="$28,800 / year"
            risk="Low Risk"
            color="green"
          />
     
        </div>
      </Card>

      {/* Usage Health */}
      <Card title="Usage Health">
        <div className="space-y-4">
          <UsageRow label="License Utilization" value="71%" bar={71} />
          <UsageRow label="Inactive Licenses" value="49 seats" bar={29} />
          <UsageRow label="High-Cost Users" value="18 users" bar={42} />
          <UsageRow label="Daily Active Users" value="236 / 340" bar={69} />
          <UsageRow label="SSO Adoption" value="92%" bar={92} />
        </div>
      </Card>

      {/* Cost Alert */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex gap-3">
        <WarningOutlined className="text-yellow-600 text-lg mt-0.5" />
        <div>
          <p className="text-xs font-black text-gray-900">
            Unusual Cost Pattern Detected
          </p>
          <p className="text-[10px] text-gray-600 leading-relaxed">
            Datadog and AWS data transfer costs increased by 27% over the
            last billing cycle.
          </p>
        </div>
      </div>
    </div>
  );
};

/* =======================
   SMALL COMPONENTS
======================= */

const RenewalItem = ({
  name,
  days,
  amount,
  risk,
  color,
}: {
  name: string;
  days: number;
  amount: string;
  risk: string;
  color: "red" | "yellow" | "green";
}) => {
  const badgeColor =
    color === "red"
      ? "bg-red-50 text-red-600"
      : color === "yellow"
      ? "bg-yellow-50 text-yellow-700"
      : "bg-emerald-50 text-emerald-600";

  return (
    <div className="flex justify-between items-start">
      <div>
        <p className="text-xs font-black text-gray-900">{name}</p>
        <p className="text-[10px] text-gray-500">
          Renews in {days} days · {amount}
        </p>
      </div>
      <span
        className={`px-2 py-1 text-[10px] font-black rounded-lg ${badgeColor}`}
      >
        {risk}
      </span>
    </div>
  );
};

const UsageRow = ({
  label,
  value,
  bar,
}: {
  label: string;
  value: string;
  bar: number;
}) => (
  <div>
    <div className="flex justify-between items-center mb-1">
      <p className="text-xs font-bold text-gray-600">{label}</p>
      <p className="text-xs font-black text-gray-900">{value}</p>
    </div>
    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
      <div
        className="h-full bg-emerald-500 rounded-full"
        style={{ width: `${bar}%` }}
      />
    </div>
  </div>
);

export default RightSidebar;
