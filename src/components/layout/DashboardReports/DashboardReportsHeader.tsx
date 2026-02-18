/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect } from "react";
import {
  SearchOutlined,
  UserOutlined,
  EditOutlined,
  LogoutOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { LifeBuoy, Sparkles } from "lucide-react";
import { Tooltip } from "antd";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../../../utils/baseUrl";
import toast from "react-hot-toast";
import { setActiveAccountId } from "../../../utils/auth";
const DashboardReportsHeader: React.FC<{ onOpenLauncher: () => void }> = ({
  onOpenLauncher,
}) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user") || sessionStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });

  const userName = user?.userName;
  const userEmail = user?.email;

  const workspaces = user?.accounts.map((acc: any) => ({
    id: acc.accountId,
    name: acc.accountName,
    role: acc.role,
    active: acc.accountId === user.activeAccountId,
  }));

  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const switchWorkspace = async (accountId: string) => {
    try {
      await fetch(baseUrl() + "/Home/SwitchAccount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ accountId }),
      });

      setActiveAccountId(accountId); // 🔥 global update
    } catch {
      toast.error("Failed to switch account");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(baseUrl() + "/Home/Logout", {
        method: "POST",
        credentials: "include", // IMPORTANT if cookies/session based
      });
    } catch {
      toast.error("Logout API failed, proceeding with client logout");
    } finally {
      // 🔥 clear auth FIRST
      localStorage.removeItem("user");

      sessionStorage.removeItem("user");

      // 🔀 redirect to login
      navigate("/login", { replace: true });
    }
  };

  useEffect(() => {
    const handler = () => {
      const raw =
        localStorage.getItem("user") || sessionStorage.getItem("user");
      setUser(raw ? JSON.parse(raw) : null);
    };

    window.addEventListener("account-changed", handler);
    return () => window.removeEventListener("account-changed", handler);
  }, []);

  return (
    <header className="flex items-center justify-between mb-4 mt-2 relative">
      {/* LEFT */}
      <div className="flex items-center gap-3">
        {/* Launcher */}
        <button onClick={onOpenLauncher} className="launcher-btn">
          <div className="launcher-dots">
            {Array.from({ length: 9 }).map((_, i) => (
              <span key={i} className="dot" />
            ))}
          </div>
        </button>

        {/* Kozmo Logo */}
        <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white font-bold text-base shadow-lg">
          K
        </div>

        {/* Brand */}
        <div>
          <h1 className="text-md font-black tracking-tight">KOZMO</h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Super Agent
          </p>
        </div>
      </div>

      {/* CENTER SEARCH */}
      <div className="flex-1 flex justify-center">
        <div className="w-[420px] flex items-center gap-3 px-4 py-2 bg-white border border-gray-200 rounded-2xl shadow-sm cursor-pointer hover:border-emerald-400 transition group">
          <SearchOutlined className="text-gray-400 group-hover:text-emerald-500" />
          <span className="flex-1 text-sm text-gray-400">
            Search or type a command…
          </span>
          <kbd className="px-2 py-0.5 bg-gray-100 border border-gray-200 rounded-lg text-[10px] font-bold text-gray-500">
            ⌘ K
          </kbd>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2">
        {/* Help */}
        <Tooltip title="Help">
          <button
            className="
      w-9 h-9 flex items-center justify-center rounded-lg
      text-emerald-600/70
      bg-emerald-50/40
      hover:text-emerald-600
      hover:bg-emerald-100
      transition-all duration-150
    "
          >
            <LifeBuoy size={22} strokeWidth={2} />
          </button>
        </Tooltip>

        <Tooltip title="Guide">
          <button
            className="
      w-9 h-9 flex items-center justify-center rounded-lg
      text-emerald-600/70
      bg-emerald-50/40
      hover:text-emerald-600
      hover:bg-emerald-100
      transition-all duration-150
    "
          >
            <Sparkles size={22} strokeWidth={2} />
          </button>
        </Tooltip>

        {/* Profile */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="
    w-10 h-10 rounded-xl
    bg-emerald-50/60
    border border-emerald-100
    flex items-center justify-center
    font-black text-emerald-700
    hover:bg-emerald-100
    transition
  "
          >
            {userName ? (
              userName.slice(0, 2).toUpperCase()
            ) : (
              <UserOutlined size={22} />
            )}
          </button>

          {open && (
            <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
              {/* User */}
              <div className="px-4 py-3 border-b">
                <div className="text-sm font-black">{userName}</div>
                <div className="text-xs text-gray-400">{userEmail}</div>
              </div>

              {/* Workspaces */}
              <div className="px-4 py-3">
                <div className="text-[10px] font-black text-gray-400 uppercase mb-2">
                  Workspace
                </div>
                {workspaces.map((w: any) => (
                  <div
                    key={w.id}
                    onClick={() => switchWorkspace(w.id)}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer ${
                      w.active
                        ? "bg-emerald-50 text-emerald-600"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div>
                      <div className="text-sm font-bold">{w.name}</div>
                      <div className="text-[10px] text-gray-400">{w.role}</div>
                    </div>
                    {w.active && <CheckOutlined />}
                  </div>
                ))}
              </div>

              {/* Settings + Signout */}
              <div className="border-t px-4 py-3 flex items-center justify-between">
                {/* Edit */}
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition">
                  <EditOutlined />
                  <span className="text-sm font-medium">Edit</span>
                </button>

                {/* Sign out */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition"
                >
                  <LogoutOutlined />
                  <span className="text-sm font-medium">Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardReportsHeader;
