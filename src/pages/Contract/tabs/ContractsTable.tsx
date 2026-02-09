/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useMemo } from "react";
import { Button, Input, Tooltip, Select, Divider, Drawer, Badge } from "antd";
import {
  LayoutGrid,
  List,
  CreditCard,
  Filter,
  RotateCcw,
  Briefcase,
} from "lucide-react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { fetchContracts } from "../../../services/contractsService";
import { mapContractsFromApi } from "../../../constants/apps";
import FullscreenLoader from "../../../components/ui/FullScreenLoader";
import { getActiveAccountId, ACCOUNT_CHANGED_EVENT } from "../../../utils/auth";
import type { Contract } from "../../../constants/apps";
import { useContractsPagination } from "../../../hooks/pagination";

import ContractTableView from "../../../components/contract/ContractTableView";
import ContractListView from "../../../components/contract/ContractListView";
import ContractCardView from "../../../components/contract/ContractCardView";
import ContractPreviewDrawer from "../../../components/contract/ContractPreviewDrawer";
import PaginationControl from "../../../components/PaginationControl";
import Portfolio from "../../../components/contract/Portfolio";
type View = "table" | "list" | "card";

type Sorter = {
  field?: keyof Contract;
  order?: "ascend" | "descend";
};

type Filters = {
  status: string[];
  type: string[];
  area: string[];
};

export default function ContractsPage() {
  const [view, setView] = useState<View>("table");
  const [activeContract, setActiveContract] = useState<Contract | null>(null);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [sorter, setSorter] = useState<Sorter>({});
  const [filters, setFilters] = useState<Filters>({
    status: [],
    type: [],
    area: [],
  });

  const [filterOpen, setFilterOpen] = useState(false);
  const [accountId, setAccountId] = useState(getActiveAccountId());
  const [showPortfolio, setShowPortfolio] = useState(false);
  /* ---------------- account change ---------------- */
  useEffect(() => {
    const handler = () => {
      setAccountId(getActiveAccountId());

      setContracts([]); // 👈 IMPORTANT
      setSearch("");
      setSorter({});
      setFilters({ status: [], type: [], area: [] });
      setActiveContract(null);
      setPage(1); // 👈 reset pagination
    };

    window.addEventListener(ACCOUNT_CHANGED_EVENT, handler);
    return () => window.removeEventListener(ACCOUNT_CHANGED_EVENT, handler);
  }, []);

  /* ---------------- load contracts ---------------- */
  useEffect(() => {
    if (!accountId) return;

    const loadContracts = async () => {
      setLoading(true);
      try {
        const apiData = await fetchContracts(accountId);
        const normalized = Array.isArray(apiData) ? apiData : [];
        setContracts(mapContractsFromApi(normalized));
      } finally {
        setLoading(false);
      }
    };

    loadContracts();
  }, [accountId]);

  useEffect(() => {
    setPage(1);
  }, [contracts]);

  /* ---------------- sorting ---------------- */
  const sortedContracts = useMemo(() => {
    if (!sorter.field || !sorter.order) return contracts;

    return [...contracts].sort((a, b) => {
      const aVal = a[sorter.field!];
      const bVal = b[sorter.field!];

      if (aVal < bVal) return sorter.order === "ascend" ? -1 : 1;
      if (aVal > bVal) return sorter.order === "ascend" ? 1 : -1;
      return 0;
    });
  }, [contracts, sorter]);

  /* ---------------- search ---------------- */
  const searchedContracts = useMemo(() => {
    if (!search) return sortedContracts;

    const q = search.toLowerCase();
    return sortedContracts.filter((c) =>
      `${c.title} ${c.company} ${c.counterparty} ${c.type} ${c.area}`
        .toLowerCase()
        .includes(q),
    );
  }, [search, sortedContracts]);

  /* ---------------- filters ---------------- */
  const filteredContracts = useMemo(() => {
    return searchedContracts.filter((c) => {
      if (filters.status.length && !filters.status.includes(c.status))
        return false;
      if (filters.type.length && !filters.type.includes(c.type)) return false;
      if (filters.area.length && !filters.area.includes(c.area)) return false;
      return true;
    });
  }, [searchedContracts, filters]);

  /* ---------------- pagination ---------------- */
  const { paginatedData, page, pageSize, total, setPage, setPageSize } =
    useContractsPagination(filteredContracts);

  const activeFilterCount =
    filters.status.length + filters.type.length + filters.area.length;

  return (
    <div className="space-y-4">
      {loading && <FullscreenLoader />}
      {showPortfolio ? (
        <div className="space-y-1">
          {/* -------- PAGE HEADER (SAME AS CONTRACTS STYLE) -------- */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600">
                <Briefcase size={18} />
              </div>

              <div className="leading-tight">
                <div className="text-lg font-semibold text-gray-900">
                  Portfolio
                </div>
                <div className="text-xs text-gray-500">
                  Value vs Criticality overview
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowPortfolio(false)}
              className=" flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 transition-all duration-200 hover:bg-emerald-100 hover:border-emerald-300 hover:-translate-y-[1px] active:translate-y-0 "
            >
              {" "}
              <ArrowLeftOutlined /> Back{" "}
            </button>{" "}
          </div>

          <Divider className="my-2" />

          {/* -------- PORTFOLIO CONTENT -------- */}
          <Portfolio />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between gap-6">
            {/* Search + Filters */}
            <div className="flex items-center gap-3">
              <Input.Search
                placeholder="Search contracts, counterparties, clauses…"
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
              <Button
                onClick={() => setShowPortfolio(true)}
                className="
    px-5 py-2.5
    rounded-xl
    font-medium
    text-white
    bg-gradient-to-r from-indigo-500 to-purple-600
    hover:from-indigo-600 hover:to-purple-700
    shadow-md hover:shadow-lg
    transition-all duration-200
    active:scale-95
  "
              >
                <Briefcase size={18} />
                Portfolio
              </Button>
            </div>

            {/* Page size */}
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

            {/* View switch */}
            <Button.Group className="shadow-sm rounded-xl overflow-hidden">
              <Tooltip title="Table view">
                <Button
                  type={view === "table" ? "primary" : "default"}
                  onClick={() => setView("table")}
                >
                  <LayoutGrid size={16} />
                  Table
                </Button>
              </Tooltip>
              <Tooltip title="Compact view">
                <Button
                  type={view === "list" ? "primary" : "default"}
                  onClick={() => setView("list")}
                >
                  <List size={16} />
                  Compact
                </Button>
              </Tooltip>
              <Tooltip title="Card view">
                <Button
                  type={view === "card" ? "primary" : "default"}
                  onClick={() => setView("card")}
                >
                  <CreditCard size={16} />
                  Card
                </Button>
              </Tooltip>
            </Button.Group>
          </div>

          <Divider className="my-2" />

          {/* ---------------- CONTENT ---------------- */}
          {view === "table" && (
            <ContractTableView
              data={paginatedData}
              sorter={sorter}
              onSortChange={setSorter}
              onSelect={setActiveContract}
            />
          )}

          {view === "list" && (
            <ContractListView
              data={paginatedData}
              onSelect={setActiveContract}
            />
          )}

          {view === "card" && (
            <ContractCardView
              data={paginatedData}
              onSelect={setActiveContract}
            />
          )}

          {/* ---------------- PAGINATION ---------------- */}
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
        </>
      )}

      {/* ---------------- PREVIEW DRAWER ---------------- */}
      <ContractPreviewDrawer
        contract={activeContract}
        onClose={() => setActiveContract(null)}
      />

      <Drawer
        placement="right"
        width={380}
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        closable={false}
        styles={{
          body: { padding: 0 },
        }}
      >
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
              options={["Active", "Inactive", "Signed", "Terminated"]}
              value={filters.status}
              onChange={(v) => setFilters((f) => ({ ...f, status: v }))}
            />
          </div>

          {/* Contract Type */}
          <div className="rounded-xl border bg-white shadow-sm p-4">
            <FilterSection
              title="Contract Type"
              options={[
                "Dealer Agreement",
                "Lease",
                "MSA",
                "NDA",
                "SOW",
                "Sales Agreement",
                "Supply",
              ]}
              value={filters.type}
              onChange={(v) => setFilters((f) => ({ ...f, type: v }))}
            />
          </div>

          {/* Business Area */}
          <div className="rounded-xl border bg-white shadow-sm p-4">
            <FilterSection
              title="Business Area"
              options={[
                "Analytics",
                "Banking",
                "Commercial",
                "Data",
                "Engineering",
                "Finance",
                "IT",
                "Legal",
                "Risk",
                "Sales",
              ]}
              value={filters.area}
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
              onClick={() => setFilters({ status: [], type: [], area: [] })}
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

  /* ---------------- Filter Pill Section ---------------- */
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
}
