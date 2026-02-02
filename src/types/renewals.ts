import type { Renewal } from "../constants/apps";

export const formatDateMMDDYY = (dateStr?: string | null) => {
  if (!dateStr) return "—"; // fallback for null/undefined

  const d = new Date(dateStr);

  if (isNaN(d.getTime())) return "—"; // safety net

  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(-2);

  return `${mm}/${dd}/${yy}`;
};


export const mapRenewalsFromApi = (
  apiData: Array<{
    rowKey: string;
    contractTitle: string;
    businessArea: string;
    counterparty: string;
    owner: string;
    renewalStatus: string;
    nextRenewalDate: string;
  }>,
): Renewal[] => {
  return apiData.map((c) => ({
    key: c.rowKey,
    title: c.contractTitle,
    businessArea: c.businessArea,
    area: c.businessArea, // if you want both
    counterparty: c.counterparty,
    owner: c.owner?.trim() || "N/A",
    renewalStatus: c.renewalStatus,
    nextRenewaldate: formatDateMMDDYY(c.nextRenewalDate), // handled below
  }));
};
