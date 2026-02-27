export const formatCurrency = (value: number | undefined): string => {
  if (!value && value !== 0) return "$0";

  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(2)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`;
  }
  return `$${value.toFixed(2)}`;
};

export const getRiskColor = (
  daysLeft: number
): "red" | "yellow" | "green" => {
  if (daysLeft <= 7) return "red";
  if (daysLeft <= 30) return "yellow";
  return "green";
};

export const formatContractStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    Active: "Active",
    Signed: "Signed",
    Expired: "Expired",
    "In Review": "In Review",
    "Pending Signature": "Pending Signature",
  };
  return statusMap[status] || status;
};

export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const getDaysRemaining = (endDate: string): number => {
  const end = new Date(endDate);
  const now = new Date();
  return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
};