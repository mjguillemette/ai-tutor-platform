import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface RatingDisplayProps {
  rating: number;
  category: string;
  description: string;
}

export function RatingDisplay({ rating, category, description }: RatingDisplayProps) {
  // Ensure the rating is between 0 and 10
  const normalizedRating = Math.min(Math.max(rating, 0), 10);

  // Determine color based on rating
  const getColorClass = (rating: number) => {
    if (rating <= 3) return "text-destructive";
    if (rating <= 7) return "text-warning";
    return "text-success";
  };

  const getProgressColorClass = (rating: number) => {
    if (rating <= 3) return "bg-destructive";
    if (rating <= 7) return "bg-warning";
    return "bg-success";
  };

  const colorClass = getColorClass(normalizedRating);
  const progressColorClass = getProgressColorClass(normalizedRating);

  return (
    <div className="w-full bg-card rounded-xl shadow-md p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">{category}</h2>
        <span 
          className={cn("text-3xl font-bold", colorClass)} 
          aria-label={`Rating: ${normalizedRating} out of 10`}
        >
          {normalizedRating}
          <span className="text-lg text-muted-foreground">/10</span>
        </span>
      </div>
      <Progress 
        value={normalizedRating * 10} 
        className={cn("h-2", progressColorClass)} 
        aria-hidden="true" 
      />
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
