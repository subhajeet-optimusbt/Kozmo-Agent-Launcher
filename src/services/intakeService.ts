import { baseUrl } from "../utils/baseUrl";

export type RangeType = "today" | "last7days" | "last30days";

export type IntakeDashboardResponse = {
  total: number;
  withDocs: number;
  running: number;
  completed: number;
  failed: number;
  escalated: number;
};

export const fetchIntakeDashboard = async (
  accountId: string,
  timeSpan: RangeType,
): Promise<IntakeDashboardResponse> => {
  const res = await fetch(
    `${baseUrl()}/api/Intake/${accountId}/dashboard/Stats?timeSpan=${timeSpan}`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch intake dashboard stats");
  }

  return res.json();
};

export const fetchIntake = async (accountId: string) => {
  const res = await fetch(baseUrl() + `/api/Intake/${accountId}/Request`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch intake requests");
  }

  return res.json();
};
