// /* eslint-disable @typescript-eslint/no-unused-expressions */
// import React, { useMemo, type KeyboardEvent } from "react";
// import { StarOutlined, StarFilled } from "@ant-design/icons";

// interface App {
//   key: string;
//   name: string;
//   route: string;
//   description?: string;
// }

// interface AppTileProps {
//   app: App;
//   isPinned?: boolean;
//   isFocused?: boolean;
//   compact?: boolean;
//   showAvatar?: boolean; // NEW: whether to render the avatar (icon)
//   onClick?: () => void;
//   onPinToggle?: (appKey: string) => void;
// }

// /**
//  * Small deterministic color generator based on string (for avatar bg).
//  */
// const colorFromString = (str: string) => {
//   let hash = 0;
//   for (let i = 0; i < str.length; i++) {
//     hash = str.charCodeAt(i) + ((hash << 5) - hash);
//   }
//   const hue = Math.abs(hash) % 360;
//   return `hsl(${hue} 60% 85%)`;
// };

// const textColorFromHue = (hue: number) => {
//   // darker text for pastel backgrounds
//   return hue > 200 ? "text-gray-800" : "text-gray-900";
// };

// const getInitials = (name: string) =>
//   name
//     .split(" ")
//     .map((s) => s[0])
//     .slice(0, 2)
//     .join("")
//     .toUpperCase();

// const AppTile: React.FC<AppTileProps> = ({
//   app,
//   isPinned = false,
//   isFocused = false,
//   compact = false,
//   showAvatar = true,
//   onClick,
//   onPinToggle,
// }) => {
//   const initials = useMemo(() => getInitials(app.name), [app.name]);

//   const bg = useMemo(() => colorFromString(app.key), [app.key]);

//   const hueMatch = /\d+/.exec(bg) ? parseInt(bg.match(/\d+/)?.[0] || "180", 10) : 180;
//   const textColorClass = useMemo(() => textColorFromHue(hueMatch), [hueMatch]);

//   const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
//     // Enter or Space triggers tile click
//     if (e.key === "Enter" || e.key === " ") {
//       e.preventDefault();
//       onClick && onClick();
//     }
//   };

//   return (
//     <div
//       role="button"
//       tabIndex={0}
//       onClick={onClick}
//       onKeyDown={handleKeyDown}
//       aria-label={`${app.name} ${app.description ? `- ${app.description}` : ""}`}
//       className={`relative flex items-start gap-4 rounded-lg cursor-pointer transition-all duration-150
//         bg-white hover:shadow-xl active:translate-y-[1px] select-none
//         ${isFocused ? "ring-2 ring-emerald-300 shadow-xl" : "shadow-sm"}
//         ${compact ? "p-3" : "p-4"}
//       `}
//     >
//       {/* Avatar (initials) - rendered only when showAvatar is true */}
//       {showAvatar ? (
//         <div
//           aria-hidden
//           className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-semibold text-lg`}
//           style={{ background: bg }}
//         >
//           <span className={`leading-none ${textColorClass}`}>{initials}</span>
//         </div>
//       ) : null}

//       {/* Content: when avatar hidden, allow the name to occupy full width and wrap */}
//       <div className={`flex-1 min-w-0 ${showAvatar ? "" : "pr-2"}`}>
//         <div className="flex items-center justify-between gap-2">
//           <div
//             // when avatar hidden, permit wrapping and show full name
//             className={`text-sm font-semibold text-gray-900 ${showAvatar ? "truncate" : "whitespace-normal"}`}
//           >
//             {app.name}
//           </div>
//         </div>

//         {app.description && (
//           <div className={`text-xs text-gray-400 mt-1 ${showAvatar ? "truncate" : "line-clamp-2"}`}>
//             {app.description}
//           </div>
//         )}
//       </div>

//       {/* Pin button */}
//       <button
//         type="button"
//         onClick={(e) => {
//           e.stopPropagation();
//           onPinToggle && onPinToggle(app.key);
//         }}
//         title={isPinned ? "Unpin app" : "Pin app"}
//         aria-pressed={isPinned}
//         className={`
//           ml-2 p-1.5 rounded-md transition-transform duration-150 flex items-center justify-center
//           ${isPinned ? "text-amber-500 bg-amber-50 hover:scale-105" : "text-emerald-500 hover:bg-emerald-50 hover:scale-105"}
//         `}
//       >
//         {isPinned ? <StarFilled className="text-base" /> : <StarOutlined className="text-base" />}
//       </button>
//     </div>
//   );
// };

// export default AppTile;



/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, {type KeyboardEvent } from "react";
import { StarOutlined, StarFilled } from "@ant-design/icons";
import {
  DashboardOutlined,
  InboxOutlined,
  FileTextOutlined,
  SolutionOutlined,
  TeamOutlined,
  SyncOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import type { App } from "../../constants/apps";

/* ---------------------------------- */
/* ICON MAP */
/* ---------------------------------- */
const ICON_MAP: Record<string, React.ReactNode> = {
  dashboard: <DashboardOutlined />,
  inbox: <InboxOutlined />,
  file: <FileTextOutlined />,
  contract: <SolutionOutlined />,
  users: <TeamOutlined />,
  sync: <SyncOutlined />,
  settings: <SettingOutlined />,
};

interface AppTileProps {
  app: App;
  isPinned?: boolean;
  isFocused?: boolean;
  compact?: boolean;
  showAvatar?: boolean;
  onClick?: () => void;
  onPinToggle?: (appKey: string) => void;
}

const AppTile: React.FC<AppTileProps> = ({
  app,
  isPinned = false,
  isFocused = false,
  compact = false,
  showAvatar = true,
  onClick,
  onPinToggle,
}) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      aria-label={`${app.name} ${app.description ?? ""}`}
      className={`
        group relative flex items-start gap-4 rounded-xl cursor-pointer
        bg-white transition-all duration-200
        hover:shadow-xl hover:ring-1 hover:ring-emerald-200
        active:translate-y-[1px]
        ${isFocused ? "ring-2 ring-emerald-300 shadow-xl" : "shadow-sm"}
        ${compact ? "p-3" : "p-4"}
      `}
    >
      {/* Icon Avatar */}
      {showAvatar && (
        <div
          className="
            flex-shrink-0 w-12 h-12 rounded-xl
            flex items-center justify-center
            bg-gradient-to-br from-emerald-50 to-white
            text-emerald-600 text-xl
            shadow-sm
            transition-transform duration-200
            group-hover:scale-110
          "
        >
          {ICON_MAP[app.icon] ?? <DashboardOutlined />}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-gray-900 truncate">
          {app.name}
        </div>

        {app.description && (
          <div className="text-xs text-gray-400 mt-1 truncate">
            {app.description}
          </div>
        )}
      </div>

      {/* Pin Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onPinToggle?.(app.key);
        }}
        aria-pressed={isPinned}
        className={`
          ml-2 p-1.5 rounded-md transition-all duration-150
          ${isPinned
            ? "text-amber-500 bg-amber-50 hover:scale-105"
            : "text-emerald-500 hover:bg-emerald-50 hover:scale-105"}
        `}
      >
        {isPinned ? (
          <StarFilled className="text-base" />
        ) : (
          <StarOutlined className="text-base" />
        )}
      </button>
    </div>
  );
};

export default AppTile;
