import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Directory Item Skeleton
const DirectorySkeleton = () => (
  <div className="space-y-3">
    {[1, 2, 3, 4, 5].map((item) => (
      <Card key={item} className="bg-[var(--color-card)] border-[var(--border)]">
        <CardContent className="p-4 sm:p-5">
          <div className="flex justify-between items-start gap-3">
            {/* Left Section */}
            <div className="flex gap-3 items-start flex-1 min-w-0">
              <Skeleton className="h-5 w-5 rounded flex-shrink-0" />
              <div className="min-w-0 flex-1 space-y-3">
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>

            {/* Right Action Buttons */}
            <div className="flex gap-2 items-center flex-shrink-0">
              <Skeleton className="h-8 w-20 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

// Note Skeleton
const NoteSkeleton = () => (
  <div className="space-y-2">
    {[1, 2, 3].map((item) => (
      <div key={item} className="flex items-start gap-3 p-3 rounded-md bg-[var(--color-card)] border border-[var(--border)]">
        <Skeleton className="h-4 w-4 rounded flex-shrink-0" />
        <div className="flex-1 min-w-0 space-y-2">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-full" />
        </div>
      </div>
    ))}
  </div>
);

export { DirectorySkeleton, NoteSkeleton };