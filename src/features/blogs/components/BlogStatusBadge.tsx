import { Badge } from "@/components/ui/badge";
import type { BlogStatus } from "../types";

const STATUS_VARIANT: Record<BlogStatus, "default" | "secondary" | "outline" | "destructive"> = {
  DRAFT: "outline",
  PUBLISHED: "default",
  ARCHIVED: "secondary",
};

const STATUS_LABEL: Record<BlogStatus, string> = {
  DRAFT: "Draft",
  PUBLISHED: "Published",
  ARCHIVED: "Archived",
};

export function BlogStatusBadge({ status }: { status: BlogStatus }) {
  return <Badge variant={STATUS_VARIANT[status]}>{STATUS_LABEL[status]}</Badge>;
}
