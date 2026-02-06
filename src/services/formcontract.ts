/* eslint-disable @typescript-eslint/no-explicit-any */
import dayjs from "dayjs";
import { baseUrl } from "../utils/baseUrl";

// ---------------- TYPES ----------------
export interface DropdownOption {
  id: string;
  name: string;
}

// ---------------- GET ACCOUNT ID ----------------
const getAccountId = (): string => {
  const user = JSON.parse(
    localStorage.getItem("user") || sessionStorage.getItem("user") || "{}",
  );

  return user?.activeAccountId || "";
};

// ---------------- COMMON FETCH OPTIONS ----------------
const fetchOptions: RequestInit = {
  method: "GET",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
};

// ---------------- GET DROPDOWNS ----------------
export const fetchAreas = async (): Promise<DropdownOption[]> => {
  const accountId = getAccountId();

  const res = await fetch(
    `${baseUrl()}/api/BusinessArea/${accountId}/BusinessArea`,
    fetchOptions,
  );

  if (!res.ok) throw new Error("Failed to fetch areas");

  return res.json();
};

export const fetchTypes = async (): Promise<DropdownOption[]> => {
  const accountId = getAccountId();

  const res = await fetch(
    `${baseUrl()}/api/Admin/${accountId}/ArcheType`,
    fetchOptions,
  );

  if (!res.ok) throw new Error("Failed to fetch contract types");

  return res.json();
};

export const fetchCompanies = async (): Promise<DropdownOption[]> => {
  const accountId = getAccountId();

  const res = await fetch(
    `${baseUrl()}/api/Company/${accountId}/Company`,
    fetchOptions,
  );

  if (!res.ok) throw new Error("Failed to fetch companies");

  return res.json();
};

export const fetchCounterparties = async (): Promise<DropdownOption[]> => {
  const accountId = getAccountId();

  const res = await fetch(
    `${baseUrl()}/api/Relationship/${accountId}/Counterparty`,
    fetchOptions,
  );

  if (!res.ok) throw new Error("Failed to fetch counterparties");

  return res.json();
};

export const fetchOwners = async (): Promise<DropdownOption[]> => {
  const accountId = getAccountId();

  const res = await fetch(
    `${baseUrl()}/api/Admin/${accountId}/User`,
    fetchOptions,
  );

  if (!res.ok) throw new Error("Failed to fetch owners");

  return res.json();
};

// ---------------- POST CONTRACT ----------------
export const createContract = async (values: any, files: File[]) => {
  const accountId = getAccountId();

  const formData = new FormData();

  Object.keys(values).forEach((key) => {
    let value = values[key];

    if (dayjs.isDayjs(value)) {
      value = value.format("YYYY-MM-DD");
    }

    formData.append(key, value ?? "");
  });

  files.forEach((file) => {
    formData.append("documents", file);
  });

  const res = await fetch(
    `${baseUrl()}/api/Contract/${accountId}/CreateContract`,
    {
      method: "POST",
      credentials: "include", // ⭐ IMPORTANT
      body: formData,
    },
  );

  if (!res.ok) throw new Error("Failed to create contract");

  return res.json();
};
