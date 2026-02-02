import { baseUrl } from "../utils/baseUrl";

export const fetchDocument = async (accountId: string) => {
  const res = await fetch(
    baseUrl() + `/api/Document/${accountId}`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch intake requests");
  }

  return res.json();
};