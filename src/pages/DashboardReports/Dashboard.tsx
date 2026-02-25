/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  BarChart3,
  ShieldAlert,
  RefreshCcw,
  Clock,
  FileBarChart,
  Cpu,
} from "lucide-react";
import { baseUrl } from "../../utils/baseUrl";
import { getActiveAccountId, ACCOUNT_CHANGED_EVENT } from "../../utils/auth";
import FullscreenLoader from "../../components/ui/FullScreenLoader";
import { useNavigate } from "react-router-dom";
interface Props {
  Zone: any;
}

const ICON_MAP: Record<string, any> = {
  "Portfolio Posture": BarChart3,
  "Commercial Value & Exposure": FileBarChart,
  "Health & Intelligence (CHI Layer)": ShieldAlert,
  "Renewal & Time-Based Risk": Clock,
  "Operational Stress & Execution Signals": RefreshCcw,
  "Counterparty & Relationship Risk": Cpu,
};

const PALETTE_MAP: Record<string, string> = {
  "Portfolio Posture": "emerald",
  "Commercial Value & Exposure": "blue",
  "Health & Intelligence (CHI Layer)": "violet",
  "Renewal & Time-Based Risk": "amber",
  "Operational Stress & Execution Signals": "rose",
  "Counterparty & Relationship Risk": "cyan",
};

const DashboardSection: React.FC<Props> = ({ Zone }) => {
  const [dashboards, setDashboards] = useState<any[]>([]);
  const [activeAccountId, setActiveAccountId] = useState(getActiveAccountId());
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => {
      setActiveAccountId(getActiveAccountId());
    };

    window.addEventListener(ACCOUNT_CHANGED_EVENT, handler);
    return () => window.removeEventListener(ACCOUNT_CHANGED_EVENT, handler);
  }, []);

  const fetchDashboards = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${baseUrl()}/api/Dashboard/${activeAccountId}/dashboards`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error("Unauthorized");
      }

      const data = await response.json();
      setDashboards(data);
    } catch (error) {
      console.error("Dashboard fetch failed", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeAccountId) {
      fetchDashboards();
    }
  }, [activeAccountId]);

  return (
    <div className="space-y-4">
      {loading && <FullscreenLoader />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...dashboards]
          .sort((a, b) => {
            const getNumber = (id: string) =>
              parseInt(id?.replace(/[^\d]/g, "") || "0", 10);
            return getNumber(a.dashboardId) - getNumber(b.dashboardId);
          })
          .map((d) => {
            let metricsObj: any = {};
            try {
              metricsObj = JSON.parse(d.metrics || "{}");
            } catch {
              metricsObj = {};
            }

            const categoryKey = Object.keys(metricsObj)[0] || d.dashboardName;

            const metrics = metricsObj?.[categoryKey]?.Metrics || {};

            let kpis: any[] = [];

            /* -----------------------------------
               Commercial Value & Exposure
            ----------------------------------- */
            if (d.dashboardName === "Commercial Value & Exposure") {
              const totalValue = metrics["Total Contract Value"] || 0;
              const outstanding = metrics["Outstanding Invoices Amount"] || 0;

              kpis = [
                {
                  label: "Active Value",
                  value: `₹${Number(totalValue).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })} Cr`,
                },
                {
                  label: "Outstanding",
                  value: `₹${Number(outstanding).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })} Cr`,
                },
              ];
            } else if (
              /* -----------------------------------
               Health & Intelligence (CHI Layer)
            ----------------------------------- */
              d.dashboardName === "Health & Intelligence (CHI Layer)"
            ) {
              const avgScore = metrics["Average CHI Score"] || 0;
              const contracts = metrics["Contracts with CHI Score > 60"] || 0;

              kpis = [
                {
                  label: "Avg CHI Score",
                  value: Number(avgScore).toFixed(2),
                },
                {
                  label: "Contracts > 60",
                  value: contracts,
                },
              ];
            } else if (d.dashboardName === "Counterparty & Relationship Risk") {
              /* -----------------------------------
               Counterparty & Relationship Risk
            ----------------------------------- */
              const activeCount = metrics["Active Counterparties Count"] || 0;

              const top5 = metrics["Top 5 High Value Counterparties"] || [];

              const topRiskName = top5.length > 0 ? top5[0].Name : "-";

              kpis = [
                {
                  label: "Active Counterparties",
                  value: activeCount,
                },
                {
                  label: "Top Risk",
                  value: topRiskName,
                },
              ];
            }

            /* -----------------------------------
               Default + Structural Quality Fallback
            ----------------------------------- */
            if (!kpis.length) {
              const metricEntries = Object.entries(metrics);

              if (metricEntries.length === 0) {
                kpis = [
                  { label: "", value: "-" },
                  { label: "", value: "-" },
                ];
              } else {
                kpis = metricEntries.slice(0, 2).map(([label, value]: any) => ({
                  label,
                  value:
                    typeof value === "number"
                      ? value.toLocaleString()
                      : String(value),
                }));
              }
            }

            return (
              <Zone
                key={d.dashboardId}
                title={d.dashboardName}
                // description={categoryKey}
                icon={ICON_MAP[d.dashboardName] || BarChart3}
                palette={PALETTE_MAP[d.dashboardName] || "emerald"}
                kpis={kpis}
                onClick={() => navigate(`/dashboard-reports/${d.dashboardId}`)}
              />
            );
          })}
      </div>
    </div>
  );
};

export default DashboardSection;
