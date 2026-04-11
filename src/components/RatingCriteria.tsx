export function RatingCriteria() {
  return (
    <div className="glass rounded-xl p-6 text-center space-y-3">
      <h3 className="text-lg font-semibold text-foreground">Rating Criteria</h3>
      <div className="flex flex-wrap justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-orange-500" />
          <span className="text-muted-foreground"><strong className="text-orange-400">0 – 4</strong> Average</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-yellow-500" />
          <span className="text-muted-foreground"><strong className="text-yellow-400">5 – 7</strong> Good</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-muted-foreground"><strong className="text-green-400">8 – 10</strong> Excellent</span>
        </div>
      </div>
    </div>
  );
}
