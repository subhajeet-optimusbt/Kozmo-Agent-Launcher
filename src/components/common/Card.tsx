import React from "react";

const Card: React.FC<{
  children: React.ReactNode;
  className?: string;
  title?: string;
  extra?: React.ReactNode;
}> = ({ children, className = "", title, extra }) => (
  <div
    className={`bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden ${className}`}
  >
    {(title || extra) && (
      <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
        {title && (
          <h3 className="text-xs font-black text-gray-500 uppercase tracking-wider">
            {title}
          </h3>
        )}
        {extra && <div>{extra}</div>}
      </div>
    )}
    <div className="p-4">{children}</div>
  </div>
);

export default Card;
