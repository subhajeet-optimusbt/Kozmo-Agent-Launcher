import { baseUrl } from "../utils/baseUrl";


export type DocumentRange = "today" | "last7days" | "last30days";

export const fetchDocumentDashboard = async (
  accountId: string,
  timeSpan: DocumentRange
) => {
  const url = `${baseUrl()}/api/Document/${accountId}/dashboard/Stats?timeSpan=${timeSpan}`;

  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch document dashboard");
  }

  return res.json();
};
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