import { Outlet } from "react-router-dom";
import { getActiveAccountId } from "../utils/auth";
import { forceLogout } from "../utils/logout";
export default function ProtectedRoute() {
  const user = localStorage.getItem("user") || sessionStorage.getItem("user");
  const activeAccountId = getActiveAccountId();
  // Not logged in → redirect
  if (!user || !activeAccountId) {
    forceLogout();

    return null;
  }

  return <Outlet />;
}
