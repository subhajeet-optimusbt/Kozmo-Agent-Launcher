/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useMemo, useEffect } from "react";
import type { Contract } from "../constants/apps";

export function useContractsPagination(data: Contract[]) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const total = data.length;
  const totalPages = Math.ceil(total / pageSize);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [page, totalPages]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, page, pageSize]);

  return {
    page,
    pageSize,
    total,
    setPage,
    setPageSize,
    paginatedData,
  };
}
