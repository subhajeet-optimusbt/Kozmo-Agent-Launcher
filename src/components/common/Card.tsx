import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  extra?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  children,
  className = "",
  title,
  extra,
}) => (
  <div
    className={`bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden ${className}`}
  >
    {(title || extra) && (
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
        {title && (
          <h3 className="text-xs font-black text-gray-700 uppercase tracking-wider">
            {title}
          </h3>
        )}
        {extra && <div className="text-sm">{extra}</div>}
      </div>
    )}
    <div className="p-6">{children}</div>
  </div>
);

export default Card;