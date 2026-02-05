import { useState, useMemo } from "react";
import { Button, Input, Tooltip, Select, Divider, Drawer, Badge } from "antd";
import { LayoutGrid, List, CreditCard, Filter, RotateCcw } from "lucide-react";

import type { Relationships } from "../../../constants/apps";
import { usePagination } from "../../../hooks/pagination";

import RelationshipsTableView from "../../../components/relationships/RelationshipsTableView";
import RelastionshipsListView from "../../../components/relationships/RelationshipsListView";
import RelationshipsCardView from "../../../components/relationships/RelationshipsCardView";
import RelationshipsPreviewDrawer from "../../../components/relationships/RelationshipsPreviewDrawer";
import PaginationControl from "../../../components/PaginationControl";

type View = "table" | "list" | "card";

type Sorter = {
  field?: keyof Relationships;
  order?: "ascend" | "descend";
};

type Filters = {
  status: string[];
  category: string[];
};

export default function RelationshipsTable({
  relationships,
}: {
  relationships: Relationships[];
}) {
  const [view, setView] = useState<View>("table");
  const [activeRelationships, setActiveRelationships] =
    useState<Relationships | null>(null);

  const [search, setSearch] = useState("");
  const [sorter, setSorter] = useState<Sorter>({});
  const [filters, setFilters] = useState<Filters>({
    status: ["All"],
    category: ["All"],
  });

  const [filterOpen, setFilterOpen] = useState(false);

  /* ---------------- reset pagination when data changes ---------------- */
  // useEffect(() => {
  //   setPage(1);
  // }, [renewals]);

  /* ---------------- sorting ---------------- */
  const sortedRelationships = useMemo(() => {
    if (!sorter.field || !sorter.order) return relationships;

    return [...relationships].sort((a, b) => {
      const aVal = a[sorter.field!];
      const bVal = b[sorter.field!];

      if (aVal < bVal) return sorter.order === "ascend" ? -1 : 1;
      if (aVal > bVal) return sorter.order === "ascend" ? 1 : -1;
      return 0;
    });
  }, [relationships, sorter]);

  /* ---------------- search ---------------- */
  const searchedRelationships = useMemo(() => {
    if (!search) return sortedRelationships;

    const q = search.toLowerCase();
    return sortedRelationships.filter((r) =>
      `${r.displayName} ${r.legalName}`.toLowerCase().includes(q),
    );
  }, [search, sortedRelationships]);

  /* ---------------- filters ---------------- */
  const filteredRelationships = useMemo(() => {
    return searchedRelationships.filter((c) => {
      // STATUS
      if (
        filters.status.length &&
        !filters.status.includes("All") &&
        !filters.status.includes(c.status)
      ) {
        return false;
      }

      if (
        filters.category.length &&
        !filters.category.includes("All") &&
        !filters.category.includes(c.category)
      ) {
        return false;
      }
      return true;
    });
  }, [searchedRelationships, filters]);

  /* ---------------- pagination ---------------- */
  const { paginatedData, page, pageSize, total, setPage, setPageSize } =
    usePagination<Relationships>(filteredRelationships);

  const activeFilterCount =
    (filters.status.includes("All") ? 0 : filters.status.length) +
    (filters.category.includes("All") ? 0 : filters.category.length);

  /* ---------------- FACET OPTIONS ---------------- */
  const statusOptions = useMemo(() => {
    const set = new Set<string>();
    relationships.forEach((d) => d.status && set.add(d.status));
    return ["All", ...Array.from(set)];
  }, [relationships]);

  const categoryOptions = useMemo(() => {
    const set = new Set<string>();
    relationships.forEach((r) => r.category && set.add(r.category));
    return ["All", ...Array.from(set)];
  }, [relationships]);

  return (
    <div className="space-y-4">
      {/* ---------------- TOP TOOLBAR ---------------- */}
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <Input.Search
            placeholder="Search relationships...."
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
        <RelationshipsTableView
          data={paginatedData}
          sorter={sorter}
          onSortChange={setSorter}
          onSelect={setActiveRelationships}
        />
      )}

      {view === "list" && (
        <RelastionshipsListView
          data={paginatedData}
          onSelect={setActiveRelationships}
        />
      )}

      {view === "card" && (
        <RelationshipsCardView
          data={paginatedData}
          onSelect={setActiveRelationships}
        />
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

      <RelationshipsPreviewDrawer
        relationships={activeRelationships}
        onClose={() => setActiveRelationships(null)}
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
        <div className="px-6 py-4 space-y-4">
          {/* Status */}
          <div className="rounded-xl border bg-white shadow-sm p-4">
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

          {/* Category */}
          <div className="rounded-xl border bg-white shadow-sm p-4">
            <FilterSection
              title="Category"
              options={categoryOptions}
              value={filters.category}
              onChange={(v) =>
                setFilters((f) => ({
                  ...f,
                  category: v.includes("All") ? ["All"] : v,
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
                setFilters({
                  status: ["All"],
                  category: ["All"],
                })
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
