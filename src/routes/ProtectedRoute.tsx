// import { Outlet } from "react-router-dom";
// import { getActiveAccountId } from "../utils/auth";
// import { forceLogout } from "../utils/logout";
// export default function ProtectedRoute() {
//   const user = localStorage.getItem("user") || sessionStorage.getItem("user");
//   const activeAccountId = getActiveAccountId();
//   // Not logged in → redirect
//   if (!user || !activeAccountId) {
//     forceLogout();

//     return null;
//   }

//   return <Outlet />;
// }


import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { getActiveAccountId } from "../utils/auth";
import { forceLogout } from "../utils/logout";
import FullscreenLoader from "../components/ui/FullScreenLoader";

export default function ProtectedRoute() {
  const [loading, setLoading] = useState(false);

  const user = localStorage.getItem("user") || sessionStorage.getItem("user");
  const activeAccountId = getActiveAccountId();

  useEffect(() => {
    if (!user || !activeAccountId) {
      const logout = async () => {
        setLoading(true);
        await forceLogout();
        setLoading(false);
      };

      logout();
    }
  }, [user, activeAccountId]);

  if (loading) {
    return <FullscreenLoader />;
  }

  if (!user || !activeAccountId) {
    return null;
  }

  return <Outlet />;
}