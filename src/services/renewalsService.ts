import { baseUrl } from "../utils/baseUrl";

export const fetchRenewals = async (accountId: string) => {
  const res = await fetch(
    baseUrl() + `/api/Renewal/${accountId}/Renewal`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch renewals");
  }

  return res.json();
};