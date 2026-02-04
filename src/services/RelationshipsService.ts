// services/RelationshipsService.ts
import { baseUrl } from "../utils/baseUrl";

export type RelationshipsDashboardResponse = {
  activeCounterparties: number;
  newCounterparties: number;
  highRiskCounterparties: number;
};

export const fetchRelationshipsDashboard = async (
  accountId: string,
): Promise<RelationshipsDashboardResponse> => {
  const res = await fetch(
    `${baseUrl()}/api/Relationship/${accountId}/dashboard/Stats`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch relationships dashboard stats");
  }

  return res.json();
};


export const fetchRelationships = async (accountId: string) => {
  const res = await fetch(
    `${baseUrl()}/api/Relationship/${accountId}/Counterparty`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch relationships");
  }

  return res.json();
};