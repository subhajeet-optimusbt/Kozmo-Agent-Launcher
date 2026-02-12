/* eslint-disable @typescript-eslint/no-explicit-any */
// utils/mapIntakeFromApi.ts
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const mapIntakeFromApi = (apiData: Array<any>) => {
  return apiData.map((c) => ({
    key: c.RowKey,

    // Screenshot shows "Untitled Request"
    subject: c.Intent ?? "Untitled Request",

    currentJobName: c.CurrentJobName ?? "0",

    // API doesn’t give source → show fallback
    source: c.source?.trim() || "N/A",

    noOfDocuments: c.NoOfDocuments ?? 0,

    Status: c.Status,

    created: dayjs(c.Created).fromNow(),
    updated: dayjs(c.Modified).fromNow(),

    RequestId: c.RequestId,
  }));
};
