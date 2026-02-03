/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
// import JobsHeader from "../../../components/intake/jobs/JobsHeader";
import JobsKPIs from "../../../components/intake/jobs/JobsKPIs";
import JobsControls from "../../../components/intake/jobs/JobsControls";
import JobsTable from "../../../components/intake/jobs/JobsTable";
import { fetchIntakeJobs } from "../../../services/jobsService";
import { usePagination } from "../../../hooks/pagination";
import PaginationControl from "../../../components/PaginationControl";
import FullscreenLoader from "../../../components/ui/FullScreenLoader";

type Props = {
  accountId: string;
  range: "today" | "last7days" | "last30days";
};

export default function IntakeJobsPanel({ accountId, range }: Props) {
  const [view, setView] = useState<"health" | "runs">("health");
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  /* ---------------- FETCH JOBS ---------------- */
  useEffect(() => {
    if (!accountId) return;

    const loadJobs = async () => {
      setLoading(true);
      try {
        const data = await fetchIntakeJobs(accountId, range);
        setJobs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, [accountId, range]);

const {
  page,
  pageSize,
  total,
  setPage,
  setPageSize,
  paginatedData,
} = usePagination<any>(jobs);


  return (
    <div className="space-y-4">
      {loading && <FullscreenLoader />}

      {/* <JobsHeader
      /> */}

      <JobsKPIs jobs={jobs} />

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
