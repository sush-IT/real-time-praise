import type { Rating } from "@/hooks/useProjects";

interface Props {
  ratings: Rating[];
}

export function RatingDistribution({ ratings }: Props) {
  const total = ratings.length;
  const dist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: ratings.filter((r) => r.rating === star).length,
  }));
  const avg = total > 0 ? ratings.reduce((s, r) => s + r.rating, 0) / total : 0;

  return (
    <div className="space-y-3">
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold gradient-text">{avg.toFixed(1)}</span>
        <span className="text-sm text-muted-foreground">/ 5 · {total} review{total !== 1 ? "s" : ""}</span>
      </div>
      <div className="space-y-1.5">
        {dist.map(({ star, count }) => {
          const pct = total > 0 ? (count / total) * 100 : 0;
          return (
            <div key={star} className="flex items-center gap-2 text-xs">
              <span className="w-3 text-muted-foreground">{star}</span>
              <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
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
