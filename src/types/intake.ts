/* eslint-disable @typescript-eslint/no-explicit-any */
// utils/mapIntakeFromApi.ts
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const mapIntakeFromApi = (apiData: Array<any>) => {
  return apiData.map((c) => ({
    key: c.RowKey,

    // Screenshot shows "Untitled Request"
    subject: c.Subject || "N/A",

    currentJobName: c.CurrentJobName ?? "0",

    // API doesn’t give source → show fallback
    source: c.Source?.trim() || "N/A",

    noOfDocuments: c.NoOfDocuments ?? 0,

    Status: c.Status,

    created: new Date(c.Created).toLocaleString(),
    createdRaw: c.created,

    updated: new Date(c.Modified).toLocaleString(),
    updatedRaw: c.updated,
    RequestId: c.RequestId,
  }));
};
