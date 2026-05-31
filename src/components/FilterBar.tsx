"use client";

interface FilterBarProps {
  options: readonly string[];
  active: string;
  onChange: (value: string) => void;
  allLabel?: string;
  label: string;
}

export default function FilterBar({
  options,
  active,
  onChange,
  allLabel = "All",
  label,
}: FilterBarProps) {
  const items = [allLabel, ...options];

  return (
    <div
      role="group"
      aria-label={label}
      className="flex flex-wrap items-center gap-x-6 gap-y-3"
    >
      {items.map((item) => {
        const isActive = item === active;
        return (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            aria-pressed={isActive}
            className={`relative font-body text-xs uppercase tracking-[0.2em] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ochre focus-visible:ring-offset-2 focus-visible:ring-offset-canvas ${
              isActive
                ? "text-charcoal after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-full after:bg-ochre"
                : "text-label-gray hover:text-charcoal"
            }`}
          >
            {item}
          </button>
        );
      })}
    </div>
  );
}
