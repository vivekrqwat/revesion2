import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Directory Item Skeleton
const DirectorySkeleton = () => (
  <Card className="bg-card border-border h-full">
    <CardContent className="p-4 sm:p-5 space-y-4">
      <div className="flex justify-between items-start gap-3">
        {/* Left Section */}
        <div className="flex gap-3 items-start flex-1 min-w-0">
          <Skeleton className="h-4 w-4 rounded mt-0.5" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex gap-1 sm:gap-2 items-center flex-shrink-0">
          <Skeleton className="h-8 w-16 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </div>
    </CardContent>

    <CardContent className="p-4 sm:p-5 space-y-4">
      <div className="flex justify-between items-start gap-3">
        {/* Left Section */}
        <div className="flex gap-3 items-start flex-1 min-w-0">
          <Skeleton className="h-4 w-4 rounded mt-0.5" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex gap-1 sm:gap-2 items-center flex-shrink-0">
          <Skeleton className="h-8 w-16 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </div>
    </CardContent>
     <CardContent className="p-4 sm:p-5 space-y-4">
      <div className="flex justify-between items-start gap-3">
        {/* Left Section */}
        <div className="flex gap-3 items-start flex-1 min-w-0">
          <Skeleton className="h-4 w-4 rounded mt-0.5" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex gap-1 sm:gap-2 items-center flex-shrink-0">
          <Skeleton className="h-8 w-16 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </div>
    </CardContent>
  </Card>
);

// Note Skeleton
const NoteSkeleton = () => (
  <div className="flex items-start gap-3 p-3 rounded-md bg-muted/50 border border-border">
    <Skeleton className="h-3 w-3 rounded mt-0.5 flex-shrink-0" />
    <div className="flex-1 min-w-0 space-y-2">
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-3 w-full" />
    </div>
  </div>
);

export { DirectorySkeleton, NoteSkeleton };
