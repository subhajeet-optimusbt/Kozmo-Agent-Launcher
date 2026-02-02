/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useMemo, useEffect } from "react";
import type { Contract } from "../constants/apps";
import type { Renewal } from "../constants/apps";

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

export function useRenewalsPagination(data: Renewal[]) {
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


// export function useIntakePagination(data: Intake[]) {
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);

//   const total = data.length;
//   const totalPages = Math.ceil(total / pageSize);

//   useEffect(() => {
//     if (page > totalPages) setPage(1);
//   }, [page, totalPages]);

//   const paginatedData = useMemo(() => {
//     const start = (page - 1) * pageSize;
//     return data.slice(start, start + pageSize);
//   }, [data, page, pageSize]);

//   return {
//     page,
//     pageSize,
//     total,
//     setPage,
//     setPageSize,
//     paginatedData,
//   };
// }


export function usePagination<T>(data: T[]) {
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