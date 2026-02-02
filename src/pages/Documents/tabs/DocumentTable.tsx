import { useState, useMemo } from "react";
import { Button, Input, Tooltip, Select, Divider, Drawer, Badge } from "antd";
import { LayoutGrid, List, CreditCard, Filter, RotateCcw } from "lucide-react";

import type { Document } from "../../../constants/apps";
import { usePagination } from "../../../hooks/pagination";

import DocumentTableView from "../../../components/document/DocumentTableView";
import DocumentListView from "../../../components/document/DocumentListView";
import DocumentCardView from "../../../components/document/DocumentCardView";
import DocumentPreviewDrawer from "../../../components/document/DocumentPreviewDrawer";
import PaginationControl from "../../../components/PaginationControl";

type View = "table" | "list" | "card";

type Sorter = {
  field?: keyof Document;
  order?: "ascend" | "descend";
};

type Filters = {
  status: string[];
  subject: string[];
  currentJobName: string[];
};

export default function DocumentTable({ document }: { document: Document[] }) {
  const [view, setView] = useState<View>("table");
  const [activeDocument, setActiveDocument] = useState<Document | null>(null);

  const [search, setSearch] = useState("");
  const [sorter, setSorter] = useState<Sorter>({});
const [filters, setFilters] = useState<Filters>({
  status: ["All"],
  subject: [],
  currentJobName: ["All"],
});

  const [filterOpen, setFilterOpen] = useState(false);

  /* ---------------- reset pagination when data changes ---------------- */
  // useEffect(() => {
  //   setPage(1);
  // }, [renewals]);

  /* ---------------- sorting ---------------- */
  const sortedDocument = useMemo(() => {
    if (!sorter.field || !sorter.order) return document;

    return [...document].sort((a, b) => {
      const aVal = a[sorter.field!];
      const bVal = b[sorter.field!];

      if (aVal < bVal) return sorter.order === "ascend" ? -1 : 1;
      if (aVal > bVal) return sorter.order === "ascend" ? 1 : -1;
      return 0;
    });
  }, [document, sorter]);

  /* ---------------- search ---------------- */
  const searchedDocument = useMemo(() => {
    if (!search) return sortedDocument;

    const q = search.toLowerCase();
    return sortedDocument.filter((c) =>
      `${c.subject} ${c.currentJobName}`.toLowerCase().includes(q),
    );
  }, [search, sortedDocument]);

  /* ---------------- filters ---------------- */
  const filteredDocument = useMemo(() => {
    return searchedDocument.filter((c) => {
      // STATUS
      if (
        filters.status.length &&
        !filters.status.includes("All") &&
        !filters.status.includes(c.status)
      ) {
        return false;
      }

      // CURRENT JOB
      if (
        filters.currentJobName.length &&
        !filters.currentJobName.includes("All") &&
        !filters.currentJobName.includes(c.currentJobName)
      ) {
        return false;
      }

      return true;
    });
  }, [searchedDocument, filters]);

  /* ---------------- pagination ---------------- */
  const { paginatedData, page, pageSize, total, setPage, setPageSize } =
    usePagination<Document>(filteredDocument);

  const activeFilterCount =
    filters.status.length +
    filters.subject.length +
    filters.currentJobName.length;

  /* ---------------- FACET OPTIONS ---------------- */
  const statusOptions = useMemo(() => {
    const set = new Set<string>();
    document.forEach((d) => d.status && set.add(d.status));
    return ["All", ...Array.from(set)];
  }, [document]);

  const jobOptions = useMemo(() => {
    const set = new Set<string>();
    document.forEach((d) => {
      if (d.currentJobName && d.currentJobName !== "N/A") {
        set.add(d.currentJobName);
      }
    });
    return ["All", ...Array.from(set)];
  }, [document]);

  return (
    <div className="space-y-4">
      {/* ---------------- TOP TOOLBAR ---------------- */}
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <Input.Search
            placeholder="Search documents…"
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
        <DocumentTableView
          data={paginatedData}
          sorter={sorter}
          onSortChange={setSorter}
          onSelect={setActiveDocument}
        />
      )}

      {view === "list" && (
        <DocumentListView data={paginatedData} onSelect={setActiveDocument} />
      )}

      {view === "card" && (
        <DocumentCardView data={paginatedData} onSelect={setActiveDocument} />
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

      <DocumentPreviewDrawer
        document={activeDocument}
        onClose={() => setActiveDocument(null)}
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
              <div className="text-xs text-gray-500">Narrow down documents</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-2">
          {/* Status */}
          <div className="rounded-xl border bg-white shadow-sm p-2">
            <FilterSection
              title="Status"
              options={statusOptions}
              value={filters.status}
              onChange={(v) =>
                setFilters((f) => ({
                  ...f,
                  status: v.includes("All") ? ["All"] : v,
                }))
              }
            />
          </div>

          <div className="rounded-xl border bg-white shadow-sm p-4">
            <FilterSection
              title="Current Job"
              options={jobOptions}
              value={filters.currentJobName}
              onChange={(v) =>
                setFilters((f) => ({
                  ...f,
                  currentJobName: v.includes("All") ? ["All"] : v,
                }))
              }
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
                setFilters({ status: [], subject: [], currentJobName: [] })
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
    <div>
      <h4 className="mb-3 font-semibold text-gray-800">{title}</h4>

      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = value.includes(opt);

          return (
            <Button
              key={opt}
              size="small"
              type={active ? "primary" : "default"}
              className="rounded-full px-4"
              onClick={() => {
                if (opt === "All") {
                  onChange(["All"]);
                } else {
                  const next = active
                    ? value.filter((v) => v !== opt)
                    : [...value.filter((v) => v !== "All"), opt];

                  onChange(next);
                }
              }}
            >
              {opt}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
