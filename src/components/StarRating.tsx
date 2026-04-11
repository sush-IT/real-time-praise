import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: number;
}

export function getGradeLabel(rating: number): { label: string; color: string } {
  if (rating >= 8) return { label: "Excellent", color: "text-green-400" };
  if (rating >= 5) return { label: "Good", color: "text-yellow-400" };
  return { label: "Average", color: "text-orange-400" };
}

export function StarRating({ value, onChange, readonly = false, size = 20 }: StarRatingProps) {
  if (readonly) {
    const { label, color } = getGradeLabel(value);
    return (
      <span className={cn("font-semibold", color)} style={{ fontSize: size * 0.7 }}>
        {value}/10 · {label}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-1">
        {Array.from({ length: 11 }, (_, i) => i).map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange?.(n)}
            className={cn(
              "w-7 h-7 rounded text-xs font-bold transition-all duration-150",
              value === n
                ? "bg-primary text-primary-foreground scale-110"
                : "bg-secondary text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )}
          >
            {n}
          </button>
        ))}
      </div>
      {value > 0 && (
        <span className={cn("text-sm font-medium", getGradeLabel(value).color)}>
          {getGradeLabel(value).label}
        </span>
      )}
    </div>
  );
}
