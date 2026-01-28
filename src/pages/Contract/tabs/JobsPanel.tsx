/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState,useMemo } from "react";
import JobsHeader from "../../../components/jobs/JobsHeader";
import JobsKPIs from "../../../components/jobs/JobsKPIs";
import JobsControls from "../../../components/jobs/JobsControls";
import JobsTable from "../../../components/jobs/JobsTable";
import { fetchJobs } from "../../../services/jobsService";

type Props = {
  accountId: string;
};

export default function JobsPanel({ accountId }: Props) {
  const [view, setView] = useState<"health" | "runs">("health");
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
    const [range, setRange] = useState<"today" | "7d" | "30d">("30d");

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
        return (
          now.getTime() - d.getTime() <= 7 * 24 * 60 * 60 * 1000
        );
      }

      return (
        now.getTime() - d.getTime() <= 30 * 24 * 60 * 60 * 1000
      );
    });
  }, [jobs, range]);
  return (
    <div className="space-y-4">
      <JobsHeader range={range} onChange={setRange} />
      <JobsKPIs jobs={filteredJobs} />
      <JobsControls view={view} onChange={setView} />
      <JobsTable view={view} jobs={filteredJobs} loading={loading} />
    </div>
  );
}
