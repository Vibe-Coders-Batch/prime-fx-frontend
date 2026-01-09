import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function StatsCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-[100px]" /> {/* Title */}
        <Skeleton className="h-4 w-4" /> {/* Icon */}
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-[60px] mb-2" /> {/* Value */}
        <Skeleton className="h-4 w-[120px]" /> {/* Trend/Description */}
      </CardContent>
    </Card>
  );
}
