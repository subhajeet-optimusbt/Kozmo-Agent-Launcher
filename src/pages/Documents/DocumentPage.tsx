/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

import DocumentDashboard from "./tabs/DocumentDashboard";
import DocumentTable from "./tabs/DocumentTable";
import DocumentJobs from "./tabs/DocumentJobs";

import {
  fetchDocument,
  fetchDocumentDashboard,
} from "../../services/documentService";
import { mapDocumentFromApi } from "../../types/document";
import FullscreenLoader from "../../components/ui/FullScreenLoader";
import RangeTabs from "../../components/ui/RangeTabs";
import { getActiveAccountId, ACCOUNT_CHANGED_EVENT } from "../../utils/auth";
import type { Document } from "../../constants/apps";

type IntakeContextType = {
  activeTab: string;
};

export type RangeType = "today" | "last7days" | "last30days";

export default function DocumentPage() {
  const { activeTab } = useOutletContext<IntakeContextType>();

  const [document, setDocument] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [accountId, setAccountId] = useState(getActiveAccountId());
  const [range, setRange] = useState<RangeType>("today");
  const [dashboardData, setDashboardData] = useState<any | null>(null);

  useEffect(() => {
    if (!accountId || activeTab !== "dashboard") return;

    const loadDashboard = async () => {
      setLoading(true);
      try {
        const data = await fetchDocumentDashboard(accountId, range);
        setDashboardData(data);
      } catch (err) {
        console.error(err);
        setDashboardData(null);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [accountId, range, activeTab]);

  /* ---------------- FETCH INBOX ---------------- */
  useEffect(() => {
    if (!accountId || activeTab !== "documents") return;

    const loadDocument = async () => {
      setLoading(true);
      try {
        const apiData = await fetchDocument(accountId);
        const normalized = Array.isArray(apiData) ? apiData : [];
        setDocument(mapDocumentFromApi(normalized));
      } finally {
        setLoading(false);
      }
    };

    loadDocument();
  }, [accountId, activeTab]);

  /* ---------------- ACCOUNT CHANGE ---------------- */
  useEffect(() => {
    const handler = () => {
      setAccountId(getActiveAccountId());
      setDocument([]);
    };

    window.addEventListener(ACCOUNT_CHANGED_EVENT, handler);
    return () => window.removeEventListener(ACCOUNT_CHANGED_EVENT, handler);
  }, []);

  return (
    <div className="relative overflow-hidden bg-white rounded-2xl border border-gray-200 shadow-sm">
      {loading && <FullscreenLoader />}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500" />
      {/* Header */}
      <div className="mx-8 my-4 flex items-center">
        {/* Left: Title */}

        <div>
          <h3 className="text-2xl font-black tracking-tight text-gray-900">
            Document Dashboard
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            What is coming in, from where, and what needs attention.
          </p>
        </div>

        {/* Center: Range Tabs (dashboard & jobs only) */}
        {activeTab !== "documents" && (
          <div className="ml-auto">
            <RangeTabs value={range} onChange={setRange} />
          </div>
        )}
      </div>

      {/* Tabs */}
      {activeTab === "dashboard" && (
        <div className="px-8 pb-8">
          <DocumentDashboard
            loading={loading}
            data={dashboardData}
            range={range}
          />
        </div>
      )}

      {activeTab === "documents" && (
        <div className="px-8 pb-8">
          <DocumentTable document={document} />
        </div>
      )}

      {activeTab === "jobs" && (
        <div className="px-8 pb-8">
          <DocumentJobs accountId={accountId!} range={range} />
        </div>
      )}
    </div>
  );
}
