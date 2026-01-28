export const ACCOUNT_CHANGED_EVENT = "account-changed";

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

export const setActiveAccountId = (accountId: string) => {
  const storage = localStorage.getItem("user")
    ? localStorage
    : sessionStorage;

  const raw = storage.getItem("user");
  if (!raw) return;

  const user = JSON.parse(raw);
  user.activeAccountId = accountId;

  storage.setItem("user", JSON.stringify(user));

  // 🔥 notify whole app
  window.dispatchEvent(new Event(ACCOUNT_CHANGED_EVENT));
};
