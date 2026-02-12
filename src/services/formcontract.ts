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
const buildFieldsPayload = (values: any) => {
  return [
    { FieldName: "BusinessArea", FieldValue: values.area, FieldType: "text" },
    { FieldName: "Type", FieldValue: values.type, FieldType: "text" },
    { FieldName: "Title", FieldValue: values.title, FieldType: "text" },
    { FieldName: "ContractNumber", FieldValue: values.number, FieldType: "text" },
    { FieldName: "Counterparty", FieldValue: values.counterparty, FieldType: "text" },
    { FieldName: "CompanyName", FieldValue: values.company, FieldType: "text" },
    { FieldName: "OriginatingParty", FieldValue: values.originatingParty, FieldType: "text" },
    { FieldName: "TermType", FieldValue: values.termType, FieldType: "text" },

    {
      FieldName: "StartDate",
      FieldValue: dayjs(values.startDate).format("YYYY-MM-DDT00:00:00.000Z"),
      FieldType: "date",
    },
    {
      FieldName: "EndDate",
      FieldValue: dayjs(values.endDate).format("YYYY-MM-DDT00:00:00.000Z"),
      FieldType: "date",
    },

    {
      FieldName: "RenewalNoticePeriodDays",
      FieldValue: values.noticePeriodValue,
      FieldType: "number",
    },
    {
      FieldName: "RenewalNoticePeriodUnit",
      FieldValue: values.noticePeriodUnit,
      FieldType: "text",
    },

    {
      FieldName: "Value",
      FieldValue: values.totalValueAmount,
      FieldType: "number",
    },
    {
      FieldName: "Currency",
      FieldValue: values.totalValueCurrency,
      FieldType: "text",
    },
  ];
};

export const createContract = async (values: any, files: File[]) => {
  const accountId = getAccountId();
  const formData = new FormData();

  formData.append("PartitionKey", accountId);
  formData.append("UserName", "Optimus"); // or from auth

  const fieldsPayload = buildFieldsPayload(values);

  // IMPORTANT: stringify Fields
  formData.append("Fields", JSON.stringify(fieldsPayload));

  // Files must be appended as "Files"
  files.forEach((file) => {
    formData.append("Files", file);
  });

  const res = await fetch(
    `${baseUrl()}/api/Contract/${accountId}/CreateContract`,
    {
      method: "POST",
      credentials: "include",
      body: formData,
    },
  );

  if (!res.ok) throw new Error("Failed to create contract");
  return res.json();
};
