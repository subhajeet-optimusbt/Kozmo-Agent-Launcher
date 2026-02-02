/* eslint-disable @typescript-eslint/no-explicit-any */
// utils/mapIntakeFromApi.ts
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const mapIntakeFromApi = (apiData: Array<any>) => {
  return apiData.map((c) => ({
    key: c.RowKey,

    // Screenshot shows "Untitled Request"
    subject: c.subject ?? "Untitled Request",

    currentJobName: c.CurrentJobName ?? "0",

    // API doesn’t give source → show fallback
    source: c.source?.trim() || "N/A" ,

    noOfDocuments: c.NoOfDocuments ?? 0,

    status: c.status,

    created: dayjs(c.Created).fromNow(),
    updated: dayjs(c.Modified).fromNow(),
  }));
};
