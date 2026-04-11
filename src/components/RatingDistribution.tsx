import { getGradeLabel } from "@/components/StarRating";
import type { Rating } from "@/hooks/useProjects";

interface Props {
  ratings: Rating[];
}

export function RatingDistribution({ ratings }: Props) {
  const total = ratings.length;
  const avg = total > 0 ? ratings.reduce((s, r) => s + r.rating, 0) / total : 0;
  const { label, color } = getGradeLabel(avg);

  const categories = [
    { name: "Excellent (8-10)", filter: (r: Rating) => r.rating >= 8, color: "bg-green-500" },
    { name: "Good (5-7)", filter: (r: Rating) => r.rating >= 5 && r.rating <= 7, color: "bg-yellow-500" },
    { name: "Average (0-4)", filter: (r: Rating) => r.rating <= 4, color: "bg-orange-500" },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold gradient-text">{avg.toFixed(1)}</span>
        <span className="text-sm text-muted-foreground">/ 10 · {total} review{total !== 1 ? "s" : ""}</span>
        {total > 0 && <span className={`text-sm font-semibold ${color}`}>{label}</span>}
      </div>
      <div className="space-y-1.5">
        {categories.map(({ name, filter, color: barColor }) => {
          const count = ratings.filter(filter).length;
          const pct = total > 0 ? (count / total) * 100 : 0;
          return (
            <div key={name} className="flex items-center gap-2 text-xs">
              <span className="w-24 text-muted-foreground">{name}</span>
              <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                <div
                  className={`h-full rounded-full ${barColor} transition-all duration-500`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-6 text-right text-muted-foreground">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
