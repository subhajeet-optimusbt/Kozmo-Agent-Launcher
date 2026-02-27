/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback } from "react";
import { baseUrl } from "../utils/baseUrl";
import { getActiveAccountId, ACCOUNT_CHANGED_EVENT } from "../utils/auth";

interface ApiStatus {
  widgets: "loading" | "ok" | "error";
  intake: "loading" | "ok" | "error";
  document: "loading" | "ok" | "error";
  contract: "loading" | "ok" | "error";
  renewal: "loading" | "ok" | "error";
}

interface DashboardData {
  widgets: any[];
  intakeMetrics: any;
  documentMetrics: any;
  contractMetrics: any;
  renewalMetrics: any;
  apiStatus: ApiStatus;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/* ─────────────────────────────────────────────
   SAFE JSON FETCH
   - Returns null (not throw) on failure
   - Never crashes on HTML / empty responses
   - Classifies the error type for UI display
───────────────────────────────────────────── */
const safeJsonFetch = async (
  url: string,
  requestOptions: RequestInit
): Promise<{ data: any; error: string | null }> => {
  try {
    const res = await fetch(url, requestOptions);

    // Empty response (CORS preflight / 204 No Content)
    if (res.status === 204) return { data: null, error: null };

    // Read content-type BEFORE reading body
    const contentType = res.headers.get("content-type") ?? "";
    const isJson = contentType.includes("application/json");

    if (!res.ok) {
      // Try to get a clean error message without dumping HTML
      if (isJson) {
        try {
          const json = await res.json();
          const msg = json?.message || json?.error || `HTTP ${res.status}`;
          return { data: null, error: msg };
        } catch {
          return { data: null, error: `HTTP ${res.status}: ${res.statusText}` };
        }
      }
      // HTML error page (401 redirect, 404, 500, etc.) — don't dump it
      return {
        data: null,
        error: `HTTP ${res.status}: ${res.statusText || "Server error"}`,
      };
    }

    // Success but non-JSON (shouldn't happen in normal flow)
    if (!isJson) {
      return { data: null, error: "Server returned non-JSON response" };
    }

    const data = await res.json();
    return { data, error: null };
  } catch (err) {
    // Network error, CORS block, DNS failure, etc.
    if (err instanceof TypeError && err.message.includes("fetch")) {
      return { data: null, error: "Network error — check your connection" };
    }
    return {
      data: null,
      error: err instanceof Error ? err.message : "Unknown fetch error",
    };
  }
};

/* ─────────────────────────────────────────────
   HOOK
───────────────────────────────────────────── */
export const useDashboardData = (): DashboardData => {
  const [accountId, setAccountId] = useState(getActiveAccountId());
  const [fetchTick, setFetchTick] = useState(0);

  const [data, setData] = useState<DashboardData>({
    widgets: [],
    intakeMetrics: null,
    documentMetrics: null,
    contractMetrics: null,
    renewalMetrics: null,
    apiStatus: {
      widgets: "loading",
      intake: "loading",
      document: "loading",
      contract: "loading",
      renewal: "loading",
    },
    loading: true,
    error: null,
    refetch: () => {},
  });

  /* ── Account change listener ── */
  useEffect(() => {
    const handler = () => setAccountId(getActiveAccountId());
    window.addEventListener(ACCOUNT_CHANGED_EVENT, handler);
    return () => window.removeEventListener(ACCOUNT_CHANGED_EVENT, handler);
  }, []);

  /* ── Expose refetch ── */
  const refetch = useCallback(() => {
    setFetchTick((t) => t + 1);
  }, []);

  /* ── Fetch dashboard data ── */
  useEffect(() => {
    if (!accountId) return;

    const requestOptions: RequestInit = {
      method: "GET",
      credentials: "include",
    };

    const base = baseUrl();
    const urls = {
      widgets: `${base}/api/Dashboard/${accountId}/widgets/DL001`,
      intake: `${base}/api/Dashboard/${accountId}/intake`,
      document: `${base}/api/Dashboard/${accountId}/document`,
      contract: `${base}/api/Dashboard/${accountId}/contract`,
      renewal: `${base}/api/Dashboard/${accountId}/renewal`,
    };

    const fetchDashboardData = async () => {
      // Set all to loading
      setData((prev) => ({
        ...prev,
        loading: true,
        error: null,
        apiStatus: {
          widgets: "loading",
          intake: "loading",
          document: "loading",
          contract: "loading",
          renewal: "loading",
        },
      }));

      // ✅ Promise.allSettled — each fetch is independent, none can crash the others
      const [widgetsRes, intakeRes, documentRes, contractRes, renewalRes] =
        await Promise.all([
          safeJsonFetch(urls.widgets, requestOptions),
          safeJsonFetch(urls.intake, requestOptions),
          safeJsonFetch(urls.document, requestOptions),
          safeJsonFetch(urls.contract, requestOptions),
          safeJsonFetch(urls.renewal, requestOptions),
        ]);

      // Collect non-critical errors for the warning banner (don't block render)
      const partialErrors: string[] = [];
      if (widgetsRes.error) partialErrors.push(`Widgets: ${widgetsRes.error}`);
      if (intakeRes.error) partialErrors.push(`Intake: ${intakeRes.error}`);
      if (documentRes.error) partialErrors.push(`Documents: ${documentRes.error}`);
      if (contractRes.error) partialErrors.push(`Contracts: ${contractRes.error}`);
      if (renewalRes.error) partialErrors.push(`Renewals: ${renewalRes.error}`);

      setData((prev) => ({
        ...prev,
        widgets: widgetsRes.data?.widgets ?? [],
        intakeMetrics: intakeRes.data,
        documentMetrics: documentRes.data,
        contractMetrics: contractRes.data,
        renewalMetrics: renewalRes.data,
        loading: false,
        // Only show error banner if widgets failed (core data missing)
        // Partial agent failures are shown per-panel, not globally
        error:
          widgetsRes.error && !widgetsRes.data
            ? `Dashboard data unavailable: ${widgetsRes.error}`
            : null,
        apiStatus: {
          widgets: widgetsRes.error ? "error" : "ok",
          intake: intakeRes.error ? "error" : "ok",
          document: documentRes.error ? "error" : "ok",
          contract: contractRes.error ? "error" : "ok",
          renewal: renewalRes.error ? "error" : "ok",
        },
      }));
    };

    fetchDashboardData();
  }, [accountId, fetchTick]);

  return { ...data, refetch };
};