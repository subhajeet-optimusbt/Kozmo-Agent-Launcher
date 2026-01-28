// src/services/contractsService.ts
import { baseUrl } from "../utils/baseUrl";

export const fetchContractsDashboard = async (
  accountId: string
) => {
  const res = await fetch(
    `${baseUrl()}/api/Dashboard/${accountId}/contract`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch contract dashboard");
  }

  return res.json();
};


export const fetchContracts = async (accountId: string) => {
  const res = await fetch(
    `${baseUrl()}/api/Contract/${accountId}`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch contracts");
  }

  return res.json();
};