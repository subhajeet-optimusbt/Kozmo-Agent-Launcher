/* eslint-disable react-hooks/immutability */
import React, { useEffect, useMemo, useState, useRef } from "react";
import { Modal } from "antd";
import {
  SearchOutlined,
  StarFilled,
  ClockCircleOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import AppTile from "../common/AppTile";
import { APPS } from "../../constants/apps";
import { useNavigate, useLocation } from "react-router-dom";
import useLocalStorage from "../../hooks/storage";

interface LauncherModalProps {
  launcherOpen: boolean;
  setLauncherOpen: (v: boolean) => void;
}

const RECENT_LIMIT = 8;

const LauncherModal: React.FC<LauncherModalProps> = ({
  launcherOpen,
  setLauncherOpen,
}) => {
  const [searchText, setSearchText] = useState("");
  const [pinnedKeys, setPinnedKeys] = useLocalStorage<string[]>(
    "launcher_pinned",
    [],
  );
  const [recentKeys, setRecentKeys] = useLocalStorage<string[]>(
    "launcher_recent",
    [],
  );
  const [focusedIndex, setFocusedIndex] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement | null>(null);

  const activeAppKey = useMemo(() => {
    return APPS.find(
      (app) =>
        location.pathname === app.route ||
        location.pathname.startsWith(app.route + "/"),
    )?.key;
  }, [location.pathname]);
  useEffect(() => {
    if (launcherOpen) {
      setSearchText("");
      setFocusedIndex(0);
    }
  }, [launcherOpen]);

  const allApps = APPS;

  const pinnedApps = useMemo(
    () => allApps.filter((a) => pinnedKeys.includes(a.key)),
    [allApps, pinnedKeys],
  );

  const recentApps = useMemo(
    () =>
      recentKeys
        .map((key) => allApps.find((a) => a.key === key))
        .filter(Boolean) as typeof APPS,
    [recentKeys, allApps],
  );

  // LEFT: All apps (no avatar)
  const leftApps = useMemo(() => {
    if (!searchText.trim()) return allApps;
    const q = searchText.toLowerCase();
    return allApps.filter(
      (app) =>
        app.name.toLowerCase().includes(q) ||
        (app.description || "").toLowerCase().includes(q),
    );
  }, [allApps, searchText]);

  useEffect(() => {
    if (focusedIndex >= leftApps.length) {
      setFocusedIndex(Math.max(0, leftApps.length - 1));
    }
  }, [leftApps.length]); // eslint-disable-line

  const togglePin = (appKey: string) => {
    setPinnedKeys((prev) => {
      const found = prev.includes(appKey);
      if (found) return prev.filter((k) => k !== appKey);
      return [appKey, ...prev];
    });
  };

  const openApp = (appKey: string) => {
    const app = APPS.find((a) => a.key === appKey);
    if (!app) return;
    setRecentKeys((prev) => {
      const newList = [appKey, ...prev.filter((k) => k !== appKey)].slice(
        0,
        RECENT_LIMIT,
      );
      return newList;
    });

    navigate(app.route);
    setLauncherOpen(false);
  };

  useEffect(() => {
    if (!launcherOpen) return;

    setSearchText("");

    if (activeAppKey) {
      const index = leftApps.findIndex((app) => app.key === activeAppKey);
      setFocusedIndex(index >= 0 ? index : 0);
    } else {
      setFocusedIndex(0);
    }
  }, [launcherOpen, activeAppKey, leftApps]);
  // Keyboard handling: Esc to close, Up/Down to navigate left list, Enter to open
  useEffect(() => {
    if (!launcherOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setLauncherOpen(false);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setFocusedIndex((i) => Math.min(i + 1, leftApps.length - 1));
        scrollIntoViewLeft(focusedIndex + 1);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setFocusedIndex((i) => Math.max(i - 1, 0));
        scrollIntoViewLeft(focusedIndex - 1);
      } else if (e.key === "Enter") {
        e.preventDefault();
        const app = leftApps[focusedIndex];
        if (app) openApp(app.key);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        const el = containerRef.current?.querySelector(
          "input[data-launcher-search]",
        ) as HTMLInputElement | null;
        el?.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [launcherOpen, leftApps, focusedIndex]); // keep leftApps dependency so navigation updates

  const scrollIntoViewLeft = (index: number) => {
    const list = containerRef.current?.querySelectorAll("[data-app-left]");
    if (!list || index < 0 || index >= list.length) return;
    const el = list[index] as HTMLElement;
    el.scrollIntoView({ block: "nearest", behavior: "smooth" });
  };

  return (
    <Modal
      open={launcherOpen}
      onCancel={() => setLauncherOpen(false)}
      footer={null}
      closable={false}
      width={960}
      centered
      className="launcher-modal"
      bodyStyle={{ padding: 0, overflow: "hidden", borderRadius: 20 }}
      destroyOnClose={false}
    >
      <div
        ref={containerRef}
        className="flex flex-col h-[680px] bg-gradient-to-br from-gray-50 via-white to-gray-50 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="relative p-7 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
          <div className="relative flex flex-col gap-5">
            <div className="flex items-center gap-4 px-5 py-4 bg-white rounded-2xl shadow-sm border border-gray-200/60 transition-all duration-300 group">
              <SearchOutlined className="text-2xl text-emerald-500 group-hover:scale-110 transition-transform duration-200" />
              <input
                data-launcher-search
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                  setFocusedIndex(0);
                }}
                placeholder="Search applications..."
                className="flex-1 bg-transparent border-none outline-none text-lg font-medium text-gray-900 placeholder:text-gray-400"
                autoFocus
              />
              <div className="flex items-center gap-2">
                <kbd className="px-2.5 py-1.5 bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300 rounded-lg text-[10px] font-bold text-gray-600 shadow-sm">
                  ESC
                </kbd>
                <kbd className="px-2.5 py-1.5 bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300 rounded-lg text-[10px] font-bold text-gray-600 shadow-sm">
                  ⌘K
                </kbd>
              </div>
            </div>
          </div>
        </div>

        {/* Body: LEFT = All Apps (no avatar), RIGHT = Pinned + Recent (with avatar) */}
        <div className="flex-1 p-7 bg-gradient-to-br from-gray-50/50 to-white">
          <div className="flex gap-6 h-full">
            {/* Left: All Apps */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.15em] flex items-center gap-2">
                  <span className="w-8 h-[2px] bg-gradient-to-r from-emerald-500 to-transparent rounded-full" />
                  All Applications
                </h3>
                <span className="text-xs text-gray-400 font-medium">
                  {leftApps.length} {leftApps.length === 1 ? "app" : "apps"}
                </span>
              </div>

              {leftApps.length === 0 ? (
                <div className="flex items-center justify-center h-[520px] rounded-2xl border-2 border-dashed border-gray-300 bg-white/50 backdrop-blur-sm">
                  <div className="text-center max-w-sm">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <AppstoreOutlined className="text-2xl text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      No applications found
                    </p>
                    <p className="text-xs text-gray-400">
                      Try adjusting your search query
                    </p>
                  </div>
                </div>
              ) : (
                <div className="h-[520px] overflow-auto px-2 py-2">
                  <div className="grid grid-cols-3 gap-4">
                    {leftApps.map((app, idx) => (
                      <div
                        key={app.key}
                        data-app-left
                        className="transition-all duration-200 hover:scale-[1.02]"
                      >
                        <AppTile
                          app={app}
                          isPinned={pinnedKeys.includes(app.key)}
                          isFocused={focusedIndex === idx}
                          compact
                          showAvatar={false} // <-- NO avatar in All Applications
                          onClick={() => {
                            openApp(app.key);
                          }}
                          onPinToggle={togglePin}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Pinned + Recent */}
            <aside className="w-80 shrink-0 flex flex-col gap-4">
              {/* Pinned */}
              <div className="bg-white/70 backdrop-blur-md border border-gray-200/60 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <StarFilled className="text-emerald-500" />
                    <h4 className="text-sm font-semibold text-gray-700">
                      Pinned
                    </h4>
                    <span className="text-xs text-gray-400 ml-1">
                      ({pinnedApps.length})
                    </span>
                  </div>
                </div>

                {pinnedApps.length === 0 ? (
                  <div className="text-xs text-gray-400">
                    No pinned apps yet
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {pinnedApps.map((app) => (
                      <div
                        key={app.key}
                        className="transition hover:bg-gray-50 rounded-lg"
                      >
                        <AppTile
                          app={app}
                          isPinned={true}
                          isFocused={false}
                          showAvatar={true} // <-- show avatar in Pinned
                          onClick={() => openApp(app.key)}
                          onPinToggle={togglePin}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent */}
              <div className="bg-white/70 backdrop-blur-md border border-gray-200/60 rounded-2xl p-4 shadow-sm flex-1 overflow-auto">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <ClockCircleOutlined className="text-emerald-500" />
                    <h4 className="text-sm font-semibold text-gray-700">
                      Recent
                    </h4>
                    <span className="text-xs text-gray-400 ml-1">
                      ({recentApps.length})
                    </span>
                  </div>
                </div>

                {recentApps.length === 0 ? (
                  <div className="text-xs text-gray-400">No recent apps</div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {recentApps.slice(0, RECENT_LIMIT).map((app) => (
                      <div
                        key={app.key}
                        className="transition hover:bg-gray-50 rounded-lg"
                      >
                        <AppTile
                          app={app}
                          isPinned={pinnedKeys.includes(app.key)}
                          isFocused={false}
                          showAvatar={true} // <-- show avatar in Recent
                          onClick={() => openApp(app.key)}
                          onPinToggle={togglePin}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default LauncherModal;
