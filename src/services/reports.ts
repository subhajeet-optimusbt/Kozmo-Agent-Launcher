/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseUrl } from "../utils/baseUrl";

async function get(url: string) {
  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`API failed: ${res.status}`);
  }

  return res.json();
}

export const ReportsAPI = {
  contracts: (activeAccountId: any) =>
    get(`${baseUrl()}/api/Dashboard/${activeAccountId}/reports/contracts`),

  renewals: (activeAccountId: any) =>
    get(`${baseUrl()}/api/Dashboard/${activeAccountId}/reports/renewals`),

  counterparties: (activeAccountId: any) =>
    get(`${baseUrl()}/api/Dashboard/${activeAccountId}/reports/counterparties`),

  milestones: (activeAccountId: any) =>
    get(
      `${baseUrl()}/api/Dashboard/${activeAccountId}/reports/milestones-obligations`,
    ),

  issues: (activeAccountId: any) =>
    get(`${baseUrl()}/api/Dashboard/${activeAccountId}/reports/issues`),

  keyProvisions: (activeAccountId: any) =>
    get(`${baseUrl()}/api/Dashboard/${activeAccountId}/reports/key-provisions`),
};
