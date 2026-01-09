import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableSkeletonProps {
  columnCount?: number;
  rowCount?: number;
  showToolbar?: boolean;
}

export function DataTableSkeleton({
  columnCount = 5,
  rowCount = 10,
  showToolbar = true,
}: DataTableSkeletonProps) {
  return (
    <div className="space-y-4 w-full">
      {showToolbar && (
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-[250px]" /> {/* Search Input */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-[80px]" /> {/* View Toggle */}
            <Skeleton className="h-8 w-[80px]" /> {/* Filter/Export */}
          </div>
        </div>
      )}
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {Array.from({ length: columnCount }).map((_, i) => (
                <TableHead key={i}>
                  <Skeleton className="h-4 w-full" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rowCount }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: columnCount }).map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex items-center justify-end space-x-2">
        <Skeleton className="h-8 w-[100px]" /> {/* Pagination Info */}
        <div className="flex items-center space-x-2">
          <Skeleton className="h-8 w-8" /> {/* Prev Page */}
          <Skeleton className="h-8 w-8" /> {/* Next Page */}
        </div>
      </div>
    </div>
  );
}
