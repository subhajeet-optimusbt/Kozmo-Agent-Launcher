export default function JobsHeader() {
  return (
    <div className="flex justify-between items-start">
      <div>
        <h1 className="text-xl font-semibold">Jobs</h1>
        <p className="text-sm text-gray-500">
          Grouped health by JobType. Click any row to drill into runs.
        </p>
      </div>
    </div>
  );
}
