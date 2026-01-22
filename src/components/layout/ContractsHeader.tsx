/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect } from "react";
import {
  UserOutlined,
  EditOutlined,
  LogoutOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import {
  LifeBuoy,
  Sparkles,
  LayoutDashboard,
  FileText,
  Briefcase,
} from "lucide-react";
import { Tooltip } from "antd";
import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../../utils/baseUrl";
import toast from "react-hot-toast";
type ContractHeaderProps = {
  activeTab: string;
  onTabChange: (key: string) => void;
  onOpenLauncher: () => void;
};

const ContractHeader: React.FC<ContractHeaderProps> = ({
  activeTab,
  onTabChange,
  onOpenLauncher,
}) => {
  const [open, setOpen] = useState(false);
const navigate = useNavigate();
 const storedUser =
    localStorage.getItem("user") || sessionStorage.getItem("user");

  const user = storedUser ? JSON.parse(storedUser) : null;
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

    const switchWorkspace = (accountId: string) => {
    const storage = localStorage.getItem("user")
      ? localStorage
      : sessionStorage;

    const updatedUser = {
      ...user,
      activeAccountId: accountId,
    };

    storage.setItem("user", JSON.stringify(updatedUser));

    // optional: reload data
    window.location.reload();
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
  return (
    <header className="flex items-center justify-between mb-2 relative">
      {/* LEFT */}
      <div className="flex items-center gap-3">
        {/* Launcher */}
        <button
          onClick={onOpenLauncher}
          className="
    relative
    w-8 h-8
    rounded-xl

    bg-gradient-to-br from-white via-slate-50 to-slate-100
    border border-slate-300/80

    flex items-center justify-center

    shadow-[0_2px_6px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.7)]
    backdrop-blur-sm

    transition-all duration-200

    hover:bg-white
    hover:shadow-[0_6px_18px_rgba(16,185,129,0.25)]
    hover:border-emerald-300

    active:scale-[0.96]

    group
  "
        >
          <Menu
            className="
      w-4.5 h-4.5
      text-emerald-600
      transition-all duration-200

      group-hover:text-emerald-600
      group-hover:scale-110
    "
          />

          {/* ambient glow (visible even normally, stronger on hover) */}
          <span
            className="
      pointer-events-none
      absolute inset-0
      rounded-xl

      bg-gradient-to-br
      from-emerald-100/20
      via-transparent
      to-transparent

      opacity-60
      group-hover:opacity-100
      transition-opacity duration-200
    "
          />
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

      {/* Pill Tabs */}
      <div
        className="flex items-center gap-1.5
  bg-white/60 backdrop-blur-md
  p-2 rounded-full
  border border-gray-200
  shadow-sm"
      >
        {[
          { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
          { key: "contracts", label: "Contracts", icon: FileText },
          { key: "jobs", label: "Jobs", icon: Briefcase },
        ].map(({ key, label, icon: Icon }) => {
          const isActive = activeTab === key;

          return (
            <button
              key={key}
              onClick={() => onTabChange(key)}
              className={`
          relative flex items-center gap-2
          px-5 py-2.5 rounded-full
          text-sm font-semibold
          transition-all duration-300 ease-out
          ${
            isActive
              ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md"
              : "text-gray-600 hover:text-gray-900 hover:bg-white/70"
          }
        `}
            >
              {/* Glow */}
              {isActive && (
                <span
                  className="absolute inset-0 rounded-full
            bg-emerald-500/25 blur-lg"
                />
              )}

              {/* Icon */}
              <Icon
                className={`
            relative z-10 h-4 w-4
            transition-all duration-300
            ${isActive ? "" : "opacity-70 group-hover:opacity-100"}
          `}
              />

              {/* Text */}
              <span
                className={`
            relative z-10
            transition-all duration-300
            ${isActive ? "translate-y-0" : "translate-y-[1px]"}
          `}
              >
                {label}
              </span>
            </button>
          );
        })}
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
              userName[0].toUpperCase()
            ) : (
              <UserOutlined className="w-10 h-10" />
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
                <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition">
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

export default ContractHeader;
