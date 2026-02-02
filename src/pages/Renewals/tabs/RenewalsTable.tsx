import { useState, useMemo } from "react";
import { Button, Input, Tooltip, Select, Divider, Drawer, Badge } from "antd";
import { LayoutGrid, List, CreditCard, Filter } from "lucide-react";

import type { Renewal } from "../../../constants/apps";
import { useRenewalsPagination } from "../../../hooks/pagination";

import RenewalsTableView from "../../../components/renewals/RenewalsTableView";
import RenewalsListView from "../../../components/renewals/RenewalsListView";
import RenewalsCardView from "../../../components/renewals/RenewalsCardView";
import RenewalsPreviewDrawer from "../../../components/renewals/RenewalsPreviewDrawer";
import PaginationControl from "../../../components/PaginationControl";

type View = "table" | "list" | "card";

type Sorter = {
  field?: keyof Renewal;
  order?: "ascend" | "descend";
};

type Filters = {
  status: string[];
  type: string[];
  area: string[];
};

export default function RenewalsTable({
  renewals,
}: {
  renewals: Renewal[];
}) {
  const [view, setView] = useState<View>("table");
  const [activeRenewal, setActiveRenewal] = useState<Renewal | null>(null);

  const [search, setSearch] = useState("");
  const [sorter, setSorter] = useState<Sorter>({});
  const [filters] = useState<Filters>({
    status: [],
    type: [],
    area: [],
  });

  const [filterOpen, setFilterOpen] = useState(false);

  /* ---------------- reset pagination when data changes ---------------- */
  // useEffect(() => {
  //   setPage(1);
  // }, [renewals]);

  /* ---------------- sorting ---------------- */
  const sortedRenewals = useMemo(() => {
    if (!sorter.field || !sorter.order) return renewals;

    return [...renewals].sort((a, b) => {
      const aVal = a[sorter.field!];
      const bVal = b[sorter.field!];

      if (aVal < bVal) return sorter.order === "ascend" ? -1 : 1;
      if (aVal > bVal) return sorter.order === "ascend" ? 1 : -1;
      return 0;
    });
  }, [renewals, sorter]);

  /* ---------------- search ---------------- */
  const searchedRenewals = useMemo(() => {
    if (!search) return sortedRenewals;

    const q = search.toLowerCase();
    return sortedRenewals.filter((c) =>
      `${c.title} ${c.businessArea} ${c.counterparty} ${c.owner}`
        .toLowerCase()
        .includes(q),
    );
  }, [search, sortedRenewals]);

  /* ---------------- filters ---------------- */
  const filteredRenewals = useMemo(() => {
    return searchedRenewals.filter((c) => {
      if (filters.status.length && !filters.status.includes(c.renewalStatus))
        return false;
      if (filters.type.length && !filters.type.includes(c.type))
        return false;
      if (filters.area.length && !filters.area.includes(c.area))
        return false;
      return true;
    });
  }, [searchedRenewals, filters]);

  /* ---------------- pagination ---------------- */
  const { paginatedData, page, pageSize, total, setPage, setPageSize } =
    useRenewalsPagination(filteredRenewals);

  const activeFilterCount =
    filters.status.length + filters.type.length + filters.area.length;

  return (
    <div className="space-y-4">
      {/* ---------------- TOP TOOLBAR ---------------- */}
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <Input.Search
            placeholder="Search renewals, counterparties, clauses…"
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
        <RenewalsTableView
          data={paginatedData}
          sorter={sorter}
          onSortChange={setSorter}
          onSelect={setActiveRenewal}
        />
      )}

      {view === "list" && (
        <RenewalsListView
          data={paginatedData}
          onSelect={setActiveRenewal}
        />
      )}

      {view === "card" && (
        <RenewalsCardView
          data={paginatedData}
          onSelect={setActiveRenewal}
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

      <RenewalsPreviewDrawer
        renewal={activeRenewal}
        onClose={() => setActiveRenewal(null)}
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
      </Drawer>
    </div>
  );
}
