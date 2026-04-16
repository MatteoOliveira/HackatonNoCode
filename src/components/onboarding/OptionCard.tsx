interface Props {
  iconBg: string;
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  selected: boolean;
  onSelect: () => void;
}

export default function OptionCard({
  iconBg,
  icon,
  title,
  subtitle,
  selected,
  onSelect,
}: Props) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all"
      style={{
        backgroundColor: selected ? "#fff" : "#f5f5f5",
        border: `2px solid ${selected ? "var(--color-bleu-fonce)" : "transparent"}`,
      }}
      aria-pressed={selected}
    >
      {/* Icon circle */}
      <div
        className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 text-xl"
        style={{ backgroundColor: iconBg }}
        aria-hidden="true"
      >
        {icon}
      </div>

      {/* Text */}
      <div className="flex-1">
        <p className="font-bold text-base" style={{ color: "var(--color-noir)" }}>
          {title}
        </p>
        {subtitle && (
          <p className="text-sm opacity-50 mt-0.5" style={{ color: "var(--color-noir)" }}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Radio / Checkbox */}
      <div
        className="w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0"
        style={{
          borderColor: selected ? "var(--color-bleu-fonce)" : "#d1d5db",
          backgroundColor: selected ? "var(--color-bleu-fonce)" : "transparent",
        }}
        aria-hidden="true"
      >
        {selected && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M2 6l3 3 5-5"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
    </button>
  );
}
