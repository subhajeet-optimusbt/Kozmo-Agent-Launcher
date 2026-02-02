type Range = "today" | "7" | "30";

type Props = {
  value: Range;
  onChange: (v: Range) => void;
};

export default function RangeTabs({ value, onChange }: Props) {
  const tabs: { label: string; value: Range }[] = [
    { label: "Today", value: "today" },
    { label: "Last 7 days", value: "7" },
    { label: "Last 30 days", value: "30" },
  ];

  return (
    <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
      {tabs.map((t) => (
        <button
          key={t.value}
          onClick={() => onChange(t.value)}
          className={`
            px-4 py-1.5 text-sm rounded-lg font-medium transition
            ${
              value === t.value
                ? "bg-white shadow text-gray-900"
                : "text-gray-500 hover:text-gray-800"
            }
          `}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
