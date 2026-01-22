// src/utils/auth.ts
export const getActiveAccountId = () => {
  const raw = localStorage.getItem("user") || sessionStorage.getItem("user");
  if (!raw) return null;

  try {
    const user = JSON.parse(raw);
    return user.activeAccountId;
  } catch {
    return null;
  }
};
