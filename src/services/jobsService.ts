import { baseUrl } from "../utils/baseUrl";

export interface JobRunApi {
  partitionKey: string;
  rowKey: string;
  jobName: string;
  status: string;
  attemptNumber: number;
  startedAt: string;
  completedAt: string;
  timeTaken: number;
}

export async function fetchJobs(accountId: string): Promise<JobRunApi[]> {
  const response = await fetch(
    `${baseUrl()}/api/Contract/${accountId}/RequestJobs`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // keep if your app uses cookies / auth
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch jobs");
  }

  return response.json();
}
