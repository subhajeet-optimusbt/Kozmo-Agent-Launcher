import { useState, useMemo } from "react";
import { Button, Input, Tooltip, Select, Divider, Drawer, Badge } from "antd";
import { LayoutGrid, List, CreditCard, Filter, RotateCcw } from "lucide-react";

import type { Intake } from "../../../constants/apps";
import { usePagination } from "../../../hooks/pagination";

import IntakeTableView from "../../../components/intake/IntakeTableView";
import IntakeListView from "../../../components/intake/IntakeListView";
import IntakeCardView from "../../../components/intake/IntakeCardView";
import IntakePreviewDrawer from "../../../components/intake/IntakePreviewDrawer";
import PaginationControl from "../../../components/PaginationControl";

type View = "table" | "list" | "card";

type Sorter = {
  field?: keyof Intake;
  order?: "ascend" | "descend";
};

type Filters = {
  Status: string[];
  subject: string[];
  currentJobName: string[];
  RequestId: string[];
};

export default function IntakeTable({ intake }: { intake: Intake[] }) {
  const [view, setView] = useState<View>("table");
  const [activeIntake, setActiveIntake] = useState<Intake | null>(null);

  const [search, setSearch] = useState("");
  const [sorter, setSorter] = useState<Sorter>({});
  const [filters, setFilters] = useState<Filters>({
    Status: [],
    subject: [],
    currentJobName: [],
    RequestId: [],
  });

  const [filterOpen, setFilterOpen] = useState(false);

  /* ---------------- reset pagination when data changes ---------------- */
  // useEffect(() => {
  //   setPage(1);
  // }, [renewals]);

  /* ---------------- sorting ---------------- */
  const sortedIntake = useMemo(() => {
    if (!sorter.field || !sorter.order) return intake;

    return [...intake].sort((a, b) => {
      const aVal = a[sorter.field!];
      const bVal = b[sorter.field!];

      if (aVal < bVal) return sorter.order === "ascend" ? -1 : 1;
      if (aVal > bVal) return sorter.order === "ascend" ? 1 : -1;
      return 0;
    });
  }, [intake, sorter]);

  /* ---------------- search ---------------- */
  const searchedIntake = useMemo(() => {
    if (!search) return sortedIntake;

    const q = search.toLowerCase();
    return sortedIntake.filter((c) =>
      `${c.subject} ${c.currentJobName} ${c.noOfDocuments} ${c.RequestId}`
        .toLowerCase()
        .includes(q),
    );
  }, [search, sortedIntake]);
  /* ---------------- filters ---------------- */
  const filteredIntake = useMemo(() => {
    return searchedIntake.filter((c) => {
      if (filters.Status.length && !filters.Status.includes(c.Status))
        return false;
      if (filters.subject.length && !filters.subject.includes(c.subject))
        return false;
      if (
        filters.currentJobName.length &&
        !filters.currentJobName.includes(c.currentJobName)
      )
        if (
        filters.RequestId.length &&
        !filters.RequestId.includes(c.RequestId)
      )
        return false;
      return true;
    });
  }, [searchedIntake, filters]);

  /* ---------------- pagination ---------------- */
  const { paginatedData, page, pageSize, total, setPage, setPageSize } =
    usePagination<Intake>(filteredIntake);

  const activeFilterCount =
    filters.Status.length +
    filters.subject.length +
    filters.currentJobName.length;

  return (
    <div className="space-y-4">
      {/* ---------------- TOP TOOLBAR ---------------- */}
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <Input.Search
            placeholder="Search intake, counterparties, clauses…"
            className="w-[340px]"
            allowClear
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />

          <Button
            icon={<Filter size={16} />}
            className="rounded-xl font-medium"
            onClick={() => setFilterOpen(true)}
          >
            Filters & Facets
            {activeFilterCount > 0 && (
              <Badge
                count={activeFilterCount}
                size="small"
                className="ml-2"
                style={{ backgroundColor: "#6366f1" }}
              />
            )}
          </Button>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Rows</span>
          <Select
            value={pageSize}
            className="w-[90px]"
            onChange={(s) => {
              setPageSize(s);
              setPage(1);
            }}
            options={[
              { value: 10, label: "10" },
              { value: 12, label: "12" },
              { value: 20, label: "20" },
            ]}
          />
        </div>

        <Button.Group className="shadow-sm rounded-xl overflow-hidden">
          <Tooltip title="Table view">
            <Button
              type={view === "table" ? "primary" : "default"}
              onClick={() => setView("table")}
            >
              <LayoutGrid size={16} /> Table
            </Button>
          </Tooltip>
          <Tooltip title="Compact view">
            <Button
              type={view === "list" ? "primary" : "default"}
              onClick={() => setView("list")}
            >
              <List size={16} /> Compact
            </Button>
          </Tooltip>
          <Tooltip title="Card view">
            <Button
              type={view === "card" ? "primary" : "default"}
              onClick={() => setView("card")}
            >
              <CreditCard size={16} /> Card
            </Button>
          </Tooltip>
        </Button.Group>
      </div>

      <Divider className="my-2" />

      {view === "table" && (
        <IntakeTableView
          data={paginatedData}
          sorter={sorter}
          onSortChange={setSorter}
          onSelect={setActiveIntake}
        />
      )}

      {view === "list" && (
        <IntakeListView data={paginatedData} onSelect={setActiveIntake} />
      )}

      {view === "card" && (
        <IntakeCardView data={paginatedData} onSelect={setActiveIntake} />
      )}

      {total > 0 && (
        <div className="pb-4 flex justify-center">
          <PaginationControl
            page={page}
            pageSize={pageSize}
            total={total}
            onPageChange={setPage}
          />
        </div>
      )}

      <IntakePreviewDrawer
        intake={activeIntake}
        onClose={() => setActiveIntake(null)}
      />

      {/* FILTER DRAWER (unchanged UI logic) */}
      <Drawer
        placement="right"
        width={380}
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        closable={false}
        styles={{ body: { padding: 0 } }}
      >
        {/* keep your existing filter UI here */}
        {/* Header */}
        <div className="px-6 py-2 border-b bg-gradient-to-r from-emerald-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
              <Filter size={18} />
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-900">
                Filters & Facets
              </div>
              <div className="text-xs text-gray-500">Narrow down contracts</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-2">
          {/* Status */}
          <div className="rounded-xl border bg-white shadow-sm p-2">
            <FilterSection
              title="Status"
              options={["Completed", "Failed", "Signed", "NotStarted"]}
              value={filters.Status}
              onChange={(v) => setFilters((f) => ({ ...f, Status: v }))}
            />
          </div>

          {/* Contract Type */}
          <div className="rounded-xl border bg-white shadow-sm p-4">
            <FilterSection
              title="Contract Type"
              options={["All"]}
              value={filters.subject}
              onChange={(v) => setFilters((f) => ({ ...f, type: v }))}
            />
          </div>

          {/* Business Area */}
          <div className="rounded-xl border bg-white shadow-sm p-4">
            <FilterSection
              title="Business Area"
              options={["All"]}
              value={filters.currentJobName}
              onChange={(v) => setFilters((f) => ({ ...f, area: v }))}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 border-t bg-white px-6 py-4">
          <div className="flex gap-3">
            <Button
              icon={<RotateCcw size={16} />}
              className="flex-1"
              onClick={() =>
                setFilters({ Status: [], subject: [], currentJobName: [], RequestId: [] })
              }
            >
              Clear all
            </Button>

            <Button
              type="primary"
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              onClick={() => setFilterOpen(false)}
            >
              Apply
            </Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
}

function FilterSection({
  title,
  options,
  value,
  onChange,
}: {
  title: string;
  options: string[];
  value: string[];
  onChange: (v: string[]) => void;
}) {
  return (
    <div className="mb-6">
      <h4 className="mb-3 font-semibold">{title}</h4>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = value.includes(opt);
          return (
            <Button
              key={opt}
              size="small"
              type={active ? "primary" : "default"}
              className="rounded-full"
              onClick={() =>
                onChange(
                  active ? value.filter((v) => v !== opt) : [...value, opt],
                )
              }
            >
              {opt}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
