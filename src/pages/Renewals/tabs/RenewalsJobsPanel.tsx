/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useMemo } from "react";
// import JobsHeader from "../../../components/jobs/JobsHeader";
import JobsKPIs from "../../../components/jobs/JobsKPIs";
import JobsControls from "../../../components/jobs/JobsControls";
import JobsTable from "../../../components/jobs/JobsTable";
import { fetchJobs } from "../../../services/jobsService";
import { useContractsPagination } from "../../../hooks/pagination";
import PaginationControl from "../../../components/PaginationControl";
import FullscreenLoader from "../../../components/ui/FullScreenLoader";
type Props = {
  accountId: string;
  range: string;
};

export default function JobsPanel({ accountId,range }: Props) {
  const [view, setView] = useState<"health" | "runs">("health");
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (!accountId) return;

    const loadJobs = async () => {
      setLoading(true);
      try {
        const data = await fetchJobs(accountId);
        setJobs(data);
      } catch (err) {
        console.error(err);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, [accountId]);

  const filteredJobs = useMemo(() => {
    const now = new Date();

    return jobs.filter((j) => {
      const d = new Date(j.startedAt);

      if (range === "today") {
        return d.toDateString() === now.toDateString();
      }

      if (range === "7d") {
        return now.getTime() - d.getTime() <= 7 * 24 * 60 * 60 * 1000;
      }

      return now.getTime() - d.getTime() <= 30 * 24 * 60 * 60 * 1000;
    });
  }, [jobs, range]);

  const { page, pageSize, total, setPage, setPageSize, paginatedData } =
    useContractsPagination(filteredJobs);
  return (
    <div className="space-y-4">
      {loading && <FullscreenLoader/>}
      {/* <JobsHeader range={range} onChange={setRange} /> */}
      <JobsKPIs jobs={filteredJobs} />
      <JobsControls
        view={view}
        onChange={setView}
        pageSize={pageSize}
        onPageSizeChange={(size) => {
          setPage(1);
          setPageSize(size);
        }}
      />
      <JobsTable view={view} jobs={paginatedData} />
      <PaginationControl
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={setPage}
      />
    </div>
  );
}
