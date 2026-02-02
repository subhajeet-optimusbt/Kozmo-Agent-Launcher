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




export async function fetchIntakeJobs(
  accountId: string,
  range: "today" | "7" | "30"
) {
  const res = await fetch(
    `${baseUrl()}/api/Intake/${accountId}/JobList?range=${range}`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch jobs");
  }

  return res.json();
}
