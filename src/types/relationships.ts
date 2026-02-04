/* eslint-disable @typescript-eslint/no-explicit-any */
// types/Relationships.ts
import type { Relationships } from "../constants/apps";

export const mapRelationshipsFromApi = (apiData: any[]): Relationships[] => {
  return apiData.map((r) => ({
    key: r.rowKey,
    displayName: r.displayName,
    legalName: r.legalName ?? "N/A",
    category: r.category ?? "N/A",
    status: r.status ?? "Prospect",
    created: r.created ?? "N/A",
    modified: r.modified ?? "N/A",
  }));
};
