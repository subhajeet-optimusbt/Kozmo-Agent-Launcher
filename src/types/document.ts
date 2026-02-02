/* eslint-disable @typescript-eslint/no-explicit-any */
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const mapDocumentFromApi = (apiData: Array<any>) => {
  return apiData.map((d) => ({
    key: d.rowKey, // REQUIRED for antd table

    // File Name shown as Subject
    subject: d.fileName ?? "Untitled Document",

   currentJobName: d.currentJobName?.trim() || "N/A",

    // API does not provide source
    source: d.source?.trim() || "N/A",


    status: d.status ?? "NotStarted",

    created: d.created
      ? dayjs(d.created).fromNow()
      : "N/A",

    updated: d.modified
      ? dayjs(d.modified).fromNow()
      : "N/A",
  }));
};
